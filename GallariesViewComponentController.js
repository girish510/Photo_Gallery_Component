({
    doInit: function (component, event, helper) {
        helper.setupObjectType(component);
    },
    refreshGallery: function (component, event, helper) {
        helper.getData(component);
    },
    handleSaveEdition: function (component, event, helper) {
        helper.handleSaveEditionHelper(component, event);
    },
    onNext: function(component, event, helper) {        
        let pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber + 1);
        helper.setPageDataAsPerPagination(component);
    },
    onPrev: function(component, event, helper) {        
        let pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber - 1);
        helper.setPageDataAsPerPagination(component);
    },
    onFirst: function(component, event, helper) {        
        component.set("v.currentPageNumber", 1);
        helper.setPageDataAsPerPagination(component);
    },
    onLast: function(component, event, helper) {        
        component.set("v.currentPageNumber", component.get("v.totalPages"));
        helper.setPageDataAsPerPagination(component);
    },
    onPageSizeChange: function(component, event, helper) {        
        helper.preparePagination(component, component.get('v.filteredData'));
    },
    onChangeSearchPhrase : function (component, event, helper) {
        if ($A.util.isEmpty(component.get("v.searchPhrase"))) {
            let allData = component.get("v.allData");
            component.set("v.filteredData", allData);
            helper.preparePagination(component, allData);
        }
        let searchPhrase = component.get("v.searchPhrase");
        if (!$A.util.isEmpty(searchPhrase)) {
            let allData = component.get("v.allData");
            let filteredData = allData.filter(word => (!searchPhrase) || word.galName.toLowerCase().indexOf(searchPhrase.toLowerCase()) > -1);
            component.set("v.filteredData", filteredData);
            helper.preparePagination(component, filteredData);
        }
    },
    // This method is used for view action on Galleries Records.
    viewRecord : function(component, event, helper) {
        var recId = event.getParam('row').Id;
        var urlName = event.getParam('row').Image_URL__c;
        var imageName = event.getParam('row').galName;
        console.log('Imagename--->',imageName);
        if(urlName.endsWith(".pdf")||urlName.endsWith(".PDF")){
            component.set("v.isPDF",true);
        }
        else{
            component.set("v.isPDF",false);
        }
        var actionName = event.getParam('action').name;
        if( actionName == 'View') {
            component.set("v.imageUrl",urlName);
            component.set("v.imageName",imageName);
            component.set("v.isModalOpen", true);
        }
        else if(actionName == 'Delete'){
           component.set('v.recId',recId);
           component.set('v.showConfirmDialog', true);
        }
    },
    closeModel : function(component,event,helper) {
        component.set("v.isModalOpen", false);
        component.set("v.imageUrl",'');
        component.set("v.imageName",'');
    },
     handleConfirmDialogNo : function(component, event, helper) {
         component.set('v.showConfirmDialog', false);
         component.set('v.recId','');
    },
    handleConfirmDialogYes : function(component, event, helper) {
        component.set("v.isLoading", true);
        component.set('v.showConfirmDialog', false);
        var recId = component.get('v.recId');
        console.log("v.recordId--->",recId)
        var action = component.get("c.deleteGallery");
        action.setParams({'recordId':recId});
        action.setCallback(this, function(data){
            if(data.getState() == 'SUCCESS'){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    mode: 'pester',
                    "title": "Record Deleted successfully!",
                    "message": "Gallery Has Been Deleted successfully.",
                    "type": "Success"
                });
                toastEvent.fire();
                helper.setupDataTable(component);
                helper.getData(component);
            }
            else{
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    mode: 'pester',
                    "title": "Error while Deleting Record",
                    "message": "There are error while Deleting gallery record.",
                    "type": "error "
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
        component.set('v.recId','');
        component.set("v.isLoading", false);   
    },  
    handleSort: function(component, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        component.set("v.sortedBy", fieldName);
        component.set("v.sortDirection", sortDirection);
        helper.handleSorthelper(component, fieldName, sortDirection);      
    },
    preImgAction: function (component, event, helper) {
        let imgUrl = component.get("v.imageUrl");
        let galleries =  component.get('v.tableData');
        for(var i=0;i<galleries.length;i++){
            if(imgUrl ==galleries[i].Image_URL__c && i>0){
                if(galleries[i-1].Name.endsWith(".pdf")||galleries[i-1].Name.endsWith(".PDF")){
                    component.set("v.isPDF",true);
                }
                else{
                    component.set("v.isPDF",false);
                }
                component.set("v.imageUrl",galleries[i-1].Image_URL__c);
                component.set("v.imageName",galleries[i-1].Name);
                break;
            }
        }
    },
    nextImgAction: function (component, event, helper) {
        let imgUrl = component.get("v.imageUrl");
        let galleries =  component.get('v.tableData');
        for(var i=0;i<galleries.length;i++){
            if(imgUrl ==galleries[i].Image_URL__c && i<galleries.length-1){
                if(galleries[i+1].Name.endsWith(".pdf")||galleries[i+1].Name.endsWith(".PDF")){
                    component.set("v.isPDF",true);
                }
                else{
                    component.set("v.isPDF",false); 
                }
                component.set("v.imageUrl",galleries[i+1].Image_URL__c);
                component.set("v.imageName",galleries[i+1].Name);
                break;
            }
        }
    }
})