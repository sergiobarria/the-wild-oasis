# Hotel Booking System

> Full Stack Hotel Booking System using Sveltekit, Turso Database, and Drizzle ORM.

## Query Examples

Using Drizzle ORM, you can query the database using the following examples:

### Default Syntax

```javascript
const cabinsData = await db
	.select({
		id: cabins.id,
		name: cabins.name,
		slug: cabins.slug,
		maxCapacity: cabins.maxCapacity,
		price: cabins.price,
		discountPrice: cabins.discountPrice
	})
	.from(cabins)
	.orderBy(desc(cabins.createdAt), desc(cabins.name));
```

### Alternative Syntax (Query)

```javascript
const cabinsData = await db.query.cabins.findMany({
	columns: {
		id: true,
		name: true,
		maxCapacity: true,
		price: true,
		discountPrice: true
	},
	orderBy: (cabins, { desc }) => [desc(cabins.createdAt), desc(cabins.name)]
});
```

Both queries will return an array of object similar to the following example:

```javascript
[
	{
		id: 8,
		name: '008',
		maxCapacity: 10,
		price: 1400,
		discountPrice: 0
	}
	// ...other records
];
```
