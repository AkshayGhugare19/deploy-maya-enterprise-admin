import React, { useEffect, useRef, useState } from 'react'
import { Document, Page, View, Text, StyleSheet, Image, pdf, PDFViewer } from '@react-pdf/renderer';
import moment from 'moment';
import { apiPOST, apiPUT, uploadPost } from '../../utils/apiHelper';
import Swal from 'sweetalert2';
const VITE_COMPANY_MAIL = import.meta.env.VITE_COMPANY_MAIL;

const PrintOrder = ({ order }) => {
	const pdfRef = useRef(null);
	const [loading, setLoading] = useState(false)
	const [fileUrl, setFileUrl] = useState('')
	const [uploadProgress, setUploadProgress] = useState(0)
	const generatePDF =
		(
			<Document>
				<Page style={{ padding: "40px", fontSize: "13px", color: "grey", border: "1px solid black" }}>
					<View style={{
						display: 'flex',
						justifyContent: "space-between",
						flexDirection: "row"
					}}>
						<Text style={{
							fontSize: "18px",
							color: "black",
							fontWeight: "700"
						}}>Order {order?.orderNo} ({order?.productDetail?.length} items)</Text>
						<Text style={{
							fontSize: "13px",
						}}>
							Placed on: {moment(order?.createdAt).format('LLL')}
						</Text>
					</View>
					<View style={{
						display: 'flex',
						marginTop: "12px",
						flexDirection: "row"
					}}>
						<View style={{
							display: "flex",
							flexDirection: "row"
						}}>
							<Text style={{}}>
								{order?.shippingAdderess?.shippingAddressObj?.firstName}
								{" "}
							</Text>
							<Text style={{}}>
								{order?.shippingAdderess?.shippingAddressObj?.lastName}
								{" | "}
							</Text>
						</View>
						<Text style={{}}>
							{order?.shippingAdderess?.shippingAddressObj?.email}
							{" | "}
						</Text>
						<Text style={{}}>
							{order?.shippingAdderess?.shippingAddressObj?.phone}
						</Text>
					</View>

					<View style={{ border: "1px solid black", marginTop: "2px" }}></View>
					{order?.productDetail?.length ? order?.productDetail.map((item, index) => (
						<View key={index}
							style={{
								padding: "10px",
								display: "flex",
								width: "100%",
								flexDirection: "row",
								gap: "20px",
								// justifyContent:"space-between",
								borderBottom: "1px solid black"
							}}
						>
							<Image src={`${item?.productDetailsObj?.productImageUrl}`}
								style={{ width: 100 }}
							/>
							<Text style={{ color: "black", width: "300px" }}>{item?.productDetailsObj?.name}</Text>
							<Text style={{ color: "black", width: "100px" }}>£{item?.productDetailsObj?.price}</Text>
							<Text style={{ color: "black", width: "100px" }}>x{item?.quantity}</Text>
							<Text style={{ color: "black", width: "100px" }}>£{item?.quantity * item?.productDetailsObj?.price}</Text>
						</View>
					))
						: ""
					}
					<View style={{ display: "flex", marginTop: "10px", flexDirection: "row", justifyContent: "flex-end" }}>
						<View >
							<View style={{ display: "flex", width: "200px", flexDirection: "row", justifyContent: "space-between" }}>
								<Text>Subtotal:-</Text>
								<Text>£{order?.amountToPay - order?.deliveryCharge}</Text>
							</View>
							<View style={{ display: "flex", marginTop: "5px", width: "200px", flexDirection: "row", justifyContent: "space-between" }}>
								<Text>Shipping:-</Text>
								<Text>£{order?.deliveryCharge}</Text>
							</View>
							<View style={{ display: "flex", marginTop: "5px", width: "200px", flexDirection: "row", justifyContent: "space-between" }}>
								<Text>Tax:-</Text>
								<Text>£0</Text>
							</View>
							<View style={{ border: "1px solid black", margin: "5px 0px" }}></View>
							<View style={{ display: "flex", width: "200px", flexDirection: "row", justifyContent: "space-between" }}>
								<Text>Total:-</Text>
								<Text>£{order?.amountToPay}</Text>
							</View>
						</View>
					</View>

					<Text style={{ color: "black", fontSize: "16px", marginTop: "20px", fontWeight: "700" }}>Customer Info</Text>
					<View style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
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
								{order?.shippingAdderess?.shippingAddressObj?.email}
							</Text>
							<Text style={{ textTransform: "capitalize" }}>{order?.deliveryMethod}</Text>
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
								{order?.shippingAdderess?.shippingAddressObj?.email}
							</Text>
						</View>
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
					updateOrder({ orderSlipUrl: file_Url })

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

	const updateOrder = async ({ orderSlipUrl }) => {
		let id = order?._id;
		try {
			let payload = {
				orderSlipUrl
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
            </PDFViewer> */}

			{order?.orderSlipUrl && order?.orderSlipUrl != "" ? <a
				href={order?.orderSlipUrl}
				style={{ background: "transparent", display: "block", color: "rgba(0,0,0,0.87)", fontSize: "14px", textDecoration: "none", padding: "0px", cursor: "pointer" }}
				target="_blank">
				Print order
			</a>
				:
				<button
					type='button'
					style={{ background: "transparent", fontSize: "14px", border: "0", padding: "0px", cursor: "pointer" }}
					onClick={openPDFInNewTab}>
					Print order
				</button>
			}
		</div>
	);
}

export default PrintOrder