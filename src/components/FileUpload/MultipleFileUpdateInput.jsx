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
        <div className="mt-3">
        <div className="border-2 border-dashed  border-gray-300 flex flex-col justify-center items-center bg-white rounded-lg p-8">
        <div className="flex gap-2 items-center justify-center overflow-auto w-[850px]">
            {imageUrls.length > 0 ? (
                imageUrls.map((imageUrl, index) => (
                    <div key={index} className="flex flex-col items-center mb-2">
                        <div className="relative flex justify-center items-center w-36 h-36 border-2 border-gray-300 rounded-lg overflow-hidden">
                            <button
                                disabled={loading}
                                className="absolute top-1 right-1 text-white bg-black rounded-full p-1"
                                onClick={() => removeImage(index)}
                            >
                                <MdClose />
                            </button>
                            <img className="w-4/5 h-4/5 object-cover" src={imageUrl} alt="uploaded" />
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center">
                    <div className="fallback">
                        <input disabled={loading} {...getInputProps()} />
                    </div>
                    <div
                        className="dz-message needsclick cursor-pointer"
                        {...getRootProps({ className: 'dropzone' })}
                    >
                        {loading ? (
                            <div className="text-gray-500">
                                Uploading{" "}
                                {Object.entries(uploadProgress).map(([file, progress]) => (
                                    <div key={file}>
                                        {file}: {progress} %
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <h5 className="cursor-pointer">
                                Drop multiple image files here or click to upload.
                            </h5>
                        )}
                    </div>
                </div>
            )}
        </div>
        </div>
    </div>
    );
};

export default MultipleFileUpdateInput;
