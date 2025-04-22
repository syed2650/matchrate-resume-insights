
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  resumeUploader: f({ 
    "pdf": { maxFileSize: "4MB" },
    "docx": { maxFileSize: "4MB" },
    "text": { maxFileSize: "4MB" }
  })
    .middleware(async () => {
      // Add any authentication checks here if needed
      return { userId: "user_id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
