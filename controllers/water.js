const { Board, Sensor } = require("johnny-five")
const board = new Board({ port: "COM3" })
const axios = require("axios")

module.exports = async (req, res) => {
    try {
        board.on("ready", () => {
            const sensor1 = new Sensor("A0")
            const sensor2 = new Sensor("A1")
            let outOfCoffee = false

            // sensor1.on("change", function () {
            //   sensores.sensor1 = this.value
            //   analyse(sensores.sensor1, sensores.sensor2)
            // })

            let sensores = new Object()
            sensores.sensor1 = null
            sensores.sensor2 = null

            sensor1.on("change", function () {
                console.log(`SENSOR 1 ${(this.value)}`)
            })

            sensor2.on("change", function () {
                console.log(`SENSOR 2 ${(this.value)}`)
            })

            // sensor1.within([700, 1000], () => {
            //   sensor1.on("change", function () {
            //     sensores.sensor1 = this.value
            //     analyse(sensores.sensor1, sensores.sensor2)
            //   })
            // })

            // sensor2.within([700, 1000], () => {
            //   sensor2.on("change", function () {
            //     sensores.sensor2 = this.value
            //     analyse(sensores.sensor1, sensores.sensor2)
            //   })
            // })

        })
    } catch (error) {
        console.log(error)
    }

    function analyse(sensor1, sensor2) {
        console.log(sensor1)
        if (sensor1) {
            sendMessageTelegram("SENSOR 1 COM NIVEL ALTO")
        }
        if (sensor2) {
            sendMessageTelegram("SENSOR 2 COM NIVEL ALTO")
        }
        if (sensor1 && sensor2) {
            sendMessageTelegram("ALERTA DE ENCHENTE")
        }
    }

    function sendMessageTelegram(message) {
        const token = process.env.TOKEN_TELEGRAM
        const config = {
            method: 'post',
            url: `https://api.telegram.org/bot${token}/sendMessage?chat_id=-1001770509988&text=${message}`,
            headers: {}
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function getTemperature() {
        const token = process.env.TOKEN_CLIMA_TEMPO
        let previsao_tempo = null
        var config = {
            method: 'get',
            url: `http://apiadvisor.climatempo.com.br/api/v1/weather/locale/4970/current?token=${token}`,
            headers: {}
        };

        axios(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                previsao_tempo = response.data
            })
            .catch(function (error) {
                console.log(error);
            });
        return previsao_tempo

    }
}
