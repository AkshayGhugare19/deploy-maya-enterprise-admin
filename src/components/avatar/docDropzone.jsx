import React, { useCallback, useEffect, useState } from "react";
// import receptUpload from "../../assets/receptUpload.svg";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { uploadPost } from "./../../utils/apiHelper";

const DocDropzone = ({ fileItem, setFile }) => {
  let [fileUrl, setFileUrl] = useState(fileItem);
  let [loading, setLoading] = useState(false);
  let [acceptedFile, setAcceptedFile] = useState("");
  let [uploadProgress, setUploadProgress] = useState(0);
  function ellipsePdfName(pdfName = "", width = 8) {
    if (!pdfName) {
      return "";
    }
    if (pdfName.length > 24) {
      return `${pdfName.slice(0, width)}...${pdfName.slice(-width)}`;
    } else {
      return pdfName;
    }
  }

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

    // if (acceptedFile[0].type.match(/application\/pdf/)) {
    //   let file = acceptedFiles.map((file) =>
    //     Object.assign(file, {
    //       preview: URL.createObjectURL(file),
    //     })
    //   );
    //   console.log("jkgsnsg");

    //   uploadToCloud(file[0]);
  }, []);

  const removeFile = (file) => {
    setFileUrl("");
    setFile("");
    setUploadProgress(0);
    setAcceptedFile("");
  };

  const { getRootProps, getInputProps, isDragReject, fileRejections } =
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
          setAcceptedFile(file);
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

  useEffect(() => {
    if (!fileItem) {
      removeFile();
    } else {
      if (fileItem.includes('http')) {
        setFileUrl(fileItem)
      } else {
        setFileUrl(fileItem)
      }
    }
  }, [fileItem]);

  return (
    <div className="">
      {fileUrl == "" && uploadProgress == 0 ? (
        <div
          {...getRootProps()}
          style={{ cursor: "pointer" }}
        >

          <input {...getInputProps()} />
          <div >
            <div >
              <div >
                <img
                  alt=""
                />
              </div>
            </div>
            <div className=" " style={{ textAlign: 'center', marginTop: "-10px" }}>
              Click to upload images
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
          // {...getRootProps()}
          className="cursor-pointer flex w-full justify-center items-center"
        >

          <input {...getInputProps()} />
          <div style={{ position: 'relative' }} >
            <img src={fileUrl} style={{ height: "100%", width: "100%" }} />
            <div style={{ position: 'absolute', top: -12, right: -12, width:20, height:20, cursor: 'pointer' }}>
              <svg onClick={() => {
                removeFile(fileUrl);
              }} width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M24 24C23.7454 24.2546 23.4001 24.3976 23.04 24.3976C22.6799 24.3976 22.3346 24.2546 22.08 24L16 17.92L9.92 24C9.66539 24.2546 9.32007 24.3976 8.96 24.3976C8.59993 24.3976 8.25461 24.2546 8 24C7.74539 23.7454 7.60236 23.4001 7.60236 23.04C7.60235 22.6799 7.74539 22.3346 8 22.08L14.08 16L8 9.92C7.74539 9.66539 7.60236 9.32007 7.60235 8.96C7.60235 8.59993 7.74539 8.25461 8 8C8.25461 7.74539 8.59993 7.60236 8.96 7.60236C9.32007 7.60236 9.66539 7.74539 9.92 8L16 14.08L22.08 8C22.3346 7.74539 22.6799 7.60236 23.04 7.60236C23.4001 7.60236 23.7454 7.74539 24 8C24.2546 8.25461 24.3976 8.59993 24.3976 8.96C24.3976 9.32007 24.2546 9.66539 24 9.92L17.92 16L24 22.08C24.2546 22.3346 24.3976 22.6799 24.3976 23.04C24.3976 23.4001 24.2546 23.7454 24 24Z" fill="black" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocDropzone;
