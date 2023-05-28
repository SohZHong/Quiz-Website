import React, { useEffect, useState } from "react";
import FileUploader from "../../../addon/FileUploader";
import Pagination from "../../../addon/Pagination";
import axios from "axios";

function UploadsTab({ classID }){

    const [files, setFiles] = useState([]);
    const [existingFileIDs, setExistingFileIDs] = useState([]);
    const [initialFiles, setInitialFiles] = useState([]);
    const [filesToDelete, setFilesToDelete] = useState([]);
    const allowedExtensions = [".pdf", ".docx", ".doc", ".ppt", ".pptx", ".txt", ".png", "jpg", ".jpeg"];
    const [currentPage, setCurrentPage] = useState(0);
    const [docPerPage, setDocPerPage] = useState(5); //Default Documents Per Page
    const docOptions = [5, 10, 15];
    const pageRange = useState(5);

    //Determining number of pages and filtering rows
    const pageCount = Math.ceil(files.length / docPerPage);
    const rowOffset = currentPage * docPerPage;

    useEffect(() => {
        axios.get(`/api/class/${classID}/get_uploads`)
        .then(resp => {
            const data = resp.data

            setFiles(data);
            setInitialFiles(data);
            // Extract IDs from the response data
            const fileIDs = data.map(file => file.id);
            // Update existingFileIDs with the extracted IDs
            setExistingFileIDs(fileIDs);
        })
    }, [classID])


    const handleRowChange = (e) => {
        setDocPerPage(e.target.value)
    }

    const handlePageChange = (e) => {
        setCurrentPage(e.selected);
    };
   
    const convertKB = (size) => {
        return ((size / 1024).toFixed(1) + ' KB');
    }

    const getExtension = (fileName) => {
        return ("." + fileName.split(".").pop().toLowerCase());
    }

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            //Show alert if wrong file extension
            if (allowedExtensions.includes(getExtension(selectedFile.name))){
                setFiles(prevState => [
                    ...prevState,
                    {
                      id: prevState.reduce((prevMax, file) => (file.id > prevMax ? file.id : prevMax), 0) + 1,
                      name: selectedFile.name, 
                      size: convertKB(selectedFile.size),
                      path: selectedFile
                    }
                  ]);
            }
            else {
                //Show user available file types
                alert("Invalid File Type. Allowed Types: " + allowedExtensions.join(', '));
            }
        }
    };

    const handleFileRemove = (e, fileID) => {
        e.preventDefault();

        const updatedFiles = files.filter(file => 
            file.id !== fileID
        )
        setFiles(updatedFiles);
        setFilesToDelete(prevState => [...prevState, { id: fileID, name: files.find(file => file.id === fileID).name }]);
    };

    const handleDragEvents = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDropEvent = (e) => {
        e.preventDefault();
    
        const droppedFiles = Array.from(e.dataTransfer.files);

        // Filter out files with disallowed extensions
        const newFiles = droppedFiles.filter(file => 
          allowedExtensions.includes(getExtension(file.name))
        );
    
        // Add the valid files to the array
        const filesToAdd = newFiles.map((file, index) => ({
            id: files.reduce((prevMax, file) => (file.id > prevMax ? file.id : prevMax), 0) + index + 1,
            name: file.name, 
            size: convertKB(file.size),
            path: file
        }));

        const updatedFiles = [...files, ...filesToAdd];
        setFiles(updatedFiles);
    };

    const handleReset = (e) => {
        e.preventDefault();
        setFiles(initialFiles);
        setFilesToDelete([]); //Empty the array
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const filesToAdd = [];

        for (const file of files){
            if (!existingFileIDs.includes(file.id)){
                formData.append('files', file.path, file.path.name);
                filesToAdd.push(file);
            }
        }

        //Only post if there is new files
        if (formData.has('files')) {
            await axios.post('/api/upload_files', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .catch(err => console.error(err));
        }

        if (filesToDelete.length > 0){
            //Empty array after deleting in sql
            await axios.post(`/api/class/${classID}/delete_uploads`, {data: filesToDelete});
            // Remove deleted file IDs from existingFileIDs
            setExistingFileIDs(prevIDs => prevIDs.filter(id => {
                const foundFile = filesToDelete.find(file => file.id === id);
                return !foundFile;
            }));

            setFilesToDelete([]);
        }

        if (filesToAdd.length > 0){
            await axios.post(`/api/class/${classID}/save_uploads`, {data: filesToAdd});
            setInitialFiles(files);

            //Add uploaded file's id to escape second upload
            const fileIDs = filesToAdd.map(file => file.id);
            setExistingFileIDs(prevIDs => [...prevIDs, ...fileIDs]);
        }

        
    }

    return (
        <div className='uploads-section'>
            <FileUploader
                files={files.slice(rowOffset, rowOffset + docPerPage)}
                handleDragEvents={handleDragEvents}
                handleDropEvent={handleDropEvent}
                handleFileUpload={handleFileUpload}
                handleFileRemove={handleFileRemove}
                allowDownload={false}
            />
            <Pagination 
                options={docOptions}
                pageCount={pageCount}
                pageRange={pageRange}
                handleRowChange={handleRowChange}
                handlePageChange={handlePageChange}
            />
            <div className="button-container">
                <button className="save-button" onClick={handleSubmit}>
                    Save
                </button>
                <button className="reset-button" onClick={handleReset}>
                    Reset
                </button>
            </div>
      </div>
    )
}

export default UploadsTab