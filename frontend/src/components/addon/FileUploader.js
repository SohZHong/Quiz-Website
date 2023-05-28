import React from "react";
import FileItems from "./FileItems";

function FileUploader({ files, handleDragEvents, handleDropEvent, handleFileUpload, handleFileRemove, allowDownload=true }){

    return (
            <div className="drag-and-drop">
                <div className="drag-file-area" 
                    onDrag={handleDragEvents}
                    onDragStart={handleDragEvents}
                    onDragEnd={handleDragEvents}
                    onDragOver={handleDragEvents}
                    onDragEnter={handleDragEvents}
                    onDragLeave={handleDragEvents}
                    onDrop={handleDropEvent}>
                    
                    <div className="drag-file-area-text">
                        <span className="drop-file"> Drop files here </span>
                        <span className="or"> Or </span>
                        <label htmlFor="file" className="uploader-label">Browse
                            <input type="file" id="file" name="file" onChange={handleFileUpload} style={{ display: "none" }} />
                        </label>
                    </div>
                </div>
                {files.map((file, index) => 
                    <FileItems 
                        key={index}
                        file={file} 
                        handleFileRemove={handleFileRemove}
                        allowDownload={allowDownload}
                    />
                )
                }
            </div>
    )


}

export default FileUploader