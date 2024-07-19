import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProductModal from '../../modals/productModals/AddProductModal';
import ProductTable from '../../modules/productTable/ProductTable';
import { apiGET, apiPOST } from '../../utils/apiHelper';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery,setSearchQuery] = useState('')

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const fetchProducts = async () => {
    try {
        setLoading(true)
       const payload= {
            "searchQuery":searchQuery,
            "limit":10,
            "page":currentPage
        }
      const response = await apiPOST(`/v1/product/getAllProducts`,payload);
      console.log( "oooo",response?.data?.data?.product)
      setProducts(response?.data?.data?.product);
      setTotalPages(response?.data?.data?.pagination?.totalPages);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false)
    }
  };

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage,searchQuery]);
  
 
  return (
    <div>
      <ProductTable
        products={products}
        onAddProductClick={() => setOpen(true)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        fetchProducts={fetchProducts}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
      />
      <AddProductModal
        open={open}
        onClose={() => setOpen(false)}
        refreshProducts={fetchProducts}
      />
    </div>
  );
};

export default ProductList;
