import axios from "axios";
// Secure Server-Side Cloudinary Image Upload Utility
// Converts files to base64 and posts them to our backend route.
// Keeps the same function signatures to prevent page-level changes.

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export async function uploadFile(file) {
  const base64Image = await convertToBase64(file)

  const response = await axios.post(
    "/api/upload/image",
    { image: base64Image },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  )

  if (response.data && response.data.success && response.data.secure_url) {
    return {
      $id: response.data.secure_url,
    }
  }

  throw new Error(response.data?.message || "Image upload failed")
}

export function getFilePreview(fileId) {
  // Since we save the full secure_url in the $id field, we return it directly.
  return fileId
}
