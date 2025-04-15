@isTest
public class GallariesViewControllerTest {
public static testmethod void test1(){
        system.runAs(AdminUserTest.createRunwayUser(true)) {
            Part__c parts = Utility.CreatePart('P-w834834');
            System.assertNotEquals(parts.Id, null);
            Part__c part1 = Utility.CreatePart('for null condition test');
            System.assertNotEquals(part1.Id, null);
            Customer_Quote__c cq = Utility.CreateCustomerQuote('New');
            System.assertNotEquals(cq.Id, null);
            Condition_Code__c cCode = Utility.createConditionCode('NE');
            System.assertNotEquals(cCode.Id, null);
            Inventory_Line__c invLine=  Utility.createInventoryLine('New', parts.Id, cCode.Id);
            System.assertNotEquals(invLine.Id, null);
           
            List<Gallery__c> myPartGalleryList = new List<Gallery__c>();
            for(Integer i=0;i<5;i++){
                Gallery__c gal = new Gallery__c();
                gal.Part__c = parts.Id;
                gal.Commentes__c ='test';
                gal.Image_URL__c = 'https://cdn.shoppd.net/salesforce/0/0/1609940961105.png';
                myPartGalleryList.add(gal);
            }
            utility.createGalleryList(myPartGalleryList);
            
            List<Gallery__c> myCQGalleryList = new List<Gallery__c>();
            for(Integer i=0;i<5;i++){
                Gallery__c gal = new Gallery__c();
                gal.Customer_Quote__c = cq.Id;
                gal.Commentes__c ='test';
                gal.Image_URL__c = 'https://cdn.shoppd.net/salesforce/0/0/1609940961105.png';
                myCQGalleryList.add(gal);
            }
            utility.createGalleryList(myCQGalleryList);
           
            List<Gallery__c> myInvGalleryList = new List<Gallery__c>();
            for(Integer i=0;i<5;i++){
                Gallery__c gal = new Gallery__c();
                gal.To__c = 'Vendor';
                gal.From__c = 'Vendor';
                gal.Inbound__c = true;
                gal.Commentes__c ='test';
                gal.Inventory_Line__c = invLine.Id;
                gal.Image_URL__c = 'https://cdn.shoppd.net/salesforce/0/0/1609940961105.png';
                myInvGalleryList.add(gal);
            }
            utility.createGalleryList(myInvGalleryList);
           
            List<Gallery__c> GalleryListForUpdate = new List<Gallery__c>();
            for( Gallery__c gal : myInvGalleryList){
                gal.Commentes__c ='test gallery update';
                GalleryListForUpdate.add(gal);
            }
            
            Test.startTest();
            String ObjectName  = GallariesViewController.setObjectType(parts.Id);
            System.assertEquals(ObjectName,'Part__c');
            List<Gallery__c> PartGalleryList  = GallariesViewController.fetchGalleriesList(parts.Id);
            System.assertEquals(PartGalleryList.size(),5);
              List<Gallery__c> PartGalleryList1  = GallariesViewController.fetchGalleriesList(part1.Id); // for null condition
            System.assertEquals(PartGalleryList1,null);
            List<Gallery__c> InvGalleryList  = GallariesViewController.fetchGalleriesList(invLine.Id);
            System.assertEquals(InvGalleryList.size(),5);
            List<Gallery__c> CQGalleryList  = GallariesViewController.fetchGalleriesList(cq.Id);
            System.assertEquals(CQGalleryList.size(),5);
            GallariesViewController.deleteGallery(GalleryListForUpdate[0].Id);
            GallariesViewController.updateGalleries(GalleryListForUpdate);
            System.assertEquals(GalleryListForUpdate[0].Commentes__c,'test gallery update');
            Test.stopTest();
        }
    }
    
}