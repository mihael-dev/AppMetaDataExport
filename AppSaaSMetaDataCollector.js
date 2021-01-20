/*var config = {
	host: 'mrvmuc3.eu.qlikcloud.com', //for example, 'abc.us.example.com'
	prefix: '/',
	port: 443,
	isSecure: true,
	webIntegrationId: 'eyJhbGciOiJFUzM4NCIsImtpZCI6ImU3NzU5N2FmLTNhNTEtNGU0Mi05NTRlLTJjNjQ4YmY1NjUyYiIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoiOTUxU2xIbzZlU0RmdDdDbmJpX2xySU5RQmtRdVpqMG8iLCJqdGkiOiJlNzc1OTdhZi0zYTUxLTRlNDItOTU0ZS0yYzY0OGJmNTY1MmIiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoibDBVZE1sLW9uRFJVOWdua1dkM1NQckRCU3ZpcTZRYWQifQ.jPoYFP0hUvpRxbQleXuYWBXAL2cB5_2tSMXZciWvCDxc8JBpN4vgfW77mcWMdkt0RTa694iKkeueLqz4175oWQJSljLyerwGZ7RrSstqbzbEJv3RsVkA-mwoWd74tB7s'
};*/

var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/sense" ) + 1 );

var config = {
	openWithoutData: true,
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:",
	webIntegrationId: 'eyJhbGciOiJFUzM4NCIsImtpZCI6IjVlMDg5NzE4LWZiN2ItNGE0YS04NTMyLTkyOWZlZWExYjUyOSIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoiOTUxU2xIbzZlU0RmdDdDbmJpX2xySU5RQmtRdVpqMG8iLCJqdGkiOiI1ZTA4OTcxOC1mYjdiLTRhNGEtODUzMi05MjlmZWVhMWI1MjkiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoibDBVZE1sLW9uRFJVOWdua1dkM1NQckRCU3ZpcTZRYWQifQ.U6W-pAL1GJ4jaAX-2Ar1wSMPWOiDV8cZ0z84fU6V0PRwfc0Ae5T26zjj-HR_Xs6spL_3MMeMJkQwFk7Akq1JGiwIDYGrUtIBKEKP0id8-xgcR-PcTOjjoJlzbHEM2qE8'
	
};


require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
	paths: {
        //
        // CDN versions listed here: http://cdnjs.com/libraries/handlebars.js/
        // Don't forget to remove .js extension for requirejs path.
        //
       
		app_sheets: "./lib/app-sheets",
		app_objects: "./lib/app-objects",
		app_variables: "./lib/app-variables",
		app_master_measure: "./lib/app-master-measure",
		app_master_dimension: "./lib/app-master-dimension",
		app_master_object: "./lib/app-object",
		app_bookmark: "./lib/app-bookmark",
		app_script: "./lib/app-script",
		app_appprops: "./lib/app-appprops"
    },
	webIntegrationId: config.webIntegrationId
} );		

