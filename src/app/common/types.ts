export interface IPaginationParams {
  page?: number;
  limit?: number;
}

export interface IResponseBase {
  total: number;
  skip: number;
  limit: number;
}

export type IResponse<T, K extends string> = IResponseBase & {
  [key in K]: T[];
};
