import slugify from "slugify";

export function makeSlug(input: string) {
  return slugify(input || "item", {
    lower: true,
    strict: true,
    trim: true
  });
}
