import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Dropdown } from 'semantic-ui-react';
import { apiPOST, apiGET } from '../../utils/apiHelper';
import { toast } from 'react-toastify';

const AddSubscriberModal = ({ open, onClose, refreshSubscriber }) => {
  const [formData, setFormData] = useState({
    email: '',
    name:'',
    userId: '',
  });
  console.log(formData)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fetchUsers = async () => {
    try {
      const response = await apiGET('/v1/users/all-users');
      if (response?.data?.data?.status) {
        setUsers(response?.data?.data?.data?.map(item => ({
          key: item.id,
          text: `${item.name}`,
          value: item.id,
          email: item.email,
        })));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserChange = (e, { value }) => {
    const selectedUser = users.find(user => user.value === value);
    console.log("ee",selectedUser)
    setFormData({
      ...formData,
      userId: selectedUser?.value,
      email: selectedUser?.email,
      name: selectedUser?.text,
    });
    setErrors({ ...errors, userId: '' });
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId) {
      newErrors.userId = 'Please select a user';
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
          email: formData.email,
          userId: formData.userId,
          isEmailSubscribed: true,
      };
      const response = await apiPOST('/v1/email-subscribe/add', payload);
      if (response?.data?.status) {
        onClose();
        toast.success("Subscriber added successfully");
        refreshSubscriber(); // Call this function to refresh the subscriber list
      } else {
        toast.error("Failed to add subscriber");
      }
    } catch (error) {
      console.error('Error adding subscriber:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    } else {
      setFormData({
        email: '',
        userId: '',
      });
      setErrors({});
      setLoading(false);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} size='tiny' closeIcon>
      <Modal.Header>Add a New Subscriber</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field error={errors.userId ? { content: errors.userId, pointing: 'below' } : null}>
            <label>User</label>
            <Dropdown
              placeholder='Select User'
              fluid
              search
              selection
              options={users}
              onChange={handleUserChange}
              value={formData.userId}
            />
            {errors.userId && <div className='text-red-500'>{errors.userId}</div>}
          </Form.Field>
          
          <Button type='button' primary loading={loading} onClick={handleSubmit}>Add Subscriber</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddSubscriberModal;
