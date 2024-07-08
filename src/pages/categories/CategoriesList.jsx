import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiGET, apiPOST } from '../../utils/apiHelper';
import CategoriesTable from '../../modules/categoriesTable/CategoriesTable';
import AddCategoriesModal from '../../modals/categoriesModals/AddCategoriesModal';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);


  const fetchCategories = async () => {
    try {
        setLoading(true)
      const response = await apiGET(`v1/category/all`);
      console.log( "Categories res",response?.data?.data)
      setCategories(response?.data?.data);
      // setTotalPages(response?.data?.data?.pagination?.totalPages);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false)
    }
  };

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  return (
    <div>
      <CategoriesTable
        categories={categories}
        onAddCategoriesClick={() => setOpen(true)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        fetchCategories={fetchCategories}
      />
      <AddCategoriesModal
        open={open}
        onClose={() => setOpen(false)}
        refreshCategories={fetchCategories}
      />
    </div>
  );
};

export default CategoriesList;
