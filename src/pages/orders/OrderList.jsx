import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrdersTable from '../../modules/ordersTable/OrdersTable';
import { apiPOST } from '../../utils/apiHelper';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [seacrhQuery,setSearchQuery] = useState('')

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const payload = {
        page:currentPage,
        limit: 10,
        searchQuery:seacrhQuery
      };
      const response = await apiPOST(`/v1/order/all`, payload);
      setOrders(response?.data?.data?.data || []);
      setTotalPages(response?.data?.data?.totalPages || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage,seacrhQuery]);

  return (
    <div>
      <OrdersTable
        orders={orders}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        seacrhQuery={seacrhQuery}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default OrderList;
