import React, { useState } from 'react';
import { Table, Button, Pagination, Loader, Input } from 'semantic-ui-react';
import DeleteCategoriesModal from '../../modals/categoriesModals/DeleteCategoriesModal';
import UpdateCategoriesModal from '../../modals/categoriesModals/UpdateCategoriesModal';
import moment from 'moment';

const CategoriesTable = ({ categories, onAddCategoriesClick, currentPage, totalPages, onPageChange, loading, fetchCategories, searchQuery, handleSearch }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(null);

    const handleDeleteCategories = (item) => {
        setDeleteModalOpen(true);
        setSelectedCategories(item);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedCategories(null);
        fetchCategories()
    };
    const handleUpdateCategories = (item) => {
        setUpdateModalOpen(true);
        setSelectedCategories(item);
    };

    const closeUpdateModal = () => {
        setUpdateModalOpen(false);
        setSelectedCategories(null);
        fetchCategories()
    };

    return (
        <div className='w-full px-4'>
            <div className='flex justify-between items-center mt-4'>
                <div><Input placeholder="Serach by name or phone number " value={searchQuery} onChange={handleSearch} /></div>

                <Button primary onClick={onAddCategoriesClick}>Add Categories</Button>
            </div>

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Created At</Table.HeaderCell>
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
                        {categories?.length ? categories.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>{item.name}</Table.Cell>
                                <Table.Cell>{item.description}</Table.Cell>
                                <Table.Cell>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Table.Cell>
                                <Table.Cell>
                                <div style={{ display: 'flex', justifyContent: '' }}>
                                    <Button positive icon='edit' onClick={() => handleUpdateCategories(item)} />
                                    <Button negative icon='delete' onClick={() => handleDeleteCategories(item)} />
                                </div>
                                </Table.Cell>
                               

                            </Table.Row>
                        )) : (
                            <Table.Row>
                                <Table.Cell colSpan='4' textAlign='center'>
                                    No categories found
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                )}

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='4'>
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
                <DeleteCategoriesModal
                    deleteModalOpen={deleteModalOpen}
                    deleteModalClose={closeDeleteModal}
                    selectedCategories={selectedCategories}
                />
            )}
            {updateModalOpen && (
                <UpdateCategoriesModal
                    updateModalOpen={updateModalOpen}
                    updateModalClose={closeUpdateModal}
                    selectedCategories={selectedCategories}
                />
            )}
        </div>
    );
};

export default CategoriesTable;
