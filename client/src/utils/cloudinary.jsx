// cloudinary.js
import axios from 'axios';

const CLOUDINARY_URL = 'cloudinary://423261281436497:dMvx8KGHf0P8JJljFwW7mbG5RpI@duvpop9lr';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Add your upload preset here


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
