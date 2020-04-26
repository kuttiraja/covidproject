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
        NodeEmployees = NodeEmployee.find({})
    }
    catch (err) {
        logger.info("Fetch Node Failed");
    }
    return NodeEmployees;
}

async function updateNodeEmployeeCovidIndicators(linkedemployees){
    //Get linked employees
    let empIds = [];
    linkedemployees.forEach(element => {
        empIds.push(element.employeeId)
    });
    
    try {
        NodeEmployee.findAndModify({
            query: { employeeId: {$in : empIds }, covidIndicator : 'N'},
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
    updateNodeEmployeeCovidIndicators,
    retrieveAllNodeEmployees
}