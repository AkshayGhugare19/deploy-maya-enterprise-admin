import React, { useState } from 'react';
import { Table, Button, Pagination, Loader, Input } from 'semantic-ui-react';
import DeleteProductModal from '../../modals/productModals/DeleteProductModal';
import { useNavigate } from 'react-router-dom';

const ProductTable = ({ products, onAddProductClick, currentPage, totalPages, onPageChange, loading,fetchProducts,searchQuery,handleSearch }) => {
    const navigate = useNavigate()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleDeleteProduct = (item) => {
        setDeleteModalOpen(true);
        setSelectedProduct(item);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedProduct(null);
        fetchProducts()
    };

    return (
        <div className='w-full px-4'>
            <div className='flex justify-between items-center mt-4'>
            <div><Input placeholder="Serach by product name " value={searchQuery} onChange={handleSearch}/></div>
                <Button primary onClick={onAddProductClick}>Add Product</Button>
            </div>

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                        <Table.HeaderCell>Ratings</Table.HeaderCell>
                        <Table.HeaderCell>Strip Capsule Qty</Table.HeaderCell>
                        <Table.HeaderCell>Discounted Price</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                {loading ? (
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan='4' textAlign='center'>
                                <Loader active inline='centered' />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ) : (
                    <Table.Body>
                        {products?.length ? products.map((item,index) => (
                            <Table.Row key={item._id}>
                                <Table.Cell>{item.name}</Table.Cell>
                                <Table.Cell>{item.price}</Table.Cell>
                                <Table.Cell>{item.avgRating}</Table.Cell>
                                <Table.Cell>{item.stripCapsuleQty}</Table.Cell>
                                <Table.Cell>{item.discountedPrice}</Table.Cell>
                                <Table.Cell>
                                    <Button positive icon='edit' onClick={()=>navigate(`/dashboard/product/${item._id}`)}/>
                                    <Button negative icon='delete' onClick={() => handleDeleteProduct(item)} />
                                </Table.Cell>
                            </Table.Row>
                        )) : (
                            <Table.Row>
                                <Table.Cell colSpan='4' textAlign='center'>
                                    No products found
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                )}

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='7'>
                            <Pagination
                                activePage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
            {deleteModalOpen && (
                <DeleteProductModal
                    deleteModalOpen={deleteModalOpen}
                    deleteModalClose={closeDeleteModal}
                    selectedProduct={selectedProduct}
                />
            )}
        </div>
    );
};

export default ProductTable;
