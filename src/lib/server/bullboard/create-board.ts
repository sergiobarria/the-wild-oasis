import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { HonoAdapter } from '@bull-board/hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { emailQueue } from '../queues/email-queue';

function createAppBullBoard() {
	const serverAdapter = new HonoAdapter(serveStatic);

	createBullBoard({
		queues: [new BullMQAdapter(emailQueue)],
		serverAdapter
	});

	const app = new Hono({ strict: false });
	const basePath = '/jobs';

	serverAdapter.setBasePath(basePath);
	app.route(basePath, serverAdapter.registerPlugin());

	return app;
}

export const bullboard = createAppBullBoard();
