define( ["angular", "ng!$q"], function(angular, $q) { 

    return {
        getVariableData: function (currApp) {

            var defer = $q.defer();

            var qVariableListDef =
                {	"qListDef": 
                    {
                        "qType": "variable",
                        "qShowReserved": false,
                        "qShowConfig": false,
                        "qData": {},
                        "qShowSession": false
                    }
                };
            currApp.model.enigmaModel.app.getVariables(qVariableListDef).then(variableList =>  {
                defer.resolve(variableList);
                //destroySessionObject(currApp, variableList.qInfo.qId);
            

            });


            return defer.promise;

        },

        exportVariableData: function(app, variables) {

            var exportData = [];

            variables.forEach(variable => {
                exportData.push([
                    'Variable',
                    app.qDocId,
                    variable.qName,
                    variable.qDefinition
                ]);
                
            });

            return exportData;

        }
    }

});