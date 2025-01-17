// cloudinary.js
import axios from 'axios';

const CLOUDINARY_URL = import.meta.env.VITE_APP_CLOUDINARY_API;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_APP_CLOUDINARY_PRESET_NAME; // Add your upload preset here


// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.secure_url; // Returns the image URL from Cloudinary
  } catch (error) {
    console.error('Error uploading image to Cloudinary', error);
    throw error;
  }
};
