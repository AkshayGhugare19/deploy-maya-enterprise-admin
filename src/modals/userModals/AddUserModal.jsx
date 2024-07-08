import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Icon } from 'semantic-ui-react';
import axios from 'axios';
import { apiPOST } from '../../utils/apiHelper'; // Assuming this is your custom API helper

const initialFormData = {
  name: '',
  email: '',
  phoneNo: '',
  password: ''
};

const AddUserModal = ({ open, onClose, refreshUsers }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiPOST('/v1/auth/signup', formData); 
      if (response?.data?.status) {
        console.log('User added successfully:', response.data);
        onClose(); 
        refreshUsers(); 
      } else {
        console.error('Failed to add user:', response);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData); 
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} size='small' closeIcon>
      <Modal.Header>Add a New User</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            label='Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Form.Input
            label='Email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Form.Input
            label='PhoneNo'
            name='phoneNo'
            type='text'
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />
          <Form.Input
            label='Password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type='submit' primary loading={loading}>
            Add User
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddUserModal;
