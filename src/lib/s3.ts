import { S3Client } from "@aws-sdk/client-s3"
import { getRequiredEnv } from "@/lib/env"

export const S3_BUCKET = "ogc-general-web"
export const S3_PREFIX = "jounralofoli"

const region = getRequiredEnv("AWS_REGION")

export const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID"),
        secretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY"),
    },
})

const publicBaseUrl = process.env.AWS_S3_PUBLIC_URL?.trim()
export const S3_CDN_URL = publicBaseUrl || `https://${S3_BUCKET}.s3.${region}.amazonaws.com`
