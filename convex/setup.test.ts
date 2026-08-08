import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';

/**
 * Smoke test proving the in-memory Convex harness boots under the edge runtime.
 * Replace this with real function tests once `convex/schema.ts` and the first
 * query/mutation exist:
 *
 *   const t = convexTest(schema);
 *   await t.mutation(api.cabins.create, { name: 'Cabin 001' });
 *   expect(await t.query(api.cabins.list)).toMatchObject([{ name: 'Cabin 001' }]);
 *
 * Cover auth with `t.withIdentity({ subject: 'user_1' })` and scheduled work
 * with `t.finishInProgressScheduledFunctions()`.
 */
test('in-memory backend reads back what it writes', async () => {
    const t = convexTest();

    const id = await t.run(async (ctx) => ctx.db.insert('cabins', { name: 'Cabin 001' }));
    const cabin = await t.run(async (ctx) => ctx.db.get(id));

    expect(cabin).toMatchObject({ name: 'Cabin 001' });
});
