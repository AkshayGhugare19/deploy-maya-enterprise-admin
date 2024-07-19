import React, { useState } from 'react';
import { Table, Button, Pagination, Loader, Input } from 'semantic-ui-react';
 import DeleteUserModal from '../../modals/userModals/DeleteUserModal';
import UpdateUserModal from '../../modals/userModals/UpdateUserModal'
import { useNavigate } from 'react-router-dom';

const UserTable = ({ users, currentPage, totalPages, onPageChange, loading,fetchUsers,seacrhQuery,handleSearch }) => {
    const navigate = useNavigate()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    
const handleDeleteUser = (item) => {
    console.log("ggfdf",item)
    setDeleteModalOpen(true);
    setSelectedUser(item);
};

const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
    fetchUsers();
};

const handleUpdateUser = (item) => {
    setUpdateModalOpen(true);
    setSelectedUser(item);
};

const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedUser(null);
    fetchUsers();
};


    return (
        <div className='w-full p-4'>
            <div><Input placeholder="Serach by name or email" value={seacrhQuery} onChange={handleSearch}/></div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Phone No</Table.HeaderCell>
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
                        {users?.length ? users.map((item) => (
                            <Table.Row key={item?.id}>
                                <Table.Cell>{item?.name}</Table.Cell>
                                <Table.Cell>{item?.email}</Table.Cell>
                                <Table.Cell>{item?.phoneNo}</Table.Cell>
                                <Table.Cell>
                                    <Button icon='eye' onClick={() => navigate(`/dashboard/user/${item?.id}`)} />
                                    {/* <Button icon='edit' onClick={() => handleUpdateUser(item)} /> */}
                                    <Button negative icon='delete' onClick={() => handleDeleteUser(item)} />
                                        
                                </Table.Cell>
                            </Table.Row>
                        )) : (
                            <Table.Row>
                                <Table.Cell colSpan='4' textAlign='center'>
                                    No users found
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                )}
                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='4'>
                            <Pagination
                                activePage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
            
            {updateModalOpen && (
                <UpdateUserModal
                    open={updateModalOpen}
                    onClose={closeUpdateModal}
                    selectedUser={selectedUser}
                    refreshUsers={fetchUsers}
                />
            )}
           {deleteModalOpen && (
                <DeleteUserModal
                    deleteModalOpen={deleteModalOpen}
                    closeDeleteModal={closeDeleteModal}
                    selectedUser={selectedUser}
                />
            )}
        </div>
    );
};

export default UserTable;
