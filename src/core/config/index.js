require('dotenv').config(); 
const config = {
    APP_NAME: process.env.APP_NAME || 'covidscreening',
    APP_HOST: process.env.APP_HOST || 'localhost',
    APP_PORT: process.env.PORT || 8080,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_SCHEMA: process.env.DB_SCHEMA,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    LOG_TO_FILE_OR_CONSOLE: process.env.LOG_TO_FILE_OR_CONSOLE || 'CONSOLE',
    DB_URI: process.env.DB_URI,

    IMPACTED_COVID_INDICATOR : process.env.IMPACTED_COVID_INDICATOR || "I",
    QUARANTINE_COVID_INDICATOR : process.env.QUARANTINE_COVID_INDICATOR || "Q",
    MONITOR_COVID_INDICATOR : process.env.MONITOR_COVID_INDICATOR || "M",
    CONTACTTRACE_COVID_INDICATOR : process.env.CONTACTTRACE_COVID_INDICATOR || "C",
    NOIMPACT_COVID_INDICATOR : process.env.NOIMPACT_COVID_INDICATOR || "N",

    IMPACTED_COVID_COLOR : process.env.IMPACTED_COVID_COLOR || "#FF0000",
    QUARANTINE_COVID_COLOR : process.env.QUARANTINE_COVID_COLOR || "#E77471",
    MONITOR_COVID_COLOR : process.env.MONITOR_COVID_COLOR || "#FFFF00",
    CONTACTTRACE_COVID_COLOR : process.env.CONTACTTRACE_COVID_COLOR || "#FFF380",
    NOIMPACT_COVID_COLOR : process.env.NOIMPACT_COVID_COLOR || "#00FF00"

}

module.exports = config