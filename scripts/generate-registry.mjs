#!/usr/bin/env node

import { globSync } from "glob";
import fs from "node:fs";
import path from "node:path";

const registryPath = "registry.json";
const basePath = "src";
const atomicCrmComponentsPath = "src/components/atomic-crm";
const supabaseComponentsPath = "src/components/supabase";
const hooksPath = "src/hooks";
const libPath = "src/lib";

const excludedHooks = [
  "filter-context.tsx",
  "saved-queries.tsx",
  "use-mobile.ts",
  "useSupportCreateSuggestion.tsx",
];

const excludedLibFiles = [
  "field.type.ts",
  "genericMemo.ts",
  "i18nProvider.ts",
  "sanitizeInputRestProps.ts",
  "utils.ts",
];

const testFilePattern = "**/*.{test,spec}.*";
const storyFilePattern = "**/*.stories.*";

const atomicCrmComponents = globSync(
  `${atomicCrmComponentsPath}/**/*.ts*`,
  { ignore: [testFilePattern, storyFilePattern] },
);
const supabaseComponents = globSync(
  `${supabaseComponentsPath}/**/*.ts*`,
  { ignore: [testFilePattern, storyFilePattern] },
);
const hooks = globSync(`${hooksPath}/**/*.ts*`).filter((hook) => {
  return !excludedHooks.includes(path.basename(hook));
});
const libFiles = globSync(`${libPath}/**/*.ts*`).filter((file) => {
  return !excludedLibFiles.includes(path.basename(file));
});
const changelogPath = "CHANGELOG.md";

const registryContent = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

const toForwardSlash = (p) => p.replace(/\\/g, "/");

const files = [
  ...atomicCrmComponents.map((p) => {
    return {
      path: toForwardSlash(p),
      type: "registry:component",
    };
  }),
  ...supabaseComponents.map((p) => {
    return {
      path: toForwardSlash(p),
      type: "registry:component",
    };
  }),
  ...hooks.map((p) => {
    return {
      path: toForwardSlash(p),
      type: "registry:hook",
    };
  }),
  ...libFiles.map((p) => {
    return {
      path: toForwardSlash(p),
      type: "registry:lib",
    };
  }),
  {
    path: changelogPath,
    type: "registry:file",
    target: "~/CHANGELOG.md",
  },
];

const newRegistryContent = {
  ...registryContent,
  items: registryContent.items.map((item) => {
    if (item.name === "atomic-crm") {
      return {
        ...item,
        files,
      };
    }

    return item;
  }),
};

fs.writeFileSync(
  registryPath,
  JSON.stringify(newRegistryContent, null, 2),
  "utf-8",
);
