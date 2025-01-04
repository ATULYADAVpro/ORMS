import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/duvpop9lr/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'gtk4v3ju';

const uploadImageToCloudinary = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); // Use the upload preset correctly

        const response = await axios.post(CLOUDINARY_URL, formData); // Use the correct upload URL
        return response.data.secure_url; // URL of the uploaded image
    } catch (error) {
        console.log('Error uploading image to Cloudinary:', error);
        throw error;
    }
};

export default uploadImageToCloudinary;
