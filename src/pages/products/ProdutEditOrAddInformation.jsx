import React, { useState, useEffect } from 'react';
import { Button, Form, Segment, Message, Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { apiGET, apiPOST, apiPUT } from '../../utils/apiHelper';
import FileUpdateInput from '../../components/FileUpload/FileUpdateInput';
import MultipleFileUpdateInput from '../../components/FileUpload/MultipleFileUpdateInput';
import { toast } from 'react-toastify';

const ProdutEditOrAddInformation = () => {
  const { id } = useParams();
  const [productForm, setProductForm] = useState({
    name: '',
    avgRating: '',
    isPrescription: false,
    price: '',
    bannerImg: '',
    marketer: '',
    saltComposition: '',
    origin: '',
    categoryId: '',
    brandId: '',
    discountedPrice: '',
    stripCapsuleQty: '',
    productQuantity: ''
  });
  const [moreInfoForm, setMoreInfoForm] = useState({
    introduction: '',
    uses: '',
    therapeuticEffects: '',
    interaction: '',
    moreInformationabout: '',
    howtoconsume: '',
    sideEffects: '',
    wordofAdvice: '',
    safetyAdvices: {
      pregnancy: '',
      breastFeeding: '',
      lungs: '',
      liver: '',
      alcohol: '',
      driving: '',
    },
  });
  console.log("rrr", productForm)
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [updatedFileUrl, setUpdatedFileUrl] = useState("");
  const [updatedMultipleFileUrl, setUpdateMultipleUrl] = useState([]);
  const [errors, setErrors] = useState({});


  const fetchProductData = async () => {
    try {
      setLoading(true);
      const productResponse = await apiGET(`/v1/product/get-product/${id}`);
      const moreInfoResponse = await apiGET(`/v1/product/get-product-information-by-product/${id}`);
      setProductForm(productResponse?.data?.data?.data?.product);
      setMoreInfoForm(moreInfoResponse.data.data[0]);
    } catch (error) {
      console.error('Error fetching product data:', error);
      setError('Failed to fetch product data');
    } finally {
      setLoading(false);
    }
  };



  const handleProductChange = (e, { name, value, checked }) => {
    setProductForm((prevProductForm) => ({
      ...prevProductForm,
      [name]: name === 'isPrescription' ? checked : value,
    }));
  };

  const handleMoreInfoChange = (e, { name, value }) => {
    setMoreInfoForm((prevMoreInfoForm) => ({
      ...prevMoreInfoForm,
      [name]: value,
    }));
  };

  const handleSafetyChange = (e, { name, value }) => {
    setMoreInfoForm((prevMoreInfoForm) => ({
      ...prevMoreInfoForm,
      safetyAdvices: {
        ...prevMoreInfoForm.safetyAdvices,
        [name]: value,
      },
    }));
  };

  const handleAddMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };


  const validateForm = () => {
    const newErrors = {};
    if (!productForm.name) {
      newErrors.name = 'Name is required';
    }
    if (productForm.productQuantity <= 0) {
      newErrors.productQuantity = 'Product Quantity must be greater than 0';
    }
    if (productForm.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (productForm.avgRating < 1 || productForm.avgRating > 5) {
      newErrors.avgRating = 'Average Rating must be between 1 and 5';
    }
    if (productForm.discountedPrice <= 0) {
      newErrors.discountedPrice = 'Discounted Price must be greater than 0';
    }
    if (productForm.discountedPrice >= productForm.price) {
      newErrors.discountedPrice = 'Discounted price should be less than the original price';
    }
    if (productForm.stripCapsuleQty <= 0) {
      newErrors.stripCapsuleQty = 'Strip Capsule Quantity must be greater than 0';
    }
    if (!productForm.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    if (!productForm.brandId) {
      newErrors.brandId = 'Brand is required';
    }
    if (!updatedFileUrl && productForm.bannerImg) {
      newErrors.updatedFileUrl = 'Banner Image is required';
    }

    if (updatedMultipleFileUrl.length === 0) {
      newErrors.updatedMultipleFileUrl = 'Additional Images are required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const updateProductPayload = {
        name: productForm?.name,
        avgRating: productForm?.avgRating,
        isPrescription: productForm?.isPrescription,
        price: productForm?.price,
        bannerImg: updatedFileUrl ? updatedFileUrl : productForm?.bannerImg,
        images: updatedMultipleFileUrl ? updatedMultipleFileUrl : productForm?.images,
        marketer: productForm?.marketer,
        saltComposition: productForm?.saltComposition,
        origin: productForm?.origin,
        categoryId: productForm?.categoryId,
        brandId: productForm?.brandId,
        discountedPrice: productForm?.discountedPrice,
        stripCapsuleQty: productForm?.stripCapsuleQty,
        productQuantity: productForm?.productQuantity
      }
      await apiPUT(`/v1/product/update-product/${id}`, updateProductPayload);
      setSuccess('Product updated successfully');
      toast.success("Product updated successfully");
    } catch (error) {
      console.error('Error saving product data:', error);
      toast.error("Something went wrong")
      setError('Failed to save product data');
    } finally {
      setLoading(false);
    }
  };

  const countWords = (text) => {
    return text ? text.trim().split(/\s+/).length : 0;
  };

  const MoreinfovalidateForm = () => {
    const newErrors = {};

    const validateField = (field, fieldName) => {
      if (!field) {
        newErrors[fieldName] = `${fieldName.replace(/([A-Z])/g, ' $1')} is required`;
      } else if (countWords(field) > 150) {
        newErrors[fieldName] = `${fieldName.replace(/([A-Z])/g, ' $1')} cannot exceed 150 words`;
      }
    };

    validateField(moreInfoForm.introduction, 'introduction');
    validateField(moreInfoForm.uses, 'uses');
    validateField(moreInfoForm.therapeuticEffects, 'therapeuticEffects');
    validateField(moreInfoForm.interaction, 'interaction');
    validateField(moreInfoForm.moreInformationabout, 'moreInformationabout');
    validateField(moreInfoForm.howtoconsume, 'howtoconsume');
    validateField(moreInfoForm.sideEffects, 'sideEffects');
    validateField(moreInfoForm.wordofAdvice, 'wordofAdvice');
    // Uncomment and add additional validations as necessary
    validateField(moreInfoForm.safetyAdvices.pregnancy, 'pregnancy');
    validateField(moreInfoForm.safetyAdvices.breastFeeding, 'breastFeeding');
    validateField(moreInfoForm.safetyAdvices.lungs,'lungs');
    validateField(moreInfoForm.safetyAdvices.pregnancy, 'pregnancy');
    validateField(moreInfoForm.safetyAdvices.liver, 'liver');
    validateField(moreInfoForm.safetyAdvices.alcohol,'alcohol');
    validateField(moreInfoForm.safetyAdvices.driving,'driving');


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveMoreInfo = async () => {
    const error = MoreinfovalidateForm();
    console.log(error)
    if (!error) {
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (moreInfoForm?._id) {
        const id = moreInfoForm?._id
        const updatePayload = {
          introduction: moreInfoForm?.introduction,
          uses: moreInfoForm?.uses,
          therapeuticEffects: moreInfoForm?.therapeuticEffects,
          interaction: moreInfoForm?.interaction,
          moreInformationabout: moreInfoForm?.moreInformationabout,
          howtoconsume: moreInfoForm?.howtoconsume,
          sideEffects: moreInfoForm?.sideEffects,
          wordofAdvice: moreInfoForm?.wordofAdvice,
          safetyAdvices: {
            pregnancy: moreInfoForm?.safetyAdvices?.pregnancy,
            breastFeeding: moreInfoForm?.safetyAdvices?.breastFeeding,
            lungs: moreInfoForm?.safetyAdvices?.lungs,
            liver: moreInfoForm?.safetyAdvices?.liver,
            alcohol: moreInfoForm?.safetyAdvices?.alcohol,
            driving: moreInfoForm?.safetyAdvices?.driving,
          },
        }

        const updateResponse = await apiPUT(`/v1/product/update-product-information/${id}`, updatePayload);
        console.log("L", updateResponse)
        if (updateResponse?.data?.status) {
          toast.success("Product information updated successfully")
        } else {
          toast.error("Failed to update product information")
        }
      } else {
        const addPayload = {
          brandId: productForm?.brandId,
          categoryId: productForm?.categoryId,
          productId: id,
          introduction: moreInfoForm?.introduction,
          uses: moreInfoForm?.uses,
          therapeuticEffects: moreInfoForm?.therapeuticEffects,
          interaction: moreInfoForm?.interaction,
          moreInformationabout: moreInfoForm?.moreInformationabout,
          howtoconsume: moreInfoForm?.howtoconsume,
          sideEffects: moreInfoForm?.sideEffects,
          wordofAdvice: moreInfoForm?.wordofAdvice,
          safetyAdvices: {
            pregnancy: moreInfoForm?.safetyAdvices?.pregnancy,
            breastFeeding: moreInfoForm?.safetyAdvices?.breastFeeding,
            lungs: moreInfoForm?.safetyAdvices?.lungs,
            liver: moreInfoForm?.safetyAdvices?.liver,
            alcohol: moreInfoForm?.safetyAdvices?.alcohol,
            driving: moreInfoForm?.safetyAdvices?.driving,
          },

        }
        const addResponse = await apiPOST(`/v1/product/add-product-information`, addPayload);
        if (addResponse?.data?.status) {
          toast.success("Added product information")
        } else {
          toast.error("Failed to add product information")
        }
      }
      setSuccess('More info saved successfully');
    } catch (error) {
      console.error('Error saving more info:', error);
      setError('Failed to save more info');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const payload = {
        page: 1,
        limit: 10,
        searchQuery: ""
      }
      const response = await apiPOST('/v1/category/all');
      console.log(response?.data?.data);
      if (response?.data?.data?.categories?.length) {
        setCategories(
          response?.data?.data?.categories?.map((category) => ({
            key: category?.id,
            value: category?.id,
            text: category?.name,
          }))
        );
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  console.log(categories)
  const fetchBrands = async (category) => {

    try {
      const response = await apiGET(`/v1/brand/get-by-category/${category}`);
      if (response?.data?.data?.length) {
        console.log(response, "dsfds")
        setBrands(
          response?.data?.data?.map((brand) => ({
            key: brand?.id,
            value: brand?.id,
            text: brand?.name,
          }))
        );
      }

      else {
        setBrands([]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
    console.log(brands, 'fgf')

  };

  const handleCategoryChange = (e, { value }) => {
    setProductForm((prevProductForm) => ({
      ...prevProductForm,
      categoryId: value,
    }));
    fetchBrands(value);
  };

  const handleBrandChange = (e, { value }) => {
    setProductForm((prevProductForm) => ({
      ...prevProductForm,
      brandId: value,
    }));
  };

  useEffect(() => {
    fetchProductData()
  }, [id])

  useEffect(() => {
    fetchCategories();
    fetchBrands(productForm?.categoryId)
    // fetchBrands(productForm?.id)

  }, [productForm?.categoryId]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-4'>
      <Form loading={loading} error={!!error} success={!!success}>
        <Form.Input
          label='Name'
          name='name'
          value={productForm?.name}
          onChange={handleProductChange}
          error={errors.name ? { content: errors.name, pointing: 'below' } : null}
        />
        {errors.name && <Message error content={errors.name} />}

        <Form.Input
          label='Product Quantity'
          name='productQuantity'
          type='number'
          value={productForm.productQuantity}
          onChange={handleProductChange}
          error={errors.productQuantity ? { content: errors.productQuantity, pointing: 'below' } : null}
        />
        {errors.productQuantity && <Message error content={errors.productQuantity} />}

        <Form.Input
          label='Ratings'
          name='avgRating'
          type='number'
          value={productForm?.avgRating}
          onChange={handleProductChange}
          error={errors.avgRating ? { content: errors.avgRating, pointing: 'below' } : null}
        />
        {errors.avgRating && <Message error content={errors.avgRating} />}

        <Form.Checkbox
          label='Prescription'
          name='isPrescription'
          checked={productForm?.isPrescription}
          onChange={handleProductChange}
        />
        <Form.Input
          label='Price'
          name='price'
          type='number'
          value={productForm?.price}
          onChange={handleProductChange}
          error={errors.price ? { content: errors.price, pointing: 'below' } : null}
        />
        {errors.price && <Message error content={errors.price} />}

        <div className='my-4'>
          <lable>Banner Img</lable>
          <FileUpdateInput myFileUrl={productForm?.bannerImg} setUpdatedFileUrl={setUpdatedFileUrl} />
          {errors.updatedFileUrl && <div className='text-red-500 mt-1'>{errors.updatedFileUrl}</div>}
        </div>
        <div className='my-4'>
          <lable>Images</lable>
          <MultipleFileUpdateInput myFileUrls={productForm?.images} setUpdateMultipleUrl={setUpdateMultipleUrl} />
        </div>
        {errors.updatedMultipleFileUrl && <div className='text-red-500 mt-1'>{errors.updatedMultipleFileUrl}</div>}

        <Form.Input
          label='Marketer'
          name='marketer'
          value={productForm?.marketer}
          onChange={handleProductChange}

        />
        <Form.Input
          label='Salt Composition'
          name='saltComposition'
          value={productForm?.saltComposition}
          onChange={handleProductChange}
        />
        <Form.Input
          label='Origin'
          name='origin'
          value={productForm?.origin}
          onChange={handleProductChange}
        />
        <Form.Field>
          <label>Category</label>
          <Dropdown
            placeholder='Select Category'
            fluid
            selection
            options={categories}
            value={productForm?.categoryId}
            onChange={handleCategoryChange}
          />
          {errors.categoryId && <div className='text-red-500'>{errors.categoryId}</div>}
        </Form.Field>

        <Form.Field>
          <label>Brand</label>
          <Dropdown
            placeholder='Select Brand'
            fluid
            selection
            options={brands}
            value={productForm?.brandId}
            onChange={handleBrandChange}
          />
          {errors.brandId && <div className='text-red-500' >{errors.brandId}</div>}
        </Form.Field>
        <Form.Input
          label='Discounted Price'
          name='discountedPrice'
          type='number'
          value={productForm?.discountedPrice}
          onChange={handleProductChange}
          error={errors.discountedPrice ? { content: errors.discountedPrice, pointing: 'below' } : null}
        />
        <Form.Input
          label='Strip Capsule Quantity'
          name='stripCapsuleQty'
          type='number'
          value={productForm?.stripCapsuleQty}
          onChange={handleProductChange}
          error={errors.stripCapsuleQty ? { content: errors.stripCapsuleQty, pointing: 'below' } : null}
        />
        {errors.stripCapsuleQty && <Message error content={errors.stripCapsuleQty} />}
        <Button primary onClick={handleSaveProduct}>Save Product</Button>
        <Button onClick={handleAddMoreInfo}>{showMoreInfo ? 'Hide More Info' : 'Add Or Update More Info'}</Button>

        {showMoreInfo && (
          <Segment>
            <Form.Input
              label='Introduction'
              name='introduction'
              value={moreInfoForm?.introduction}
              onChange={handleMoreInfoChange}
              error={errors.introduction ? { content: errors.introduction } : null}
            />
            <Form.Input
              label='Uses'
              name='uses'
              value={moreInfoForm?.uses}
              onChange={handleMoreInfoChange}
              error={errors.uses ? { content: errors.uses } : null}

            />
            <Form.Input
              label='Therapeutic Effects'
              name='therapeuticEffects'
              value={moreInfoForm?.therapeuticEffects}
              onChange={handleMoreInfoChange}
              error={errors.therapeuticEffects ? { content: errors.therapeuticEffects } : null}

            />
            <Form.Input
              label='Interaction'
              name='interaction'
              value={moreInfoForm?.interaction}
              onChange={handleMoreInfoChange}
              error={errors.interaction ? { content: errors.interaction } : null}

            />
            <Form.Input
              label='More Information about'
              name='moreInformationabout'
              value={moreInfoForm?.moreInformationabout}
              onChange={handleMoreInfoChange}
              error={errors.moreInformationabout ? { content: errors.moreInformationabout } : null}

            />
            <Form.Input
              label='How to consume'
              name='howtoconsume'
              value={moreInfoForm?.howtoconsume}
              onChange={handleMoreInfoChange}
              error={errors.howtoconsume ? { content: errors.howtoconsume } : null}

            />
            <Form.TextArea
              label='Side Effects'
              name='sideEffects'
              value={moreInfoForm?.sideEffects}
              onChange={handleMoreInfoChange}
              error={errors.sideEffects ? { content: errors.sideEffects } : null}

            />
            <Form.TextArea
              label='Word of Advice'
              name='wordofAdvice'
              value={moreInfoForm?.wordofAdvice}
              onChange={handleMoreInfoChange}
              error={errors.wordofAdvice ? { content: errors.wordofAdvice } : null}

            />
            <Form.Group widths='equal' className='flex flex-wrap'>
              <label className='font-bold my-4'>Safety Advices</label>
              <Form.Input
                label='Pregnancy'
                name='pregnancy'
                value={moreInfoForm?.safetyAdvices?.pregnancy}
                onChange={handleSafetyChange}
                error={errors.pregnancy ? { content: errors.pregnancy } : null}
              />
              <Form.Input
                label='Breast Feeding'
                name='breastFeeding'
                value={moreInfoForm?.safetyAdvices?.breastFeeding}
                onChange={handleSafetyChange}
                error={errors.breastFeeding ? { content: errors.breastFeeding } : null}
              />
              <Form.Input
                label='Lungs'
                name='lungs'
                value={moreInfoForm?.safetyAdvices?.lungs}
                onChange={handleSafetyChange}
                error={errors.lungs ? { content: errors.lungs } : null}
              />
              <Form.Input
                label='Liver'
                name='liver'
                value={moreInfoForm?.safetyAdvices?.liver}
                onChange={handleSafetyChange}
                error={errors.liver ? { content: errors.liver } : null}
              />
              <Form.Input
                label='Alcohol'
                name='alcohol'
                value={moreInfoForm?.safetyAdvices?.alcohol}
                onChange={handleSafetyChange}
                error={errors.alcohol ? { content: errors.alcohol } : null}
              />
              <Form.Input
                label='Driving'
                name='driving'
                value={moreInfoForm?.safetyAdvices?.driving}
                onChange={handleSafetyChange}
                error={errors.driving ? { content: errors.driving } : null}
              />
            </Form.Group>
            <Button primary onClick={handleSaveMoreInfo}>Save More Info</Button>
          </Segment>
        )}
        {/* 
        <Message error content={error} />
        <Message success content={success} /> */}
      </Form>
    </div>
  );
};

export default ProdutEditOrAddInformation;
