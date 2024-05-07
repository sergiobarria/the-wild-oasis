/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('3ebj97j1854phkn');

		// remove
		collection.schema.removeField('li5rtelx');

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: '9t7cd5rg',
				name: 'description',
				type: 'text',
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ''
				}
			})
		);

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('3ebj97j1854phkn');

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'li5rtelx',
				name: 'description',
				type: 'editor',
				required: true,
				presentable: false,
				unique: false,
				options: {
					convertUrls: false
				}
			})
		);

		// remove
		collection.schema.removeField('9t7cd5rg');

		return dao.saveCollection(collection);
	}
);
