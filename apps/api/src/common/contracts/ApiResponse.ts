/**
 * Generic API Response wrapper for all API endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
}

/**
 * Error details in API response
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
