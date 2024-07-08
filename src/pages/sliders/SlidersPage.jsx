import React, { useEffect, useState } from "react";
import { apiGET, apiPUT } from "../../utils/apiHelper";
import FileUpdateInput from "../../components/FileUpload/FileUpdateInput";
import { Button, Container, Header, Segment, Grid } from "semantic-ui-react";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";

const SlidersPage = () => {
    const [allSliders, setAllSliders] = useState([]);
    const [updatedFileUrls, setUpdatedFileUrls] = useState({});
    const [loading,setLoading]=useState(false);
    const [alert, setAlert] = useState({ message: "", type: "", visible: false });

    const getAllSliders = async () => {
        setLoading(true);
        try {
            const sliderResponse = await apiGET(`/v1/sliderImg/get-all-slider-img`);
            setAllSliders(sliderResponse?.data?.data?.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch sliders", error);
            setLoading(false);
        }
    };

    const updateSlider = async (item) => {
        const updatedFileUrl = updatedFileUrls[item?._id];
        if (!updatedFileUrl) {
            setAlert({ message: "No file URL to update for this slider", type: "error", visible: true });
            return;
        }
        const payload = {
            sliderImgUrl: updatedFileUrl,
            position: item.position,
        };

        try {
            const response = await apiPUT(`/v1/sliderImg/update-slider-img/${item?._id}`, payload);
            if (response) {
                setAlert({ message: `Slider at position ${item.position} updated successfully`, type: "success", visible: true });
                toast.success(`Slider at position ${item.position} updated successfully`)
                getAllSliders();
            }else{
                toast.error("Failed to update slider")
            }
        } catch (error) {
            setAlert({ message: "Failed to update slider", type: "error", visible: true });
            console.error("Failed to update slider", error);
        }
    };

    const handleFileUrlChange = (id, url) => {
        setUpdatedFileUrls((prev) => ({ ...prev, [id]: url }));
    };

    useEffect(() => {
        getAllSliders();
    }, []);

    if (loading) return <Loader/>


    return (
        <Container className="w-full p-4">
            {alert.visible && (
                <div className={`alert ${alert.type === "success" ? "alert-success" : "alert-error"}`}>
                    {alert.message}
                </div>
            )}
            <Header as="h2">Slider Management</Header>
            {allSliders.map((item) => (
                <Segment key={item?._id} padded>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <div>Position: {item?.position}</div>
                                <FileUpdateInput myFileUrl={item?.sliderImgUrl} setUpdatedFileUrl={(url) => handleFileUrlChange(item._id, url)} />
                            </Grid.Column>
                            <Grid.Column>
                                <Button primary onClick={() => updateSlider(item)}>Update</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            ))}
            <style jsx>{`
                .alert {
                    margin-bottom: 20px;
                    padding: 10px;
                    border-radius: 4px;
                    text-align: center;
                }
                .alert-success {
                    background-color: #d4edda;
                    color: #155724;
                }
                .alert-error {
                    background-color: #f8d7da;
                    color: #721c24;
                }
            `}</style>
        </Container>
    );
};

export default SlidersPage;
