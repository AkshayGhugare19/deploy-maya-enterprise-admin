import React, { useCallback, useEffect, useState } from "react";
// import receptUpload from "../../assets/receptUpload.svg";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { uploadPost } from "./../../utils/apiHelper";
import { Icon } from "semantic-ui-react";

const DocDropzoneMultipleImage = ({  setFile }) => {
    let [fileUrl, setFileUrl] = useState("");
    let [loading, setLoading] = useState(false);
    let [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        if (fileRejections.length > 1) {
            toast.error("Please select only 1 document");
            return;
        }
        if (
            acceptedFiles[0].type.match(/image\/.*/)
        ) {
            let file = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            uploadToCloud(file[0]);
        } else {
            toast.error("Select only images or pdf files.");
            return
        }
    }, []);

   

    const { getRootProps, getInputProps } =
        useDropzone({
            onDrop,
            maxFiles: 1,
            accept: "image/*",
        });


    const getUploadKeyWithBaseFolderLocation = (filename) => {
        return new Date().getTime() + `_${filename}`;
    };

    const uploadToCloud = async (file) => {
        if (loading) return;

        try {
            const key = getUploadKeyWithBaseFolderLocation(file.name);
            const extension = file.name.split(".")[file.name.split(".").length - 1];
            setLoading(true);
            const payload = {
                key: key,
                content: file.type,
            };
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
                    let file_Url = url.split("?")[0];
                    setFileUrl(file_Url);
                    setFile(file_Url);
                    
                   
                } else {
                    console.log(
                        "Could not upload image please try again---",
                        "asset image"
                    );
                }
            };
            xhr.onerror = function (error) {
                setLoading(false);
                console.log("Could not upload image please try again", "asset image");
            };
            xhr.send(file);
        } catch (error) {
            setLoading(false);
            setUploadProgress(0);
        }
    };


    return (
        <div className="">
            {fileUrl == "" && uploadProgress == 0 ? (
                <div
                    {...getRootProps()}
                    style={{ cursor: "pointer" }}
                >

                    <input {...getInputProps()} />
                    <div >
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                            <div
                                style={{
                                    height: '35px',
                                    width: '35px',
                                    backgroundColor: 'gray',
                                    borderRadius: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon name='plus' style={{ color: 'white', margin: '0px 0px 0px 0px ', padding: '0px 0px 0px 0px' }} />
                            </div>
                        </div>
                        <div className=" " style={{ textAlign: 'center', marginTop: "0px", lineHeight: '16px' }}>
                            Click to upload image
                        </div>
                    </div>
                </div>
            ) : fileUrl == "" && uploadProgress != 0 ? (
                <div className="h-[70%]">
                    <p>Uploading... {uploadProgress}%</p>
                </div>
            ) : fileUrl != "" && uploadProgress != 0 && uploadProgress != 100 ? (
                <div className="h-[70%]">
                    <p>Uploading... {uploadProgress}%</p>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    style={{ cursor: "pointer" }}
                >

                    <input {...getInputProps()} />
                    <div >
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                            <div
                                style={{
                                    height: '35px',
                                    width: '35px',
                                    backgroundColor: 'gray',
                                    borderRadius: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon name='plus' style={{ color: 'white', margin: '0px 0px 0px 0px ', padding: '0px 0px 0px 0px' }} />
                            </div>
                        </div>
                        <div className=" " style={{ textAlign: 'center', marginTop: "0px", lineHeight: '16px' }}>
                            Click to upload image
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocDropzoneMultipleImage;
