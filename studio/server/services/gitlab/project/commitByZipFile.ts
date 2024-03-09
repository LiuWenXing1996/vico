import type { CommitAction } from "@gitbeaker/rest";
import JSZip from "jszip";
import { filterNullable } from "~/utils";

export const commitByZipFile = async (params: {
  projectId: string | number;
  branchName: string;
  message: string;
  zipFile: JSZip;
}) => {
  const { projectId, branchName, message, zipFile } = params;
  const gitlabCilent = getGitlabCilent();
  const actions: (CommitAction | undefined)[] = await Promise.all(
    Object.keys(zipFile.files).map(async (file) => {
      const zipd = zipFile.files[file];
      if (!zipd.dir) {
        const content = await zipd.async("base64");
        return {
          action: "create",
          filePath: file,
          content,
          encoding: "base64",
        };
      }
    })
  );
  return await gitlabCilent.Commits.create(projectId, branchName, message, [
    ...filterNullable(actions),
  ]);
};
