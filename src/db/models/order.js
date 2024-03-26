import { Model, DataTypes } from "sequelize";
import db from "../config.js";
export default class Order extends Model {}

Order.init(
  {
    idOrder: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idCustomer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idBussiness: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    idWarehouse: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    warehouse: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isTest: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    originAddress: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    billingAddress: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    package: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    idProvider: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idBussinessProvider: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isDropshipping: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    paymentMethod: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    shippingRate: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    totalProvider: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    totalSeller: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    shippingRateQuoted: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    idCarrier: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    carrierTrackingCode: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    externalOrderId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    carrierTracking: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    idTransaction: {
      type: DataTypes.STRING(65),
      allowNull: true,
    },
    idConfirmationStatus: {
      type: DataTypes.INTEGER,
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
    modelName: "Order",
    tableName: "order",
    timestamps: false,
  }
);
