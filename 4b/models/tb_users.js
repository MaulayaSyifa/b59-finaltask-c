"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class tb_users extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			tb_users.hasMany(models.tb_collections, {
				foreignKey: "user_id",
				as: "collections",
			});
		}
	}
	tb_users.init(
		{
			username: DataTypes.STRING,
			password: DataTypes.STRING,
			email: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "tb_users",
		}
	);
	return tb_users;
};
