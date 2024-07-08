import React, { useState } from 'react';
import { Table, Button, Pagination, Loader } from 'semantic-ui-react';
import DeleteBrandsModal from '../../modals/brandsModal/DeleteBrandsModal';
import UpdateBrandsModal from '../../modals/brandsModal/UpdateBrandsModal';

const BrandsTable = ({ brands, onAddCategoriesClick, currentPage, totalPages, onPageChange, loading, fetchBrands }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState(null);

    const handleDeleteCategories = (item) => {
        setDeleteModalOpen(true);
        setSelectedBrands(item);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedBrands(null);
        fetchBrands()
    };
    const handleUpdateCategories = (item) => {
        setUpdateModalOpen(true);
        setSelectedBrands(item);
    };

    const closeUpdateModal = () => {
        setUpdateModalOpen(false);
        setSelectedBrands(null);
        fetchBrands()
    };

    return (
        <div className='w-full px-4'>
            <div className='flex justify-end mt-4'>
                <Button primary onClick={onAddCategoriesClick}>Add Brand</Button>
            </div>

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Brand Logo</Table.HeaderCell>
                        <Table.HeaderCell>Categories</Table.HeaderCell>
                        <Table.HeaderCell>Brand Name</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Active</Table.HeaderCell>
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
                        {brands?.length ? brands.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell><div className='w-full flex justify-center item-center  '><img src={item?.brandImgUrl ? item?.brandImgUrl : ""} alt='loading' className='w-10 h-10 rounded-full' /></div></Table.Cell>
                                <Table.Cell className=''>{item?.categoryId.length && item?.categoryId.map((catItem) => {
                                    return (
                                        <div >{catItem?.name}</div>
                                    )
                                })}</Table.Cell>
                                <Table.Cell>{item.name}</Table.Cell>
                                <Table.Cell>{item.description}</Table.Cell>
                                <Table.Cell>{item.active ? "Active" : "Not Active"}</Table.Cell>
                                <Table.Cell>
                                    <Button positive icon='edit' onClick={() => handleUpdateCategories(item)} />
                                    <Button negative icon='delete' onClick={() => handleDeleteCategories(item)} />
                                </Table.Cell>
                            </Table.Row>
                        )) : (
                            <Table.Row>
                                <Table.Cell colSpan='4' textAlign='center'>
                                    No brands found
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                )}

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='6'>
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
                <DeleteBrandsModal
                    deleteModalOpen={deleteModalOpen}
                    deleteModalClose={closeDeleteModal}
                    selectedBrands={selectedBrands}
                />
            )}
            {updateModalOpen && (
                <UpdateBrandsModal
                    updateModalOpen={updateModalOpen}
                    updateModalClose={closeUpdateModal}
                    selectedBrands={selectedBrands}
                />
            )}
        </div>
    );
};

export default BrandsTable;
