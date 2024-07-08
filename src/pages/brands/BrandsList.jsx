import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiGET, apiPOST } from '../../utils/apiHelper';
import BrandsTable from '../../modules/brandsTable/BrandsTable';
import AddBrandsModal from '../../modals/brandsModal/AddBrandsModal';

const BrandLists = () => {
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);


  const fetchBrands = async () => {
    try {
        setLoading(true)
      const response = await apiGET(`v1/brand/all`);
      console.log( "Brands res",response?.data?.data)
      setBrands(response?.data?.data);
      // setTotalPages(response?.data?.data?.pagination?.totalPages);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching brands:', error);
      setLoading(false)
    }
  };

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  useEffect(() => {
    fetchBrands();
  }, [currentPage]);

  return (
    <div>
      <BrandsTable
        brands={brands}
        onAddCategoriesClick={() => setOpen(true)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        fetchBrands={fetchBrands}
      />
      <AddBrandsModal
        open={open}
        onClose={() => setOpen(false)}
        refreshBrands={fetchBrands}
      />
    </div>
  );
};

export default BrandLists;
