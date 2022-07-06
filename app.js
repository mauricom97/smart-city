let cron = require('node-cron');

require('dotenv').config()
setInterval(() => {
  notification = require("./controllers/notification")()
}, 3000)

// wateLevelController = require("./controllers/water")