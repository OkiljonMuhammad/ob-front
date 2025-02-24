import React, { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import ThemeContext from '../../context/ThemeContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UploadImage = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { theme } = useContext(ThemeContext); 

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first!");
      return;
    }
  
    setIsUploading(true);
  
    try {
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
        setPreview(null);
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
        <Form.Label>Upload Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Upload an image"
          className={`bg-${theme} ${getTextColorClass()}`}
        />
      </Form.Group>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ width: '100px', marginTop: '10px' }}
        />
      )}
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