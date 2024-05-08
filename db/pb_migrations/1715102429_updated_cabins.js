/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('3ebj97j1854phkn');

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'ahrzpncy',
				name: 'discount_price',
				type: 'number',
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: null,
					max: null,
					noDecimal: true
				}
			})
		);

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('3ebj97j1854phkn');

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'ahrzpncy',
				name: 'discount_price',
				type: 'number',
				required: true,
				presentable: false,
				unique: false,
				options: {
					min: null,
					max: null,
					noDecimal: true
				}
			})
		);

		return dao.saveCollection(collection);
	}
);