define( ["angular","qlik","jquery", "text!./style.css", "text!./template.html", 
'text!./dialog-template.ng.html',"ng!$q",
"./lib/app-sheets", 
"./lib/app-objects", 
"./lib/app-variables",
"./lib/app-master-measure",
"./lib/app-master-dimension",
"./lib/app-master-object",
"./lib/app-bookmark",
"./lib/app-script",
"./lib/app-appprops"

], function (angular, qlik, $, cssContent, template, dialogTemplate, $q, 
	app_sheets, 
	app_objects, 
	app_variables,
	app_master_measure,
	app_master_dimension,
	app_master_object,
	app_bookmark,
	app_script,
	app_appprops
	) {
		
		'use strict';
	$("<style>").html(cssContent).appendTo("head");
	
	
	


	return {
       template: template,
       initialProperties : {
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 50
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 0
				},
				measures : {
					uses : "measures",
					min : 0
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : {
						initFetchRows : {
							ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
							label : "Initial fetch rows",
							type : "number",
							defaultValue : 50
						}
					}
				}
			}
		},
		support : {
			snapshot: true,
			export: true,
			exportData : true
		},
		paint: function ( ) {
			//setup scope.table
			if ( !this.$scope.table ) {
				this.$scope.table = qlik.table( this );
			}
			return qlik.Promise.resolve();
		},
		controller: ['$scope', 'luiDialog', function ( $scope, luiDialog) {

			var $injector = angular.injector(['ng']);
			var $http = $injector.get("$http");

			/*var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/sense" ) + 1 );

			var config = {
				openWithoutData: true,
				host: window.location.hostname,
				prefix: prefix,
				port: window.location.port,
				isSecure: window.location.protocol === "https:",
				
			};*/
			
			qlik.setOnError( function ( error ) {
				console.info(error);
			});

			
			$scope.openWizard = function(appId) {
				luiDialog.show({
					template: dialogTemplate,
					input: {
						layout: $scope.layout
					},
					controller: ['$scope', function( $scope) {	
						//console.log('asd ' +  $sce);
						
						$scope.selectedAppID = appId;


						$scope.exportAppJson = function() {
							getApps($scope.selectedAppID)
								.then(traverseAppforJSON)
								
								.then(exportJSON);
							;
						}

						$scope.exportAppCSV = function() {
							getApps($scope.selectedAppID)
								//.then(app.getAppLayout(function(layout) {)
								.then(traverseAppforJSON)
								//.then(console.log($scope.items))
								.then(exportCSV);
								
							//	console.log(getApps());
							
						}

						$scope.exportTest = function() {
							$http({
								method: 'GET',
								url: 'http://localhost:4848/engine/healthcheck/',
								//url: 'https://' + config.host + ':4848/api/v1/apps/55127532-ce3d-4b0c-8a76-ee539cd337a3/export?NoData=true',
								//url: 'http://' + config.host + ':4848/api/v1/apps/' + $scope.selectedAppID + '/export?NoData=true',
								//body: {"appId":"apps/55127532-ce3d-4b0c-8a76-ee539cd337a3", "NoData":true},
								headers: {  }
							}).then(function (response) {	
								console.info(response);
							});
						}
					}]

				})
			};



			$scope.header = ["Action", "#", "AppName", "AppId"];
			$scope.items = [];

			$scope.previewApps = function() {
				$scope.items.splice(0,$scope.items.length);
				getApps ().then(function(apps) {
					
					
					var i = 0;
					apps.forEach(app => {

						i++;
						$scope.items.push(['', i, app.qDocName, app.qDocId]);
					});

				});
			}

			$scope.previewApps();


			

			$scope.exportAppJson = function(appId) {
				getApps(appId)
					.then(traverseAppforJSON)
					.then(exportJSON);
				;
			}


			$scope.checkItems = function(noElements) {
				if (noElements == undefined) {
					return !($scope.items.length > 0);
				} else {
					return !($scope.items.length == noElements);
				}

			}


			function getApps (appId) {

				//vm.loadingStatusHint = 'Loading apps ... ';

				var deferred = $q.defer();
				if ($scope.apps == null) {
					console.info(config);
                    var app = qlik.currApp(this);
                    $scope.apps = [app];
                    
                    /*qlik.getAppList( function ( apps) {
					
						$scope.apps = apps;
						deferred.resolve( apps );


                    }, config );
                    */
					//});
				} else {
					if (appId != null) {
						var appsFiltered = $scope.apps.filter(function (app) {
							return app.qDocId == appId;
						});

						deferred.resolve( appsFiltered );

					} else  {
						
						
						var appsFiltered = $scope.apps.filter(function (app) {

							//Overall Equipment Efficiency(2)
							//return app.qDocName.startsWith("Downloads/Police Crime Analysis - 2017-2019.qvf");
							if ($scope.filterValue == undefined || $scope.filterValue.length == 0) {
								return true;
							} else {
								var re = new RegExp($scope.filterValue.replace('*', '.*').replace('?', '.'), 'g');
								return app.qDocName.match(re);
							}

							return true;
							//return app.qDocName.startsWith("_");
						}); 
						//deferred.resolve( apps );
						deferred.resolve( appsFiltered );
					}		
				}

				return deferred.promise;
			
			}


			function traverseAppforJSON ( apps ) {

				//vm.loadingStatusHint = 'Analyzing apps ...';
				//v0ar appsResolved = [];
		//		console.log(appsResolved) ;

				
				return $q.all( 
					
					apps.map( function ( app ) {

					var deferred = $q.defer();
					
					
					processApp( app, true )
						.then( function ( processedApp ) {
							//console.log( '--app processed => ', processedApp );
				//			vm.loadingStatusHint = 'Analyzing \"' + processedApp.qDocName + '\"';
			//				app.missingExtensions = []; 	// Initialize the array
			//				app.usedExtensions = []; 		// Initialize the array
							deferred.resolve( processedApp );
						}, function ( err ) {
							//console.error( 'Error in processApp', err );
							deferred.reject( /*reply*/ );
						} );

					return deferred.promise;
				} ) );
			}


			/**
			 * Process each app:
			 * - Save the app's meta data to vm.apps
			 * @param apps
			 */
			function traverseApps ( apps ) {

				//vm.loadingStatusHint = 'Analyzing apps ...';
				//v0ar appsResolved = [];
		//		console.log(appsResolved) ;

				
				return $q.all( 
					
					apps.map( function ( app ) {

					var deferred = $q.defer();
					
					
					processApp( app )
						.then( function ( processedApp ) {
							//console.log( '--app processed => ', processedApp );
				//			vm.loadingStatusHint = 'Analyzing \"' + processedApp.qDocName + '\"';
			//				app.missingExtensions = []; 	// Initialize the array
			//				app.usedExtensions = []; 		// Initialize the array
							deferred.resolve( app );
						}, function ( err ) {
							//console.error( 'Error in processApp', err );
							deferred.reject( /*reply*/ );
						} );

					return deferred.promise;
				} ) );
			}


			function getSheetList(currApp) {
				var defer = $q.defer();
				currApp.getList( 'sheet', function ( reply ) {
					var qAppObjectList = reply;
					//appData.sheets = [];

					defer.resolve(qAppObjectList);

				}, config)

				return defer.promise;
			}

	

			

			function getSheetObjects(currApp, qSheet) {


				return $q.all( qSheet.qData.cells.map(function( qObj) {
					var deferred = $q.defer();
					
					getObject(currApp, qObj).then(sheetProp => {
						//console.info(sheetProp);

						deferred.resolve( sheetProp );
					});

					return deferred.promise;
				}));


				var deferred = $q.defer();
				//currApp.getFullPropertyTree(qObj.qInfo.qId).then(function(model){
				currApp.getObjectProperties(qObj.qInfo.qId).then(function(model){
					
					//ppData.qAppObjectList[index].sheet = model.propertyTree.qChildren;
					var objProp = model.propertyTree;
					//sheets.push(sheet);
					deferred.resolve( objProp );
				});
				return deferred.promise;
			}


			/*function getObjects(currApp, qObjectList ) {
			
				return $q.all( qObjectList.qItems.map(function( qSheet) {
					var deferred = $q.defer();
					
					getSheetObjects(currApp, qSheet).then(sheetProp => {
						//console.info(sheetProp);

						deferred.resolve( sheetProp );
					});

					return deferred.promise;
				}));

			}*/




		


			


			/**
			 * Process a single app:
			 * - open the app
			 * - Get all sheet objects
			 * @param appData
			 * @returns {*|promise}
			 */
			function processApp ( appData, detailedJSON ) {
				var defer = $q.defer();

				//console.log( '>> processApp >> app.qDocId', app.qDocId );
				//console.log( '>> processApp >> qlik', qlik );
				//console.log( 'qlik.currApp().id', qlik.currApp().id );
				
				var currApp;
				appData.isCurrentApp = isCurrentApp( appData );
				if (!appData.isCurrentApp ) {
					currApp = qlik.openApp( appData.qDocId, config );
				} else {
					currApp = qlik.currApp();
				}
				console.info(appData.qDocName);
				
			
				

				currApp.getAppLayout(function(layout) {


					appData.sheets = null;
					appData.objects = null;
					appData.masterMeasures = null;
					appData.masterDimensions = null;
					appData.masterObjects = null;
					appData.variables = null;
			

					var objectPromise = app_sheets.getAppAndSheetData(currApp).then(sheetData => {
						appData.sheets = [];
						appData.objects = [];
						console.debug("sheetData");
						sheetData.forEach(sheet => {
							appData.sheets.push(sheet.sheetProp);
							appData.objects = appData.objects.concat(sheet.objects);
						});

					});
					
					
					var apppropsPromise = app_appprops.getAppprops(currApp).then(appprops => {
						console.debug("appprops");
						appData.appprops = appprops;
					});

					var meaListPromise = app_master_measure.getMasterMeasureData(currApp, config).then(measureList => {
						console.debug("measureList");
						appData.masterMeasures = measureList;
					});

					
					/*var dimListPromise = app_master_dimension.getMasterDimensionData(currApp, config).then(dimensionList => {
						console.debug("dimensionList");
						appData.masterDimensions = dimensionList;
					});


					var masterObjectPromise = app_master_object.getMasterObjectData(currApp, config).then(masterObjects => {
						console.debug("masterObjects");
						appData.masterObjects = masterObjects;
					});


					var variablePromise = app_variables.getVariableData(currApp).then(variableList => {
						console.debug("variableList");
						appData.variables = variableList;
					});

					var bookmarkPromise = app_bookmark.getBookmarkData(currApp).then(bookmarkList => {
						console.debug("bookmarkList");
						appData.bookmarks = bookmarkList;
					});

					var scriptPromise = app_script.getScriptData(currApp).then(script => {
						console.debug("script");
						appData.script = script;
					});
					*/
					

					//console.info(objectPromise);

					
					//$q.all([objectPromise, meaListPromise, dimListPromise, masterObjectPromise,
					//	variablePromise, bookmarkPromise, scriptPromise,apppropsPromise
					$q.all([objectPromise, apppropsPromise, meaListPromise
						 ]).then(function() {//, meaListPromise, dimListPromise]).then(function(obj) {
						console.info(appData);

							//objectPromise, meaListPromise, dimListPromise, masterObjectPromise. variablePromise, bookmarkPromise, scriptPromise,apppropsPromise, 
						//defer.resolve( appData );

						if ( !appData.isCurrentApp ) {
							currApp.close();
							defer.resolve( appData );
						} else {
							defer.resolve( appData );
						}
						//appsResolved.remove(appData);


						var item = $scope.items.find(
							function (item) {
								return item[3] == currApp.id;
								}

						);
						item[0] = '';



					});

				});

				
				return defer.promise;
				
					
			}


			function destroySessionObject(currApp, qId) {
				currApp.destroySessionObject( qId )
					.then( function () {
						//console.info("destroyed " + qId );
				});
			}

			function isCurrentApp( appData ) {

				return appData.qDocId === qlik.currApp().id;
				/*
				if (appData.qDocId.indexOf('.qvf') > -1) {
					console.log("curr " + qlik.currApp().id);
					return (appData.qDocId.replace( '.qvf', '' ) === qlik.currApp().id);
				} else {
					return appData.qDocId === qlik.currApp().id;
				}*/
			}
			
			function exportJSON ( apps ) {

				var app = apps[0];
				var json = JSON.stringify(app);
				var uri = 'data:attachment/json;charset=utf-8,' + encodeURIComponent(json);
					

				//$scope.href = uri;
						
				var ts = new Date().getTime();
			//	$scope.download = 'app_meta_data_'+ ts+".csv";

				$('#downloadJSON').attr("href",uri);
				$('#downloadJSON').attr("download", app.qDocName + 'app_meta_data_'+ ts + ".json");


			}

			function exportCSV ( apps ) {
				
				var rows = [];

				var sheets = app_sheets.exportSheets(apps[0], apps[0].sheets);
				rows = rows.concat(sheets);
				var sheetObjects = app_sheets.exportSheetObjects(apps[0], apps[0].sheets);
				rows = rows.concat(sheetObjects);

				var objectProp = app_objects.exportObjectProp(apps[0], apps[0].objects);
				rows = rows.concat(objectProp);

				var objectHyperCubeDim = app_objects.exportObjectHyperCubeDim(apps[0], apps[0].objects);
				rows = rows.concat(objectHyperCubeDim);

				var objectHyperCubeMea = app_objects.exportObjectHyperCubeMea(apps[0], apps[0].objects);
				rows = rows.concat(objectHyperCubeMea);

				var variables = app_variables.exportVariableData(apps[0], apps[0].variables);
				rows = rows.concat(variables);

				var masterMeasures = app_master_measure.exportMasterMeasure(apps[0], apps[0].masterMeasures);
				rows = rows.concat(masterMeasures);

				var masterDims = app_master_dimension.exportMasterDimensions(apps[0], apps[0].masterDimensions);
				rows = rows.concat(masterDims);

				var masterObj = app_master_object.exportMasterObjects(apps[0], apps[0].masterObjects);
				rows = rows.concat(masterObj);	
				

				//var bookmarkList = app_bookmark()


				//var titel = ["appId", "appName", "fileSize", "sheetId", "sheetName", "objName", "objTyp"];
				var rowsJoined = [];
				
				rows.forEach(row => {
					var rowString = row.map(function(cell){
						// Wrap each element of the dates array with quotes
						return "\"" + ((cell != null && cell != undefined && isNaN(cell)) ? String(cell).replace(/"/g, '""') : cell) + "\"";
					}).join(",");

					rowsJoined.push(rowString);
					//rowsJoined.push('"' + row.join("\",\"") + '"');
				});

				

				 
				var csv = rowsJoined.join("\n");
				var uri = 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(csv);
						
				var ts = new Date().getTime();

				$('#download').attr("href",uri);
				//$('#download').attr("download", 'app_meta_data_'+ ts + ".csv");
				$('#download').attr("download", apps[0].qDocName + 'app_meta_data_'+ ts + ".csv");

			
				
				//a.click(); //Downloaded file

				
			
			}



			/*function exportCSV_BMW ( apps ) {
				
				var sheets = exportSheets(apps[0]);

				var titel = ["appId", "appName", "fileSize", "sheetId", "sheetName", "objName", "objTyp"];
				var rows = [];
				rows.push(titel);

				apps.forEach(app => {
					var appData =  [app.qDocId , app.qDocName ,app.qFileSize];
					var sheetData = ["",""]; 
					var objectData = ["",""]; ;
					
					if (app.qAppObjectList.qItems.length > 0) {
						app.qAppObjectList.qItems.forEach(sheet => {
							sheetData = [sheet.qInfo.qId, sheet.qMeta.title];
							if (sheet.qData.cells.length > 0) {
								sheet.qData.cells.forEach(object => {
										}		var objectData = [object.name, object.type]; 
									
									var row = appData;
									row = row.concat(sheetData);
									row = row.concat(objectData);
									rows.push(row.join(","));
								});
							} else {
								// no objects on sheet
								var row = appData;
								row = row.concat(sheetData);
								row = row.concat(objectData);
								//appData;	
								rows.push(row.join(","));
							}
						});
					} else {
						// no sheets
						var row = appData;
						row = row.concat(sheetData);
						row = row.concat(objectData);
						rows.push(row);

						//console.info(row.join(","));
						//rows.push(row.join(","));

						
					}




					
					
					

				});

				 
				var csv = rows.join("\n");
				var uri = 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(csv);
						
				var ts = new Date().getTime();

				$('#download').attr("href",uri);
				$('#download').attr("download", 'app_meta_data_'+ ts + ".csv");

			
				
				//a.click(); //Downloaded file

				
			
			}*/

			

			

		}]
	};

} );
