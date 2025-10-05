/**
 * Extract user-friendly error message from various error types
 * Handles backend standardized error format
 */
export function getErrorMessage(error: unknown): string {
  // Handle null/undefined
  if (!error) {
    return 'An unknown error occurred';
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle Error objects with message
  if (error instanceof Error) {
    return error.message;
  }

  // Handle backend standardized error format
  // { success: false, status: 400, message: "...", data: null }
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;

    // Try to get message from various possible locations
    if (typeof err.message === 'string' && err.message) {
      return err.message;
    }

    // Check data.message (some endpoints might nest it)
    if (err.data && typeof err.data === 'object') {
      const data = err.data as Record<string, unknown>;
      if (typeof data.message === 'string' && data.message) {
        return data.message;
      }
    }

    // Check error property
    if (typeof err.error === 'string' && err.error) {
      return err.error;
    }
  }

  // Fallback
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Get HTTP status code from error
 */
export function getErrorStatus(error: unknown): number | null {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: unknown }).status;
    if (typeof status === 'number') {
      return status;
    }
  }
  return null;
}

/**
 * Check if error is a specific HTTP status
 */
export function isErrorStatus(error: unknown, status: number): boolean {
  return getErrorStatus(error) === status;
}

/**
 * Check if error is authentication related (401)
 */
export function isAuthError(error: unknown): boolean {
  return isErrorStatus(error, 401);
}

/**
 * Check if error is forbidden (403)
 */
export function isForbiddenError(error: unknown): boolean {
  return isErrorStatus(error, 403);
}

/**
 * Check if error is not found (404)
 */
export function isNotFoundError(error: unknown): boolean {
  return isErrorStatus(error, 404);
}

/**
 * Check if error is validation error (400)
 */
export function isValidationError(error: unknown): boolean {
  return isErrorStatus(error, 400);
}
