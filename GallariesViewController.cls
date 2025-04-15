/* ** 
* @Description : This Apex controller used to handle Gallery based(DML quries), 
like Adding,Deleting For gallery 
* @Author :  Girish Nager
* @Date : 06-Jan-2021
*/
public class GallariesViewController {
    
     /**
* @Description: This method is used to get gallery object Type.
* @Param: Id => object record Id.
* @Return: String => object Type.
*/
	@AuraEnabled
    public static String setObjectType(Id recordId ){
        String sObjName = recordId.getSObjectType().getDescribe().getName();
        return sObjName;
    }
    
    /**
* @Description: This method is used to Get All Non-deleted gallery Records
* @Return: List => gallery records.
*/
	@AuraEnabled
    public static  List<Gallery__c> fetchGalleriesList(Id currentRecordId) {
       	List<Gallery__c> GallerList = new List<Gallery__c>();
        String sObjName = currentRecordId.getSObjectType().getDescribe().getName();

        String queryString = 'Select Id,Name,Image_URL__c ,From__c,To__c,Part__c ,Inventory_Line__c,Commentes__c,DateTime_Of_Upload__c,Inbound__c,Internal__c,Outbound__c,Last_Modified_Data_Time__c from Gallery__c ' ;

        if(sObjName == 'Inventory_Line__c'){
            queryString= queryString +' where Inventory_Line__c=: currentRecordId AND Is_Deleted__c = false ORDER BY DateTime_Of_Upload__c DESC';
        }
        if(sObjName == 'Customer_Quote__c'){
            queryString= queryString +' where Customer_Quote__c=: currentRecordId AND Is_Deleted__c = false ORDER BY DateTime_Of_Upload__c DESC';
        }
        if(sObjName == 'Part__c'){
            queryString= queryString +' where Part__c=: currentRecordId AND Is_Deleted__c = false ORDER BY DateTime_Of_Upload__c DESC';
        }
        if(sObjName == 'Repair_Order__c'){
            queryString= queryString +' where Repair_Order__c=: currentRecordId AND Is_Deleted__c = false ORDER BY DateTime_Of_Upload__c DESC';
        }
		GallerList = Data.read(queryString,new Map<String, Object> {'currentRecordId' =>currentRecordId });
       
        if(GallerList.size()>0){
        return GallerList;
        }
        else{
            return null ;
        }
    }
  
    /**
* @Description: This method is used to update selected gallery Record for delete file status.
* @Param: Id => gallery record Id.
*/  
    @AuraEnabled
    public static void deleteGallery(Id recordId) {
        Gallery__c gal = new Gallery__c(Id=recordId);
        gal.Is_Deleted__c = true;
        Data.modify(gal);
    } 
}