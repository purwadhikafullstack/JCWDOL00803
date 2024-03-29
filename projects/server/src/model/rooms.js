const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const PropertiesModel = require("./properties");
const SpecialPricesModel = require("./specialprices");
const { DataTypes } = Sequelize;

const RoomsModel = dbSequelize.define(
  "rooms",
  {
    id_room: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_property: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING(1000),
    },
    picture: {
      type: DataTypes.STRING,
    },
    basePrice: {
      type: DataTypes.DOUBLE,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  }
);

RoomsModel.belongsTo(PropertiesModel,{foreignKey:"id_property"})
PropertiesModel.hasMany(RoomsModel,{foreignKey:"id_property",as:"listrooms"})
PropertiesModel.belongsTo(RoomsModel,{foreignKey:"id_property",as:"available"})

RoomsModel.hasMany(SpecialPricesModel,{foreignKey:"id_room",as:"sprice"})
module.exports = RoomsModel;
