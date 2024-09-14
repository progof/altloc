import { S3Client } from "@aws-sdk/client-s3";
import { config } from "./config.js";

export const s3 = new S3Client({
	credentials: {
		accessKeyId: config.MINIO_ACCESS_KEY,
		secretAccessKey: config.MINIO_SECRET_KEY,
	},
	endpoint: config.MINIO_ENDPOINT,
	region: config.MINIO_REGION,
	forcePathStyle: true,
});
