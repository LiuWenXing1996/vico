import { z } from "zod";

const paramsScheam = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  templateOwner: z.string().min(1),
  templateRepo: z.string().min(1),
  templateBranch: z.string().min(1),
});

export type IParams = z.infer<typeof paramsScheam>;
export type IReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const githubClient = await useGithubClient(event);

  const res = await githubClient.repoCreateFormTemplate({
    templateOwner: data.templateOwner,
    templateRepo: data.templateRepo,
    templateBranch: data.templateBranch,
    name: data.name,
    description: data.description,
  });
  return res;
});
export default handler;
