define( ["angular", "ng!$q"], function(angular, $q) { 

    return {
        getScriptData: function (currApp) {

            var defer = $q.defer();

         
           /* currApp.model.enigmaModel.GetScript().then(script =>  {
                defer.resolve(script);
                //destroySessionObject(currApp, variableList.qInfo.qId);
            

            });*/

            var qScriptHandle =
            {
               
                    "handle": 1,
                    "method": "GetScript",
                    "params": {}
                
            };

            currApp.model.enigmaModel.app.getScript().then(script =>  {
                defer.resolve(script);
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