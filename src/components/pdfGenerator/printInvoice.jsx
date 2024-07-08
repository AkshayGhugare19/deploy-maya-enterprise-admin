import React, { useEffect, useRef, useState } from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  pdf,
  
  
} from '@react-pdf/renderer';
import moment from 'moment';
import { apiPOST, apiPUT, uploadPost } from '../../utils/apiHelper';
import Swal from 'sweetalert2';
const VITE_COMPANY_MAIL = import.meta.env.VITE_COMPANY_MAIL;







const PrintInvoice = ({ order }) => {
  const pdfRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    row: {
      flexDirection: 'row',
      width: '94%',
      alignSelf: 'center',
    },
    section2: {
      margin: 3,
      padding: 3,
      flexGrow: 1,
	  width:"80%",
	
    },
    section: {
      margin: 5,
      padding: 5,
      width: '90%',

      flexGrow: 1,
    },
    txt: {
      //textAlign:"right",
      fontWeight: 'normal',
      fontSize: 11,
    },
    txtbold: {
      //textAlign:"right",
      fontWeight: 'bold',
      fontSize: 12,
    },
    heading: {
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 10,
      color: 'black',
    },

    tableheading: {
      fontWeight: 'bold',
      fontSize: 12,

      color: 'grey',
    },
    line: {
      borderBottomColor: 'grey',
      height: 3,
      width: '94%',
      alignSelf: 'center',
      borderBottomWidth: 0.5,
    },
    lineright: {
      borderBottomColor: 'grey',
      height: 3,
      width: '34%',
      marginRight: '3%',
      alignSelf: 'flex-end',
      borderBottomWidth: 0.5,
    },
  });

  const generatePDF = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.row}>
          <View style={styles.section}>
		  <View style={{ marginTop: 10 }}></View>
            <Image
              style={{ height: 45, width: 140 }}
              src={'https://thesnuslife-asset.s3.amazonaws.com/logosnus.png'}
            />
		  <View style={{ marginTop: 10 }}></View>
          </View>
          <View style={styles.section}>
		  <View style={{ marginTop: 10 }}></View>
            <View style={{ alignSelf: 'flex-end' }}>
              <Text style={styles.txtbold}>Snus Life</Text>
              <Text style={styles.txt}>New Road New Hall</Text>
              <Text style={styles.txt}>Essex Romford</Text>
              <Text style={styles.txt}>RM4 1AJ</Text>
              
              <View style={{ marginTop: 10 }}></View>
             
            </View>
          </View>
        </View>

        <View style={styles.line} />
        <View style={{ width: '90%', alignSelf: 'center' }}>
          <Text style={styles.heading}>INVOICE</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.section}>
            <Text style={styles.txtbold}>Reference</Text>
            <Text style={styles.txt}>{order?.orderNo}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.txtbold}>Amount Due</Text>
            <Text style={styles.txt}>£ {order?.amountToPay}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.txtbold}>Due Date</Text>
            <Text style={styles.txt}>None</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.txtbold}>To</Text>
            <Text style={styles.txt}>{order?.shippingAdderess?.shippingAddressObj?.firstName} {order?.shippingAdderess?.shippingAddressObj?.lastName}</Text>
            <Text style={styles.txt}>{order?.shippingAdderess?.shippingAddressObj?.address}</Text>
            <Text style={styles.txt}>{order?.shippingAdderess?.shippingAddressObj?.city} {order?.shippingAdderess?.shippingAddressObj?.country}</Text>
            <Text style={styles.txt}>{order?.shippingAdderess?.shippingAddressObj?.zip}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.section}></View>
          <View style={styles.section}></View>
          <View style={styles.section}>
            <Text style={styles.txtbold}>Issue Date</Text>
            <Text style={styles.txt}>{moment(order?.createdAt).format("DD/MM/YYYY")}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.txt}>{order?.shippingAdderess?.shippingAddressObj?.firstName} {order?.shippingAdderess?.shippingAddressObj?.lastName}</Text>
            <Text style={styles.txt}>{order?.shippingAdderess?.shippingAddressObj?.email}</Text>
          </View>
        </View>

        <View style={styles.line} />
        <View style={styles.row}>
          <View style={styles.section}>
          
              <Text style={styles.tableheading}>Description</Text>
     
          </View>
          <View style={styles.row}>
            <View style={styles.section2}>
              <Text style={styles.tableheading}>Qty</Text>
            </View>
            <View style={styles.section2}>
              <Text style={styles.tableheading}>Units</Text>
            </View>
            <View style={styles.section2}>
              <Text style={styles.tableheading}>Unit cost</Text>
            </View>
            <View style={styles.section2}>
              <Text style={styles.tableheading}>VAT</Text>
            </View>
            <View style={styles.section2}>
              <Text style={styles.tableheading}>Amount</Text>
            </View>
          </View>
        </View>

        <View style={styles.line} />

        {/* add loop */}
		{order?.productDetail?.map((item, i) => {
        return (
		
        <View style={styles.row}>
          <View style={styles.section}>
            
              <Text style={styles.txtbold}>{item?.productDetailsObj?.name}</Text>
     
          </View>
          <View style={styles.row}>
            <View style={styles.section2}>
              <Text style={styles.txtbold}>{item?.quantity}</Text>
            </View>
            <View style={styles.section2}>
              <Text style={styles.txtbold}>{item?.quantity}</Text>
            </View>
            <View style={styles.section2}>
              <Text style={styles.txtbold}>{item?.productDetailsObj?.price}</Text>
            </View>
            <View style={styles.section2}>
              <Text style={styles.txtbold}>-</Text>
            </View>
            <View style={styles.section2}>
              <Text style={styles.txtbold}>£{parseFloat(item?.quantity)*parseFloat(item?.productDetailsObj?.price)}</Text>
            </View>
          </View>
        </View>

	
		)})}
		       <View style={styles.line}/>
        <View style={styles.row}>
          <View style={styles.section}>
            <View style={styles.section}></View>
          </View>
          <View style={styles.row}>
            <View style={styles.section}></View>

            <View style={styles.section}>
              <Text style={styles.tableheading}>SubTotal:</Text>
			  <View style={{ marginTop: 10 }}></View>
			  <Text style={styles.tableheading}>Delivery Charge:</Text>
              <View style={{ marginTop: 10 }}></View>
              <Text style={styles.tableheading}>VAT</Text>
            </View>
			<View style={styles.section}>
            
            </View>
            <View style={styles.section}>
              <View style={{ alignSelf: 'flex-end', }}>
                <Text style={styles.txtbold}>£ {parseFloat(order?.amountToPay)-parseFloat(order?.deliveryCharge)}</Text>
                <View style={{ marginTop: 10 }}></View>
				<Text style={styles.txtbold}>£ {order?.deliveryCharge}</Text>
				<View style={{ marginTop: 10 }}></View>
			    <Text style={styles.txtbold}>{order?.shippingAdderess?.shippingAddressObj?.country=="United Kingdom"?"20%":"--"}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.lineright} />

        <View style={styles.row}>
          <View style={styles.section}>
            <View style={styles.section}></View>
          </View>
          <View style={styles.row}>
            <View style={styles.section}></View>

            <View style={styles.section}></View>
            <View style={styles.section}>
              <View style={{ alignSelf: 'flex-end' }}>
                <Text style={styles.txtbold}>Total</Text>
                <View style={{ marginTop: 10 }}></View>
                <Text style={styles.txtbold}>£ {order?.amountToPay}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        <View style={{ width: '90%', alignSelf: 'center' }}>
          <Text style={styles.heading}>PAYMENT METHODS</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.section}>
           
              <Text style={styles.tableheading}>Account Number: </Text>
              <Text style={styles.txt}>17076053</Text>
           
          </View>
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.tableheading}>Sort Code: </Text>
              <Text style={styles.txt}>04-06-05</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.txt}>
              Please pay directly into our business account. Once funds have
              ceared your order will be shipped with Royal Mail tracked 24 or
              pallet line for wholesale orders.
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
        key: 'uploads/' + new Date().getTime() + `${order?.orderNo}.pdf`,
        content: 'application/pdf',
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
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      xhr.setRequestHeader('Caches', false);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.addEventListener('progress', handleProgress, false);
      xhr.onload = function () {
        setLoading(false);
        if (xhr.readyState == 4) {
          let file_Url = url.split('?')[0];
          setFileUrl(file_Url);
          /* 	updateOrder({ orderSlipUrl: file_Url }) */

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
            'Could not upload image please try again---',
            'asset image'
          );
        }
      };
      xhr.onerror = function (error) {
        setLoading(false);
        console.log('Could not upload image please try again', 'asset image');
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
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order?.orderNo}.pdf`;
  };



  const updateOrder = async (file) => {
    let id = order?._id;
    try {
      let payload = {
        invoice:fileUrl,
      };
      const response = await apiPUT(
        `/v1/order/update-order-byid/${id}`,
        payload
      );
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
  };

  useEffect(()=>{
     if(fileUrl && fileUrl.length>0){
		console.log("file Url====",fileUrl);
		updateOrder(fileUrl)
	 }
  },[fileUrl]);


  return (
    <div  >
       {/* <PDFViewer ref={pdfRef} width="100%" height={500}>
        {generatePDF}
      </PDFViewer>  */}

      {/* {order?.orderSlipUrl && order?.orderSlipUrl != "" ? <a
				href={order?.orderSlipUrl}
				style={{ background: "transparent", display: "block", color: "rgba(0,0,0,0.87)", fontSize: "14px", textDecoration: "none", padding: "0px", cursor: "pointer" }}
				target="_blank">
			Create invoice
			</a>
				:
				<button
					type='button'
					style={{ background: "transparent", fontSize: "14px", border: "0", padding: "0px", cursor: "pointer" }}
					onClick={openPDFInNewTab}>
            Create invoice
				</button>
			} */}
      <button
        type="button"
        style={{
          background: 'transparent',
          fontSize: '14px',
          border: '0',
          padding: '0px',
          color: 'rgba(0,0,0,0.87)',
          cursor: 'pointer',
        }}
        onClick={() => {
          openPDFInNewTab();
        }}>
        Create invoice
      </button>
    </div>
  );
};

export default PrintInvoice;
