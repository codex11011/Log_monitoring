const WatchLog = require("../src/watchLog");
const filePath = "Performance/logs/info.log";
const watchIt = new WatchLog(filePath);
const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const readLastLines = require("read-last-lines");
const ejs = require("ejs");
const engine = require("ejs-mate");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //complex algo for parsing
app.use(cookieParser());
app.engine("ejs", engine);
app.set("view engine", "ejs");

watchIt.veryCarefully();
app.get("/", async (req, res) => {
  try {
    let updatedContent = await readLastLines.read(filePath, 10);
    res.render("receiver.ejs", {
      data: updatedContent.split("\n")
    });
  } catch (err) {
    console.log(err);
  }
});

let client = 0;
try {
  io.on("connection", socket => {
    client++;
    console.log("Number of clients connected: " + client);
    socket.on("disconnect", function() {
      client--;
      console.log("Number of clients conected: " + client);
    });
  });
  watchIt.on("get_updatedContent", data => {
    io.sockets.emit("broadcast", {
      description: data.content
    });
    // console.log(data.content);
  });
} catch (err) {
  console.log(err);
}

http.listen(3000, function() {
  console.log("listening on localhost:3000");
});
