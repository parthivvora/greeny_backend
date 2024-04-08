const express = require("express");
const app = express();
const db = require("./utils/dbConfig");
const cors = require("cors");
const path = require("path");
const chalk = require("chalk");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://greeny-admin-panel.vercel.app/"],
    methods: ["POST", "GET", "DELETE", "PUT"],
  })
);

// app.options("*", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.status(200).send();
// });

app.use("/api", require("./routes/index"));

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

db.on("error", console.error.bind(console, "Connection Error :- "));
db.once("open", (error) => {
  if (error) throw Error();
  console.log(chalk.black.bgCyan("Connection success with DB...!"));

  app.listen(process.env.PORT, () => {
    console.log(
      chalk.black.bgMagenta(`Server start on ${process.env.PORT} port...!`)
    );
  });
});
