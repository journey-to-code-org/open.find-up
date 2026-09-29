import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { findUp } from "../src/index.js";

test("finds a parent file", async () => {
  const root = await mkdtemp(path.join(tmpdir(),"find-up-"));
  try {
    await writeFile(path.join(root,"package.json"),"{}");
    const nested = path.join(root,"a","b");
    await mkdir(nested,{recursive:true});
    assert.equal(await findUp("package.json",{cwd:nested}),path.join(root,"package.json"));
  } finally { await rm(root,{recursive:true,force:true}); }
});

test("returns null", async () => {
  const root = await mkdtemp(path.join(tmpdir(),"find-up-"));
  try { assert.equal(await findUp("missing.file",{cwd:root,stopAt:root}),null); }
  finally { await rm(root,{recursive:true,force:true}); }
});
