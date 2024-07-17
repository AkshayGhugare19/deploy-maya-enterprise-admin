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


  const fetchPaymentHistory = async () => {
    try {
        setLoading(true)
        const payload = {
          "page" : currentPage,
          "limit" :10,
          "name": "",
          "email": ""
      }
      const response = await apiPOST(`v1/payment-history/get-all`,payload);
      console.log( "Payment history res",response?.data?.data?.data)
      setPaymentHistory(response?.data?.data?.data);
      // setTotalPages(response?.data?.data?.pagination?.totalPages);
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
  }, [currentPage]);

  return (
    <div>
      <PaymentHistoryTable
        paymentHistory={paymentHistory}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />
     
    </div>
  );
};

export default PaymentHistoryList;
