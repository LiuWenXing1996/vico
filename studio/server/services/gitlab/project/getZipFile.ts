import JSZip from "jszip";

export const getZipFile = async (params: {
  projectId: string | number;
  sha: string;
}) => {
  const { projectId, sha } = params;
  const gitlabCilent = getGitlabCilent();
  const projectBlob = await gitlabCilent.Repositories.showArchive(projectId, {
    sha: sha,
    fileType: "zip",
  });
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
  return zipFilePure;
};
