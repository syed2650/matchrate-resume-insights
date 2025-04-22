
// The generateComponents function doesn't exist in @uploadthing/react
// Let's use the direct component imports instead

import { useUploadThing, uploadFiles } from "@uploadthing/react";
import { UploadButton, UploadDropzone, Uploader } from "@uploadthing/react";
import type { OurFileRouter } from "./uploadthing-router";

export { useUploadThing, uploadFiles, UploadButton, UploadDropzone, Uploader };
export type { OurFileRouter };
