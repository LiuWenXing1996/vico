import type { UseFetchOptions } from "#app";
import { defu } from "defu";

export interface IApiMap {
  "/api/project/list": {
    requestData: import("~/server/api/project/list.get").IParams;
    responseData: import("~/server/api/project/list.get").IReturn;
  };
}

export interface IFetchOptions<IParams extends { [key: string]: any }, IReturn>
  extends UseFetchOptions<IReturn> {
  params?: IParams;
}

export const useCustomFetch = <IUrl extends keyof IApiMap>(
  url: IUrl,
  options: IFetchOptions<
    IApiMap[IUrl]["requestData"],
    IApiMap[IUrl]["responseData"]
  > = {}
) => {
  const defaults: UseFetchOptions<IApiMap[IUrl]["responseData"]> = {
    onResponseError(_ctx) {
      console.log(_ctx);
    },
  };

  const params = defu(options, defaults);
  return useFetch(
    url,
    params as UseFetchOptions<IApiMap[IUrl]["responseData"]>
  );
};
