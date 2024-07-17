import { useState, useEffect } from "react";
import { Button, Modal, Form, Message, Dropdown } from "semantic-ui-react";
import { apiPUT, apiGET } from "../../utils/apiHelper";
import FileUpdateInput from "../../components/FileUpload/FileUpdateInput";
import { toast } from "react-toastify";

const UpdateSubscriberModal = ({ updateModalOpen, updateModalClose, selectedSubscriber, refreshBrands }) => {
  console.log("wwwwww>>>><<<",selectedSubscriber?.brandImgUrl)
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: [],
  });
  const [updatedFileUrl,setUpdatedFileUrl]=useState('')
  const [categories, setCategories] = useState([]);
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

    if (selectedSubscriber) {
      setFormData({
        name: selectedSubscriber.name || "",
        description: selectedSubscriber.description || "",
        categoryId: selectedSubscriber.categoryId.map(cat => cat.id) || [],
      });
    }
  }, [selectedSubscriber]);

  const handleInputChange = (e, { name, value }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (e, { value }) => {
    console.log("Selected Categories:", value);
    setFormData((prevData) => ({ ...prevData, categoryId: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const paylod={
        name: formData?.name,
        description: formData?.description,
        categoryId: formData?.categoryId,
        brandImgUrl:updatedFileUrl || selectedSubscriber?.brandImgUrl,
      }
      const response = await apiPUT(`/v1/Brand/update/${selectedSubscriber?.id}`, paylod);
      if (response?.data?.status) {
        setSuccess("Brand updated successfully!");
        toast.success("Brand updated successfully!");
        updateModalClose();
        refreshBrands();
      } else {
        toast.error("Brand updated successfully!");
        setError("Failed to update Brand.");
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
        <p>Are you sure you want to update the category <strong>{selectedSubscriber?.name}</strong>?</p>
        <Form loading={loading} error={!!error} success={!!success}>
          {error && <Message error content={error} />}
          {success && <Message success content={success} />}
          <Form.Field>
            <FileUpdateInput myFileUrl={selectedSubscriber?.brandImgUrl} setUpdatedFileUrl={setUpdatedFileUrl} />
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
            />
          </Form.Field>
          <Form.Input
            label='Name'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
          />
          <Form.Input
            label='Description'
            name='description'
            value={formData.description}
            onChange={handleInputChange}
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

export default UpdateSubscriberModal;
