import { useValidatedBody } from "h3-zod";
import { ProjectModel } from "../models/project";
import zod from "zod";
import { useFetch } from "nuxt/app";
import { ProjectSchema } from "@gitbeaker/rest";

export default defineEventHandler(async (event) => {
  const body = await useValidatedBody(
    event,
    zod.object({
      id: zod.string().optional(),
      detail: zod.object({
        name: zod.string().optional(),
        description: zod.string().optional(),
        url: zod.string().optional(),
      }),
    })
  );

  if (body.id) {
    return await ProjectModel.findOneAndUpdate(
      {
        _id: body.id,
      },
      {
        ...body.detail,
      }
    );
  }
  if (!body.detail.url) {
    const time = Date.now();
    const a = await $fetch<ProjectSchema>("/api/gitProjectCreate", {
      method: "post",
      body: {
        name: `test-${time}`,
        path: `test-${time}`,
      },
    });
    // console.log("ProjectSchema", a);
    body.detail.url = a.web_url;
  }
  const projectItem = await ProjectModel.create({ ...body.detail });
  return await projectItem.save();
});
