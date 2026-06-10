import { db } from "@/db";
import { files } from "@/db/schema";
import { createUploadthing, FileRouter } from "uploadthing/next";
import {z} from 'zod'

const f = createUploadthing()

export const ourFileRouter = {
    projectAssets: f({ 
        pdf: {maxFileSize: '16MB'}, 
        image: {maxFileSize: '16MB'}, 
        video: {maxFileSize: '64MB'} 
    })
    .input(z.object({projectId: z.string()}))
    .middleware(async ({input}) => {
        return {projectId: input.projectId}
    })
    .onUploadComplete(async ({ metadata, file }) => {
        await db.insert(files).values({
            projectId: metadata.projectId,
            fileUrl: file.ufsUrl,
            fileName: file.name
        })
        return { url: file.ufsUrl }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter