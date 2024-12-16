import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Spellcaster™ worker', () => {
	it('responds with failed login', async () => {
		const request = new Request('http://localhost:8787/auth-status');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.json()).toMatchObject({ error: 'Secret key must be provided.', status: 500 });
	});

	it('responds with failed login (integration style)', async () => {
		const response = await SELF.fetch('http://localhost:8787/auth-status');
		expect(await response.json()).toMatchObject({ error: 'Secret key must be provided.', status: 500 });
	});
});
