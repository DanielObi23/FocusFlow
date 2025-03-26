import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from "dotenv"
import crypto from "crypto"
import { promisify } from "util"

dotenv.config()
const region = process.env.AWS_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

export const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
})

const randomBytes = promisify(crypto.randomBytes)

export async function generateUploadURL() {
    const bytes = await randomBytes(16); // Await the random bytes
    const imageName = bytes.toString('hex'); // Convert to hex string
    
    const params = {
        Bucket: bucketName,
        Key: imageName,
    }

    const command = new PutObjectCommand(params)
    
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 300 })
    return uploadURL
}