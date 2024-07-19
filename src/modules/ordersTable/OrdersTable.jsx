import React, { useState } from 'react';
import { Table, Button, Pagination, Loader, Input } from 'semantic-ui-react';
import DeleteProductModal from '../../modals/productModals/DeleteProductModal';
import { useNavigate } from 'react-router-dom';
import OrderDeleteModal from '../../modals/ordersModal/OrderDeleteModal';
import moment from 'moment';
import StatusBadgeForTable from '../../layouts/StatusBadgeForTable';

const OrdersTable = ({ orders, currentPage, totalPages, onPageChange, loading,fetchOrders,seacrhQuery,handleSearch }) => {
   console.log('orders',orders)
    const navigate = useNavigate()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleDeleteOrder = (item) => {
        setDeleteModalOpen(true);
        setSelectedOrder(item);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedOrder(null);
        fetchOrders()
    };

    return (
        <div className='w-full p-4'>
            <div><Input placeholder="Serach by name or phone number" value={seacrhQuery} onChange={handleSearch}/></div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>User Name</Table.HeaderCell>
                        <Table.HeaderCell>Mode</Table.HeaderCell>
                        <Table.HeaderCell>Phone No</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Total Payment</Table.HeaderCell>
                        <Table.HeaderCell>Order Place Time</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                {loading ? (
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan='4' textAlign='center'>
                                <Loader active inline='centered' />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ) : (
                    <Table.Body>
                        {orders?.length ? orders.map((item,index) => (
                            <Table.Row key={item?._id}>
                                <Table.Cell>{item?.userData?.name}</Table.Cell>
                                <Table.Cell>{item?.mode}</Table.Cell>
                                <Table.Cell>{item?.userData?.phoneNo?item?.userData?.phoneNo:"--"}</Table.Cell>
                                <Table.Cell><StatusBadgeForTable status={item?.status}/></Table.Cell>
                                <Table.Cell>{item?.totalPayment}</Table.Cell>
                                <Table.Cell>{moment(item?.createdAt).format("DD/MM/YYYY") }</Table.Cell>
                                <Table.Cell>
                                    <Button basic icon='eye' onClick={()=>navigate(`/dashboard/order/${item?._id}`,{ state: { userData: item?.userData ,prescriptionData:item?.prescriptionData,enquiryData:item}})}/>
                                    {/* <Button negative icon='delete' onClick={() => handleDeleteOrder(item)} /> */}
                                </Table.Cell>
                            </Table.Row>
                        )) : (
                            <Table.Row>
                                <Table.Cell colSpan='4' textAlign='center'>
                                    No orders found
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                )}

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='7'>
                            <Pagination
                                activePage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
            {deleteModalOpen && (
                <OrderDeleteModal
                    deleteModalOpen={deleteModalOpen}
                    deleteModalClose={closeDeleteModal}
                    selectedOrder={selectedOrder}
                />
            )}
        </div>
    );
};

export default OrdersTable;
