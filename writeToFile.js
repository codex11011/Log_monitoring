const fs = require("fs");
const writeStream = fs.createWriteStream("./Performance/logs/info.log", {
  flags: "a"
});

let count = 1;
writeStream.on("open", () => {
  console.log("writing to data.txt every 5 seconds");
  setInterval(() => {
    writeStream.write("This is stream line " + count + "\n");
    count++;
  }, 5000);
});
