import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Dropdown } from 'semantic-ui-react';
import { apiPOST, apiGET } from '../../utils/apiHelper';
import FileUploadInput from '../../components/FileUpload/FileUploadInput';
import { toast } from 'react-toastify';

const AddBrandsModal = ({ open, onClose, refreshBrands }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: [],
  });
  const [uploadFileUrl, setUploadedFileUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await apiGET('/v1/category/all');
      if (response?.data?.status) {
        setCategories(response.data.data.map(item => ({
          key: item.id,
          text: item.name,
          value: item.id,
        })));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e, { value }) => {
    setFormData({ ...formData, categoryId: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        brandImgUrl: uploadFileUrl,
      };
      const response = await apiPOST('/v1/brand/add', payload);
      if (response?.data?.status) {
        onClose();
        toast.success("Brand added successfully")
        refreshBrands(); // Call this function to refresh the product list
      }else{
        toast.error("Failed to add brand")}
    } catch (error) {
      console.error('Error adding brand:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: [],
      });
      setUploadedFileUrl('');
      setLoading(false);
    }
  }, [open]);
  return (
    <Modal open={open} onClose={onClose} size='tiny' closeIcon>
      <Modal.Header>Add a New Brand</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Brand image</label>
            <FileUploadInput setUploadedFileUrl={setUploadedFileUrl} />
          </Form.Field>
          <Form.Field>
            <label>Categories</label>
            <Dropdown
              placeholder='Select Categories'
              fluid
              multiple
              search
              selection
              options={categories}
              onChange={handleCategoryChange}
              value={formData.categoryId}
            />
          </Form.Field>
          <Form.Input
            label='Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Form.Input
            label='Description'
            name='description'
            value={formData.description}
            onChange={handleChange}
          />
          <Button type='button' primary loading={loading} onClick={handleSubmit}>Add Brand</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddBrandsModal;
