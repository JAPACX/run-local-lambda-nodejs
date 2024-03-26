import { Model, DataTypes } from "sequelize";
import db from "../config.js";

export default class OrderStatusLog extends Model {}

OrderStatusLog.init(
  {
    idOrderStatusLog: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comments: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "OrderStatusLog",
    tableName: "orderStatusLog",
    timestamps: false,
  }
);
