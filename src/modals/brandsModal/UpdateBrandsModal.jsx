import { useState, useEffect } from "react";
import { Button, Modal, Form, Message, Dropdown } from "semantic-ui-react";
import { apiPUT, apiGET } from "../../utils/apiHelper";
import FileUpdateInput from "../../components/FileUpload/FileUpdateInput";
import { toast } from "react-toastify";

const UpdateBrandsModal = ({ updateModalOpen, updateModalClose, selectedBrands, refreshBrands }) => {
  console.log("wwwwww>>>><<<", selectedBrands?.brandImgUrl);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: [],
  });
  const [updatedFileUrl, setUpdatedFileUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiGET('/v1/category/all');
        if (response?.data?.status) {
          setCategories(response.data.data.map(item => ({
            key: item.id,
            text: item.name,
            value: item.id,
          })));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

    if (selectedBrands) {
      setFormData({
        name: selectedBrands.name || "",
        description: selectedBrands.description || "",
        categoryId: selectedBrands.categoryId.map(cat => cat.id) || [],
      });
    }
  }, [selectedBrands]);

  const handleInputChange = (e, { name, value }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear the error for the current field
  };

  const handleCategoryChange = (e, { value }) => {
    console.log("Selected Categories:", value);
    setFormData((prevData) => ({ ...prevData, categoryId: value }));
    setErrors((prevErrors) => ({ ...prevErrors, categoryId: '' })); // Clear the category error
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
    if (formData.categoryId.length === 0) {
      newErrors.categoryId = 'Category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        brandImgUrl: updatedFileUrl || selectedBrands?.brandImgUrl,
      };
      const response = await apiPUT(`/v1/Brand/update/${selectedBrands?.id}`, payload);
      if (response?.data?.status) {
        setSuccess("Brand updated successfully!");
        toast.success("Brand updated successfully!");
        updateModalClose();
        refreshBrands();
      } else {
        setError("Failed to update Brand.");
        toast.error("Failed to update Brand.");
      }
    } catch (error) {
      console.error('Error updating Brand:', error);
      setError('Error updating Brand.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={updateModalOpen} size='tiny' className="p-4">
      <Modal.Header>Update Brand</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to update the category <strong>{selectedBrands?.name}</strong>?</p>
        <Form loading={loading} error={!!error} success={!!success}>
          {error && <Message error content={error} />}
          {success && <Message success content={success} />}
          <Form.Field>
            <FileUpdateInput myFileUrl={selectedBrands?.brandImgUrl} setUpdatedFileUrl={setUpdatedFileUrl} />
          </Form.Field>
          <Form.Field>
            <label>Categories</label>
            <Dropdown
              placeholder='Select Categories'
              fluid
              multiple
              search
              selection
              options={categories}
              onChange={handleCategoryChange}
              value={formData.categoryId}
              error={errors.categoryId ? { content: errors.categoryId, pointing: 'below' } : null}
            />
          </Form.Field>
          <Form.Input
            label='Name'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name ? { content: errors.name, pointing: 'below' } : null}
          />
          <Form.Input
            label='Description'
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description ? { content: errors.description, pointing: 'below' } : null}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={updateModalClose}>Cancel</Button>
        <Button positive loading={loading} onClick={handleUpdate}>Update</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UpdateBrandsModal;
