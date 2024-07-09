import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Dropdown } from 'semantic-ui-react';
import { apiPOST } from '../../utils/apiHelper';
import { toast } from 'react-toastify';

const AddOrderItem = ({ open, onClose, orderId }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {

      const response = await apiPOST('/v1/product/getAllProductsOfNoOrderItem');
      console.log("ppp",response)
      if (response?.data?.status) {
        setProducts(response?.data?.data?.product.map(item => ({
          key: item._id,
          text: item.productDetails.name,
          value: item._id,
        })));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
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
        toast.success("Order item added successfully")
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.error('Error adding order item:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProducts();
    } else {
      setFormData({
        productId: '',
        quantity: '',
      });
      setLoading(false);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} size='tiny' closeIcon>
      <Modal.Header>Add a New Item</Modal.Header>
      <Modal.Content>
        <div className='mb-4 font-semibold text-lg'>Order ID: ORD-{orderId}</div>
        <Form>
          <Form.Field>
            <label>Product</label>
            <Dropdown
              placeholder='Select Product'
              fluid
              search
              selection
              options={products}
              onChange={(e, data) => handleChange(e, { name: 'productId', value: data?.value })}
              value={formData.productId}
              required
            />
          </Form.Field>
          <Form.Input
            label='Quantity'
            name='quantity'
            value={formData.quantity}
            onChange={(e, data) => handleChange(e, { name: 'quantity', value: data?.value })}
            required
          />
          <Button
            type='button'
            primary
            loading={loading}
            onClick={handleSubmit}
          >
            Add
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddOrderItem;
