import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal } from "semantic-ui-react";
import { apiPUT } from "../../utils/apiHelper";

const DeleteBrandsModal = ({ deleteModalOpen, deleteModalClose, selectedBrands }) => {
    console.log("Delete Brand Modal", selectedBrands);
    const [loading,setLoading] = useState(false)
    
    const handleDelete =async () => {
        try {
            setLoading(true)
          const response = await apiPUT(`/v1/brand/delete/${selectedBrands?.id}`);
          if(response?.data?.status){
              setLoading(false)
              deleteModalClose();
              toast.success("Brand deleted successfully");
          }else{
            deleteModalClose();
            toast.error("Failed to delete categories");
          }
        } catch (error) {
          console.error('Error fetching Brand:', error);
          setLoading(false)
          deleteModalClose();
        }
    };

    return (
        <Modal open={deleteModalOpen} size='tiny' className="p-4">
            <Modal.Header>Delete Brand</Modal.Header>
            <Modal.Content>
                <p>Are you sure you want to delete the brand <strong>{selectedBrands?.name?selectedBrands?.name:""}</strong>?</p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={deleteModalClose}>Cancel</Button>
                <Button negative loading={loading} onClick={()=>handleDelete()}>Delete</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default DeleteBrandsModal;
