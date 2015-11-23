(function(){
	'use strict'
	angular.module('mainApp')
	.service('xlsxService', [
		XlsxService]);

	function XlsxService(){

		this.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
		this.sheetData = {};
		this.sheetData.lastColumn = '';


	}

	XlsxService.prototype = {

		workSheetFromUserData: function(usersData){
			
			var rowCount = 1;
			var lastColumn = '';
			var ws = {A1: {t:'s',v:'User Name'}, B1: {t:'s',v:'User Id'}, C1: {t:'s',v:'Roles'}};
			

			_.each( usersData, function(user){
				//A1 : Name , B1: user Name, C1 : isAdmin, D1: isAdvanced, E1: isBasic
				rowCount++
				if( user.userName ){
					var obj = {t:'s', v: user.userName};
					ws['A'+rowCount] = obj;
				}
				if( user.userId ){
					var obj = {t:'s', v: user.userId};
					ws['B'+rowCount] = obj;
				}
				if( user.selectedRoles ){

					var selectedRoles = user.selectedRoles;
					var role = '';
					if(selectedRoles.isAdmin){
						role = role +'admin';
					}

					if(selectedRoles.isSchedule){
						if(role ===''){
							role = role +'schedule';
						}else{
							role = role +', schedule';
						}
						
					}
					
					if(selectedRoles.isAdvanced){
						if(role ===''){
							role = role +'save search';
						}else{
							role = role +', save search';
						}
						
					}

					if(selectedRoles.isBasic){
						if(role ===''){
							role = role +'basic';
						}else{
							role = role +', basic';
						}
						
					}
					var	obj = {t:'s', v: role};
					ws['C'+rowCount] = obj;
				}			
			});

			ws['!ref'] = "A1:C" + (usersData.length + 1); //Because of title

			return ws;

		},

		
		
		workSheetAdhocAttributeData: function(reportData, reportProperties){

			var reportColumnList 	= reportProperties.reportColumnList;
			var filterQuery 		= reportProperties.filterQuery;
			var showActivePercentage= reportProperties.showActiveMemberPercentage;
			var activeMember 		= reportProperties.showActiveMember;

			var rowCount = 1, lastColumn = '', columnCount = 0;
			var ws = {};
			var self = this;
			//To show Filter

				ws['A1'] = {t:'s', v: 'Filter'};
				ws['B1'] = {t:'s', v: filterQuery === undefined ? '': filterQuery};
				rowCount++; 
			
			//To show column title
			_.each(reportColumnList, function(attr){
				
					ws[self.alphabet[columnCount] + rowCount] = {t:'s',v: attr.ReportDisplayName};
					columnCount++;
				
			});
			

			
			_.each( reportData, function(data){
				
				rowCount++;  //start from second row , bcz first row for title
				columnCount = 0;
				if(reportColumnList !== undefined && reportColumnList.length > 0){

					_.each(reportColumnList, function(column){
						var celData = data[column.AttributeCollectionMapping];
						var type = celData.type === 'text' ? 's' : 'n';
						var obj = {t: type, v: celData.value};

						ws[self.alphabet[columnCount] + rowCount] = obj;

						columnCount++;
					});
				}			
			});

			/*if(requestQuery !== ''){
				rowCount++;
				ws['A'+ rowCount] = {t:'s', v: 'Query: ' + requestQuery};
			}*/
			var columnCount = reportColumnList.length - 1;
			ws['!ref'] = "A1:"+this.alphabet[columnCount] + (reportData.length + 2); //Because of title
						//A1:D67	
			return ws;
		},
		alphabetByPosition: function(position){
			if(this.alphabet[position]){
				this.sheetData.lastColumn = this.alphabet[position];
				return this.alphabet[position];
			}
		},
		convertToBinary: function(data){
			var buf = new ArrayBuffer(data.length);
			var view = new Uint8Array(buf);
			for (var i = 0; i != data.length; ++i)
			 	view[i] = data.charCodeAt(i) & 0xFF;
			
			return buf;
		}

	};



})();
