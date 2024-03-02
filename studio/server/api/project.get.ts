import { useSafeValidatedQuery } from "h3-zod";
import { ProjectModel } from "../models/project";
import zod from "zod";

export default defineEventHandler(async (event) => {
  const query = await useSafeValidatedQuery(
    event,
    zod.object({
      id: zod.string(),
    })
  );
  if (!query.success) {
    throw createError({
      statusCode: 400,
      message: query.error.toString(),
    });
  }
  const projectItem = await ProjectModel.findById(query.data.id);
  return projectItem;
});
