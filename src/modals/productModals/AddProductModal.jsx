import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Divider, Dropdown } from 'semantic-ui-react';
import FileUploadInput from '../../components/FileUpload/FileUploadInput';
import { apiPOST, apiGET } from '../../utils/apiHelper';
import MultiFileUploadInput from '../../components/FileUpload/MultiFileUpload';
import { toast } from 'react-toastify';
const initialFormData = {
  name: '',
  ratings: 0,
  isPrescription: false,
  price: 0,
  bannerImg: '',
  marketer: '',
  saltComposition: '',
  origin: '',
  categoryId: '',
  images: [],
  discountedPrice: 0,
  brandId: '',
  stripCapsuleQty: 0
};
const AddProductModal = ({ open, onClose, refreshProducts }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadMultipleUrl, setUploadMultipleUrl] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await apiGET('/v1/category/all');
      if(response?.data?.data?.length){
        setCategories(response?.data?.data?.map(category => ({
          key: category.id,
          value: category.id,
          text: category.name
        })));
      }else{
        setCategories([]);
      }
      
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async (category) => {
    try {
      const response = await apiGET(`/v1/brand/get-by-category/${category}`);
      if(response?.data?.data?.length){
        setBrands(response.data.data?.map(brand => ({
          key: brand.id,
          value: brand.id,
          text: brand.name
        })));
      }else{
        setBrands([]);
      }
     
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e, { value }) => {
    setFormData({ ...formData, categoryId: value });
    fetchBrands(value);
    console.log('Selected Category Key:', value);
  };

  const handleBrandChange = (e, { value }) => {
    setFormData({ ...formData, brandId: value });
    // fetchBrands(value);
    console.log('Selected Brand Key:', value);
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formDataWithImages = {
        ...formData,
        bannerImg: uploadedFileUrl,
        images :uploadMultipleUrl
      };

      const response = await apiPOST('/v1/product/add', formDataWithImages);
      console.log("rrr",response)
      if (response?.data?.code===201) {
        setLoading(false);
        toast.success("Product added successfully")
        onClose();
        setUploadMultipleUrl([])
        refreshProducts();
         // Call this function to refresh the product list
      }else{
        toast.error(response?.data?.data?.msg)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Something went wrong")
      setUploadMultipleUrl([])
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [open]);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData); // Reset formData when modal closes
      setUploadMultipleUrl([])
    }
  }, [open]);


  return (
    <Modal open={open} onClose={onClose} size='small' closeIcon>
      <Modal.Header>
        Add a New Product
      </Modal.Header>
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
            label='Price'
            name='price'
            type='number'
            value={formData.price}
            onChange={handleChange}
            required
          />
          <Form.Input
            label='Ratings'
            name='ratings'
            type='number'
            value={formData.ratings}
            onChange={handleChange}
            required
          />
          
          <Divider horizontal>Banner Image</Divider>
          <div className='w-full mb-4'>
            <FileUploadInput setUploadedFileUrl={setUploadedFileUrl} />
          </div>

          <Divider horizontal>Additional Images</Divider>
          
          <MultiFileUploadInput setUploadMultipleUrl ={setUploadMultipleUrl} />


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

          <Form.Field>
            <label>Category</label>
            <Dropdown
              placeholder='Select Category'
              fluid
              selection
              options={categories}
              value={formData.category}
              onChange={handleCategoryChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Brand</label>
            <Dropdown
              placeholder='Select Brand'
              fluid
              selection
              options={brands}
              value={formData.brand}
              onChange={handleBrandChange}
            />
          </Form.Field>

          <Form.Input
            label='Discounted Price'
            name='discountedPrice'
            type='number'
            value={formData.discountedPrice}
            onChange={handleChange}
            required
          />
          <Form.Input
            label='Strip Capsule Qty'
            name='stripCapsuleQty'
            type='number'
            value={formData.stripCapsuleQty}
            onChange={handleChange}
            required
          />

          <Form.Checkbox
            label='Prescription Required'
            name='isPrescription'
            checked={formData.isPrescription}
            onChange={(e, { checked }) => setFormData({ ...formData, isPrescription: checked })}
          />
          <Button type='submit' primary loading={loading}>Add Product</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddProductModal;
