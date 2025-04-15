/**
* @Description : This Component Helper is used to call the Apex controller and used to handle the All server side calls.
* @Author : Girish Nagar
* @Date : 18/11/2020
*/

({
    setupObjectType: function (component) {
       var action = component.get("c.setObjectType");
        action.setParams({'recordId':component.get("v.recordId")});
        action.setCallback(this, function(data){
            if(data.getState() == 'SUCCESS'){
               var objectType = data.getReturnValue();
                console.log('objectType >',objectType);
                component.set("v.objectType",objectType);
                this.setupDataTable(component);
                this.getData(component);
            }
            else{
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    mode: 'pester',
                    "title": "Error while set object type",
                    "message": "Can not find proper object type for show gallery records.",
                    "type": "error "
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    
    setupDataTable: function (component) {
        var objecttype = component.get("v.objectType");
        console.log('object in setup column type-->',objecttype);
        if(objecttype == 'Inventory_Line__c'){
            component.set('v.columns', [
                {
                    label : 'Name',     
                    fieldName : 'galLink',
                    type : 'url',
                    sortable : true,
                    typeAttributes: {label: { fieldName: 'galName' }, target: '_blank'}   
                },
                {label:'Uploaded Date/Time', fieldName: 'DateTime_Of_Upload__c',sortable : true, type: 'date', typeAttributes: {  
                    day: 'numeric',  
                    month: 'short',  
                    year: 'numeric',  
                    hour: '2-digit',  
                    minute: '2-digit',  
                    second: '2-digit',  
                    hour12: true}},
                {label:'Last Modified Date/Time', fieldName: 'Last_Modified_Data_Time__c',sortable : true, type: 'date', typeAttributes: {  
                    day: 'numeric',  
                    month: 'short',  
                    year: 'numeric',  
                    hour: '2-digit',  
                    minute: '2-digit',  
                    second: '2-digit',  
                    hour12: true}},
                {label:'From', fieldName: 'From__c', sortable : true, type: 'Text'},
                {label:'To', fieldName: 'To__c', sortable : true, type: 'Text'},
                {label:'Inbound/Outbound/Internal', fieldName: 'type', sortable : true, type: 'Text'},
                {label:'Comments', fieldName: 'Commentes__c', sortable : true,editable: true, type: 'Text'},
                {type: 'button-icon',
                 initialWidth:15,
                 typeAttributes: {
                     name: 'View',
                     iconName: 'utility:preview',
                     value: 'view',
                     alternativeText: 'View'}
                },
                {type: 'button-icon',
                 initialWidth:15,
                 typeAttributes: {
                     name: 'Delete', 
                     iconName: 'utility:delete', 
                     value: 'delete',
                     alternativeText: 'Delete'}
                }
                
            ]);
        }
        else{
            component.set('v.columns', [
                {
                    label : 'Name',     
                    fieldName : 'galLink',
                    type : 'url',
                    sortable : true,
                    typeAttributes: {label: { fieldName: 'galName' }, target: '_blank'}   
                },
                {label:'Uploaded Date/Time', fieldName: 'DateTime_Of_Upload__c',sortable : true, type: 'date', typeAttributes: {  
                    day: 'numeric',  
                    month: 'short',  
                    year: 'numeric',  
                    hour: '2-digit',  
                    minute: '2-digit',  
                    second: '2-digit',  
                    hour12: true}},
                {label:'Last Modified Date/Time', fieldName: 'Last_Modified_Data_Time__c',sortable : true, type: 'date', typeAttributes: {  
                    day: 'numeric',  
                    month: 'short',  
                    year: 'numeric',  
                    hour: '2-digit',  
                    minute: '2-digit',  
                    second: '2-digit',  
                    hour12: true}},
                {label:'Comments', fieldName: 'Commentes__c', sortable : true,editable: true, type: 'Text'},
                {type: 'button-icon',
                 initialWidth:15,
                 typeAttributes: {
                     name: 'View',
                     iconName: 'utility:preview',
                     value: 'view',
                     alternativeText: 'View'}
                },
                {type: 'button-icon',
                 initialWidth:15,
                 typeAttributes: {
                     name: 'Delete', 
                     iconName: 'utility:delete', 
                     value: 'delete',
                     alternativeText: 'Delete'}
                }
                
            ]);
        }
    },
 
    getData: function (component) {
        return this.callAction(component)
            .then(
                $A.getCallback(imageRecords => {
                    component.set('v.allData', imageRecords);
                    component.set('v.filteredData', imageRecords);
            var allData =  component.get('v.allData');
            allData.forEach(function(record){
                    if(record.Id != undefined && record.Name != undefined){
                        record.galLink = '/one/one.app?#/sObject/'+ record.Id + '/view';
                        record.galName = record.Name;
                    }
            		if(record.Inbound__c==true){
            			record.type = 'Inbound';
            			}
            		else if(record.Internal__c==true){
            			record.type = 'Internal';
            			}
            		else if(record.Outbound__c==true){
            			record.type = 'Outbound';
            			}
            });
                    this.preparePagination(component, imageRecords);
                })
            )
            .catch(
                $A.getCallback(errors => {
                    if (errors && errors.length > 0) {
                        $A.get("e.force:showToast")
                            .setParams({
                                message: errors[0].message != null ? errors[0].message : errors[0],
                                type: "error"
                            })
                            .fire();
                    }
                })
            );
    },
 
    callAction: function (component) {
        component.set("v.isLoading", true);
        return new Promise(
            $A.getCallback((resolve, reject) => {
            const action = component.get("c.fetchGalleriesList");
                action.setParams({"RecordId":component.get("v.recordId")});
             action.setCallback(this, response => {
                 component.set("v.isLoading", false);
                    const state = response.getState();
                    if (state === "SUCCESS") {
                        return resolve(response.getReturnValue());
                    } else if (state === "ERROR") {
                        return reject(response.getError());
                    }
                    return null;
                });
           $A.enqueueAction(action);
            })
            );
    },
 
    preparePagination: function (component, imagesRecords) {
        let countTotalPage = Math.ceil(imagesRecords.length/component.get("v.pageSize"));
        let totalPage = countTotalPage > 0 ? countTotalPage : 1;
        component.set("v.totalPages", totalPage);
        component.set("v.currentPageNumber", 1);
        this.setPageDataAsPerPagination(component);
    },
 
    setPageDataAsPerPagination: function(component) {
        let data = [];
        let pageNumber = component.get("v.currentPageNumber");
        let pageSize = component.get("v.pageSize");
        let filteredData = component.get('v.filteredData');
        let x = (pageNumber - 1) * pageSize;
        for (; x < (pageNumber) * pageSize; x++){
            if (filteredData[x]) {
                data.push(filteredData[x]);
            }
        }
        component.set("v.tableData", data);
    }, 

    // Method use Sorting Using Perticular Field
    sortBy: function (field, reverse, primer) {
                    var key = primer ?
                        function(x) {return primer(x[field])} :
                    function(x) {return x[field]};    
                    reverse = !reverse ? 1 : -1;
                    return function (a, b) {
                        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
                    }
                },
 handleSorthelper: function (component, fieldName, sortDirection) {
                var data = component.get("v.tableData");
                var reverse = sortDirection !== 'asc';
                data.sort(this.sortBy(fieldName, reverse));
        		component.set('v.tableData', data);    
    },
        
 handleSaveEditionHelper: function(component,event) {
     component.set("v.isLoading", true);
     var draftValues = event.getParam('draftValues');
    var action = component.get("c.updateGalleries");
        action.setParams({"galleryObject" : draftValues});
        action.setCallback(this, function(response) {
            var state = response.getState();
            var messasge = '';
            if(state === 'SUCCESS'){   
                messasge = $A.get("$Label.c.Show_Success_Message");
            }          
            else if(state === 'ERROR'){
                messasge = "Unknown Error.";
            } 
          
         this.setupDataTable(component);
         this.getData(component);
     component.set("v.isLoading", false);
     });
     $A.enqueueAction(action);
    }
})