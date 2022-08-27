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
           let changeLevel =  await sensor.on("change", function() {
                nivelDaAgua = this.value
                console.log(nivelDaAgua)
                setData(nivelDaAgua)
            })
            console.log(changeLevel.value)
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
            .then(async (response) => {
                console.log(JSON.stringify(response.data));
                const dataWeather = response.data
                nivelDaAgua = nivelDaAgua ? nivelDaAgua : 400
                
                let message = fuzzy(nivelDaAgua, dataWeather)
                console.log('================================')
                console.log(message)
                sendMenssageTelegram(message)
            })
            .catch(function (error) {
                console.log(error);
            });


    } catch (error) {
        console.log(error)
    }
}

function fuzzy(waterLevel, weatherData){
    
    let waterWeight = null
    let tempWeight = null
    let humWeight = null

    let temp = weatherData.data.temperature;
    let hum = weatherData.data.humidity;
    console.log(weatherData.data.temperature, weatherData.data.humidity)
    if(waterLevel < 100){
        waterWeight = 1
    }
    else if(waterLevel >= 200 && waterLevel < 400){
        waterWeight = 2
    }
    else if(waterLevel >= 400 && waterLevel < 600){
        waterWeight = 3
    }
    else if(waterLevel >= 600){
        waterWeight = 15
    }
    
if(temp < 0) {
    tempWeight = 0
}
else if(temp >= 0 && temp < 25) {
    tempWeight = 2
}
else if(temp >= 25 && temp < 30) {
    tempWeight = 3
}
else {
    tempWeight = 5
}

if(hum){
    if(hum < 333){
        humWeight = 1;
    }
    else if(hum >= 333 && hum < 666){
        humWeight = 2;
    }
    else  if(hum >= 666 && hum < 800){
        humWeight = 3;
    } else{
        humWeight = 5;
    }
}

    let msg = ''
    console.log(waterWeight, tempWeight, humWeight)
    let total = waterWeight + tempWeight + humWeight;
    if(total){
        if(total < 6){ msg += "Chance de alagamento baixa\n"}
        else if(total >= 6 && total < 10){ msg += "Chance de alagamento media\n"}
        else if(total >= 10 && total < 15){ msg += "Chance de alagamento alta\n"}
        else if(total >= 15){ msg += "Chance de alagamento muito alta\n"}
    }

    return msg
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