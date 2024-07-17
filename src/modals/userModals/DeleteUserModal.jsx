import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal } from "semantic-ui-react";
import { apiPUT } from "../../utils/apiHelper";

const DeleteUserModal = ({ deleteModalOpen, closeDeleteModal, selectedUser }) => {
    console.log("Delete User Modal", selectedUser);
    const [loading,setLoading] = useState(false)
    
    const handleDelete =async () => {
        try {
            setLoading(true)
          const response = await apiPUT(`/v1/users/delete-profile/${selectedUser?.id}`);
          if(response?.data?.status){
              setLoading(false)
              toast.success("User deleted successfully")
              closeDeleteModal();
          }else{
            closeDeleteModal();
            toast.error("Something went wrong")

          }
        } catch (error) {
          console.error('Error fetching users:', error);
          setLoading(false)
          closeDeleteModal();
        }
    };

    return (
        <Modal open={deleteModalOpen} size='tiny'>
            <Modal.Header>Delete User</Modal.Header>
            <Modal.Content>
                <p>Are you sure you want to delete the user <strong>{selectedUser?.name?selectedUser?.name:""}</strong>?</p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={()=>closeDeleteModal()}>Cancel</Button>
                <Button negative loading={loading} onClick={()=>handleDelete()}>Delete</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default DeleteUserModal;
