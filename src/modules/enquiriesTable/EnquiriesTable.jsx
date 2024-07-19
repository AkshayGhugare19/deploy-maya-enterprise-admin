import React, { useEffect, useState } from 'react';
import { Table, Button, Pagination, Loader, Dropdown, Input } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import StatusBadgeForTable from '../../layouts/StatusBadgeForTable';
import axios from 'axios';
import { apiPUT } from '../../utils/apiHelper';
import { toast } from 'react-toastify';

const EnquiriesTable = ({ enquiries, currentPage, totalPages, onPageChange, loading, fetchOrders,searchQuery,handleSearch }) => {
    const navigate = useNavigate();
    const [updating, setUpdating] = useState(false);
    console.log("ee",enquiries)
    const handleDeleteEnquiry = (item) => {
        console.log("Delete Enquiries", item);
    };

    const handleModeChange = async (item, newMode) => {
        setUpdating(true);
        try {
            const orderId = item?._id
            const payload = { 
                mode: newMode ,
                enquiryStatus: "fulfilled"
            };
            const response = await apiPUT(`/v1/order/update/${orderId}`, payload);
            if (response?.data?.status) {
                toast.success("Enquiries mode update successfully")
                fetchOrders();
            }
        } catch (error) {
            console.error("Error updating mode", error);
        } finally {
            setUpdating(false);
        }
    };

    const modeOptions = [
        { key: 'order', value: 'order', text: 'Order' },
        { key: 'enquiry', value: 'enquiry', text: 'Enquiry' },
    ];

   

    return (
        <div className='w-full p-4'>
            <div><Input placeholder="Serach by name or phone number " value={searchQuery} onChange={handleSearch}/></div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>User Name</Table.HeaderCell>
                        <Table.HeaderCell>Mode</Table.HeaderCell>
                        <Table.HeaderCell>Enquiry Type</Table.HeaderCell>
                        <Table.HeaderCell>Items</Table.HeaderCell>
                        <Table.HeaderCell>Phone No</Table.HeaderCell>
                        <Table.HeaderCell>Enquiry Status</Table.HeaderCell>
                        <Table.HeaderCell>Total Amount</Table.HeaderCell>
                        {/* <Table.HeaderCell>Duration Unit</Table.HeaderCell> */}
                        {/* <Table.HeaderCell>Duration Of Dosage</Table.HeaderCell> */}
                        <Table.HeaderCell>Order Place Time</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                {loading ? (
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan='10' textAlign='center'>
                                <Loader active inline='centered' />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ) : (
                    <Table.Body>
                        {enquiries?.length ? enquiries.map((item) => (
                            <Table.Row key={item?._id}>
                                <Table.Cell className='whitespace-nowrap'>{item?.userData?.name || "--"}</Table.Cell>
                                <Table.Cell>
                                        <Dropdown
                                            placeholder='Select Mode'
                                            fluid
                                            selection
                                            disabled={item?.orderItemData?.length && item?.mode === 'enquiry'?false:true}
                                            options={modeOptions}
                                            value={item?.mode}
                                            onChange={(e, { value }) => handleModeChange(item, value)}
                                            loading={updating}
                                        />
                                </Table.Cell>
                                <Table.Cell>{item?.enquiryType === "asPerPrescription" ? "prescription" : "--"}</Table.Cell>
                                <Table.Cell>{item?.orderItemData?.length}</Table.Cell>
                                <Table.Cell>{item?.userData?.phoneNo || "--"}</Table.Cell>
                                <Table.Cell>
                                    <StatusBadgeForTable status={item?.enquiryStatus} />
                                </Table.Cell>
                                <Table.Cell>{item?.totalPayment || "0"}</Table.Cell>
                                {/* <Table.Cell>{item?.durationUnit || "--"}</Table.Cell> */}
                                {/* <Table.Cell>{item?.durationOfDosage || "--"}</Table.Cell> */}
                                <Table.Cell>{moment(item?.createdAt).format("DD/MM/YYYY")}</Table.Cell>
                                <Table.Cell className='flex'>
                                    <Button positive icon='edit' onClick={() => navigate(`/dashboard/enquiry/${item?._id}`, { state: { userData: item?.userData, prescriptionData: item?.prescriptionData, enquiryData: item } })} />
                                    <Button negative icon='delete' onClick={() => handleDeleteEnquiry(item)} />
                                </Table.Cell>
                            </Table.Row>
                        )) : (
                            <Table.Row>
                                <Table.Cell colSpan='10' textAlign='center'>
                                    No enquiries found
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                )}
                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='10'>
                            <Pagination
                                activePage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </div>
    );
};

export default EnquiriesTable;
