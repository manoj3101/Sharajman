const { test, expect } = require('@playwright/test');
class LOAManagement{
   
    //Constructor
    constructor(page){
        this.page=page;
    }

    //xpath
    
    //Methods
    //LOA Generation Page
    async loaGeneration(){
        const home= await this.page.locator("(//span[contains(@class,'m-icon ng-star-inserted')])[2]");
        await home.hover();
        await this.page.locator("//span[contains(text(),'LOA Management')]").click();
        await this.page.locator("//span[contains(text(),'LOA Generation')]").click();
        
    }

    //Upload the Document ===> Responder Side
    async uploadDocument(CFP){
        //await this.page.getByRole('checkbox', { name: ' Responder ' }).check();
        await this.page.locator(" //label[contains(text(),'Responder')]").click();
        await this.page.getByPlaceholder('Search').fill(CFP);
        await this.page.getByRole('button', { name: /Search/i }).click();
        await this.page.click("//div[contains(@class,'gredient-blue-icon-box')]");
        await this.page.waitForSelector("(//input[@type='file'])[2]");
        await this.page.locator("(//input[@type='file'])[2]").setInputFiles('./Resources/Files/LOA.pdf');
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('button', { name: /Upload/i }).click();
        await this.page.waitForTimeout(2000);
        // await expect(await this.page.locator("//div[@ngbtooltip='Re-Upload']")).toBeHidden();
        console.log("----------------Successfully Uploaded the document ----------------");
    }

    async action(CFP){
        await this.page.getByPlaceholder('Search').fill(CFP);
        await this.page.getByRole('button', { name: /Search/i }).click();
        await this.page.getByRole('button', { name: /Action/i }).click();
        await this.page.getByPlaceholder('remarks').fill("LOA Approved");
        await this.page.getByRole('button', { name: /Accept/i }).click();
        console.log("----------------Action Done Successfully ----------------");
        
    }

    async formatD(CFP,gtam,source,rpo,tGnare){
        // await this.page.getByPlaceholder('Search').fill(CFP);
        // await this.page.getByRole('button', { name: /Search/i }).click();
        
        await this.page.waitForTimeout(2000);
        //punch Application
        await this.page.locator("//label[contains(text(),'Punch Application')]").click();
        //Generate New Format-D
        await this.page.getByRole('button', { name: /Generate New Format-D/i }).click();

        //Application Number
        await this.page.getByPlaceholder('Search Organization').fill(CFP);

        //Transaction under GTAM (Yes/No)
        //Value = YES | NO 
        await this.page.locator("//Select[@formcontrolname='transaction_under_gtam']").selectOption({value:gtam});

        //Source of generation is solar/non-solar/hydro 
        //Value = SOLAR || NON-SOLAR || HYDRO || NA
        await this.page.locator("//Select[@formcontrolname='source_generation']").selectOption({value:source});

        //Whether the Transaction is for meeting RPO obligation
        //Value = YES | NO | NA
        await this.page.locator("//Select[@formcontrolname='rpo_obligation']").selectOption({value:rpo});

        //Granting T-GNA/T-GNARE exigency application
        //Value = YES | NO 
        await this.page.locator("//Select[@formcontrolname='granting_exigency']").selectOption({value:tGnare});

        //Click  Generate Format-D 
        await this.page.getByRole('button', { name: /Generate Format-D/i }).click();
        //Confirm Yes
        await this.page.getByRole('button',{name:' Yes '}).click();
        console.log("----------------Format-D Generated Successfully ----------------");


    }

}
module.exports = LOAManagement;