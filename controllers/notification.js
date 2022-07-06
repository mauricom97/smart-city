const { Board, Sensor } = require("johnny-five")
const board = new Board({ port: "COM3" })
const axios = require("axios")
const moment = require('moment')

moment.locale('pt-br')

module.exports = async (req, res) => {
    try {
        let nivelDaAgua = 0
        
        board.on("ready", async function () {
            const sensor = new Sensor("A0")
           let ola =  await sensor.on("change", function() {
                nivelDaAgua = this.value
                console.log(nivelDaAgua)
                setData(nivelDaAgua)
            })
            console.log(ola.value)
        })

        function setData(value) {
            nivelDaAgua = value
        }

        var config = {
            method: 'get',
            url: 'http://apiadvisor.climatempo.com.br/api/v1/weather/locale/4970/current?token=169bee63c8137adfd0c69143cb800ba5',
            headers: {}
        };

        await axios(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                const dataWeather = response.data
                nivelDaAgua = nivelDaAgua ? nivelDaAgua : 0
                
                fuzzy(nivelDaAgua, dataWeather)

                
                const message = `Bom dia\n\nTemperatura em ${response.data.name}: ${response.data.data.temperature}\nSensacao termica: ${response.data.data.sensation}\nCondicao: ${response.data.data.condition}\nUmidade do ar: ${response.data.data.humidity}\nNivel da agua: ${nivelDaAgua}`
                sendMenssageTelegram(message)
            })
            .catch(function (error) {
                console.log(error);
            });


    } catch (error) {
        console.log(error)
    }
}

async function sendMenssageTelegram(message) {
    var config = {
        method: 'post',
        url: `https://api.telegram.org/bot5322205215:AAFBnwdaPLwWmf3cbwAFIUpR-j1R9-ddPm8/sendMessage?chat_id=-1001770509988&text=${message}`,
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