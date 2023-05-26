interface IResponse<T> {
  code: number;
  message: string | unknown;
  data?: T;
}

export default IResponse;
