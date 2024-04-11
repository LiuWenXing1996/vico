import defu from "defu";
import { useRequest } from "vue-request";

export const useCustomRequest: typeof useRequest = (...rest) => {
  const message = useCustomMessage();
  let [service, options, ...r] = rest;
  options = defu(
    {
      manual: true,
      onError: (error: any) => message.anyError(error),
      debounceInterval: 300,
    },
    options
  );
  return useRequest(service, options, ...r);
};
