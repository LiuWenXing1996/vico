import { z } from "zod";
import { CommitAction } from "@gitbeaker/rest";
import {
  ProjectModel,
  ProjectGitWebType,
  IProject,
} from "~/server/models/project";
import JSZip from "jszip";
import { filterNullable, genProjectName } from "~/utils";
import { getGitlabCilent, getGitlabTopGroupId, getPrismaClient } from "~/server/utils";
import { getZipFile } from "~/server/services/gitlab/project/getZipFile";
import { commitByZipFile } from "~/server/services/gitlab/project/commitByZipFile";

const projectCreateParamsScheam = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  templateId: z.number(),
});

export type IProjectCreateParams = z.infer<typeof projectCreateParamsScheam>;
export type IProjectCreateReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) => {
    return projectCreateParamsScheam.parse(body);
  });
  const prismaClient = getPrismaClient();
  const isProjectExist = await prismaClient.project.findUnique({
    where: {
      name: body.name,
    },
  });
  if (isProjectExist) {
    throw createError({
      statusCode: 400,
      statusMessage: `${body.name} 已存在，请输入其他的name`,
    });
  }
  console.log("尝试创建gitProject。。。");
  const gitlabCilent = getGitlabCilent();
  const groupId = getGitlabTopGroupId()
  const gitProject = await gitlabCilent.Projects.create({
    name: body.name,
    namespaceId: groupId,
  });
  console.log("创建gitProject成功！！");
  console.log("尝试获取模板。。。");
  const templateZipFile = await getZipFile({
    projectId: body.templateId,
    sha: "main",
  });
  console.log("获取模板成功。。。");
  console.log("尝试提交代码。。。");
  await commitByZipFile({
    projectId: gitProject.id,
    branchName: "main",
    message: "init by template",
    zipFile: templateZipFile,
  });
  console.log("提交代码成功。。。");
  const token = await getToken({ event });
  if (!token) {
  }
  token?.sub;
  console.log(token);
  return await prismaClient.project.create({
    data: {
      name: body.name,
      description: body.description,
      authorId: 1,
    },
  });
});
export default handler;
