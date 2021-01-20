define( ["angular", "ng!$q"], function(angular, $q) { 

    return {

        getMasterDimensionData: function(currApp, config) {

            function getDimensionList (currApp) {
                var defer = $q.defer();
                currApp.getList( 'DimensionList', function ( reply ) {
                    var qDimensionList = reply;
                    //appData.sheets = [];
    
                    defer.resolve(qDimensionList);
    
                }, config)
    
                return defer.promise;
            }
    
            function getDimensionDetails(currApp, qDimensionList ) {
            
                return $q.all( qDimensionList.qItems.map(function( qObj) {
                    var deferred = $q.defer();
                    
                    getDimension(currApp, qObj).then(sheetProp => {
                        //console.info(sheetProp);
    
                        deferred.resolve( sheetProp );
                    });
    
                    return deferred.promise;
                }));
            }
    
            function getDimension(currApp, qObj) {
                var defer = $q.defer();
                currApp.model.enigmaModel.app.getDimension(qObj.qInfo.qId).then(qDim =>  {
                    qDim.getProperties().then(dim => {
                        defer.resolve( dim);
                    });
                });
                    
            
    
                return defer.promise;
    
            }


            var defer = $q.defer();
            
            getDimensionList(currApp).then( reply => {

                //getObjectTree(currApp, reply.qMeasureList).then(measureList => {
                getDimensionDetails(currApp, reply.qDimensionList).then(dimensionList => {

                    //sappData.measureList = measureList;

                    //console.info(measureList);

                    defer.resolve(dimensionList);

                    destroySessionObject(currApp, reply.qInfo.qId);


                });
            });

            return defer.promise;

        },

        exportMasterDimensions: function(app, masterDimensions) {
            var exportData = [];

            masterDimensions.forEach(masterDim => {
                exportData.push([
                    'MasterDimension',
                    app.qDocId,
                    masterDim.qInfo.qId,
                    masterDim.qMetaDef.title,
                    masterDim.qDim.title,
                    masterDim.qDim.qGrouping,
                    masterDim.qDim.qFieldDefs.join(",")

                ]);
                
            });

            return exportData;

        }



       


    }

});