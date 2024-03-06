import { z } from "zod";
import { ProjectModel } from "~/server/models/project";

const projectDeleteParamsScheam = z.object({
  code: z.string().min(1),
});

export type IProjectDeleteParams = z.infer<typeof projectDeleteParamsScheam>;
export type IProjectDeleteReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) => {
    return projectDeleteParamsScheam.parse(body);
  });

  return await ProjectModel.deleteMany({
    code: body.code,
  });
});

export default handler;
