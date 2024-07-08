import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal } from "semantic-ui-react";
import { apiPUT } from "../../utils/apiHelper";

const DeleteUserModal = ({ deleteModalOpen, deleteModalClose, selectedUser }) => {
    console.log("Delete User Modal", selectedUser);
    const [loading,setLoading] = useState(false)
    
    const handleDelete =async () => {
        try {
            setLoading(true)
          const response = await apiPUT(`/v1/users/delete-profile/${selectedUser?.id}`);
          if(response?.data?.status){
              setLoading(false)
              deleteModalClose();
          }else{
            deleteModalClose();
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          setLoading(false)
          deleteModalClose();
        }
    };

    return (
        <Modal open={deleteModalOpen} size='tiny'>
            <Modal.Header>Delete User</Modal.Header>
            <Modal.Content>
                <p>Are you sure you want to delete the user <strong>{selectedUser?.name?selectedUser?.name:""}</strong>?</p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={deleteModalClose}>Cancel</Button>
                <Button negative loading={loading} onClick={()=>handleDelete()}>Delete</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default DeleteUserModal;
