/**
 * Cloudinary Configuration
 * ========================================
 * Image upload and management service
 */

const cloudinary = require('cloudinary').v2;
const env = require('../config/env');
const logger = require('./logger');

// Configure Cloudinary
if (env.CLOUDINARY_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
  logger.info('✅ Cloudinary configured');
} else {
  logger.warn('⚠️  Cloudinary not configured - image uploads disabled');
}

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to image file
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Object>} - Upload result with URL
 */
async function uploadImage(filePath, folder = 'netshop') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `netshop/${folder}`,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
    };
  } catch (error) {
    logger.error('Error uploading to Cloudinary:', error.message);
    throw error;
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of image
 * @returns {Promise<Object>} - Deletion result
 */
async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error('Error deleting from Cloudinary:', error.message);
    throw error;
  }
}

/**
 * Get image URL with transformations
 * @param {string} publicId - Public ID of image
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed URL
 */
function getImageUrl(publicId, options = {}) {
  try {
    return cloudinary.url(publicId, {
      width: options.width || 500,
      height: options.height || 500,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });
  } catch (error) {
    logger.error('Error generating image URL:', error.message);
    return null;
  }
}

module.exports = {
  uploadImage,
  deleteImage,
  getImageUrl,
};
