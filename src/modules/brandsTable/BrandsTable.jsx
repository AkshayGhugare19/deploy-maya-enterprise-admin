import React, { useState } from 'react';
import { Table, Button, Pagination, Loader, Input } from 'semantic-ui-react';
import DeleteBrandsModal from '../../modals/brandsModal/DeleteBrandsModal';
import UpdateBrandsModal from '../../modals/brandsModal/UpdateBrandsModal';
import { apiPUT } from '../../utils/apiHelper';
import moment from 'moment';

const BrandsTable = ({ brands, onAddCategoriesClick, currentPage, totalPages, onPageChange, loading, fetchBrands, searchQuery, handleSearch }) => {
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
    const handleToggle = async (id) => {
        const brandIndex = brands.findIndex((brand) => brand.id === id);
        if (brandIndex === -1) return;
        const updatedBrand = { ...brands[brandIndex], active: !brands[brandIndex].active };
        const payload = { active: updatedBrand.active };

        const response = await apiPUT(`v1/Brand/update/${id}`, payload)
        if (response.ok) {
            toast.success('Brand updated success')
        } else {

        }
    };

    return (
        <div className='w-full px-4'>
            <div className='flex justify-between items-center mt-4'>
                <div><Input placeholder="Serach by brnad name  " value={searchQuery} onChange={handleSearch} /></div>

                <Button primary onClick={onAddCategoriesClick}>Add Brand</Button>
            </div>

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Brand Logo</Table.HeaderCell>
                        <Table.HeaderCell>Categories</Table.HeaderCell>
                        <Table.HeaderCell>Brand Name</Table.HeaderCell>
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
                                <Table.Cell>
                                    {moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                                    {/* <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={item.active}
                                            onChange={() => handleToggle(item.id)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900">
                                            {item.active ? 'Active' : 'Not Active'}
                                        </span>
                                    </label> */}
                                </Table.Cell>
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
