"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class tb_task extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			tb_task.belongsTo(models.tb_collections, {
				foreignKey: "collections_id",
				as: "collection",
				onDelete: "SET NULL",
				onUpdate: "CASCADE",
			});
		}
	}
	tb_task.init(
		{
			name: DataTypes.STRING,
			is_done: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			status: DataTypes.STRING,
			collections_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "tb_task",
		}
	);
	return tb_task;
};
