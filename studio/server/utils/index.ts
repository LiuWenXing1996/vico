import { Gitlab } from "@gitbeaker/rest";

export const getGitlabCilent = () => {
  return new Gitlab({
    host: "https://gitlab.com/",
    token: process.env.GITLAB_TOKEN || "",
  });
};
