import { REDIS_URL } from '$env/static/private';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const QUEUE_NAME = 'send-email';

const redisConnection = new IORedis(REDIS_URL, {
	maxRetriesPerRequest: null
});

export const emailQueue = new Queue(QUEUE_NAME, {
	connection: redisConnection
});

export interface EmailJobData {
	to: string;
	subject: string;
	body: string;
	from?: string;
}

// Worker to process the email queue
export const createEmailWorker = () => {
	return new Worker(
		QUEUE_NAME,
		async (job) => {
			const { to, subject, body, from } = job.data as EmailJobData;

			// TODO: trigger email sending function here...👇
			console.log('📩 Sending email:', { to, subject, body, from });
			await new Promise((resolve) => setTimeout(resolve, 3000));

			await job.log(`Email sent to ${to} with subject ${subject}`);
			await job.updateProgress(100);

			return {
				success: true,
				sentAt: new Date().toISOString(),
				to
			};
		},
		{
			connection: redisConnection,
			concurrency: 5 // Process up to 5 emails concurrently
		}
	);
};

export const addEmailToQueue = async (data: EmailJobData) => {
	return await emailQueue.add('send-email', data, {
		attempts: 3,
		backoff: {
			type: 'exponential',
			delay: 2000
		}
	});
};
