import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Dropdown, Message } from 'semantic-ui-react';
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
  const [errors, setErrors] = useState({});
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
    setErrors({ ...errors, [name]: '' }); // Clear the error for the current field
  };

  const handleCategoryChange = (e, { value }) => {
    setFormData({ ...formData, categoryId: value });
    setErrors({ ...errors, categoryId: '' }); // Clear the category error
  };
   
  const countWords = (str) => {
    return str.trim().split(/\s+/).length;
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.description) {
      newErrors.description = 'Description is required';
    } else if (countWords(formData.description) > 100) {
      newErrors.description = 'Description must be 100 words or less';
    }
    if (formData.categoryId.length === 0) {
      newErrors.categoryId = 'Category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

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
        toast.success("Brand added successfully");
        refreshBrands(); // Call this function to refresh the product list
      } else {
        toast.error("Failed to add brand");
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      toast.error('Failed to add brand');
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
      setErrors({});
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} size='tiny' closeIcon>
      <Modal.Header>Add a New Brand</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Brand Logo</label>
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
              error={errors.categoryId ? { content: errors.categoryId, pointing: 'below' } : null}
              value={formData.categoryId}
            />
            {errors.categoryId && <Message error content={errors.categoryId} />}
          </Form.Field>
          <Form.Input
            label='Brand Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            error={errors.name ? { content: errors.name, pointing: 'below' } : null}
            
          />
          {errors.name && <Message error content={errors.name} />}
          <Form.Input
            label='Description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            error={errors.description ? { content: errors.description, pointing: 'below' } : null}
          />
          {errors.description && <Message error content={errors.description} />}
          <Button type='button' primary loading={loading} onClick={handleSubmit}>Add Brand</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddBrandsModal;
