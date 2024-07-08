import React, { useEffect, useRef, useState } from 'react'
import { Document, Page, View, Text, StyleSheet, Image, pdf, PDFViewer } from '@react-pdf/renderer';
import moment from 'moment';
import { apiPOST, apiPUT, uploadPost } from '../../utils/apiHelper';
import Swal from 'sweetalert2';
import { Button } from 'semantic-ui-react';
const VITE_COMPANY_MAIL = import.meta.env.VITE_COMPANY_MAIL;

const PrintPackingSlip = ({ order }) => {
	const pdfRef = useRef(null);
	const [loading, setLoading] = useState(false)
	const [fileUrl, setFileUrl] = useState('')
	const [uploadProgress, setUploadProgress] = useState(0)
	const generatePDF =
		(
			<Document>
				<Page style={{ padding: "40px", color: "grey", border: "1px solid black" }}>
					<View style={{
						display: 'flex',
						gap: "20px",
						flexDirection: "row"
					}}>
						<Image src={'https://thesnuslife-asset.s3.amazonaws.com/uploads/1697970599332/snuslifefav.png'}
							style={{ width: 100, height: 100 }} />

						<View style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-start" }}>
							<Text style={{
								fontSize: "16px",
								fontWeight: "700",
								color: "black",
								marginTop: "5px"
							}}>
								The Snus Life Limited
							</Text>
							<Text style={{
								fontSize: "13px",
								fontWeight: "400",
							}}>
								{VITE_COMPANY_MAIL}
							</Text>
						</View>
					</View>
					<Text style={{
						fontSize: "13px",
						marginTop: "30px"
					}}>
						Order {order?.orderNo}
					</Text>
					<Text style={{
						fontSize: "13px",
						marginTop: "5px"
					}}>
						Order placed: {moment(order?.createdAt).format('LLL')}
					</Text>

					<View style={{ display: "flex", flexDirection: "row", marginTop: "25px" }}>
						<View style={{ width: "50%" }}>
							<Text style={{ fontSize: "13px", color: "black" }}>
								Shipping Information
							</Text>
							<Text style={{ fontSize: "13px", marginTop: "5px" }}>
								{order?.shippingAdderess?.shippingAddressObj?.firstName}
								{" "}
								{order?.shippingAdderess?.shippingAddressObj?.lastName}
							</Text>
							<Text style={{ fontSize: "13px" }}>
								{order?.shippingAdderess?.shippingAddressObj?.address}
							</Text>
							<Text style={{ fontSize: "13px" }}>
								{order?.shippingAdderess?.shippingAddressObj?.city}
								{", "}
								{order?.shippingAdderess?.shippingAddressObj?.state}
								{", "}
								{order?.shippingAdderess?.shippingAddressObj?.zip}

							</Text>
							<Text style={{ fontSize: "13px" }}>
								{order?.shippingAdderess?.shippingAddressObj?.country}
							</Text>
							<Text style={{ fontSize: "13px" }}>
								{order?.user?.email}
							</Text>
						</View>
						<View style={{ width: "50%" }}>
							<Text style={{ fontSize: "13px", color: "black" }}>
								Billing Information
							</Text>
							<Text style={{ fontSize: "13px", marginTop: "5px" }}>
								{order?.shippingAdderess?.shippingAddressObj?.firstName}
								{" "}
								{order?.shippingAdderess?.shippingAddressObj?.lastName}
							</Text>
							<Text style={{ fontSize: "13px" }}>
								{order?.shippingAdderess?.shippingAddressObj?.address}
							</Text>
							<Text style={{ fontSize: "13px" }}>
								{order?.shippingAdderess?.shippingAddressObj?.city}
								{", "}
								{order?.shippingAdderess?.shippingAddressObj?.state}
								{", "}
								{order?.shippingAdderess?.shippingAddressObj?.zip}

							</Text>
							<Text style={{ fontSize: "13px" }}>
								{order?.shippingAdderess?.shippingAddressObj?.country}
							</Text>
							<Text style={{ fontSize: "13px" }}>
								{order?.user?.email}
							</Text>
						</View>
					</View>

					<View style={{ marginTop: "25px" }}>
						<View style={{
							color: "black",
							display: "flex",
							flexDirection: "row",
							padding: "6px 14px",
							backgroundColor: "#f0f4f7"
						}}>
							<Text style={{ width: "60%", fontSize: "13px" }}>
								Product Name
							</Text>
							<Text style={{ width: "20%", fontSize: "13px" }}>
								Qty
							</Text>
							<Text style={{ width: "20%", fontSize: "13px" }}>
								Price
							</Text>
						</View>
						{order?.productDetail?.length ?
							order?.productDetail.map((currenProduct, key) =>
								<View style={{
									display: "flex",
									flexDirection: "row",
									padding: "6px 14px",
									borderBottom: "1px solid #f0f4f7"
								}}>
									<Text style={{ width: "60%", fontSize: "13px" }}>
										{currenProduct?.productDetailsObj?.name}
									</Text>
									<Text style={{ width: "20%", fontSize: "13px" }}>
										{currenProduct?.quantity}
									</Text>
									<Text style={{ width: "20%", fontSize: "13px" }}>
										£{currenProduct?.productDetailsObj?.price * currenProduct?.quantity}
									</Text>
								</View>
							)
							:
							""}



					</View>
				</Page>
			</Document>
		);

	const uploadToCloud = async (file) => {
		if (loading) return;

		try {
			setLoading(true);
			const payload = {
				key: "uploads/" + new Date().getTime() + `${order?.orderNo}.pdf`,
				content: 'application/pdf'
			};
			const response = await uploadPost(payload);
			if (!response) return;
			var url = response;
			const fileObj = file;
			const handleProgress = (evt) => {
				let p = `${evt.type}: ${evt.loaded} bytes transferred\n`;
				var progress = Math.ceil((evt.loaded / evt.total) * 100);
				setUploadProgress(progress);
			};

			setLoading(true);

			setUploadProgress(0);

			var xhr = new XMLHttpRequest();
			xhr.open("PUT", url, true);
			xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
			xhr.setRequestHeader("x-amz-acl", "public-read");
			xhr.setRequestHeader("Caches", false);
			xhr.setRequestHeader("Content-Type", file.type);
			xhr.upload.addEventListener("progress", handleProgress, false);
			xhr.onload = function () {
				setLoading(false);
				if (xhr.readyState == 4) {
					let file_Url = url.split("?")[0];
					setFileUrl(file_Url);
					updateOrder({ packingSlipUrl: file_Url })

					const iframe = document.createElement('iframe');

					// Set the source URL for the iframe
					iframe.src = file_Url;
					iframe.width = '100%';
					iframe.height = '100%';

					let newTab = window.open(``, '_blank');
					newTab.document.write(iframe.outerHTML);
					newTab.document.close();

				} else {
					console.log(
						"Could not upload image please try again---",
						"asset image"
					);
				}
			};
			xhr.onerror = function (error) {
				setLoading(false);
				console.log("Could not upload image please try again", "asset image");
			};
			xhr.send(fileObj);
		} catch (error) {
			setLoading(false);
			setUploadProgress(0);
		}
	};

	// Function to open the PDF in a new tab
	const openPDFInNewTab = async () => {
		const blob = await pdf(generatePDF).toBlob();
		const url = URL.createObjectURL(blob);
		uploadToCloud(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${order?.orderNo}.pdf`;
	};

	const updateOrder = async ({ packingSlipUrl }) => {
		let id = order?._id;
		try {
			let payload = {
				packingSlipUrl
			};
			const response = await apiPUT(`/v1/order/update-order-byid/${id}`, payload);
			if (response.status === 200) {

			} else {
				Swal.fire({
					title: 'Error!',
					text: response?.data?.data || 'Something went wrong !',
					icon: 'error',
				});
			}
		} catch (error) {
			Swal.fire({
				title: 'Error',
				text: error,
				icon: 'error',
			});
		} finally {
		}
	}

	return (
		<div>
			{/* <PDFViewer ref={pdfRef} width="100%" height={500}>
				{generatePDF}
			</PDFViewer>  */}

			{order?.packingSlipUrl && order?.packingSlipUrl != "" ? <a
				// href="https://thesnuslife-asset.s3.amazonaws.com/2f570dae-7a16-4349-a2bc-ffedccf1cc8b.pdf"
				href={order?.packingSlipUrl}
				style={{ background: "transparent", border: "0", padding: "0px 8px", cursor: "pointer", color: '#FFFFFF', fontSize: '12px', display: 'flex', alignItems: 'center' }}
				target="_blank">
				Print Packing Slip
			</a>
				: ''
				// <Button
				// 	// className='shipping-label'
				// 	type='button'
				// 	style={{ background: "transparent", border: "0", padding: "0px 8px", cursor: "pointer",fontWeight:'700', color:'#FFFFFF', fontSize:'12px', display:'flex', alignItems:'center' }}
				// 	onClick={openPDFInNewTab}>
				// 	Print Packing Slip
				// </Button>
			}
		</div>
	);
}

export default PrintPackingSlip