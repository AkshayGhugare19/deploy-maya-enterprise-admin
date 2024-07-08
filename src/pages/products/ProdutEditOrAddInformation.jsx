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
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [updatedFileUrl,setUpdatedFileUrl]=useState("");
  const [updatedMultipleFileUrl,setUpdateMultipleUrl]=useState([]);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productResponse = await apiGET(`/v1/product/get-product/${id}`);
        const moreInfoResponse = await apiGET(`/v1/product/get-product-information-by-product/${id}`);
        setProductForm(productResponse.data.data.data.product);
        setMoreInfoForm(moreInfoResponse.data.data[0]);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Failed to fetch product data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

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

  const handleSaveProduct = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const updateProductPayload={
        name: productForm?.name,
        avgRating: productForm?.avgRating,
        isPrescription: productForm?.isPrescription,
        price: productForm?.price,
        bannerImg: updatedFileUrl ? updatedFileUrl: productForm?.bannerImg,
        images: updatedMultipleFileUrl ? updatedMultipleFileUrl: productForm?.images,
        marketer: productForm?.marketer,
        saltComposition: productForm?.saltComposition,
        origin: productForm?.origin,
        categoryId: productForm?.categoryId,
        brandId: productForm?.brandId,
        discountedPrice: productForm?.discountedPrice,
        stripCapsuleQty: productForm?.stripCapsuleQty,
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

  const handleSaveMoreInfo = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (moreInfoForm?._id) {
        const id = moreInfoForm?._id
        const updatePayload ={
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
        console.log("L",updateResponse)
        if(updateResponse?.data?.status){
          toast.success("Product information updated successfully")
        }else{
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
       if(addResponse?.data?.status){
        toast.success("Added product information")
       }else{
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
      const response = await apiGET('/v1/category/all');
      if (response?.data?.data?.length) {
        setCategories(
          response?.data?.data?.map((category) => ({
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

  const fetchBrands = async (category) => {
    try {
      const response = await apiGET(`/v1/brand/get-by-category/${category}`);
      if (response?.data?.data?.length) {
        setBrands(
          response?.data?.data?.map((brand) => ({
            key: brand?.id,
            value: brand?.id,
            text: brand?.name,
          }))
        );
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
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
    fetchCategories();
  }, []);

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
        />
        <Form.Input
          label='Ratings'
          name='avgRating'
          type='number'
          value={productForm?.avgRating}
          onChange={handleProductChange}
        />
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
        />
        <div className='my-4'>
        <lable>Banner Img</lable>
        <FileUpdateInput myFileUrl={productForm?.bannerImg} setUpdatedFileUrl = {setUpdatedFileUrl}/>
        </div>
        <div className='my-4'>
        <lable>Images</lable>
        <MultipleFileUpdateInput myFileUrls={productForm?.images} setUpdateMultipleUrl = {setUpdateMultipleUrl}/>
        </div>
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
        </Form.Field>

        <Form.Input
          label='Discounted Price'
          name='discountedPrice'
          type='number'
          value={productForm?.discountedPrice}
          onChange={handleProductChange}
        />
        <Form.Input
          label='Strip Capsule Quantity'
          name='stripCapsuleQty'
          type='number'
          value={productForm?.stripCapsuleQty}
          onChange={handleProductChange}
        />

        <Button primary onClick={handleSaveProduct}>Save Product</Button>
        <Button onClick={handleAddMoreInfo}>{showMoreInfo ? 'Hide More Info' : 'Add Or Update More Info'}</Button>

        {showMoreInfo && (
          <Segment>
            <Form.Input
              label='Introduction'
              name='introduction'
              value={moreInfoForm?.introduction}
              onChange={handleMoreInfoChange}
            />
            <Form.Input
              label='Uses'
              name='uses'
              value={moreInfoForm?.uses}
              onChange={handleMoreInfoChange}
            />
            <Form.Input
              label='Therapeutic Effects'
              name='therapeuticEffects'
              value={moreInfoForm?.therapeuticEffects}
              onChange={handleMoreInfoChange}
            />
            <Form.Input
              label='Interaction'
              name='interaction'
              value={moreInfoForm?.interaction}
              onChange={handleMoreInfoChange}
            />
            <Form.Input
              label='More Information about'
              name='moreInformationabout'
              value={moreInfoForm?.moreInformationabout}
              onChange={handleMoreInfoChange}
            />
            <Form.Input
              label='How to consume'
              name='howtoconsume'
              value={moreInfoForm?.howtoconsume}
              onChange={handleMoreInfoChange}
            />
            <Form.TextArea
              label='Side Effects'
              name='sideEffects'
              value={moreInfoForm?.sideEffects}
              onChange={handleMoreInfoChange}
            />
            <Form.TextArea
              label='Word of Advice'
              name='wordofAdvice'
              value={moreInfoForm?.wordofAdvice}
              onChange={handleMoreInfoChange}
            />
            <Form.Group widths='equal'className='flex flex-wrap'>
                <label className='font-bold my-4'>Safety Advices</label>
              <Form.Input
                label='Pregnancy'
                name='pregnancy'
                value={moreInfoForm?.safetyAdvices?.pregnancy}
                onChange={handleSafetyChange}
              />
              <Form.Input
                label='Breast Feeding'
                name='breastFeeding'
                value={moreInfoForm?.safetyAdvices?.breastFeeding}
                onChange={handleSafetyChange}
              />
              <Form.Input
                label='Lungs'
                name='lungs'
                value={moreInfoForm?.safetyAdvices?.lungs}
                onChange={handleSafetyChange}
              />
              <Form.Input
                label='Liver'
                name='liver'
                value={moreInfoForm?.safetyAdvices?.liver}
                onChange={handleSafetyChange}
              />
              <Form.Input
                label='Alcohol'
                name='alcohol'
                value={moreInfoForm?.safetyAdvices?.alcohol}
                onChange={handleSafetyChange}
              />
              <Form.Input
                label='Driving'
                name='driving'
                value={moreInfoForm?.safetyAdvices?.driving}
                onChange={handleSafetyChange}
              />
            </Form.Group>
            <Button primary onClick={handleSaveMoreInfo}>Save More Info</Button>
          </Segment>
        )}

        <Message error content={error} />
        <Message success content={success} />
      </Form>
    </div>
  );
};

export default ProdutEditOrAddInformation;
