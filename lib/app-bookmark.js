define( ["angular", "ng!$q"], function(angular, $q) { 

    return {
        getBookmarkData: function (currApp, config) {

            
            var defer = $q.defer();
            currApp.getList( 'BookmarkList', function ( reply ) {
                var qBookmarkList = reply;
                //appData.sheets = [];

                defer.resolve(qBookmarkList);

            }, config)

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


define( ["angular", "ng!$q", "./app-objects"], function(angular, $q, app_objects) { 

    return {

    
        getBookmarkData : function(currApp, config) {
           
            function getBookmarkList(currApp) {
                var defer = $q.defer();
                currApp.getList( 'BookmarkList', function ( reply ) {
                    var qBookmarkList = reply;
                    //appData.sheets = [];
    
                    defer.resolve(qBookmarkList);
    
                }, config)
    
                return defer.promise;
            }

            function getMasterObjectDetails(currApp, qAppObjectList) {

               

                return $q.all( qAppObjectList.qItems.map(function( qObj) {
                    var deferred = $q.defer();
                    
                    getObject(currApp, qObj.qInfo).then(qMasterObj => {
                        //console.info(sheetProp);

                        deferred.resolve( qMasterObj );
                    });

                    return deferred.promise;
                }));
            }

            function getObject(currApp, qObj) {
                var deferred = $q.defer();
                //currApp.getFullPropertyTree(qObj.qInfo.qId).then(function(model){
                currApp.model.enigmaModel.app.getObject(qObj.qId).then(obj =>  {
                    obj.getProperties().then(objProp => {
                        deferred.resolve( objProp);
                        //destroySessionObject(currApp, obj.qInfo.qId);
                                
                    });
                });
                

                return deferred.promise;
            }



            var defer = $q.defer();
            
            getMasterObjectList(currApp).then( reply => {
            
                console.info(reply.qAppObjectList)

                getMasterObjectDetails(currApp, reply.qAppObjectList).then(masterObjects => {

                    defer.resolve(masterObjects);
                })
            });

            return defer.promise;

        },

        
        exportMasterObjects: function(app, masterObjects) {
            var exportData = [];

            var objectProp = app_objects.exportObjectProp(app, masterObjects);
            exportData = exportData.concat(objectProp);

            var objectHyperCubeDim = app_objects.exportObjectHyperCubeDim(app, masterObjects);
            exportData = exportData.concat(objectHyperCubeDim);

            var objectHyperCubeMea = app_objects.exportObjectHyperCubeMea(app, masterObjects);
            exportData = exportData.concat(objectHyperCubeMea);

            /*app.masterMeasures.forEach(masterMea => {
                exportData.push([
                    'MasterObjects',
                    app.qDocId,
                    masterMea.qInfo.qId,
                    masterMea.qMetaDef.title,
                    masterMea.qMeasure.qLabel,
                    masterMea.qMeasure.qDef,
                    masterMea.qMeasure.qExpressions.join(",")

                ]);
                
            });*/

            return exportData;

        }

    }

});