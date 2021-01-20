define( ["angular", "ng!$q"], function(angular, $q) { 

    return {

        getSheetData : function (currApp, qSheets) {

            function getSheetObjectData(currApp, qSheet) {


                return $q.all( qSheet.qData.cells.map(function( qObj) {
                    var deferred = $q.defer();
                    
                    getObject(currApp, qObj).then(sheetProp => {
                        //console.info(sheetProp);

                        deferred.resolve( sheetProp );
                    });

                    return deferred.promise;
                }));
            }

            function getObject(currApp, qObj) {
                var deferred = $q.defer();
                //currApp.getFullPropertyTree(qObj.qInfo.qId).then(function(model){
                currApp.model.enigmaModel.app.getObject(qObj.name).then(obj =>  {
                    obj.getProperties().then(objProp => {
                        deferred.resolve( objProp);
                        //destroySessionObject(currApp, obj.qInfo.qId);
                                
                    });
                });
                

                return deferred.promise;
            }
            
           // function getSheetData(currApp, qSheets) {
        
        
            return $q.all( qSheets.map(function( qSheet) {
                var deferred = $q.defer();

                var sheetData = {};

            //getObject(sheet.qInfo.qId)
                currApp.model.enigmaModel.app.getObject(qSheet.qInfo.qId).then(sheet =>  {

                    sheet.getProperties().then(sheetProp => {
                        //console.info( sheetProp);
                        //appData.sheetProps.push(sheetProp);
                        sheetData.sheetProp = sheetProp;
                        getSheetObjectData(currApp, qSheet).then( objects => {
                            sheetData.objects = objects;
                            //appData.sheetData.push(sheetData);
                            deferred.resolve(sheetData);

                        });

                    
                    
                    });
                
                });

                return deferred.promise;

            }));
         
        },


        exportObjectProp : function exportObjectProp(app, objects) {

            var exportData = [];

            objects.forEach(obj => {

                var title = obj.title;
                var subtitle =  obj.subtitle;
                var footnote = obj.footnote;
               
               
                

                if (obj.title != undefined && obj.title.qStringExpression != undefined) {
                    title = obj.title.qStringExpression.qExpr;
                }
                if (obj.subtitle != undefined && obj.subtitle.qStringExpression != undefined) {
                    subtitle = obj.subtitle.qStringExpression.qExpr;
                }
                if (obj.footnote != undefined && obj.footnote.qStringExpression != undefined) {
                    footnote = obj.footnote.qStringExpression.qExpr;
                }


            
                exportData.push([
                    'Object.Prop', 
                    app.qDocId,
                    obj.qInfo.qId,  
                    obj.qInfo.qType,  
                    title,
                    subtitle,
                    footnote,
                    obj.qExtendsId,
                    obj.visualization

                ]);
                
            });

            return exportData;

        },

        exportObjectHyperCubeDim: function (app, objects) {

            var exportData = [];
        
            objects.forEach(obj => {
                var i = 0;
                if ( obj.qHyperCubeDef != undefined) {
                    obj.qHyperCubeDef.qDimensions.forEach(dim => {
                        var qFieldDefs = '';
                        var qFieldLabels = '';
                        if (dim.qDef.qFieldDefs != undefined && dim.qDef.qFieldLabels != undefined) {
                            qFieldDefs = dim.qDef.qFieldDefs[0];
                            qFieldLabels = dim.qDef.qFieldLabels[0];

                        }

                        exportData.push([
                            'Object.Hypercube.Dimension', 
                            app.qDocId, 
                            obj.qInfo.qId, 
                            i,  
                            dim.qLibraryId,
                            qFieldDefs,  
                            qFieldLabels
                        ]);
                        i++;  
                    });
                }

            });

            return exportData;

        },


        exportObjectHyperCubeMea: function(app, objects) {

            var exportData = [];
        
            objects.forEach(obj => {
                var i = 0;
                if ( obj.qHyperCubeDef != undefined) {
                    obj.qHyperCubeDef.qMeasures.forEach(mea => {
                        var qDef = '';
                        var qLabel = '';
                        if (mea.qDef.qDef != undefined && mea.qDef.qLabel != undefined) {
                            qDef = mea.qDef.qDef;
                            if (mea.qDef.qLabelExpression != "") {
                                qLabel = mea.qDef.qLabelExpression;
                            } else {
                                qLabel = mea.qDef.qLabel;

                            }
                               
                            

                        }

                        exportData.push([
                            'Object.Hypercube.Measures', 
                            app.qDocId, 
                            obj.qInfo.qId,
                            i,  
                            mea.qLibraryId,
                            qDef,  
                            qLabel
                        ]);
                        i++;  
                    });
                }
            });

            return exportData;

        }


    }

});