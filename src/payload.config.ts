import { postgresAdapter } from '@payloadcms/db-postgres';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { Bookings, Cabins, Guests, Media, Settings, Users } from './collections';
import { env } from './env';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	secret: env.PAYLOAD_SECRET || '',
	db: postgresAdapter({
		pool: { connectionString: env.DATABASE_URI || '' },
	}),
	admin: {
		components: {
			beforeDashboard: ['@/components/payload/before-dashboard'],
			afterDashboard: ['@/components/payload/after-dashboard'],
		},
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [Bookings, Cabins, Guests, Media, Settings, Users],
	editor: lexicalEditor(),
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	sharp,
	plugins: [
		payloadCloudPlugin(),
		s3Storage({
			collections: {
				media: true,
			},
			bucket: env.R2_BUCKET,
			config: {
				credentials: {
					accessKeyId: env.R2_ACCESS_KEY_ID,
					secretAccessKey: env.R2_SECRET_ACCESS_KEY,
				},
				region: env.R2_REGION,
				endpoint: env.R2_ENDPOINT,
			},
		}),
	],
});
