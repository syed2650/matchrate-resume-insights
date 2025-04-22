
// Import UploadThing React components
import {
  UploadButton,
  UploadDropzone,
  Uploader,
} from "@uploadthing/react";

// Import the type definition for your file router
import type { OurFileRouter } from "./uploadthing-router";

// Export the components with the correct type
export { 
  UploadButton, 
  UploadDropzone, 
  Uploader 
};

// Re-export type if needed in component files
export type { OurFileRouter };
