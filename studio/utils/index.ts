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

export const genProjectCode = () => {
  return `vico-${uuidv4()}`;
};