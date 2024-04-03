const express = require("express");
const app = express();
const db = require("./utils/dbConfig");
const cors = require("cors");
const path = require("path");
const chalk = require("chalk");

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  })
);

app.use("/api", require("./routes/index"));

app.use(express.static(path.join(__dirname, "/public")));

db.on("error", console.error.bind(console, "Connection Error :- "));
db.once("open", (error) => {
  if (error) throw Error();
  console.log(chalk.black.bgCyan("Connection success with DB...!"));

  app.listen(process.env.PORT, () => {
    console.log(chalk.black.bgMagenta(`Server start on ${process.env.PORT} port...!`));
  });
});
