import React, { useState } from 'react';
import { Modal, Form, Button, Icon, Divider } from 'semantic-ui-react';
import axios from 'axios';
import FileUploadInput from '../../components/FileUpload/FileUploadInput';
import { apiPOST } from '../../utils/apiHelper';
import { toast } from 'react-toastify';

const AddCategoriesModal = ({ open, onClose, refreshCategories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [fileInfo,setFileInfo]=useState("")
  const [loading, setLoading] = useState(false);
console.log("eee",fileInfo)
  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
        console.log("FOORRRMM",{ ...formData, 
        })
        
     const response =  await apiPOST('/v1/category/add', formData);
     if(response?.data?.status){
        setLoading(false)
        onClose();
        toast.success("Added category")
        refreshCategories(); // Call this function to refresh the product list
     }else{
      toast.error("Failed to add category")
     }
    } catch (error) {
      console.error('Error adding product:', error);
      setLoading(false)
      refreshCategories()
    }
  };

  return (
    <Modal open={open} onClose={onClose} size='small' closeIcon>
      <Modal.Header>
        Add a New Categories
        {/* <Icon name='close' onClick={onClose} style={{ cursor: 'pointer', float: 'right' }} /> */}
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
            label='Marketer'
            name='description'
            value={formData.description}
            onChange={handleChange}
          />
         
          <Button type='submit' primary loading={loading}>Add Categories</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddCategoriesModal;
