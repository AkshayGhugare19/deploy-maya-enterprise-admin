import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Divider, Dropdown, Message } from 'semantic-ui-react';
import FileUploadInput from '../../components/FileUpload/FileUploadInput';
import MultiFileUploadInput from '../../components/FileUpload/MultiFileUpload';
import { apiPOST, apiGET } from '../../utils/apiHelper';
import { toast } from 'react-toastify';

const initialFormData = {
  name: '',
  avgRating: null,
  isPrescription: false,
  price: null,
  bannerImg: '',
  marketer: '',
  saltComposition: '',
  origin: '',
  categoryId: '',
  images: [],
  discountedPrice: null,
  brandId: '',
  stripCapsuleQty: null,
  productQuantity: null
};

const AddProductModal = ({ open, onClose, refreshProducts }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [uploadMultipleUrl, setUploadMultipleUrl] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});
  console.log("eRR", errors)


  const fetchCategories = async () => {
    try {
      const payload = {
        page: 1,
        limit: 10,
        searchQuery: ""
      }

      const response = await apiPOST('/v1/category/all', payload);
      console.log(response?.data?.data);
      if (response?.data?.data?.categories?.length) {
        setCategories(response.data?.data?.categories?.map(category => ({
          key: category.id,
          value: category.id,
          text: category.name
        })));
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async (categoryId) => {
    try {
      const response = await apiGET(`/v1/brand/get-by-category/${categoryId}`);
      if (response?.data?.data?.length) {
        setBrands(response.data.data.map(brand => ({
          key: brand.id,
          value: brand.id,
          text: brand.name
        })));
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear the error for the current field
  };

  const handleCategoryChange = (e, { value }) => {
    setFormData({ ...formData, categoryId: value });
    setErrors({ ...errors, categoryId: '' }); // Clear category error
    fetchBrands(value);
  };

  const handleBrandChange = (e, { value }) => {
    setFormData({ ...formData, brandId: value });
    setErrors({ ...errors, brandId: '' }); // Clear brand error
  };

  const validateForm = () => {
    console.log("qqq", formData.discountedPrice, formData.price)
    console.log("TT", formData.discountedPrice >= formData.price)
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (formData.productQuantity <= 0) {
      newErrors.productQuantity = 'Product Quantity must be greater than 0';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.avgRating < 1 || formData.avgRating > 5) {
      newErrors.avgRating = 'Average Rating must be between 1 and 5';
    }
    if (formData.discountedPrice <= 0) {
      newErrors.discountedPrice = 'Discounted Price must be greater than 0';
    }
    if (parseFloat(formData.discountedPrice) >= parseFloat(formData.price)) {
      newErrors.discountedPrice = 'Discounted price should be less than the original price';
    }
    if (formData.stripCapsuleQty <= 0) {
      newErrors.stripCapsuleQty = 'Strip Capsule Quantity must be greater than 0';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    if (!formData.brandId) {
      newErrors.brandId = 'Brand is required';
    }
    if (!uploadedFileUrl) {
      newErrors.uploadedFileUrl = 'Banner Image is required';
    }
    if (uploadMultipleUrl.length === 0) {
      newErrors.uploadMultipleUrl = 'Additional Images are required';
    }
    if (uploadMultipleUrl.length > 4) {
      newErrors.uploadMultipleUrl = 'You can upload a maximum of four additional images.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formDataWithImages = {
        ...formData,
        bannerImg: uploadedFileUrl,
        images: uploadMultipleUrl
      };
      const response = await apiPOST('/v1/product/add', formDataWithImages);
      if (response?.data?.code === 201) {
        toast.success('Product added successfully');
        onClose();
        refreshProducts(); // Call this function to refresh the product list
      } else {
        toast.error(response?.data?.data?.msg || response?.data?.message || response?.data?.data);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setUploadedFileUrl('');
    setUploadMultipleUrl([]);
    setErrors({});
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} size='small' closeIcon>
      <Modal.Header>Add a New Product</Modal.Header>
      <Modal.Content className='h-[80vh] overflow-auto'>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            label='Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            error={errors.name ? { content: errors.name, pointing: 'below' } : null}
          />
          {errors.name && <Message error content={errors.name} />}

          <Form.Input
            label='Product Quantity'
            name='productQuantity'
            type='number'
            value={formData.productQuantity}
            onChange={handleChange}
            error={errors.productQuantity ? { content: errors.productQuantity, pointing: 'below' } : null}
          />
          {errors.productQuantity && <Message error content={errors.productQuantity} />}

          <Form.Input
            label='Price'
            name='price'
            type='number'
            value={formData.price}
            onChange={handleChange}
            error={errors.price ? { content: errors.price, pointing: 'below' } : null}
          />
          {errors.price && <Message error content={errors.price} />}

          <Form.Input
            label='Ratings'
            name='avgRating'
            type='number'
            value={formData.avgRating}
            onChange={handleChange}
            error={errors.avgRating ? { content: errors.avgRating, pointing: 'below' } : null}
          />
          {errors.avgRating && <Message error content={errors.avgRating} />}

          <Divider horizontal>Banner Image</Divider>
          <div className='w-full mb-4'>
            <FileUploadInput setUploadedFileUrl={setUploadedFileUrl} />
            {errors.uploadedFileUrl && <div className='text-red-500 mt-1'>{errors.uploadedFileUrl}</div>}
          </div>

          <Divider horizontal>Additional Images</Divider>
          <MultiFileUploadInput
            setUploadMultipleUrl={setUploadMultipleUrl}
            error={errors.uploadMultipleUrl ? { content: errors.uploadMultipleUrl, pointing: 'below' } : null}
          />
          {errors.uploadMultipleUrl && <div className='text-red-500 mt-1'>{errors.uploadMultipleUrl}</div>}

          <Form.Input
            label='Marketer'
            name='marketer'
            value={formData.marketer}
            onChange={handleChange}
          />

          <Form.Input
            label='Salt Composition'
            name='saltComposition'
            value={formData.saltComposition}
            onChange={handleChange}
          />

          <Form.Input
            label='Origin'
            name='origin'
            value={formData.origin}
            onChange={handleChange}
          />

          <Form.Field error={errors.categoryId ? { content: errors.categoryId, pointing: 'below' } : null}>
            <label>Category</label>
            <Dropdown
              placeholder='Select Category'
              fluid
              selection
              options={categories}
              value={formData.categoryId}
              onChange={handleCategoryChange}
            />
            {errors.categoryId && <div className='text-red-500'>{errors.categoryId}</div>}
          </Form.Field>

          <Form.Field error={errors.brandId ? { content: errors.brandId, pointing: 'below' } : null}>
            <label>Brand</label>
            <Dropdown
              placeholder='Select Brand'
              fluid
              selection
              options={brands}
              value={formData.brandId}
              onChange={handleBrandChange}

            />
            {errors.brandId && <div className='text-red-500' >{errors.brandId}</div>}
          </Form.Field>

          <Form.Input
            label='Discounted Price'
            name='discountedPrice'
            type='number'
            value={formData.discountedPrice}
            onChange={handleChange}
            error={errors.discountedPrice ? { content: errors.discountedPrice, pointing: 'below' } : null}
          />

          <Form.Input
            label='Strip Capsule Qty'
            name='stripCapsuleQty'
            type='number'
            value={formData.stripCapsuleQty}
            onChange={handleChange}
            error={errors.stripCapsuleQty ? { content: errors.stripCapsuleQty, pointing: 'below' } : null}
          />
          {errors.stripCapsuleQty && <Message error content={errors.stripCapsuleQty} />}

          <Form.Checkbox
            label='Prescription Required'
            name='isPrescription'
            checked={formData.isPrescription}
            onChange={(e, { checked }) => setFormData({ ...formData, isPrescription: checked })}
          />

          <Button onClick={onClose}>Cancel</Button>
          <Button type='submit' primary loading={loading}>
            Add Product
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddProductModal;
