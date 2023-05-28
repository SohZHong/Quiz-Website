import React from "react";
import FileItems from "../../../addon/FileItems";

function UploadList({ files }){

    return (
        <div className='uploads_container'>
            {files.map((file, index) => (
                <FileItems
                    key={index}
                    file={file}
                />
            ))}
        </div>
    )
}

export default UploadList