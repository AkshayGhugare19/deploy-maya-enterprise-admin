import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal } from "semantic-ui-react";
import { apiPUT } from "../../utils/apiHelper";

const DeleteSubscriberModal = ({ deleteModalOpen, deleteModalClose, selectedSubscriber }) => {
    console.log("Delete Subscriber Modal", selectedSubscriber);
    const [loading,setLoading] = useState(false)
    
    const handleDelete =async () => {
        try {
            setLoading(true)
          const response = await apiPUT(`/v1/brand/delete/${selectedSubscriber?.id}`);
          if(response?.data?.status){
              setLoading(false)
              deleteModalClose();
              toast.success("Subscriber deleted successfully");
          }else{
            deleteModalClose();
            toast.error("Failed to delete categories");
          }
        } catch (error) {
          console.error('Error fetching Subscriber:', error);
          setLoading(false)
          deleteModalClose();
        }
    };

    return (
        <Modal open={deleteModalOpen} size='tiny' className="p-4">
            <Modal.Header>Delete Subscriber</Modal.Header>
            <Modal.Content>
                <p>Are you sure you want to delete the subscriber <strong>{selectedSubscriber?.name?selectedSubscriber?.name:""}</strong>?</p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={deleteModalClose}>Cancel</Button>
                <Button negative loading={loading} onClick={()=>handleDelete()}>Delete</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default DeleteSubscriberModal;
