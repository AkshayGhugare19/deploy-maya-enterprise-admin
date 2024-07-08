import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { apiDELETE, apiGET, apiPUT } from "../../utils/apiHelper";
import { Container, Grid, Card, Image, Header, List, Segment, Button, Message, Icon } from "semantic-ui-react";
import Loader from "../../components/loader/Loader";
import AddOrderItem from "../../modals/enquiresModals/AddOrderItem";
import { toast } from "react-toastify";
import StatusBadge from "../../layouts/StatusBadge";

const EnquiriesDetailAndEditPage = () => {
    const { id } = useParams();
    const orderId = id;
    const location = useLocation();
    const { userData } = location.state || {};
    const { prescriptionData } = location.state || {};
    const { enquiryData } = location.state || {};
    const [orderItemData, setOrderItemData] = useState([]);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [incrementLoading, setIncrementLoading] = useState(false)
    const [decrementLoading, setDecrementLoading] = useState(false)

    const fetchOrderItemData = async () => {
        setLoading(true);
        try {
            const response = await apiGET(`/v1/order-item/${orderId}`);
            console.log("rrreee", response?.data);
            if (response?.data?.status) {
                setOrderItemData(response?.data?.data || []);
            } else {
                setOrderItemData([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching order item data:", error);
            setError("Failed to load order item data. Please try again later.");
            setLoading(false);
        }
    };

    const AddNewItem = () => {
        setOpen(true);
    };

    const handleSubmitInformToUser = async () => {
        try {
            const payload = {
                enquiryStatus: "fulfilled",
                totalPayment: totalAmount ? totalAmount : "0"
            };
            const response = await apiPUT(`/v1/order/update/${orderId}`, payload);
            if (response?.data?.status) {
                toast.success("Enquiries information sent successfully");
            }
        } catch (error) {
            console.error("Error sending enquiries information:", error);
            toast.error("Failed to send enquiries information. Please try again later.");
        }
    };

    const deleteOrderItem = async (item) => {
        try {
            const response = await apiDELETE(`/v1/order-item/delete/${item?._id}`);
            if (response?.data?.status) {
                setOrderItemData(orderItemData.filter(i => i?._id !== item?._id));
                fetchOrderItemData();
                toast.success("Order item deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting order item:", error);
        }
    };

    const updateOrderItem = async (itemId, updatedData) => {
        try {
            const payload = {
                quantity:updatedData?.quantity
            }
            const response = await apiPUT(`/v1/order-item/update/${itemId}`, payload);
            if (response?.data?.status) {
                setOrderItemData(response?.data?.data || []);
                toast.success("Order item quantity updated successfully");
                setIncrementLoading(false);
                setDecrementLoading(false);
            }
        } catch (error) {
            console.error("Error updating order item:", error);
            setIncrementLoading(false);
            setDecrementLoading(false)
            toast.error("Failed to update order item. Please try again later.");
        }
    };

    const incrementQuantity = (item) => {
        const updatedItem = { ...item, quantity: item.quantity + 1 };
        setIncrementLoading(true);
        updateOrderItem(item._id, updatedItem);
    };

    const decrementQuantity = (item) => {
        if (item.quantity > 1) {
            const updatedItem = { ...item, quantity: item.quantity - 1 };
            setDecrementLoading(true)
            updateOrderItem(item._id, updatedItem);
        } else {
            toast.error("Quantity cannot be less than 1");
        }
    };

    const copyOrderIdToClipboard = () => {
        navigator.clipboard.writeText(orderId.toString());
        toast.success(`Order ID ${orderId} copied to clipboard!`);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    useEffect(() => {
        fetchOrderItemData();
    }, [orderId]);

    useEffect(() => {
        if (orderItemData?.length) {
            const total = orderItemData.reduce((acc, item) => {
                const itemTotal = item?.quantity * item?.productDetails?.discountedPrice;
                return acc + itemTotal;
            }, 0);
            setTotalAmount(total);
        } else {
            setTotalAmount(0);
        }
    }, [orderItemData]);

    if (loading) return <Loader />;

    return (
        <Container className="p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="font-bold text-3xl">Enquiries Order Details</div>
                <StatusBadge status={enquiryData?.enquiryStatus ? enquiryData?.enquiryStatus : "awaiting_response"} />
            </div>
            <div>
                <Grid stackable>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Segment>
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold text-xl">Enquiries Items Information</div>
                                    <div className="text-sm border p-1 border-blue-500 rounded-md text-white bg-blue-500">Total Amount: {totalAmount ? totalAmount.toFixed(2) : 0}</div>
                                </div>
                                <List>
                                    <List.Item className="flex items-center">
                                        <List.Content>
                                            <strong>Order ID:</strong> ORD-{orderId}
                                            <Button
                                                icon="copy"
                                                content="Copy ID"
                                                onClick={copyOrderIdToClipboard}
                                                size="mini"
                                                style={{ marginLeft: '10px' }}
                                                color={copied ? 'green' : 'blue'}
                                                disabled={copied}
                                            />
                                        </List.Content>
                                    </List.Item>
                                </List>
                                <div className="order-item-list" style={{ height: '44vh', overflowX: 'hidden' }}>
                                    <List divided relaxed>
                                        {orderItemData?.length ? orderItemData?.map((item, index) => (
                                            <List.Item key={index}>
                                                <div className="flex justify-between items-center my-2">
                                                    <div className="font-semibold">Product {index + 1}</div>
                                                    <div className="pr-2">
                                                        <Button basic icon="trash alternate" onClick={() => deleteOrderItem(item)} />
                                                    </div>
                                                </div>
                                                <List.Description>
                                                    <Grid columns={2}>
                                                        <Grid.Column width={5}>
                                                            <img src={item?.productDetails?.bannerImg} className="rounded-md" />
                                                        </Grid.Column>
                                                        <Grid.Column width={11}>
                                                            <List divided relaxed>
                                                                <List.Item>
                                                                    <List.Icon name='tag' />
                                                                    <List.Content>Name: {item?.productDetails?.name}</List.Content>
                                                                </List.Item>
                                                                <List.Item>
                                                                    
                                                                    <List.Content>
                                                                        <div className="flex items-center">
                                                                        <List.Icon name='boxes' />
                                                                            <div className="">Quantity</div>
                                                                            <div className="pl-2 flex gap-1 items-center">
                                                                            <Button loading={decrementLoading} icon="minus" size="mini" onClick={() => decrementQuantity(item)} />
                                                                            <span className="mx-2">{item?.quantity}</span>
                                                                            <Button loading={incrementLoading} icon="plus" size="mini" onClick={() => incrementQuantity(item)} />
                                                                            </div>
                                                                        </div>
                                                                    </List.Content>
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
                                        )) : <div className="flex items-center justify-center">
                                            <Message warning>
                                                <Message.Header>Not Found</Message.Header>
                                                <p>Items for this enquiry were not found.</p>
                                            </Message>
                                        </div>}
                                    </List>
                                </div>
                                <div className="flex justify-between items-center gap-5">
                                    <Button onClick={AddNewItem} size="mini" basic color="green" fluid circular>
                                        {orderItemData?.length ? "Add More Item" : "Add Item"}
                                    </Button>
                                    <Button
                                        disabled={orderItemData?.length ? false : true}
                                        onClick={handleSubmitInformToUser}
                                        size="mini"
                                        basic
                                        color="blue"
                                        fluid
                                        circular>
                                        Submit
                                    </Button>
                                </div>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <Header as="h2">Prescription Information</Header>
                                <Card centered>
                                    <div className="flex justify-center items-center py-2">
                                        <a href={prescriptionData?.prescriptionImgUrl} target="_blank" rel="noopener noreferrer">
                                            <img src={prescriptionData?.prescriptionImgUrl} className="h-48 rounded-md" alt="Profile" />
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
                                                    <Icon name='pencil alternate' />
                                                    <List.Content><strong>Type:</strong> {prescriptionData?.type}</List.Content>
                                                </List.Item>
                                                <List.Item>
                                                    <Icon name='calendar ' />
                                                    <List.Content><strong>Duration Of Dosage:</strong> {prescriptionData?.durationOfDosage}</List.Content>
                                                </List.Item>
                                                <List.Item>
                                                    <Icon name='clock' />
                                                    <List.Content><strong>Duration Unit:</strong> {prescriptionData?.durationUnit}</List.Content>
                                                </List.Item>
                                            </List>
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column style={{ marginTop: "10px" }}>
                            <Segment>
                                <Header as="h2">User Information</Header>
                                <Card centered>
                                    <div className="flex justify-center items-center py-2">
                                        <img src={userData?.profilePic} className="w-48 h-48 rounded-full" alt="Profile" />
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
            </div>
            <AddOrderItem
                open={open}
                onClose={() => { setOpen(false); fetchOrderItemData(); }}
                orderId={orderId}
            />
        </Container>
    );
};

export default EnquiriesDetailAndEditPage;
