/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('3ebj97j1854phkn');

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: '8fnask7p',
				name: 'image',
				type: 'file',
				required: false,
				presentable: false,
				unique: false,
				options: {
					mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
					thumbs: ['50x50', '100x100', '100x75'],
					maxSelect: 1,
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

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: '8fnask7p',
				name: 'image',
				type: 'file',
				required: false,
				presentable: false,
				unique: false,
				options: {
					mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
					thumbs: ['50x50', '100x100'],
					maxSelect: 1,
					maxSize: 5242880,
					protected: false
				}
			})
		);

		return dao.saveCollection(collection);
	}
);
