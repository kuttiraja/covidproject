const employeeModel = require('../models').employeeModel
const logger = require('../core').logger

async function insertOrUpdateEmployeeAssistant(employeeDetail) { 
    let updateEmployee = new employeeModel(employeeDetail);
    try {
        await updateEmployee.save();
        logger.info("User Updated Successfully", + employeeDetail.employeeId)
    }
    catch(err) {
        logger.info("User insert failed")
    }
    return
}

async function updateEmployeeCovidIndicators(linkedemployees){
    //Get linked employees
    let empIds = [];
    linkedemployees.forEach(element => {
        empIds.push(element.employeeId)
    });
    
    try {
    employeeModel.findAndModify({
        query: { employeeId: {$in : empIds }},
        update: { covidIndicator : empIds[0].covidIndicator},
        upsert: false,
        new : true
    });
}
catch(err) {
    logger.info("update Failed")
}

}

module.exports = {
    updateEmployeeCovidIndicators,
    insertOrUpdateEmployeeAssistant
}