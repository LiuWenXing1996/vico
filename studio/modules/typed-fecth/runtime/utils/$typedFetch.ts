import { type IApiMap } from "#typed-fecth";
import { type NitroFetchOptions } from "nitropack";

export type ITypedFetchParams<
  key extends keyof IApiMap,
  IParams = IApiMap[key]["requestData"]
> = IParams extends undefined | null
  ? [url: key, options?: ITypedFetchOptions<key>]
  : [url: key, options: ITypedFetchOptions<key>];

export type ITypedFetchOptions<
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
  NitroFetchOptions<IApiMap[key]["responseData"]>;

export const $typedFetch = <IUrl extends keyof IApiMap>(
  ...rest: ITypedFetchParams<IUrl>
) => {
  // @ts-ignore
  return $fetch<IApiMap[IUrl]["responseData"] | undefined>(...rest);
};
