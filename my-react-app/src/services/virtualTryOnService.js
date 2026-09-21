/**
 * Virtual Try-On Service — Calls Backend API
 *
 * Sends user photo + garment info to the Express backend,
 * which then proxies to Hugging Face IDM-VTON (server-side).
 * This avoids CORS issues and handles long processing times.
 */

const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:1900/api";

/**
 * Main Virtual Try-On function
 * Sends user photo + garment to backend → backend calls IDM-VTON → returns AI result
 */
export async function processVirtualTryOn({ userPhotoUrl, product, onProgress }) {
  const garmentUrl = product?.images?.[0] || product?.image;

  if (!userPhotoUrl || !garmentUrl) {
    throw new Error("Both user photo and garment image are required");
  }

  // Step 1: Prepare the request
  if (onProgress) onProgress("Preparing your photo & garment image...");

  const formData = new FormData();

  // Check if userPhotoUrl is a blob URL (from file upload) or a regular URL
  if (userPhotoUrl.startsWith("blob:")) {
    // User uploaded a file — fetch the blob and attach as file
    const response = await fetch(userPhotoUrl);
    const blob = await response.blob();
    formData.append("userPhoto", blob, "user_photo.jpg");
  } else {
    // It's a URL (demo model image)
    formData.append("userPhotoUrl", userPhotoUrl);
  }

  // Append garment image
  if (garmentUrl.startsWith("blob:")) {
    const response = await fetch(garmentUrl);
    const blob = await response.blob();
    formData.append("garmentPhoto", blob, "garment_photo.jpg");
  } else {
    formData.append("garmentUrl", garmentUrl);
  }

  const desc = product?.description
    ? `${product.title} - ${product.description}`
    : (product?.title || "Saree ethnic garment outfit");
  formData.append("garmentDescription", desc);

  // Step 2: Send to backend
  if (onProgress) onProgress("Connecting to AI server (first time may take 1-2 minutes)...");

  let response;
  try {
    response = await fetch(`${API_BASE}/virtual-tryon`, {
      method: "POST",
      body: formData,
      // No Content-Type header — browser sets it automatically with boundary for FormData
    });
  } catch (networkErr) {
    throw new Error("Could not reach the server. Make sure the backend is running on port 1900.");
  }

  // Step 3: Parse response
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "AI model could not process the images. Please try again.");
  }

  if (onProgress) onProgress("Done! Your AI-fitted look is ready ✨");

  return {
    success: true,
    generatedImageUrl: data.generatedImageUrl,
    userPhotoUrl,
    product,
    fitScore: "AI Generated — True to Fit",
    fabricDrape: "Realistic AI Drape & Texture Mapping",
    processingTime: data.processingTime || "N/A",
    provider: data.provider || "Hugging Face IDM-VTON",
    processedAt: new Date().toISOString(),
    privacyNotice: "Photos processed on Hugging Face servers. No permanent storage.",
  };
}

/**
 * Check if the AI server is reachable
 */
export async function checkTryOnStatus() {
  try {
    const res = await fetch(`${API_BASE}/virtual-tryon/status`);
    return await res.json();
  } catch {
    return { status: "offline", message: "Backend server not reachable" };
  }
}
