
import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { MdClose } from "react-icons/md";
import { uploadPost } from "../../utils/apiHelper";

const MultiFileUploadInput = ({ setUploadMultipleUrl }) => {
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach(file => {
            uploadToCloud(file);
        });
    }, []);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: ".png, .jpg, .jpeg",
        onDrop,
    });

    const removeImage = (index) => {
        const newImageUrls = [...imageUrls];
        newImageUrls.splice(index, 1);
        setImageUrls(newImageUrls);
        setUploadMultipleUrl(newImageUrls);
    };

    const getUploadKeyWithBaseFolderLocation = (filename) => {
        return "uploads/" + new Date().getTime() + "/" + filename;
    };

    const uploadToCloud = async (file) => {
        if (loading) return;

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
                let progress = Math.ceil((evt.loaded / evt.total) * 100);
                setUploadProgress((prevProgress) => [
                    ...prevProgress,
                    { file: file.name, progress: progress },
                ]);
            };

            setLoading(true);
            setUploadProgress([]);

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
                    setUploadMultipleUrl((prevUrls) => [...prevUrls, fileUrl]);
                } else {
                    console.log(
                        "Could not upload image, please try again",
                        "asset image"
                    );
                }
            };
            xhr.onerror = function (error) {
                console.log("error", error);
                setLoading(false);
                console.log(
                    "Could not upload image, please try again",
                    "asset image"
                );
            };
            xhr.send(file);
        } catch (error) {
            setLoading(false);
            setUploadProgress([]);
        }
    };

    return (
        <>
            <div className="mt-3">
    <div className="border-2 border-dashed  border-gray-300 flex flex-wrap justify-center items-center bg-white rounded-lg p-8">
       <div className=" flex gap-2 items-center justify-center overflow-auto w-[850px]">
       {imageUrls.length > 0 && !loading ? (
            imageUrls.map((imageUrl, index) => (
                <div key={index} className="flex flex-col items-center mb-3 mx-3 over">
                    <div className="relative flex justify-center items-center w-36 h-36 border-2 border-gray-300 rounded-lg ">
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
                            Uploading {uploadProgress.map(p => (
                                <div key={p.file}>
                                    {p.file}: {p.progress} %
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h5 className="cursor-pointer">
                            Drop Multiple Image files here or click to upload.
                        </h5>
                    )}
                </div>
            </div>
        )}
       </div>
    </div>
</div>
        </>
    );
};

export default MultiFileUploadInput;

