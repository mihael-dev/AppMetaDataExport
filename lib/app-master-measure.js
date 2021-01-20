define( ["angular", "ng!$q"], function(angular, $q) { 

    return {

        getMasterMeasureData : function(currApp, config) {

            function getMeasureList(currApp) {
                var defer = $q.defer();
                currApp.getList( 'MeasureList', function ( reply ) {
                    var qMeasureList = reply;
                    //appData.sheets = [];
    
                    defer.resolve(qMeasureList);
    
                }, config)
    
                return defer.promise;
            }
    
            function getMeasureDetails(currApp, qMeasureList ) {
            
                return $q.all( qMeasureList.qItems.map(function( qObj) {
                    var deferred = $q.defer();
                    
                    getMeasure(currApp, qObj).then(sheetProp => {
                        //console.info(sheetProp);
    
                        deferred.resolve( sheetProp );
                    });
    
                    return deferred.promise;
                }));
            }
    
    
            function getMeasure(currApp, qObj) {
                var defer = $q.defer();
                currApp.model.enigmaModel.app.getMeasure(qObj.qInfo.qId).then(measure =>  {
                    measure.getProperties().then(mea => {
                        defer.resolve( mea );
                    });
                });
                    
            
    
                return defer.promise;
    
            }

            var defer = $q.defer();
            
            getMeasureList(currApp).then( reply => {

                //getObjectTree(currApp, reply.qMeasureList).then(measureList => {

                getMeasureDetails(currApp, reply.qMeasureList).then(measureList => {

                    //appData.measureList = measureList;

                    //console.info(measureList);

                    defer.resolve(measureList);

                    destroySessionObject(currApp, reply.qInfo.qId);



                });
            });

            return defer.promise;

        },

        
        exportMasterMeasure: function(app, masterMeasures) {
            var exportData = [];

               

           masterMeasures.forEach(masterMea => {
                exportData.push([
                    'MasterMeasure',
                    app.qDocId,
                    masterMea.qInfo.qId,
                    masterMea.qMetaDef.title,
                    masterMea.qMeasure.qLabel,
                    masterMea.qMeasure.qDef,
                    masterMea.qMeasure.qExpressions.join(",")

                ]);
                
            });

            return exportData;

        }

    }

});