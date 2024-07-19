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
  const [searchQuery,setSearchQuery] = useState('')

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }


  const fetchBrands = async () => {
    try {
        setLoading(true)
        const payload = {
          "page":currentPage,
          "limit": 10,
          "searchQuery":searchQuery
      }
      const response = await apiPOST(`v1/brand/all`,payload);
      console.log( "Brands res",response?.data?.data)
      setBrands(response?.data?.data?.brands);
      setTotalPages(response?.data?.data?.totalPages);
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
  }, [currentPage,searchQuery]);

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
        searchQuery={searchQuery}
        handleSearch={handleSearch}
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
