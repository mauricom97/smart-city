const { Board, Sensor } = require("johnny-five");
const board = new Board({port: "COM4"});

let whaterSensors = new Array()
board.on("ready", () => {
  const sensor = new Sensor("A0")
  let whaterLevel = null
  sensor.within([0, 400], function () {
    whaterLevel = {emergency: false, message: "The water level is low."}
    console.log(whaterLevel)
  })
  sensor.within([401, 800], function () {
    whaterLevel = {emergency: false, message: "The water level is normal."}
    console.log(whaterLevel)
  })
  sensor.within([801, 1800], function () {
    whaterLevel = {emergency: false, message: "The water level is high."}
    console.log(whaterLevel)
  })
})

console.log(whaterSensors)