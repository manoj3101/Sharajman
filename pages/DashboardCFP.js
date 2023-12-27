const { test, expect } = require('@playwright/test');

let currentDate = new Date();
// Get current time components
let currentHours = currentDate.getHours();
let currentMinutes = currentDate.getMinutes();

const minutesToAdd = 2;
const minutesToAdd1 = 17;

// Calculate the new time
const newMinutes = ((currentMinutes + minutesToAdd) % 60).toString();
const newMinutes1 = ((currentMinutes + minutesToAdd1) % 60).toString();
console.log(currentHours.toString())
console.log(newMinutes);
console.log(newMinutes1);
console.log(currentMinutes);


    class DashboardCFP {

        //Constructor
        constructor(page, context, browser) {
            this.page = page;
            this.context = context;
            this.browser = browser;
            
        }
        CFP_Num = null;
        //Time
        Time1 = '10:00';
        Time2 = '22:00';

        //import date
        imp_start_date = '2023-12-25';
        imp_end_date = '2023-12-30';

        //export date
        exp_start_date = '2024-01-10';
        exp_end_date = '2024-01-20';
//-------------------------------------------------------------------------------------------------------------

        //locators or xpaths
        text = 'Ex- Power Swapping of 10 MW of energy';
        Import = "//label[contains(text(),'Import')]";
        Export = "//label[contains(text(),'Export')]";
        responderyes = "//label[@for='is_result_publicYes']";
        responderno = "//label[@for='is_result_publicNo']";
        Add = "//button[contains(text(),'Add')]";

        //import add
        fromDate_imp = "//input[@formcontrolname='sch_start_date']";
        toDate_imp = "//input[@formcontrolname='sch_end_date']";
        startTime_imp = "//select[@formcontrolname='sch_start_time']";
        endTime_imp = "//select[@formcontrolname='sch_end_time']";

        quantum = "//input[@formcontrolname='quantum']";

        //Export add
        fromDate_exp = "//input[@formcontrolname='retn_start_date']";
        toDate_exp = "//input[@formcontrolname='retn_end_date']";
        startTime_exp = "//select[@formcontrolname='retn_start_time']";
        endTime_exp = "//select[@formcontrolname='retn_end_time']";

        //CFP publishing Timeline
        hh = "//input[@aria-label='Hours']";
        mm = "//input[@aria-label='Minutes']";

        //Other Details
        settlement = "(//select[contains(@aria-label,'Floating label select example')])[2]";

        //Ceiling Return for Import
        ceiling_baseYes = "//label[contains(@for,'PercentageYes')]";
        ceiling_baseNo = "//label[contains(@for,'PercentageNo')]";
        ceiling_Base_return= "//input[contains(@placeholder,'Return')]";

        //Base return for Export
        base_return = "//input[contains(@placeholder,'Base Return')]";

        showHighlight = "//button[contains(text(),'Show Highlights')]";

        //select Responder
        select_Responder = "//button[contains(text(),'Select Responders')]";
        search_responder = "(//input[contains(@placeholder,'Search Responders')])[1]";
        add_responders = "//div//tbody//td//img";

        next = "//button[contains(text(),'Next')]";

        //after publish
        cfp = "//h4[contains(text(),'The CFP')]";
        cfpNumber = "//h4[contains(text(),'The CFP')]//span";


        //Responder side xpath
        responder_tab = "//a[contains(text(),'Responder')]";

//--------------------------------------------------------------------------------------------------------

        //Methods
        //Tab Switching 
        async tabswitch(url) {
            await this.page.waitForTimeout(4000);
            const allPages = await this.context.pages();
            //const allcontexts = this.browser.contexts();
            console.log("All Contexts-------" + allPages.length);
            for (const page of allPages) {
                if ((await page.url()).includes(url)) {
                    console.log("URL :"+await page.url());
                    this.page = page;
                    await this.page.bringToFront();
                }
            }
        }

        //Click Create CFP
        async clickCreateCFP() {
            await this.tabswitch("cfp");
            await this.page.getByRole('button', { name: /Create New CFP/i }).click();
            await this.page.getByRole('button', { name: /I Agree/i }).click();
        }

        //Power Swapping 
        async powerSwapping(energy){
            //Text Area
            await this.page.getByPlaceholder(this.text).fill("Power Swapping of "+ energy +" MW of energy");
        }

        //Import/Export
        async firstChoice(choice){
            await this.page.locator("//label[contains(text(),'" + choice + "')]").check();
        }
        
        //Result to be Published to all the Responders
        async resultPublish(result){
            if(result){
                await this.page.check(this.responderyes);
            }
            else{
                await this.page.check(this.responderno)
            }
        
        }

        //Import period
        async importPeriod(quantumValue){
            await this.page.locator(this.Add).nth(0).click();
            await this.page.locator(this.fromDate_imp).fill(this.imp_start_date);
            await this.page.locator(this.toDate_imp).fill(this.imp_end_date);
            await this.page.locator(this.startTime_imp).selectOption({ label: this.Time1 });
            await this.page.locator(this.endTime_imp).selectOption({ label: this.Time2 });
            await this.page.fill(this.quantum, quantumValue);
        }

        //Minimum Quantum
        async minimumQuantum(minQuantum,minQuantumValue){
            if(minQuantum){
                await this.page.check("//label[@for='MinQuantumYes']");
                await this.page.locator("//input[@formcontrolname='min_qty']").fill(minQuantumValue);
            }
            else{
                await this.page.check("//label[@for='MinQuantumNo']");
            }           
        }

        //Export period
        async exportPeriod(){
        
            await this.page.locator(this.Add).nth(0).click();
            await this.page.locator(this.fromDate_exp).fill(this.exp_start_date);
            await this.page.locator(this.toDate_exp).fill(this.exp_end_date);
            await this.page.locator(this.startTime_exp).selectOption({ label: this.Time1 });
            await this.page.locator(this.endTime_exp).selectOption({ label: this.Time2 });
        }

        //to date and time
        async date_time(){
            //Hours
            await this.page.locator(this.hh).nth(0).fill('');
            await this.page.locator(this.hh).nth(0).fill(currentHours.toString());
            //min
            await this.page.locator(this.mm).nth(0).fill('');
            await this.page.locator(this.mm).nth(0).fill(newMinutes);
            //Hours
            // await this.page.locator(this.hh).nth(1).fill('');
            // await this.page.locator(this.hh).nth(1).fill(currentHours.toString());                
            //Min
            await this.page.locator(this.mm).nth(1).fill('');
            await this.page.locator(this.mm).nth(1).fill(newMinutes1);
        }
        
        //Other Details
        async otherDetails(index){
            await this.page.locator(this.settlement).selectOption({ index: index });
            await this.page.waitForTimeout(2000);
            if(index == 0 || index >=3){
                await this.page.locator("//input[@formcontrolname='price_value']").fill('100');
            }
        }

        //comment Box
        async commentBox(condition){
            if (condition) {
                await this.page.check("//label[contains(@for,'btn7')]");
            }
            else{
                await this.page.check("//label[contains(@for,'btn8')]");
            }
        }

        //ceiling Return
        async ceilingBaseReturn(Return,ReturnValue){
            if(Return){
                await this.page.check(this.ceiling_baseYes);
                await this.page.locator(this.ceiling_Base_return).fill(ReturnValue);
            }
            else{
                await this.page.check(this.ceiling_baseNo);
                console.log("No Ceiling or Base Return");
            }       
            await this.page.locator(this.showHighlight).click();
            await this.page.waitForTimeout(5000);
        }    
 
        //select responder
        async selectResponder(){
            await this.page.click(this.select_Responder);
            await this.page.locator(this.search_responder).fill('TickingMinds');
            await this.page.waitForTimeout(3000);
            const elements = await this.page.$$(this.add_responders);
            // Iterate through each element and perform a click action
            for (const element of elements) {
                await this.page.waitForTimeout(2000);
                await element.click();
                //break;
                //await this.page.waitForTimeout(2000);
            }
            await this.page.getByRole('button', { name: /Next/i }).click();
        }
        
                
        //next & publish
        async publish(){
            //await this.page.locator(this.next).click();
            await this.page.getByRole('button', { name: /Next/i }).click();
            await this.page.getByRole('button', { name: /Publish/i }).click();
            await this.page.waitForTimeout(2000);

            //submitted status
            const cfpstatus = await this.page.locator(this.cfp).textContent();
            console.log("----------------" + cfpstatus + "-----------------");
            await expect(cfpstatus).toContain("created successfully");
            const CFP_N = await this.page.locator(this.cfpNumber).innerText();

            this.CFP_Num = CFP_N;
            console.log("CFP ID Status -----------:"+this.CFP_Num);
        }
            
        


    //-----------------------------------------------------------------------------------------------------
        //Click Responder Tab
        async clickresponder() {
            await this.tabswitch("cfp");
            await this.page.click(this.responder_tab);
        }




        //Place Respond (Responder side)
        async place_Respond(CFP,minQuantumValue1,ReturnValue1) {
            const LiveCFP= await this.page.$$("//div[@class='d-flex low-time-strip']");
            console.log("--------------Live CFP Feed--------------: "+LiveCFP.length);
            const lists = await this.page.$$("//b[text()='CFP ID ']/..");
            console.log("-------------------CFP ID-------------: "+lists.length);
            //check the same cfp number 
            
            for (let i = 0; i < lists.length; i++) {
                const textContent = await lists[i].textContent();
                //console.log(textContent);
                if (textContent.includes(CFP)) {
                    console.log("-------------------CFP---------------: "+CFP);
                    await this.page.locator("(//button[contains(text(),'Respond')])["+(i+1)+"]").click();
                    console.log("Clicked Respond");
                    break;
                }
                else {
                    console.log("No Responders List");
                }
            }
            await this.page.waitForTimeout(2000);


            //Place Response
            //If it has Min Quantum
            if (await this.page.isVisible("//input[@formcontrolname='min_quantum']")) {
                await this.page.locator("//input[@formcontrolname='min_quantum']").fill(minQuantumValue1);
            }else{
                console.log("---------------------No Min Quantum----------------------");
            }
            //If it has Base/ceiling return enter the value and place the 
            if (await this.page.isVisible("//input[@formcontrolname='bid_amount']")) {
                await this.page.locator("//input[@formcontrolname='bid_amount']").fill(ReturnValue1);
                await this.page.click("//button[contains(text(),'Place Response')]");
                await this.page.getByRole('button', { name: /I Agree/i }).click();
            }
            else {
                await this.page.click("//button[contains(text(),'Place Response')]");
                await this.page.getByRole('button', { name: /I Agree/i }).click();
            }
            const response=await this.page.locator("//a[contains(text(),'OK')]//preceding::h4[1]").textContent();
            console.log("Response Placed :"+response);
            await expect(response).toContain("Response Placed Successfully");

        }




        //Initiator side for awarding 
        async initiatedFeed(CFP){
            await this.tabswitch("cfp");
            await this.page.waitForTimeout(3000);
            // const initiatedCFP= await this.page.$$("//div[@class='d-flex initiated-time-strip']");
            // console.log("--------------Initiated CFP Feed--------------: "+initiatedCFP.length);

            const lists = await this.page.$$("//b[contains(text(),'CFP ID')]/..");
            console.log("-------------------CFP ID-------------: "+lists.length);
           
            //check the same cfp number            
            for (let i = 0; i < lists.length; i++) {
                const textContent = await lists[i].textContent();
                //console.log("-----------------------"+textContent);
                if (textContent.includes(CFP)) {
                    console.log("-------------------CFP---------------: "+CFP);
                    //await this.page.waitForSelector("//span[contains(@class,'digital-time ng-star-inserted')]", { timeout: 900000, negative: true });
                    await this.page.locator("(//button//div[contains(@class,'icon-bg position-relative')])["+(i+1)+"]").click();
                    await this.page.waitForTimeout(2000);
                    console.log("--------------View Clicked--------------");
                    break;
                }
                else {
                    console.log("No Matching CFP found");
                }
            }             

        }

        //Generate Award
        async generateAward(){
            //click the award icon & proceed with award
            const award = await this.page.locator("//a[@ngbtooltip='Click to Award']");
            if (await award.isVisible()) {
                await award.click();
                await this.page.getByRole('button', { name: /Award/i }).click();
                await this.page.getByRole('button', { name: /Yes/i }).click();
                console.log("-------------Awarded Successfully----------")
            }
            ////button[contains(text(),'Award')]
            ////button[contains(text(),' Yes ')]
            else{
                console.log("-------------No Award Icon----------")
            }
        }


        //Generate LOA
        async generateLOA(CFP){
             //click the Generate LOA icon & proceed with LOA
             const LOA = await this.page.locator("//a[contains(text(),'Generate LOA')]");
            if (await LOA.isVisible()) {
                await LOA.click();
                await this.page.getByRole('button', { name: /Yes/i }).click();
                console.log("-------------Successfully Navigated to Generate LOA Page----------");
            }
            else{
                console.log("-------------No Generate LOA is Visible----------")
            }

            //switch to the tab
            await this.tabswitch('loi');

            await this.page.getByRole('button', { name: /Generate LOA/i }).click();                     
            await this.page.getByRole('button', { name: /Yes/i }).click();
            //await this.page.locator("//a[contains(text(),'View LOA')]").click();
            //await this.tabswitch('loi');
            await this.page.getByPlaceholder('Search').fill(CFP);
            await this.page.getByRole('button', { name: /Search/i }).click();
            await this.page.click("//span[text()='Upload']");
            await this.page.waitForSelector("(//input[@type='file'])[2]");
            await this.page.locator("(//input[@type='file'])[2]").setInputFiles('./Resources/Files/LOA.pdf');
            await this.page.waitForTimeout(2000);
            await this.page.getByRole('button', { name: /Upload/i }).click();
            await this.page.waitForTimeout(2000);
            // await expect(await this.page.locator("//div[@ngbtooltip='Re-Upload']")).toBeHidden();
            console.log("----------------Successfully Uploaded the document ----------------");
        }

        async uploadDocument(){

        }

    }
    module.exports = DashboardCFP;