import type { UseFetchOptions } from "#app";
import { defu } from "defu";
import {type IApiMap } from "#typed-fecth";
// export interface IApiMap {
//   "/api/project/list": {
//     method: "get";
//     requestData: import("~/server/api/project/list.get").IParams;
//     responseData: import("~/server/api/project/list.get").IReturn;
//   };
//   "/api/project/delete": {
//     method: "post";
//     requestData: import("~/server/api/project/delete.post").IParams;
//     responseData: import("~/server/api/project/delete.post").IReturn;
//   };
// }

export type IFe<
  key extends keyof IApiMap,
  IReturn = IApiMap[key]["responseData"],
  IParams = IApiMap[key]["requestData"],
  IMethod = IApiMap[key]["method"]
> = (IMethod extends "post"
  ? {
      body: IParams;
      method: "post" | "POST";
    }
  : {
      params: IParams;
    }) &
  UseFetchOptions<IReturn>;

export interface IFetchOptions<IParams extends { [key: string]: any }, IReturn>
  extends UseFetchOptions<IReturn> {
  params?: IParams;
}

export const useCustomFetch = <IUrl extends keyof IApiMap>(
  url: IUrl,
  options: IFe<IUrl>
) => {
  const defaults: UseFetchOptions<IApiMap[IUrl]["responseData"]> = {
    onResponseError(_ctx) {
      console.log("onResponseError");
      console.log(_ctx);
    },
  };

  const params = defu(options, defaults);
  return useFetch(
    url,
    params as UseFetchOptions<IApiMap[IUrl]["responseData"]>
  );
};
