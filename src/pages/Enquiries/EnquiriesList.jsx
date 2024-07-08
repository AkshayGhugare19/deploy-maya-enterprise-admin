import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrdersTable from '../../modules/ordersTable/OrdersTable';
import { apiPOST } from '../../utils/apiHelper';
import EnquiriesTable from '../../modules/enquiriesTable/EnquiriesTable';

const EnquiriesList = () => {
  const [enquiries, setEnquires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const payload = {
        page:currentPage,
        limit: 10,
      };
      const response = await apiPOST(`/v1/order/all-enquiries`, payload);
      setEnquires(response?.data?.data?.data || []);
      setTotalPages(response?.data?.data?.totalPages || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  return (
    <div>
      <EnquiriesTable
        enquiries={enquiries}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        fetchOrders={fetchOrders}
      />
    </div>
  );
};

export default EnquiriesList;