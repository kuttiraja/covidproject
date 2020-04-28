const Appconfig = require('../core').config


function emailTemplate(subject, message) {

    const EMAIL_TEMPLATE = {
        to: Appconfig.FROM_EMAIL,
        from: Appconfig.TO_EMAIL,
        subject: `${subject}`,
        text: `${message}`,
        html: `<strong>${message}</strong>`,
      };
    
      return EMAIL_TEMPLATE;
}

module.exports = {
    emailTemplate
}
