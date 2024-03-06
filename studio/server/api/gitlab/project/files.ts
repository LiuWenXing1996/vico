import { z } from "zod";
import { CommitAction } from "@gitbeaker/rest";
import JSZip from "jszip";
import { filterNullable, genProjectCode } from "~/utils";
import { getGitlabCilent } from "~/server/utils";

const gitlabProjectFilesParamsScheam = z.object({
  projectId: z.union([z.string().min(1), z.number().positive()]),
  branchId: z.string().min(1),
});

export type IGitlabProjectFilesParams = z.infer<
  typeof gitlabProjectFilesParamsScheam
>;
export type IGitlabProjectFilesReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (query) => {
    return gitlabProjectFilesParamsScheam.parse(query);
  });
  const gitlabCilent = getGitlabCilent();
  const projectBlob = await gitlabCilent.Repositories.showArchive(
    query.projectId,
    {
      sha: query.branchId,
      fileType: "zip",
    }
  );
  // TODO:剥离一层root
  const arrayBuffer = await projectBlob.arrayBuffer();
  const zipFile = await JSZip.loadAsync(arrayBuffer, {
    createFolders: false,
  });
  
  const stream = zipFile.generateNodeStream() as unknown as ReadableStream;
  return sendStream(event, stream);
});
export default handler;
