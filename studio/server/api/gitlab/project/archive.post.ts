import { z } from "zod";
import JSZip from "jszip";
import { getGitlabCilent } from "~/server/utils";

const gitlabProjectArchiveParamsScheam = z.object({
  projectId: z.union([z.string().min(1), z.number().positive()]),
  branchId: z.string().min(1),
});

export type IGitlabProjectArchiveParams = z.infer<
  typeof gitlabProjectArchiveParamsScheam
>;
export type IGitlabProjectArchiveReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return gitlabProjectArchiveParamsScheam.parse(data);
  });
  const gitlabCilent = getGitlabCilent();
  const projectBlob = await gitlabCilent.Repositories.showArchive(
    data.projectId,
    {
      sha: data.branchId,
      fileType: "zip",
    }
  );
  const arrayBuffer = await projectBlob.arrayBuffer();
  const zipFile = await JSZip.loadAsync(arrayBuffer, {
    createFolders: false,
  });
  const zipFilePure = new JSZip();
  await Promise.all(
    Object.keys(zipFile.files).map(async (file) => {
      const zipd = zipFile.files[file];
      if (!zipd.dir) {
        const content = await zipd.async("arraybuffer");
        const filePathSepList = file.split("/");
        const [root, ...restFilePathSepList] = filePathSepList;
        const newFilePath = restFilePathSepList.join("/");
        zipFilePure.file(newFilePath, content);
      }
    })
  );
  const a = zipFilePure.generateAsync({
    type:"blob"
  })
  return a;
});
export default handler;
