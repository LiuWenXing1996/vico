import { useSafeValidatedQuery } from "h3-zod";
import { ProjectModel } from "../models/project";
import zod from "zod";

export default defineEventHandler(async (event) => {
  const query = await useSafeValidatedQuery(
    event,
    zod.object({
      key: zod.string().optional(),
    })
  );
  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: JSON.stringify(query.error.errors),
    });
  }
  if(query.data.key){
    return await ProjectModel.find().where("name").regex(query.data.key);
  }
  return await ProjectModel.find();
});
