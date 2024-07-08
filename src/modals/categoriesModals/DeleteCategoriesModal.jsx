import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal } from "semantic-ui-react";
import { apiPUT } from "../../utils/apiHelper";

const DeleteCategoriesModal = ({ deleteModalOpen, deleteModalClose, selectedCategories }) => {
    console.log("Delete Categories Modal", selectedCategories);
    const [loading,setLoading] = useState(false)
    
    const handleDelete =async () => {
        try {
            setLoading(true)
          const response = await apiPUT(`/v1/category/delete/${selectedCategories?.id}`);
          if(response?.data?.status){
              setLoading(false)
              deleteModalClose();
              toast.success('Categories deleted successfully');
          }else{
            deleteModalClose();
            toast.error('Failed to delete categories');
          }
        } catch (error) {
          console.error('Error fetching Categories:', error);
          setLoading(false)
          deleteModalClose();
        }
    };

    return (
        <Modal open={deleteModalOpen} size='tiny' className="p-4">
            <Modal.Header>Delete Categories</Modal.Header>
            <Modal.Content>
                <p>Are you sure you want to delete the categories <strong>{selectedCategories?.name?selectedCategories?.name:""}</strong>?</p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={deleteModalClose}>Cancel</Button>
                <Button negative loading={loading} onClick={()=>handleDelete()}>Delete</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default DeleteCategoriesModal;
