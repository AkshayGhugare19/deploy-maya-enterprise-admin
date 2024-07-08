import { useState, useEffect } from "react";
import { Button, Modal, Form, Message } from "semantic-ui-react";
import { apiPUT ,apiPOST} from "../../utils/apiHelper";

const UpdateUserModal = ({ open, onClose, selectedUser, refreshUsers }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNo: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      setUserData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        phoneNo: selectedUser.phoneNo || "",
      });
    }
  }, [selectedUser]);

  const handleInputChange = (e, { name, value }) => {
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiPOST(`/v1/users/update-user/${selectedUser?.id}`, userData);
      if (response?.data?.status) {
        setSuccess("User updated successfully!");
        onClose();
        refreshUsers(); // Refresh the user list
      } else {
        setError("Failed to update user.");
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error updating user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size='tiny' className="p-4">
      <Modal.Header>Update User</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to update the user <strong>{selectedUser?.name}</strong>?</p>
        <Form loading={loading} error={!!error} success={!!success}>
          {error && <Message error content={error} />}
          {success && <Message success content={success} />}
          <Form.Input
            label='Name'
            name='name'
            value={userData.name}
            onChange={handleInputChange}
            required
          />
          <Form.Input
            label='Email'
            name='email'
            type='email'
            value={userData.email}
            onChange={handleInputChange}
            required
          />
          <Form.Input
            label='Phone No'
            name='phoneNo'
            type='text'
            value={userData.phoneNo}
            onChange={handleInputChange}
            required
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button positive loading={loading} onClick={handleUpdate}>Update</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UpdateUserModal;
