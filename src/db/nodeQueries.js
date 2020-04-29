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

async function retrievecustomNodeEmployees(empArray) {
    let NodeEmployees = [];
    try {
        NodeEmployees = NodeEmployee.find({ "employeeId" : {$in : empArray}}).lean()
    }
    catch(err) {
        logger.info("Retrieve custom employees failed")
    }
    return NodeEmployees
}

async function findEmployeeByEmployeeId(empId) {
    let Employee = [];
    try {
        Employee  = NodeEmployee.find({"employeeId" : empId}).lean()
    }
    catch(err) {
        logger.info("Employyee Retrieval failed by ID")
    }
    return Employee;
}

async function updateEmployeeLinksCovidIndicators(linkedemployees, updateCovidImpactIndicator){
    //Get linked employees
    console.log(updateCovidImpactIndicator);
    if(!Array.isArray(linkedemployees) || !linkedemployees.length) {
        logger.info("There is no link for this employee")
        return 
    }
    
    const filter = { "employeeId": {$in : linkedemployees }}
    const update = { "covidImpactIndicator" : updateCovidImpactIndicator}
    try {
        updatedRecords = await NodeEmployee.updateMany(filter, update, {upsert : false, new : true});
        logger.info(updatedRecords)
    }
    catch(err) {
        logger.info("update Failed", err)
    }
}

async function updateEmployeeNodeCovidIndicators(employeeId, covidIndicator) {
    let updatednodes = null 
    const filter = { "employeeId": employeeId }
    const update = { "covidImpactIndicator" : covidIndicator}

    try {
        updatednodes = await NodeEmployee.findOneAndUpdate(filter, update, { upsert : false, new : true}).lean();
    }
    catch(err) {
        logger.info("update Failed", err)
    }
    // console.log(updatednodes);
    return updatednodes
}

module.exports = {
    updateEmployeeLinksCovidIndicators,
    retrieveAllNodeEmployees,
    updateEmployeeNodeCovidIndicators,
    retrievecustomNodeEmployees
}