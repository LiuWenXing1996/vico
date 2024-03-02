<template>
  <div>fsfs</div>
  <CodeFileTree />
</template>
<script setup lang="ts">
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import FS from "@isomorphic-git/lightning-fs";
import * as C from "@vico/core";

const fs = new FS("test");
const dir = "/tutorial";

await git.clone({
  fs,
  http,
  dir,
  corsProxy: "https://cors.isomorphic-git.org",
  url: "https://github.com/isomorphic-git/isomorphic-git",
  ref: "main",
  singleBranch: true,
  depth: 10,
});

fs.readdir(dir, undefined, (erro, files) => {
  console.log(files);
});
</script>
