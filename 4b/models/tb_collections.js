"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class tb_collections extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			tb_collections.belongsTo(models.tb_users, {
				foreignKey: "user_id",
				as: "user",
				onDelete: "SET NULL",
				onUpdate: "CASCADE",
			});
			tb_collections.hasMany(models.tb_task, {
				foreignKey: "collections_id",
				as: "tasks",
			});
		}
	}
	tb_collections.init(
		{
			name: DataTypes.STRING,
			user_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "tb_collections",
		}
	);
	return tb_collections;
};
