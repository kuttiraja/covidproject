const NodeEmployee = require('../models').NodeEmployee
const logger = require('../core').logger

// async function insertOrUpdateNodeEmployeeAssistant(employeeDetail) { 
//     let updateEmployee = new employeeModel(employeeDetail);
//     try {
//         await updateEmployee.save();
//         logger.info("User Updated Successfully", + employeeDetail.employeeId)
//     }
//     catch(err) {
//         logger.info("User insert failed")
//     }
//     return
// }

async function retrieveAllNodeEmployees() {
    let NodeEmployees = [];
    try {
        NodeEmployees = NodeEmployee.find({}).lean()
    }
    catch (err) {
        logger.info("Fetch Node Failed");
    }
    return NodeEmployees;
}

async function updateEmployeeLinksCovidIndicators(linkedemployees){
    //Get linked employees
    let empIds = [];
    console.log(linkedemployees);
    if(!Array.isArray(linkedemployees) || !linkedemployees.length) {
        logger.info("There is no link for this employee")
        return 
    }
    linkedemployees.forEach(element => {
        empIds.push(element.employeeId)
    });
    
    const filter = { "employeeId": {$in : empIds }, "covidImpactIndicator" : null}
    const update = { "covidImpactIndicator" : linkedemployees[0].covidIndicator}
    try {
        updatedRecords = await NodeEmployee.updateMany(filter, update, {upsert : false, new : true});
        logger.info(updatedRecords)
    }
    catch(err) {
        logger.info("update Failed")
    }
}

async function updateEmployeeNodeCovidIndicators(employeeId, covidIndicator) {
    let updatednodes = null 
    const filter = { $and: [ {"employeeId": employeeId}, {"covidImpactIndicator" : 'N'}]}
    const update = { "covidImpactIndicator" : covidIndicator}

    try {
        updatednodes = await NodeEmployee.findOneAndUpdate(filter, update, { upsert : false, new : true});
    }
    catch(err) {
        logger.info("update Failed", err)
    }
    console.log(updatednodes);
}

module.exports = {
    updateEmployeeLinksCovidIndicators,
    retrieveAllNodeEmployees,
    updateEmployeeNodeCovidIndicators
}