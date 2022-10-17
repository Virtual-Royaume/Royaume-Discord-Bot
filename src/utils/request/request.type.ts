export type ResponseSuccess<T> = {
  success: true;
  data: T;
}

export type ResponseError = {
  success: false;
  data: null; // TODO : remove this
}

export type Response<T> = ResponseSuccess<T> | ResponseError;