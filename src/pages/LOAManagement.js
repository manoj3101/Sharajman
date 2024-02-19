const { test, expect } = require('@playwright/test');
class LOAManagement {

    //Constructor
    constructor(page) {
        this.page = page;
    }

    //xpath

    //Methods
    //LOA Generation Page
    async loaGeneration() {
        const home = await this.page.locator("(//span[contains(@class,'m-icon ng-star-inserted')])[2]");
        await home.hover();
        await this.page.locator("//span[contains(text(),'LOA Management')]").click();
        await this.page.locator("//span[contains(text(),'LOA Generation')]").click();

    }

    //Upload the Document ===> Responder Side 
    async uploadDocument(CFP) {

        await this.page.locator(" //label[contains(text(),'Responder')]").click();
        await this.page.getByPlaceholder('Search').fill(CFP);
        await this.page.getByRole('button', { name: /Search/i }).click();
        await this.page.click("//div[contains(@class,'gredient-blue-icon-box')]");
        await this.page.waitForSelector("(//input[@type='file'])[2]");
        await this.page.locator("(//input[@type='file'])[2]").setInputFiles('src/helper/utils/LOA.pdf');
        await this.page.waitForTimeout(3000);
        await this.page.getByRole('button', { name: /Upload/i }).click();
        await this.page.waitForTimeout(3000);

        //Assert
        const loa_assert = await this.page.locator("//*[contains(text(),'LOA has been uploaded successfully')]").textContent();
        expect(loa_assert).toContain("LOA has been uploaded successfully");
        console.log("----------------Successfully Uploaded the document ----------------");

    }

    //Your LOA acceptance timeline has been expired
    async responder_LOA_Expires(CFP) {
        await this.page.locator(" //label[contains(text(),'Responder')]").click();
        await this.page.getByPlaceholder('Search').fill(CFP);
        await this.page.getByRole('button', { name: /Search/i }).click();
        await this.page.click("//div[contains(@class,'gredient-blue-icon-box')]");

        //Assert 
        const Expired = await this.page.locator("//div[@role='alert' and contains(@class, 'toast-message') and contains(text(), 'Your LOA acceptance timeline has been expired')]").textContent();
        await expect(Expired).toContain(" Your LOA acceptance timeline has been expired");
        console.log("-------------Responder can't upload the LOA-------------------- \n !!!!!!!!!!!!!!!!!!!Your LOA acceptance timeline has been expired.!!!!!!!!!!!!!!!!!!!!!!!");

    }

    //Responder rejecting the loa
    async responder_Rejects_loa(CFP) {
        await this.page.waitForTimeout(3000);
        await this.page.locator(" //label[contains(text(),'Responder')]").click();
        await this.page.getByPlaceholder('Search').fill(CFP);
        await this.page.getByRole('button', { name: /Search/i }).click();
        await this.page.click("//div[contains(@class,'gredient-blue-icon-box')]");
        await this.page.click("//*[contains(@for,'rejectRadio')]");
        await this.page.getByPlaceholder('Remarks').fill("Rejected");
        await this.page.getByRole('button', { name: /Upload/i }).click();

        //Assertion 
        const loa_assert = await this.page.locator("//*[contains(text(),'Loa is rejected successfully.')]").textContent();
        expect(loa_assert).toContain("Loa is rejected successfully.");
        console.log("----------------Loa is rejected successfully----------------");

    }

    //Action 
    async action(CFP) {
        await this.page.getByPlaceholder('Search').fill(CFP);
        await this.page.getByRole('button', { name: /Search/i }).click();
        await this.page.getByRole('button', { name: /Action/i }).click();
        await this.page.getByPlaceholder('remarks').fill("LOA Approved");
        await this.page.getByRole('button', { name: /Accept/i }).click();
        console.log("----------------Action Done Successfully ----------------");

    }

    //Function to Generate a random 5 or 6 digit number
    async generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    async formatD(gtam, source, rpo, tGna) {
        // await this.page.getByPlaceholder('Search').fill(CFP);
        // await this.page.getByRole('button', { name: /Search/i }).click();

        await this.page.waitForTimeout(2000);

        //punch Application
        await this.page.locator("//label[contains(text(),'Application generation')]").click();
        //Generate New Format-D
        await this.page.getByRole('button', { name: /Generate New Format-D/i }).click();

        //Function to Generate a random 5 or 6 digit number
        function generateRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        // Generate a random 5 or 6 digit number
        let randomNumber = generateRandomNumber(10000, 999999);

        let application_no = randomNumber.toString();

        console.log(`Application Number : ${application_no}`);

        //Application Number
        await this.page.getByPlaceholder('Search Organization').fill(application_no);

        //Transaction under GTAM (Yes/No)
        //Value = YES | NO 
        await this.page.locator("//Select[@formcontrolname='transaction_under_gtam']").selectOption({ value: gtam });

        //Source of generation is solar/non-solar/hydro 
        //Value = SOLAR || NON-SOLAR || HYDRO || NA
        await this.page.locator("//Select[@formcontrolname='source_generation']").selectOption({ value: source });

        //Whether the Transaction is for meeting RPO obligation
        //Value = YES | NO | NA
        await this.page.locator("//Select[@formcontrolname='rpo_obligation']").selectOption({ value: rpo });

        //Granting T-GNA/T-GNARE exigency application
        //Value = YES | NO 
        await this.page.locator("//Select[@formcontrolname='granting_exigency']").selectOption({ value: tGna });

        //Click  Generate Format-D 
        await this.page.getByRole('button', { name: /Generate Format-D/i }).click();
        //Confirm Yes
        await this.page.getByRole('button', { name: ' Yes ' }).click();

        const message = await this.page.locator("//*[contains(text(),'Format-D have been generated successfully')]").textContent();
        console.log(`${message}`);
        await expect(message).toContain("Format-D have been generated successfully");
        await this.page.waitForTimeout(2000);
        console.log("----------------Format-D Generated Successfully ----------------");


    }

}

module.exports = LOAManagement;