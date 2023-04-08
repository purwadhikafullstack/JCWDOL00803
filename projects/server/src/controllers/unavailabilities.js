const UnavailabilitiesModel = require("../model/unavailabilities");
const { dbSequelize } = require("../config/db");

module.exports = {
  getUnavailabilitiesData: async (req, res) => {
    try {
      let data = await UnavailabilitiesModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  unavailability: async (req, res) => {
    try {
      let { id_room, start_date, end_date } = req.body;
      let create = await UnavailabilitiesModel.create({
        id_room,
        start_date,
        end_date,
      });
      res.status(200).send({
        success: true,
        message: "Unavailable Dates Has Been Set",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  getUnavailability: async (req, res) => {
    try {
      let id_room = req.query.room;
      let data = await UnavailabilitiesModel.findAll({
        attributes: [
          ["id_availability", "id"],
          [
            dbSequelize.fn(
              "DATE_FORMAT",
              dbSequelize.col("start_date"),
              "%Y-%m-%d"
            ),
            "start",
          ],
          [
            dbSequelize.fn(
              "DATE_FORMAT",
              dbSequelize.col("end_date"),
              "%Y-%m-%d"
            ),
            "end",
          ],
        ],
        where: {
          id_room,
        },
      });
      let dataMap = data.map((value) => ({ ...value.dataValues, title: "Unavailable", color: "red" }));
      return res.status(200).send(dataMap);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
