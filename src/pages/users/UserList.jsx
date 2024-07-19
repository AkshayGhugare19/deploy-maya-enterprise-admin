// UserList.jsx
import React, { useState, useEffect } from 'react';
import { apiGET, apiPOST } from '../../utils/apiHelper';
import UserTable from '../../modules/usersTable/UserTable';
import AddUserModal from '../../modals/userModals/AddUserModal';
import UpdateUserModal from '../../modals/userModals/UpdateUserModal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  // const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for view modal
  // const [selectedUser, setSelectedUser] = useState(null);

  const [seacrhQuery,setSearchQuery] = useState('')

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const fetchUser = async () => {
    try {
      setLoading(true);
      const payload = {
        "page": currentPage,
        "limit": 10,
        "searchQuery":seacrhQuery
    }
      const response = await apiPOST(`/v1/users/get-all-users-with-pagination`,payload);
      setUsers(response?.data?.data?.users);
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

  // const handleUpdate = (user) => {
  //   setSelectedUser(user);
  //   setIsUpdateModalOpen(true);
  // };

  // const handleViewDetails = (user) => {
  //   setSelectedUser(user);
  //   setIsViewModalOpen(true);
  // };

  useEffect(() => {
    fetchUser();
  }, [currentPage,seacrhQuery]);

  return (
    <div>
      <UserTable
        users={users}
        // onAddUserClick={() => setOpen(true)}
        // onUpdateUserClick={handleUpdate}
        // onViewUserClick={handleViewDetails} 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        fetchUsers={fetchUser}
        loading={loading}
        seacrhQuery={seacrhQuery}
        handleSearch={handleSearch}
      />
      {/* <AddUserModal
        open={open}
        onClose={() => setOpen(false)}
        refreshUsers={fetchUser}
      />
      <UpdateUserModal
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        selectedUser={selectedUser}
        refreshUsers={fetchUser}
      /> */}
      
    </div>
  );
};

export default UserList;
