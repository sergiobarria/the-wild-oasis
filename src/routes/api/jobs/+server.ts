import { jobsQueue } from '$lib/server/jobs';

export const POST = async () => {
	const { id: jobId } = await jobsQueue.add('job', {});

	const stream = new ReadableStream({
		async pull(controller) {
			try {
				const job = await jobsQueue.getJob(jobId as string);
				if (!job) {
					controller.close();
					return;
				}

				let message;

				if (job.failedReason) {
					message = { error: job.failedReason };
				} else if (job.returnvalue) {
					message = { data: job.returnvalue };
				} else {
					message = { progress: job.progress || 0 };
				}

				controller.enqueue(new TextEncoder().encode(JSON.stringify(message) + '\n'));

				if (job.finishedOn || job.failedReason) {
					controller.close();
					return;
				}

				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch (error) {
				controller.error(error);
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache'
		}
	});
};
