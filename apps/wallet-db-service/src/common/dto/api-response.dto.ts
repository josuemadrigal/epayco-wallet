export class ApiResponseDto<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code: string;

  constructor(success: boolean, message: string, code: string, data?: T) {
    this.success = success;
    this.message = message;
    this.code = code;
    this.data = data;
  }

  static success<T>(message: string, data?: T): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, 'SUCCESS', data);
  }

  static error(message: string, code: string = 'ERROR'): ApiResponseDto {
    return new ApiResponseDto(false, message, code);
  }
}
