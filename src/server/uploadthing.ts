
import { generateComponents, generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "./uploadthing-router";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
export const { UploadButton, UploadDropzone, Uploader } = generateComponents<OurFileRouter>();
export type { OurFileRouter };
