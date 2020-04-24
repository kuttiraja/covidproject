const User = require('../db/models/employee')

async function covidApiHome(req, res, next) {
    res.status(200).send("Hello World")
}

async function covidAssistant(req, res, next) {
    //res.status(200).send("Hello World -1")

    let action,lang ;

 
    action = (req.body.queryResult ===undefined) ? null:
    (req.body.queryResult.action === undefined)? null : req.body.queryResult.action;

    lang = (req.body.queryResult.languageCode === undefined) ? "en" : req.body.queryResult.languageCode;
  
    if (action != null && action == "") {
        create = async (req, res, next) => {
            try{
            var userDetails = new User(req.body)
            userDetails.save();
            if (userDetails != null ) {
                let responseJson = {
                           speech:'User details saved.',
                           displayText:'Save',
                           outputContexts:[{'name': '<outputcontext> ', 'lifespan':1, 'parameters':{}}],
                           result: []
                          
                     };
                     return res.json(sndrsp.sendResponse( responseJson));
                }
            }catch (err) {
                let responseJson = {
                            speech:'Opps! Something got broken! Contact System Administrator',
                            displayText:'Opps! Something got broken! Contact System Administrator',
                            outputContexts:[{'name': '', 'lifespan':1, 'parameters':{err}}],
                            };
                return res.json(sndrsp.sendResponse( responseJson)); 
              }
        
          } 
    }
    else {
        let responseJson = {
            speech: localeService.translate('I didn\'t get that. Can you say it again?'),
            outputContexts: [{ 'name': '', 'lifespan': 1, 'parameters': {} }],
            session: req.body.session
            };
          return res.json(sndrsp.sendResponse( responseJson));
        }

}

module.exports = {
    covidApiHome,
    covidAssistant
}
