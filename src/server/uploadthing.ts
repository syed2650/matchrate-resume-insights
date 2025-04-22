
import { generateReactHelpers } from "@uploadthing/react/hooks";
import type { OurFileRouter } from "./uploadthing-router";

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
