import React, { useEffect, useState } from "react";
import { apiGET, apiPUT } from "../../utils/apiHelper";
import FileUpdateInput from "../../components/FileUpload/FileUpdateInput";
import { Button, Container, Header, Segment, Grid } from "semantic-ui-react";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";

const BannerPage = () => {
    const [allBanners, setAllBanners] = useState([]);
    const [updatedFileUrls, setUpdatedFileUrls] = useState({});
    const [loading,setLoading]=useState(false)
    const [alert, setAlert] = useState({ message: "", type: "", visible: false });

    const getAllSliders = async () => {
        setLoading(true)
        try {
            const sliderResponse = await apiGET(`/v1/bannerImg/get-all-banner-img`);
            setAllBanners(sliderResponse?.data?.data?.data || []);
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch banners", error);
            setLoading(false)
        }
    };

    const updateBanner = async (item) => {
        const updatedFileUrl = updatedFileUrls[item?._id];
        if (!updatedFileUrl) {
            setAlert({ message: "No file URL to update for this slider", type: "error", visible: true });
            return;
        }
        const payload = {
            bannerImgUrl: updatedFileUrl
        };

        try {
            const response = await apiPUT(`/v1/bannerImg/update-banner-img/${item?._id}`, payload);
            if (response) {
                setAlert({ message: `Banner  updated successfully`, type: "success", visible: true });
                toast.success(`Banner  updated successfully`)
                getAllSliders();
            }else{
                toast.error(`Failed to update banner`)
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
            <Header as="h2">Banner Management</Header>
            {allBanners.map((item) => (
                <Segment key={item?._id} padded>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <FileUpdateInput myFileUrl={item?.bannerImgUrl} setUpdatedFileUrl={(url) => handleFileUrlChange(item._id, url)} />
                            </Grid.Column>
                            <Grid.Column>
                                <Button primary onClick={() => updateBanner(item)}>Update</Button>
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

export default BannerPage;
