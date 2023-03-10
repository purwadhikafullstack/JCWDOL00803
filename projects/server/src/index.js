require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { join } = require("path");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
const bearerToken = require("express-bearer-token");
app.use(bearerToken());
app.use(express.static("src/public"));
app.use(
  cors({
    origin: [
      process.env.WHITELISTED_DOMAIN &&
        process.env.WHITELISTED_DOMAIN.split(","),
    ],
  })
);

app.use(express.json());

//#region API ROUTES

// Check sequelize connection
const { checkSequelize, dbSequelize } = require("./config/db");
checkSequelize();
dbSequelize.sync();

const { dbConf } = require("./config/db");
//testing mysql connection
dbConf.getConnection((err, connection) => {
  if (err) {
    console.log(`Error mySQL Connection`, err.message);
  }

  console.log(`Connect MySQL ✅ : ${connection.threadId}`);
});

// Config routes
const {
  usersRouter,
  propertiesRouter,
  roomsRouter,
  citiesRouter,
  ordersRouter,
  specialPricesRouter,
} = require("./routers");
app.use("/users", usersRouter);
app.use("/properties", propertiesRouter);
app.use("/rooms", roomsRouter);
app.use("/cities", citiesRouter);
app.use("/orders", ordersRouter);
app.use("/specialprices", specialPricesRouter);

// ===========================
// NOTE : Add your routes here

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
