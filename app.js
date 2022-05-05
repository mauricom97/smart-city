const { Board, Sensor } = require("johnny-five")
const board = new Board({port: "COM3"})

board.on("ready", () => {
  const sensor = new Sensor("A0")
  let outOfCoffee = false

  sensor.within([0, 299], () => {
    if (!outOfCoffee) {
      outOfCoffee = true
      console.log("O nivel da agua esta normal")
    }
  })

  sensor.within([300, 500], () => {
    if (outOfCoffee) {
      outOfCoffee = false
      console.log("O nivel da aguá está alto!!")
    }
  })
})
