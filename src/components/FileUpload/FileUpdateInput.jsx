import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { MdClose } from "react-icons/md";
import { uploadPost } from "../../utils/apiHelper";
import { toast } from "react-toastify";

const FileUpdateInput = ({ myFileUrl, setUpdatedFileUrl }) => {
    const [imageUrl, setImageUrl] = useState(myFileUrl || "");
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (myFileUrl) {
            setImageUrl(myFileUrl);
        }
    }, [myFileUrl]);

    const onDrop = useCallback((acceptedFiles) => {
        try {
            let file = acceptedFiles[0];
            if (!file) return;
            if (file) {
                const fileType = file.type;
                if (!fileType.startsWith("image/")) {
                    toast.error("Please select an image file");
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                    // setImageUrl(reader.result);
                };
                reader.readAsDataURL(file);
                uploadToCloud(file);
            } else {
                console.error("Please select an image file");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        maxFiles: 1,
        onDrop,
    });

    const removeImage = () => {
        setImageUrl("");
        setUpdatedFileUrl("");
    };

    const getUploadKeyWithBaseFolderLocation = (filename) => {
        return "uploads/" + new Date().getTime() + "/" + filename;
    };

    const uploadToCloud = async (file) => {
        if (loading) return;

        try {
            const key = getUploadKeyWithBaseFolderLocation(file.name);
            setLoading(true);
            const payload = {
                key: key,
                content: file.type,
            };
            console.log("payload", payload);
            const response = await uploadPost(payload);
            if (!response) return;
            var url = response;

            const handleProgress = (evt) => {
                var progress = Math.ceil((evt.loaded / evt.total) * 100);
                setUploadProgress(progress);
            };

            setLoading(true);
            setUploadProgress(0);

            var xhr = new XMLHttpRequest();
            xhr.open("PUT", url, true);
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.setRequestHeader("x-amz-acl", "public-read");
            xhr.setRequestHeader("Caches", false);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.upload.addEventListener("progress", handleProgress, false);
            xhr.onload = function () {
                setLoading(false);
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let fileUrl = url.split("?")[0];
                    setUpdatedFileUrl(fileUrl);
                    setImageUrl(fileUrl);
                } else {
                    console.error("Could not upload image, please try again");
                }
            };
            xhr.onerror = function (error) {
                console.error("Error:", error);
                setLoading(false);
                console.error("Could not upload image, please try again");
            };
            xhr.send(file);
        } catch (error) {
            setLoading(false);
            setUploadProgress(0);
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ marginTop: "12px" }}>
            <div
                style={{
                    border: "2px dashed #d3d3d3",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: "5px",
                    padding: "30px",
                }}
            >
                {imageUrl && !loading ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            className="box text-center"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                position: "relative",
                            }}
                        >
                            <button
                                disabled={loading}
                                className="circular ui icon button"
                                style={{
                                    position: "absolute",
                                    top: "-10px",
                                    right: "40px",
                                }}
                                onClick={removeImage}
                            >
                                <MdClose />
                            </button>
                            <img
                                style={{ width: "50%" }}
                                src={imageUrl}
                                alt="Uploaded"
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="fallback">
                            <input
                                disabled={loading}
                                {...getInputProps()}
                            />
                        </div>
                        <div
                            className="dz-message needsclick"
                            {...getRootProps({ className: "dropzone" })}
                            style={{ cursor: "pointer" }}
                        >
                            {loading ? (
                                <div style={{ color: "#9D9D9D" }}>
                                    Uploading {uploadProgress} %
                                </div>
                            ) : (
                                <h5>Drop Image files here or click to upload.</h5>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpdateInput;
