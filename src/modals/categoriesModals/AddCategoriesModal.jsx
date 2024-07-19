import React, { useState } from 'react';
import { Modal, Form, Button, Message } from 'semantic-ui-react';
import { apiPOST } from '../../utils/apiHelper';
import { toast } from 'react-toastify';

const AddCategoriesModal = ({ open, onClose, refreshCategories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear the error for the current field
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiPOST('/v1/category/add', formData);
      if (response?.data?.status) {
        toast.success('Category added successfully');
        setFormData({ name: '', description: '' });
        onClose(); // Call this function to refresh the category list
        refreshCategories();
      } else {
        toast.error(response?.data?.data || "Something went wrong");
        onClose();
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setLoading(false);
      setFormData({ name: '', description: '' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} size='tiny' closeIcon>
      <Modal.Header>Add a New Category</Modal.Header>
      <Modal.Content>
        <Form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <Form.Input
            label='Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            error={errors.name ? { content: errors.name, pointing: 'below' } : null}
          />
          <Form.Input
            label='Description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            error={errors.description ? { content: errors.description, pointing: 'below' } : null}
          />
          <Button type='submit' primary loading={loading}>Add Category</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddCategoriesModal;
