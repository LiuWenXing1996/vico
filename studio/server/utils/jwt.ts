import jwt from "jsonwebtoken";
import { getJwtTokenSecret } from ".";
import type { H3Event, EventHandlerRequest } from "h3";

export interface IJwtPayload {
  id: number;
  name: string;
}

export const access_token_name = "access_token";

export const jwtSign = (
  event: H3Event<EventHandlerRequest>,
  payload: IJwtPayload
) => {
  const maxAge = 60 * 60 * 24 * 7;
  const expires = Math.floor(Date.now() / 1000) + maxAge;
  const jwtToken = jwt.sign(
    {
      data: {
        id: payload.id,
        name: payload.name,
      },
      exp: expires,
    },
    getJwtTokenSecret()
  );
  setCookie(event, access_token_name, jwtToken, {
    httpOnly: true,
    maxAge,
    expires: new Date(expires * 1000),
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
};

export const jwtVerify = (event: H3Event<EventHandlerRequest>) => {
  const jwtToken = getCookie(event, access_token_name);
  if (jwtToken) {
    const payload = jwt.verify(jwtToken, getJwtTokenSecret());
    if (payload) {
      return (payload as any).data as IJwtPayload;
    }
  }
};
