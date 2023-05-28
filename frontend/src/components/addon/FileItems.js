import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

function FileItems({ file: {id, name, size}, handleFileRemove, allowDownload=true }){

    const getExtension = (fileName) => {
        return ("." + fileName.split(".").pop().toLowerCase());
    }

    const handleFileDownload = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.get(`/api/download_file/${name}`, {
            responseType: 'blob', // Set the response type to 'blob'
          });
    
          // Create a download link and click it to trigger the file download
          const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

        } catch (err) {
          console.error(err);
        }
      };

    const fileExtension = getExtension(name);
    const fileIcon =
    fileExtension === ".ppt" || fileExtension === ".pptx" ? (
        <FontAwesomeIcon icon="fa-solid fa-file-powerpoint" />
    ) : fileExtension === ".doc" || fileExtension === ".docx" ? (
        <FontAwesomeIcon icon="fa-solid fa-file-word" />
    ) : fileExtension === ".jpg" || fileExtension === ".jpeg" || fileExtension === ".png" ? (
        <FontAwesomeIcon icon="fa-solid fa-file-image" />
    ) : fileExtension === ".pdf" ? (
        <FontAwesomeIcon icon="fa-solid fa-file-pdf" />
    ) : (
        <FontAwesomeIcon icon="fa-solid fa-file-lines" />
    );

    return (
        <div className="file-item">
            <span className="file-name">{fileIcon}<span>{name}</span></span>
            <span className="file-size">{size}</span>
            <div className="button-container">
                {allowDownload &&
                    <button className="file-upload-button" onClick={handleFileDownload}>
                        <FontAwesomeIcon icon="fa-solid fa-file-arrow-down" />
                    </button>
                }
                {handleFileRemove && 
                    <button className="file-delete-button" onClick={(e) => handleFileRemove(e, id)}>
                        X
                    </button>
                }

            </div>

        </div>
    )
}

export default FileItems