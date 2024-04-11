import { type FormValidationError, type MessageProviderInst } from "naive-ui";

export const useCustomMessage = () => {
  const message = useMessage();
  type ErrorMessageParams = Parameters<MessageProviderInst["error"]>;
  const anyError = (
    error: Error | FormValidationError | FormValidationError[],
    options?: ErrorMessageParams[1]
  ) => {
    let content: ErrorMessageParams[0] = "";
    if (Array.isArray(error)) {
      const list: string[] = [];
      error.map((es) => {
        if (Array.isArray(es)) {
          es.map((e) => {
            list.push(e.message || "");
          });
        } else {
          list.push(es.message || "");
        }
      });
      content = list.filter((e) => e).join(" ; ");
    } else {
      content = error.message || "";
    }
    return message.error(content, options);
  };
  return {
    ...message,
    anyError,
  };
};
