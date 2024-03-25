import type { UseFetchOptions } from "#app";
import { type IApiMap } from "#typed-fecth";

export type IUseTypedFetchParams<
  key extends keyof IApiMap,
  IParams = IApiMap[key]["requestData"]
> = IParams extends undefined | null
  ? [url: key]
  : [url: key, options: IUseTypedFetchOptions<key>];

export type IUseTypedFetchOptions<
  key extends keyof IApiMap,
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
  UseFetchOptions<IApiMap[key]["responseData"]>;

export const useTypedFetch = <IUrl extends keyof IApiMap>(
  ...rest: IUseTypedFetchParams<IUrl>
) => {
  // @ts-ignore
  return useFetch<IApiMap[IUrl]["responseData"]>(...rest);
};
