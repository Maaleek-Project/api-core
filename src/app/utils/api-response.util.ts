export interface ApiResponse<T> {
  content: T | null;
  message: string;
  success: boolean;
  code: string;
  errors?: string[];
}

export class ApiResponseUtil {

    static ok<T>(data: T, message : string, success =true, code = 'success'): ApiResponse<T> {
        return {
        content: data,
        message,
        success,
        code,
        };
    }

    static error<T>(
    message : string,
    code : string,
    success = false,
    errors: string[] = [],
    ): ApiResponse<T> {
        return {
        content: null,
        message,
        success,
        code,
        errors,
        };
    }

}