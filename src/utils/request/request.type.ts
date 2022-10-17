export type ResponseSuccess<T> = {
  success: true;
  data: T;
}

export type ResponseError = {
  success: false;
}

export type Response<T> = ResponseSuccess<T> | ResponseError;