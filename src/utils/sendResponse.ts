import { Response } from "express";

type TMeta = {
  page: number;
  limit: number;
  total: number;
};

type TResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: TMeta;
};

const sendResponse = <T>(
  res: Response,
  payload: TResponseData<T>
): void => {
  const responseData: Record<string, unknown> = {
    success: payload.success,
    statusCode: payload.statusCode,
    message: payload.message,
  };

  if (payload.meta) {
    responseData.meta = payload.meta;
  }

  if (payload.data !== undefined) {
    responseData.data = payload.data;
  }

  res.status(payload.statusCode).json(responseData);
};

export default sendResponse;