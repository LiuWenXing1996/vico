import { Gitlab } from "@gitbeaker/rest";
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

export const getGitlabCilent = () => {
  return new Gitlab({
    host: "https://gitlab.com/",
    token: "glpat-Cy6s3vafdZaZ5Aj5vzkD",
  });
};

export const genProjectCode = () => {
  return `vico-${uuidv4()}`;
};
