import React, { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import Compressor from 'compressorjs';
import ThemeContext from '../../context/ThemeContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UploadImage = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { theme } = useContext(ThemeContext); 
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      new Compressor(file, {
        quality: 0.8,
        success: (compressedFile) => {
          setSelectedFile(compressedFile);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first!");
      return;
    }
  
    setIsUploading(true);
  
    try {
      if (selectedFile.size > MAX_FILE_SIZE) {
  toast.error("File size exceeds the maximum limit of 5 MB.");
  return;
}
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1];
  
        const response = await axios.post(`${BASE_URL}/api/image/upload`, { image: base64String },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
  
        onUpload(response.data?.imageUrl);
        toast.success("Image uploaded successfully!");
  
        setSelectedFile(null);
      };
  
      reader.onerror = (error) => {
        console.error("Base64 conversion failed:", error);
        toast.error("Failed to process image.");
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <div>
      <Form.Group controlId="imageUpload">
        <Form.Label>Upload Image <span className='custom-label'>(Optional)</span></Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Upload an image"
          className={`bg-${theme} ${getTextColorClass()}`}
        />
      </Form.Group>
      <Button
        variant="primary"
        onClick={handleUpload}
        disabled={isUploading}
        className="mt-2"
      >
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </div>
  );
};

export default UploadImage;