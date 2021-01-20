define( ["angular", "ng!$q"], function(angular, $q) { 

    return {
        getAppprops: function (currApp) {

            var defer = $q.defer();

         
           /* currApp.model.enigmaModel.GetScript().then(script =>  {
                defer.resolve(script);
                //destroySessionObject(currApp, variableList.qInfo.qId);
            

            });*/

            
                    
            var qAppProps =

            {
                "qOptions": {
                    "qTypes": [
                        "appprops"
                    ],
                    "qIncludeSessionObjects": false,
                    "qData": {}
                }

            };
                
                
       
                
        currApp.model.enigmaModel.app.getObjects(qAppProps).then(qAppProps => {
                
            currApp.model.enigmaModel.app.getObject(qAppProps[0].qInfo.qId).then(qAppPropsObj => {

                //var qAppPropsProp = qAppPropsObj.GetProperties();
                qAppPropsObj.getProperties().then(objProp => {
                    //objProp.defaultBookmarkId = 'b66cd1f9-f866-45ae-9ba3-77308c8e9560';
                    //qAppPropsObj.setProperties(objProp);

                    defer.resolve( objProp);



                    //destroySessionObject(currApp, obj.qInfo.qId);
                            
                });
        
                
            });
            
               
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