import { defineComponent } from 'convex/server';

// Marks `convex/betterAuth` as a locally installed Convex component. The local
// install (rather than the NPM component) is what lets us own the generated
// schema and extend the Better Auth instance freely.
const component = defineComponent('betterAuth');

export default component;
