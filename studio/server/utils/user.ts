import type { H3Event, EventHandlerRequest } from "h3";

export interface IEventContextUserData {
  id: number;
}

export const resolveUserDataFromEvent = (
  event: H3Event<EventHandlerRequest>
) => {
  const data = event.context.user;
  const _data = JSON.parse(JSON.stringify(data));
  return _data as IEventContextUserData | undefined;
};

export const setUserDataToEvent = (
  event: H3Event<EventHandlerRequest>,
  data: IEventContextUserData | undefined
) => {
  const _data = JSON.parse(JSON.stringify(data));
  event.context.user = { ..._data };
};

export const resolveCurrentUserFromEvent = async (
  event: H3Event<EventHandlerRequest>
) => {
  const userId = resolveUserDataFromEvent(event)?.id;
  const prismaClient = getPrismaClient();
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};

export const resolveUserSecretConfigFromEvent = async (
  event: H3Event<EventHandlerRequest>
) => {
  const userId = resolveUserDataFromEvent(event)?.id;
  const prismaClient = getPrismaClient();
  const userSecretConfig = await prismaClient.userSecretConfig.findUnique({
    where: {
      id: userId,
    },
  });
  return userSecretConfig;
};
