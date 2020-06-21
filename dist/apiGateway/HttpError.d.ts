export default class HttpError extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string);
}
