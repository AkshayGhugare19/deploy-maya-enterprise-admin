import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { MdClose } from "react-icons/md";
import { uploadPost } from "../../utils/apiHelper";

const MultipleFileUpdateInput = ({ myFileUrls = [], setUpdateMultipleUrl }) => {
    const [imageUrls, setImageUrls] = useState(myFileUrls);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});

    useEffect(() => {
        setImageUrls(myFileUrls);
    }, [myFileUrls]);

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            uploadToCloud(file);
        });
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        accept: ".png, .jpg, .jpeg",
        onDrop,
    });

    const removeImage = (index) => {
        const newImageUrls = [...imageUrls];
        newImageUrls.splice(index, 1);
        setImageUrls(newImageUrls);
        setUpdateMultipleUrl(newImageUrls);
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
                let progress = Math.ceil((evt.loaded / evt.total) * 100);
                setUploadProgress((prevProgress) => ({
                    ...prevProgress,
                    [file.name]: progress,
                }));
            };

            setUploadProgress((prevProgress) => ({
                ...prevProgress,
                [file.name]: 0,
            }));

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
                    setImageUrls((prevUrls) => [...prevUrls, fileUrl]);
                    setUpdateMultipleUrl((prevUrls) => [...prevUrls, fileUrl]);
                    setUploadProgress((prevProgress) => {
                        const { [file.name]: _, ...rest } = prevProgress;
                        return rest;
                    });
                } else {
                    console.error("Could not upload image, please try again");
                }
            };
            xhr.onerror = function (error) {
                console.error("Error:", error);
                setLoading(false);
                setUploadProgress((prevProgress) => {
                    const { [file.name]: _, ...rest } = prevProgress;
                    return rest;
                });
                console.error("Could not upload image, please try again");
            };
            xhr.send(file);
        } catch (error) {
            setLoading(false);
            setUploadProgress((prevProgress) => {
                const { [file.name]: _, ...rest } = prevProgress;
                return rest;
            });
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
                {imageUrls.length > 0 ? (
                    imageUrls.map((imageUrl, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                alignItems: "center",
                                marginBottom: "10px",
                            }}
                        >
                            <div
                                className="box text-center"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "150px",
                                    maxHeight: "150px",
                                    position: "relative",
                                }}
                            >
                                <button
                                    disabled={loading}
                                    className="circular ui icon button"
                                    style={{
                                        position: "absolute",
                                        top: "0px",
                                        right: "0px",
                                    }}
                                    onClick={() => {
                                        removeImage(index);
                                    }}
                                >
                                    <MdClose />
                                </button>
                                <img
                                    style={{ width: "70%" }}
                                    src={imageUrl}
                                    alt="uploaded"
                                />
                            </div>
                        </div>
                    ))
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
                                    Uploading{" "}
                                    {Object.entries(uploadProgress).map(
                                        ([file, progress]) => (
                                            <div key={file}>
                                                {file}: {progress} %
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <h5>
                                    Drop multiple image files here or click to
                                    upload.
                                </h5>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultipleFileUpdateInput;
