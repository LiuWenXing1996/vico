import type { UseFetchOptions } from "#app";
import { defu } from "defu";
import { type IApiMap } from "#typed-fecth";
// export interface IApiMap {
//   "/api/project/list": {
//     method: "get";
//     requestData: import("~/server/api/project/list.get").Params;
//     responseData: import("~/server/api/project/list.get").Return;
//   };
//   "/api/project/delete": {
//     method: "post";
//     requestData: import("~/server/api/project/delete.post").Params;
//     responseData: import("~/server/api/project/delete.post").Return;
//   };
// }

export type IFe<
  key extends keyof IApiMap,
  Return = IApiMap[key]["responseData"],
  Params = IApiMap[key]["requestData"],
  IMethod = IApiMap[key]["method"]
> = (IMethod extends "post"
  ? {
      body: Params;
      method: "post" | "POST";
    }
  : {
      params: Params;
    }) &
  UseFetchOptions<Return>;

export interface IFetchOptions<Params extends { [key: string]: any }, Return>
  extends UseFetchOptions<Return> {
  params?: Params;
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
