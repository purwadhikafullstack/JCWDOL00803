const PropertiesModel = require("../model/properties");
const CitiesModel = require("../model/cities");
const { Op } = require("sequelize");
const RoomsModel = require("../model/rooms");
const { dbSequelize } = require("../config/db");

module.exports = {
  getPropertiesData: async (req, res) => {
    try {
      let data = await PropertiesModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  addProperty: async (req, res) => {
    try {
      let { name, address, id_city, description, rules } = req.body;
      let create = await PropertiesModel.create({
        name,
        address,
        id_city,
        picture: `/imgProperty/${req.file.filename}`,
        description,
        rules,
        createdBy: req.decript.id_user,
      });
      res.status(200).send({
        success: true,
        message: "Add Property Success",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  getProperty: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = 5;
      const offset = limit * page;
      const keyword = req.query.keyword || "";
      const sort = req.query.sort || "id_property";
      const order = req.query.order || "ASC";
      let data = await PropertiesModel.findAndCountAll({
        include: {
          model: CitiesModel,
          as: "city",
        },
        limit,
        offset,
        where: {
          createdBy: req.decript.id_user,
          status: 1,
          [Op.or]: [
            {
              name: {
                [Op.like]: "%" + keyword + "%",
              },
            },
            {
              address: {
                [Op.like]: "%" + keyword + "%",
              },
            },
            {
              "$city.name$": {
                [Op.like]: "%" + keyword + "%",
              },
            },
          ],
        },
        order: [[sort, order]],
      });
      return res
        .status(200)
        .send({ ...data, totalPage: Math.ceil(data.count / limit) });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getPropertyDetail: async (req, res) => {
    try {
      const id_property = req.query.property;
      let data = await PropertiesModel.findAll({
        include: {
          model: CitiesModel,
          as: "city",
        },
        where: {
          createdBy: req.decript.id_user,
          status: 1,
          id_property,
        },
      });
      return res.status(200).send(data[0]);
    } catch (error) {
      console.log(error);
      return res.statu(500).send(error);
    }
  },
  editProperty: async (req, res) => {
    try {
      let { id_property, name, address, id_city, description, rules, room } = req.body;
      let update = await PropertiesModel.update(
        {
          name,
          address,
          id_city,
          picture: `/imgProperty/${req.file.filename}`,
          description,
          rules,
          room,
        },
        {
          where: {
            id_property,
          },
        }
      );
      return res.status(200).send({
        success: true,
        message: "Edit Property Success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  deleteProperty: async (req, res) => {
    try {
      let update = await PropertiesModel.update(
        {
          status: 0,
        },
        {
          where: {
            id_property: req.body.id_property,
          },
        }
      );
      return res.status(200).send({
        success: true,
        message: "Delete Property Success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getLandingProperty: async (req, res) => {
    try {
      let page = req.query.page || 0;
      const limit = 16;
      const offset = limit * page;
      let propertyData = await PropertiesModel.findAll({});
      let data = await PropertiesModel.findAll({
        include: [
          { model: CitiesModel, as: "city" },
          { model: RoomsModel, as: "listrooms" },
        ],
        where: {
          status: 1,
        },
        limit,
        offset,
      });
      return res.status(200).send({
        data,
        totalPage: Math.ceil(propertyData.length / limit),
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
