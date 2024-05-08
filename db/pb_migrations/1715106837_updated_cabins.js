/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('3ebj97j1854phkn');

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: '8fnask7p',
				name: 'images',
				type: 'file',
				required: false,
				presentable: false,
				unique: false,
				options: {
					mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
					thumbs: ['50x50', '100x100'],
					maxSelect: 5,
					maxSize: 5242880,
					protected: false
				}
			})
		);

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('3ebj97j1854phkn');

		// remove
		collection.schema.removeField('8fnask7p');

		return dao.saveCollection(collection);
	}
);
