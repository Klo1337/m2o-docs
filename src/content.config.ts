import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

const routeId = ({ entry }: { entry: string }): string => {
  const normalized = entry.replaceAll("\\", "/").replace(/\.md$/i, "");
  if (normalized === "preview/index") return "index";
  if (normalized.startsWith("guides/server/")) return `guides/${normalized.slice("guides/server/".length)}`;
  if (normalized.startsWith("guides/")) return normalized;
  throw new Error(`Unsupported preview document: ${entry}`);
};

export const collections = {
  docs: defineCollection({
    loader: glob({
      base: ".",
      pattern: ["preview/index.md", "guides/**/*.md"],
      generateId: routeId,
    }),
    schema: docsSchema(),
  }),
};
