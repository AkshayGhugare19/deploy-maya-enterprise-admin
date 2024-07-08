import { useState, useEffect } from "react";
import { Button, Modal, Form, Message } from "semantic-ui-react";
import { apiPUT } from "../../utils/apiHelper";
import { toast } from "react-toastify";

const UpdateCategoriesModal = ({ updateModalOpen, updateModalClose, selectedCategories }) => {
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (selectedCategories) {
      setCategoryData({
        name: selectedCategories.name || "",
        description: selectedCategories.description || "",
      });
    }
  }, [selectedCategories]);

  const handleInputChange = (e, { name, value }) => {
    setCategoryData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiPUT(`/v1/category/update/${selectedCategories?.id}`, categoryData);
      if (response?.data?.status) {
        setSuccess("Category updated successfully!");
        updateModalClose();
        toast.success("Category updated successfully!");
      } else {
        setError("Failed to update category.");
        toast.error("Failed to update category.");
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Error updating category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={updateModalOpen} size='tiny' className="p-4">
      <Modal.Header>Update Categories</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to update the category <strong>{selectedCategories?.name}</strong>?</p>
        <Form loading={loading} error={!!error} success={!!success}>
          {error && <Message error content={error} />}
          {success && <Message success content={success} />}
          <Form.Input
            label='Name'
            name='name'
            value={categoryData.name}
            onChange={handleInputChange}
          />
          <Form.Input
            label='Description'
            name='description'
            value={categoryData.description}
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

export default UpdateCategoriesModal;
