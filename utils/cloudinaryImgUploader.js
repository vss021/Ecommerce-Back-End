import { v2 as cloudinary } from 'cloudinary';
import ErrorHandler from '../middlewares/ErrorHandler.js';

export const cloudinaryFileUploader = async ({ file, folderName }) => {
  try {
    if (!file || !file.tempFilePath) {
      throw new Error("No file uploaded or file path is missing.");
    }

    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: folderName,
      resource_type: "auto", // Automatically detects image, video, pdf, etc.
    });

    return uploaded;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    return next(new ErrorHandler("File upload failed. Try again.", 500));
  }
  
};
