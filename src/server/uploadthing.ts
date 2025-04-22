
// Import UploadThing React components
import {
  UploadButton as BaseUploadButton,
  UploadDropzone as BaseUploadDropzone,
  Uploader as BaseUploader,
} from "@uploadthing/react";

// Import the type definition for your file router
import type { OurFileRouter } from "./uploadthing-router";

// Re-export components with generics already applied
export const UploadButton = BaseUploadButton<OurFileRouter>;
export const UploadDropzone = BaseUploadDropzone<OurFileRouter>;
export const Uploader = BaseUploader<OurFileRouter>;

// Re-export type if needed in component files
export type { OurFileRouter };
