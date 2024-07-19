import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiGET, apiPOST } from '../../utils/apiHelper';
import AddBrandsModal from '../../modals/brandsModal/AddBrandsModal';
import SubscriberTable from '../../modules/subscriberTable/SubscriberTable';
import AddSubscriberModal from '../../modals/subscriberModal/AddSubscriberModal';
import PaymentHistoryTable from '../../modules/paymentHistoryTable/PaymentHistoryTable';

const PaymentHistoryList = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [seacrhQuery,setSearchQuery] = useState('')

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const fetchPaymentHistory = async () => {
    try {
        setLoading(true)
        const payload = {
          "page" : currentPage,
          "limit" :10,
          "searchQuery":seacrhQuery
      }
      const response = await apiPOST(`v1/payment-history/get-all`,payload);
      console.log( "Payment history res",response?.data?.data?.data)
      setPaymentHistory(response?.data?.data?.data?.data);
      setTotalPages(response?.data?.data?.data?.totalPages);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching paymentHistory:', error);
      setLoading(false)
    }
  };

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [currentPage,seacrhQuery]);
  

  return (
    <div>
      <PaymentHistoryTable
        paymentHistory={paymentHistory}
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

export default PaymentHistoryList;
