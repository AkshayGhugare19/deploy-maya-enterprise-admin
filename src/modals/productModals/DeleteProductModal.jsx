import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal } from "semantic-ui-react";
import { apiPUT } from "../../utils/apiHelper";

const DeleteProductModal = ({ deleteModalOpen, deleteModalClose, selectedProduct }) => {
    console.log("Delete Product Modal", selectedProduct);
    const [loading,setLoading] = useState(false)
    
    const handleDelete =async () => {
        try {
            setLoading(true)
          const response = await apiPUT(`/v1/product/delete-product/${selectedProduct?._id}`);
          if(response?.data?.status){
              setLoading(false)
              toast.success("Product deleted successfully!");
              deleteModalClose();
          }else{
            deleteModalClose();
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          setLoading(false)
          deleteModalClose();
        }
    };

    return (
        <Modal open={deleteModalOpen} size='tiny'>
            <Modal.Header>Delete Product</Modal.Header>
            <Modal.Content>
                <p>Are you sure you want to delete the product <strong>{selectedProduct?.name?selectedProduct?.name:""}</strong>?</p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={deleteModalClose}>Cancel</Button>
                <Button negative loading={loading} onClick={()=>handleDelete()}>Delete</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default DeleteProductModal;
