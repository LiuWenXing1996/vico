import * as __h3__ from "h3";
type H3Event = __h3__.H3Event;
// type InferEventInput = __h3__.InferEventInput;
export const readValidateBody = async <
  T,
  Event extends __h3__.H3Event = __h3__.H3Event,
  _T = __h3__.InferEventInput<"body", Event, T>
>(event: Event, validate: __h3__.ValidateFunction<_T>): Promise<_T> => {
    const _body = await readBody(event, { strict: true });
    return validateData(_body, validate);
};
