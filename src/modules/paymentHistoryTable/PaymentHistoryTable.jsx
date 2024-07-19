import moment from 'moment';
import React, { useState } from 'react';
import { Table, Button, Pagination, Loader, Input } from 'semantic-ui-react';

const PaymentHistoryTable = ({ paymentHistory, currentPage, totalPages, onPageChange, loading ,seacrhQuery,handleSearch}) => {

    return (
        <div className='w-full p-4'>
          <div><Input placeholder="Serach by name or email" value={seacrhQuery} onChange={handleSearch}/></div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Currency</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        {/* <Table.HeaderCell>Actions</Table.HeaderCell> */}
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
                        {paymentHistory?.length ? paymentHistory?.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>{item?.userDetails?.name}</Table.Cell>
                                <Table.Cell>{item?.userDetails?.email}</Table.Cell>
                                <Table.Cell>{item?.currency}</Table.Cell>
                                <Table.Cell>{item?.amount}</Table.Cell>
                                <Table.Cell className={`${item?.status==="succeeded"?"text-green-500":""}`}>{item?.status}</Table.Cell>
                                <Table.Cell>{moment(item?.createdAt).format("DD/MM/YYYY")}</Table.Cell>
                                {/* <Table.Cell disabled>
                                    view
                                    <Button positive icon='edit' onClick={() => handleUpdateCategories(item)} />
                                    <Button negative icon='delete' onClick={() => handleDeleteCategories(item)} />
                                </Table.Cell> */}
                            </Table.Row>
                        )) : (
                            <Table.Row>
                                <Table.Cell colSpan='4' textAlign='center'>
                                    No paymentHistory found
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                )}

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='6'>
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

export default PaymentHistoryTable;
