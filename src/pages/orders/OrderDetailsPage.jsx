import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Container, Grid, Card, Image, Header, List, Segment, Button, Message,Icon } from "semantic-ui-react";
import Loader from "../../components/loader/Loader";
import StatusBadge from "../../layouts/StatusBadge";
import { apiDELETE, apiGET, apiPUT } from "../../utils/apiHelper";
import { toast } from "react-toastify";


const OrderDetailsPage = () => {
    const { id } = useParams();
    const orderId = id;
    const location = useLocation();
    const { userData } = location.state || {};
    const { prescriptionData } = location.state || {};
    const { enquiryData } = location.state || {};
    const [orderItemData, setOrderItemData] = useState([]);
    const [copied, setCopied] = useState(false); // State to track if Order ID is copied
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);


    const fetchOrderItemData = async () => {
         setLoading(true); 
        try {
            const response = await apiGET(`/v1/order-item/${orderId}`);
            if(response?.data?.status){
                setOrderItemData(response?.data?.data || []);
                setLoading(false); 
            }else{
                setOrderItemData([]);
                setLoading(false); 
            }
           
        } catch (error) {
            console.error("Error fetching order item data:", error);
            setLoading(false);
        }
    };

    

    useEffect(() => {
        fetchOrderItemData();
    }, [orderId]);

    const copyOrderIdToClipboard = () => {
        navigator.clipboard.writeText(orderId.toString());
        alert(`Order ID ${orderId} copied to clipboard!`);
        setCopied(true); // Set copied state to true
        setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
    };
    
    if(loading) return <Loader/>
    return (
        <Container className="p-4">
            <div className="flex justify-between item-center mb-4">
            <Header as="h1">Order Details</Header>
             <StatusBadge status={enquiryData?.enquiryStatus?enquiryData?.enquiryStatus:"awaiting_response"}/>
             </div>
            <Segment>
                <Grid stackable>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Segment>
                                <Header as="h2">Order Items Information</Header>
                                    <List divided relaxed>
                                        <List.Item className="flex item-center" >
                                            <List.Content>
                                                <strong>Order ID:</strong> {orderId}
                                                <Button
                                                    icon="copy"
                                                    content="Copy ID"
                                                    onClick={copyOrderIdToClipboard}
                                                    size="mini"
                                                    style={{ marginLeft: '10px' }}
                                                    color={copied ? 'green' : 'blue'} // Change color based on copied state
                                                    disabled={copied} // Disable button when copied
                                                />
                                            </List.Content>
                                        </List.Item>
                                        {orderItemData?.length ? orderItemData?.length && orderItemData?.map((item, index) => (
                                            <List.Item key={index}>
                                                <div className="my-2 font-semibold">Product {index + 1}</div>
                                                <List.Description>
                                                    <Grid columns={2}>
                                                        <Grid.Column width={5}>
                                                            <Image src={item?.productDetails?.bannerImg} bordered fluid />
                                                        </Grid.Column>
                                                        <Grid.Column width={11}>
                                                            <List divided relaxed>
                                                                <List.Item>
                                                                    <List.Icon name='tag' />
                                                                    <List.Content>Name: {item?.productDetails?.name}</List.Content>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <List.Icon name='dollar sign' />
                                                                    <List.Content>Price: {item?.productDetails?.price}</List.Content>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <List.Icon name='star' />
                                                                    <List.Content>Rating: {item?.productDetails?.avgRating}</List.Content>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <List.Icon name='percent' />
                                                                    <List.Content>Discounted Price: {item?.productDetails?.discountedPrice}</List.Content>
                                                                </List.Item>
                                                            </List>
                                                        </Grid.Column>
                                                    </Grid>
                                                    {item?.productDetails?.images && item?.productDetails?.images.length > 0 && (
                                                        <div style={{ marginTop: '1em', maxHeight: '150px', overflowX: 'auto' }}>
                                                            <label>Related images:</label>
                                                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                                                                {item?.productDetails?.images.map((img, imgIndex) => (
                                                                    <Image key={imgIndex} src={img} rounded bordered className="w-40" />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </List.Description>
                                            </List.Item>
                                        )):<div className="flex items-center justify-center ">
                                        <Message warning>
                                            <Message.Header>Not Found</Message.Header>
                                            <p>Items for this order were not found.</p>
                                        </Message>
                                    </div>}
                                    </List>
                                
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <Header as="h2">Prescription Information</Header>
                                <Card centered>
                                    <div className="flex justify-center items-center py-2">
                                        <a href={prescriptionData?.prescriptionImgUrl} target="_blank" rel="noopener noreferrer">
                                            <img src={prescriptionData?.prescriptionImgUrl} className="h-48" alt="Profile" />
                                        </a>
                                    </div>
                                    <Card.Content>
                                        <Card.Header>{prescriptionData?.title}</Card.Header>
                                        <Card.Meta>
                                            <span className='date'>Upload in {new Date(prescriptionData?.createdAt).getFullYear()}</span>
                                        </Card.Meta>
                                        <Card.Description>
                                            <List>
                                                <List.Item>
                                                    <Icon name='pencil alternate' /> {/* Icon for Type */}
                                                    <List.Content><strong>Type:</strong> {prescriptionData?.type}</List.Content>
                                                </List.Item>
                                                <List.Item>
                                                <Icon name="calendar" />
                                                {/* Icon for Duration Of Dosage */}
                                                    <List.Content><strong>Duration Of Dosage:</strong> {prescriptionData?.durationOfDosage}</List.Content>
                                                </List.Item>
                                                <List.Item>
                                                    <Icon name='clock' /> {/* Icon for Duration Unit */}
                                                    <List.Content><strong>Duration Unit:</strong> {prescriptionData?.durationUnit}</List.Content>
                                                </List.Item>
                                            </List>
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <Header as="h2">User Information</Header>
                                <Card centered>
                                    <div className="flex justify-center item-center py-2">
                                    <img src={userData?.profilePic} className="w-48 h-48 rounded-full" />
                                    </div>
                                    <Card.Content>
                                        <Card.Header>{userData?.name}</Card.Header>
                                        <Card.Meta>
                                            <span className='date'>Joined in {new Date(userData?.createdAt).getFullYear()}</span>
                                        </Card.Meta>
                                        <Card.Description>
                                            <List>
                                                <List.Item>
                                                    <List.Icon name='mail' />
                                                    <List.Content>{userData?.email}</List.Content>
                                                </List.Item>
                                                <List.Item>
                                                    <List.Icon name='phone' />
                                                    <List.Content>{userData?.phoneNo}</List.Content>
                                                </List.Item>
                                                <List.Item>
                                                    <List.Icon name='user' />
                                                    <List.Content>{userData?.role}</List.Content>
                                                </List.Item>
                                            </List>
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </Container>
    );
};

export default OrderDetailsPage;
