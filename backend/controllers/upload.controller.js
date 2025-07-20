import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Tambahkan console.log untuk memeriksa apakah env terbaca
console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "NOT LOADED", // Cek secret tanpa menampilkannya
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req, res) => {
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  try {
    const result = await streamUpload(req);
    res.send(result);
  } catch (error) {
    // Tampilkan error asli dari Cloudinary di terminal backend
    console.error("CLOUDINARY UPLOAD ERROR:", error);
    res
      .status(500)
      .json({ message: "Upload file gagal.", error: error.message });
  }
};
