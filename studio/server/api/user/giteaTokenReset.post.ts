import { z } from "zod";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";

const paramsScheam = z.object({});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const auth = createOAuthDeviceAuth({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    scopes: ["public_repo"],
    onVerification(verification) {
      // verification example
      // {
      //   device_code: "3584d83530557fdd1f46af8289938c8ef79f9dc5",
      //   user_code: "WDJB-MJHT",
      //   verification_uri: "https://github.com/login/device",
      //   expires_in: 900,
      //   interval: 5,
      // };

      console.log("Open %s", verification.verification_uri);
      console.log("Enter code: %s", verification.user_code);
    },
  });

  const tokenAuthentication = await auth({
    type: "oauth",
  });
});

export default handler;
