import { NIcon } from "naive-ui";
import { NuxtIcon } from "#components";
import { v4 as uuidv4 } from "uuid";

export const arraify = <T>(target: T | T[]): T[] => {
  return Array.isArray(target) ? target : [target];
};

export const filterNullable = <T>(
  list: T[],
  isNullable?: (value: T) => boolean
): NonNullable<T>[] => {
  return list.filter((e) => {
    if (isNullable) {
      return isNullable(e);
    }
    return !!e;
  }) as NonNullable<T>[];
};

export const excludeObject = <T extends Object, Key extends keyof T>(
  obj: T,
  keys: Key[]
): Omit<T, Key> => {
  // @ts-ignore
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );
};

export const genProjectName = () => {
  return `vico-${uuidv4()}`;
};

export const renderIcon = (name: string) => {
  return () => h(NIcon, null, { default: () => h(NuxtIcon, { name }) });
};
