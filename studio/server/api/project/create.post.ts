import { z } from "zod";
import { CommitAction } from "@gitbeaker/rest";
import {
  ProjectModel,
  ProjectGitWebType,
  IProject,
} from "~/server/models/project";
import JSZip from "jszip";
import { filterNullable, genProjectCode } from "~/utils";
import { getGitlabCilent } from "~/server/utils";

const projectCreateParamsScheam = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  description: z.string().optional(),
  gitProject: z.object({
    templateId: z.union([z.string().min(1), z.number().positive()]),
    name: z.string().min(1),
  }),
});

export type IProjectCreateParams = z.infer<typeof projectCreateParamsScheam>;
export type IProjectCreateReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) => {
    return projectCreateParamsScheam.parse(body);
  });
  const { gitProject } = body;
  if (!body.code) {
    body.code = genProjectCode();
  }
  const isExist = await ProjectModel.findOne({ code: body.code });
  if (isExist) {
    throw createError({
      statusCode: 400,
      statusMessage: `${body.code} 已存在，请输入其他的code`,
    });
  }
  const gitlabCilent = getGitlabCilent();
  const templateProject = await gitlabCilent.Repositories.showArchive(
    gitProject.templateId,
    {
      fileType: "zip",
    }
  );

  const arrayBuffer = await templateProject.arrayBuffer();
  const zipFile = await JSZip.loadAsync(arrayBuffer);
  const actions: (CommitAction | undefined)[] = await Promise.all(
    Object.keys(zipFile.files).map(async (file) => {
      const zipd = zipFile.files[file];
      if (!zipd.dir) {
        const content = await zipd.async("base64");
        const filePathSepList = file.split("/");
        const [root, ...restFilePathSepList] = filePathSepList;
        const newFilePath = restFilePathSepList.join("/");
        return {
          action: "create",
          filePath: newFilePath,
          content,
          encoding: "base64",
        };
      }
    })
  );
  const project = await gitlabCilent.Projects.create({
    name: gitProject.name,
  });
  await gitlabCilent.Commits.create(project.id, "main", "init by template", [
    ...filterNullable(actions),
  ]);

  const projectItem = await ProjectModel.create<IProject>({
    name: body.name,
    code: body.code,
    git: {
      url: project.web_url,
      projectId: project.id,
      webType: ProjectGitWebType.GitLab,
    },
    description: body.description,
  });
  return await projectItem.save();
});
export default handler;
