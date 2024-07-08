import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal } from "semantic-ui-react";
import { apiPUT } from "../../utils/apiHelper";

const OrderDeleteModal = ({ deleteModalOpen, deleteModalClose, selectedOrder }) => {
    console.log("Delete Product Modal", selectedOrder);
    const [loading,setLoading] = useState(false)
    
    const handleDelete =async () => {
        try {
            setLoading(true)
          const response = await apiPUT(`/v1/product/delete-product/${selectedOrder?._id}`);
          if(response?.data?.status){
              setLoading(false)
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
            <Modal.Header>Delete Order</Modal.Header>
            <Modal.Content>
                <p>Are you sure you want to delete the order <strong>{selectedOrder?.name?selectedOrder?.name:""}</strong>?</p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={deleteModalClose}>Cancel</Button>
                <Button negative loading={loading} onClick={()=>handleDelete()}>Delete</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default OrderDeleteModal;
