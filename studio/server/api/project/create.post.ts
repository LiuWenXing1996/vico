import { z } from "zod";
import {} from "isomorphic-git";
import { useGithubClient } from "~/server/utils/github-client";

const paramsScheam = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  templateOwner: z.string().min(1),
  templateRepo: z.string().min(1),
});

export type IParams = z.infer<typeof paramsScheam>;
export type IReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const githubClient = await useGithubClient(event);
  const zipFile = await githubClient.getRepoZipFile({
    owner: data.templateOwner,
    repo: data.templateRepo,
    branch: "main",
  });
  const repoDetail = await githubClient.createRepo({
    name: data.name,
    description: data.description,
  });
  const updateRepoRes =  await githubClient.updateRepo({
    owner: repoDetail.owner.login,
    repo: repoDetail.name,
    branch: "main",
    message: "init by template",
    zipFile,
  });
  return updateRepoRes
});
export default handler;
