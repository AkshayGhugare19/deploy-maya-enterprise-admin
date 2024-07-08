

import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { MdClose } from "react-icons/md";
import { uploadPost } from "../../utils/apiHelper";

const FileUploadInput = ({
    setUploadedFileUrl
}) => {
    const [imageUrl, setImageUrl] = useState();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles) => {
        try {
            let file = acceptedFiles[0];
            if (!file) return;
            if (file) {
                const { name, type } = file;
                const reader = new FileReader();
                reader.onload = () => {
                    // setImageUrl(reader.result);
                };
                reader.readAsDataURL(file);
                uploadToCloud(file);
            } else onError("Please select image file");
        } catch (error) {
            console.log("errror", error);
        }
    }, []);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: ".png, .jpg, .jpeg",
        maxFiles: 1,
        onDrop,
    });

    const removeImage = () => {
        setImageUrl("");
        onRemove("");
        
    };

    const getUploadKeyWithBaseFolderLocation = (filename) => {
        return "uploads/" + new Date().getTime() + "/" + filename;
    };

    const uploadToCloud = async (file, haveToUpload = true) => {
        if (loading) return;

        if (!haveToUpload) {
            setImageUrl("");
            return;
        }

        try {
            const key = getUploadKeyWithBaseFolderLocation(file.name);
            const extension =
                file.name.split(".")[file.name.split(".").length - 1];
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
                let p = `${evt.type}: ${evt.loaded} bytes transferred\n`;
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
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let fileUrl = url.split("?")[0];
                    setUploadedFileUrl(fileUrl);
                    setImageUrl(fileUrl);
                } else {
                    console.log(
                        "Could not upload image please try again---",
                        "asset image"
                    );
                }
            };
            xhr.onerror = function (error) {
                console.log("error", error);
                setLoading(false);
                console.log(
                    "Could not upload image please try again",
                    "asset image"
                );
            };
            xhr.send(file);
        } catch (error) {
            setLoading(false);
            setUploadProgress(0);
        }
    };

   

    return (
        <>
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
                                    width: "150px",
                                    maxHeight: "150px",
                                    position: "relative",
                                }}
                            >
                                <button
                                    disabled={loading }
                                    className="circular ui icon button"
                                    style={{
                                        position: "absolute",
                                        top: "0px",
                                        right: "0px",
                                    }}
                                    onClick={() => {
                                        removeImage();
                                    }}
                                >
                                    <MdClose />
                                </button>
                                <img
                                    style={{ width: "70%" }}
                                    src={imageUrl}
                                    alt="cropped"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="fallback">
                                <input
                                    disabled={ loading }
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
                                    <h5>
                                        Drop Image files here or click to
                                        upload.
                                    </h5>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FileUploadInput;
