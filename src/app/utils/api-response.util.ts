export interface ApiResponse<T> {
  content: T | null;
  title : string;
  message: string;
  success: boolean;
  code: string;
  errors?: string[];
}

export class ApiResponseUtil {

    static ok<T>(data: T, title : string, message : string, success =true, code = 'success'): ApiResponse<T> {
        return {
        content: data,
        title,
        message,
        success,
        code,
        };
    }

    static error<T>(
    title : string,
    message : string,
    code : string,
    success = false,
    errors: string[] = [],
    ): ApiResponse<T> {
        return {
        content: null,
        title,
        message,
        success,
        code,
        errors,
        };
    }

}