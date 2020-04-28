const sgMail = require('@sendgrid/mail');
const AppConfig = require('../core').config
const template = require('./template')
const logger = require('../core').logger

async function sendEmailNotification(subject, message) {
    sgMail.setApiKey(AppConfig.SENDGRID_API_KEY);

    emailTemplate = template.emailTemplate(subject, message)
    sgMail.send(emailTemplate, function(err, data) {
        if(err) {
            logger.info(`mail sent failed , ${err.response.body}`);
        }
        else {
            logger.info('mail sent successfully')
        }
    });
}

module.exports = {
    sendEmailNotification
}
