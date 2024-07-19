import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Dropdown, Message } from 'semantic-ui-react';
import { apiPOST } from '../../utils/apiHelper';
import { toast } from 'react-toastify';

const AddOrderItem = ({ open, onClose, orderId }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const fetchProducts = async () => {
    try {
      const payload = {
        orderId
      }
      const response = await apiPOST('/v1/product/getAllProductsOfNoOrderItem', payload);
      if (response?.data?.status) {
        setProducts(response?.data?.data?.product.map(item => ({
          key: item._id,
          text: item.productDetails.name,
          value: item.productDetails._id,
        })));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear the error for the current field
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productId) {
      newErrors.productId = 'Please select product ';
    }
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
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
        orderId: orderId,
        productId: formData.productId,
        quantity: formData.quantity,
      };
      const response = await apiPOST('/v1/order-item/add', payload);
      if (response?.data?.status) {
        onClose();
        toast.success('Order item added successfully');
      } else {
        toast.error(response?.data?.data);
      }
    } catch (error) {
      console.error('Error adding order item:', error);
      toast.error('Failed to add order item');
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: '',
    });
    setErrors({});
    setLoading(false);
  };


  useEffect(() => {
    if (open) {
      fetchProducts();
    } else {
      resetForm();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} size='tiny' closeIcon>
      <Modal.Header>Add a New Item</Modal.Header>
      <Modal.Content>
        <div className='mb-4 font-semibold text-lg'>Order ID: ORD-{orderId}</div>
        <Form onSubmit={handleSubmit}>
          <Form.Field error={errors.productId ? { content: errors.productId, pointing: 'below' } : null}>
            <label>Product</label>
            <Dropdown
              placeholder='Select Product'
              fluid
              search
              selection
              options={products}
              onChange={(e, data) => handleChange(e, { name: 'productId', value: data.value })}
              value={formData.productId}

            />
            {errors.productId && <div className='text-red-500'>{errors.productId}</div>}
          </Form.Field>

          <Form.Field error={errors.quantity ? { content: errors.quantity, pointing: 'below' } : null}>
            <label>Quantity</label>
            <Form.Input
              name='quantity'
              type='number'
              value={formData.quantity}
              onChange={(e, data) => handleChange(e, { name: 'quantity', value: data.value })}
              error={errors.quantity ? { content: errors.quantity, pointing: 'below' } : null}
            />
            {errors.quantity && <Message error content={errors.quantity} />}
          </Form.Field>

          <Button type='button' primary loading={loading} onClick={handleSubmit}>
            Add
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddOrderItem;
