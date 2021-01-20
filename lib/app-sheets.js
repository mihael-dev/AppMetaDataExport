define( ["angular", "ng!$q", "./app-objects"], function(angular, $q, app_objects) { 

    return {

        getAppAndSheetData : function (currApp) {

            
            var defer = $q.defer();

            var qOptionsSheet =
                {
                    "qOptions": {
                        "qTypes": [
                            "sheet"
                        ],
                        "qIncludeSessionObjects": false,
                        "qData": {"cells": "/cells"}
                    }
            };
                    
            currApp.model.enigmaModel.app.getObjects(qOptionsSheet).then(qSheets => {

                app_objects.getSheetData(currApp, qSheets).then(sheetData => {
                    
                    defer.resolve(sheetData);
                    
                    });
                
                });

            return defer.promise;

        },

        exportSheets : function (app, sheets) {

            var exportData = [];

            sheets.forEach(sheet => {

                var sheet_layout = {};
                sheet_layout.qId = sheet.qInfo.qId;
                sheet_layout.title = sheet.qMetaDef.title;
                sheet_layout.objects = [];

                exportData.push([
                    'Sheet',
                    app.qDocId,
                    sheet.qInfo.qId,
                    sheet.qMetaDef.title
                ]);
                
            });

            return exportData;

        },

        exportSheetObjects : function (app, sheets) {

            var exportData = [];

            sheets.forEach(sheet => {

                sheet.cells.forEach(cell => {
                
                    
                    exportData.push([
                        'Sheet.Object',
                        app.qDocId,
                        sheet.qInfo.qId,
                        cell.name,
                        cell.type]);
                });
                
            });

            return exportData;

        }
    }

});

