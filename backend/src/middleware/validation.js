/**
 * Validation Middleware
 * ========================================
 * Request validation using Zod schema
 */

const { ApiError, handleError } = require('../utils/errorHandler');

/**
 * Validate request body against schema
 * @param {Object} schema - Zod schema
 * @returns {Function}
 */
function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return handleError(
          new ApiError(400, 'Validation failed', errors),
          res
        );
      }

      // Replace body with validated data
      req.body = result.data;
      next();
    } catch (error) {
      handleError(
        new ApiError(400, 'Validation error', [error.message]),
        res
      );
    }
  };
}

/**
 * Validate query parameters
 * @param {Object} schema - Zod schema
 * @returns {Function}
 */
function validateQuery(schema) {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return handleError(
          new ApiError(400, 'Query validation failed', errors),
          res
        );
      }

      req.query = result.data;
      next();
    } catch (error) {
      handleError(
        new ApiError(400, 'Query validation error', [error.message]),
        res
      );
    }
  };
}

module.exports = {
  validateRequest,
  validateQuery,
};
