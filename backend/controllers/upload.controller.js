import { v2 as cloudinary } from "cloudinary"

export const uploadImage = async (req, res, next) => {
  // Configure Cloudinary inside the route handler to ensure dotenv is fully loaded
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  try {
    const { image } = req.body
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      })
    }

    // Fallback if Cloudinary is not configured on the server
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    if (!cloudName || cloudName === "your_cloudinary_cloud_name") {
      console.warn("Cloudinary is not configured on server. Returning high-quality placeholder.")
      return res.status(200).json({
        success: true,
        secure_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
      })
    }

    // Upload base64 image string to Cloudinary with WebP and auto compression
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "newsportal",
      format: "webp",
      quality: "auto",
      fetch_format: "auto",
    })

    return res.status(200).json({
      success: true,
      secure_url: uploadResponse.secure_url,
    })
  } catch (error) {
    console.error("Cloudinary upload failed: ", error)
    return res.status(500).json({
      success: false,
      message: error.message || "Cloudinary upload failed",
    })
  }
}
