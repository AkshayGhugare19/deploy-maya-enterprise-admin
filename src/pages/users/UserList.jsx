// UserList.jsx
import React, { useState, useEffect } from 'react';
import { apiGET } from '../../utils/apiHelper';
import UserTable from '../../modules/usersTable/UserTable';
import AddUserModal from '../../modals/userModals/AddUserModal';
import UpdateUserModal from '../../modals/userModals/UpdateUserModal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for view modal
  const [selectedUser, setSelectedUser] = useState(null);

  console.log("iiiiigg", users);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await apiGET(`/v1/users/all-users`);
      setUsers(response?.data?.data?.data);
      setTotalPages(response?.data?.data?.pagination?.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <UserTable
        users={users}
        onAddUserClick={() => setOpen(true)}
        onUpdateUserClick={handleUpdate}
        onViewUserClick={handleViewDetails} 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        fetchUsers={fetchUser}
        loading={loading}
      />
      <AddUserModal
        open={open}
        onClose={() => setOpen(false)}
        refreshUsers={fetchUser}
      />
      <UpdateUserModal
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        selectedUser={selectedUser}
        refreshUsers={fetchUser}
      />
      
    </div>
  );
};

export default UserList;
