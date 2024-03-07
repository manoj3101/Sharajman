const { test, expect } = require('@playwright/test');
const tabSwitcher = require('../hooks/tabSwitcher');
const data = require("../helper/utils/data.json");
const pdf = require('pdf-parse');
const fs = require('fs').promises;
const LOAManagement = require('../pages/LOAManagement');


const currentDate = new Date();

// Get day, month, and year
const day = String(currentDate.getDate()).padStart(2, '0');
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Note: Month is zero-based
const year = currentDate.getFullYear();



class DashboardCFP {

    //Constructor
    constructor(page, context, browser) {
        this.page = page;
        this.context = context;
        this.browser = browser;
    }

    CFP_Num = null;

    //-------------------------------------------------------------------------------------------------------------

    //locators or xpaths
    text = "//textarea[@formcontrolname='title']";
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
    ceiling_Base_return = "//input[contains(@placeholder,'Return')]";

    //Base return for Export
    base_return = "//input[contains(@placeholder,'Base Return')]";

    showHighlight = "//button[contains(text(),'Show Highlights')]";

    //select Responder
    select_Responder = "//label[contains(text(),'Select Responders')]";
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

    async switchToTab(url) {

        await this.page.waitForTimeout(4000);
        const allPages = await this.page.context().pages();
        console.log("All Contexts ============" + allPages.length);
        for (const page of allPages) {
            if ((await page.url()).includes(url)) {
                console.log("URL :" + await this.page.url());
                this.page = page;
                await this.page.bringToFront();
            }
        }
        await this.page.waitForTimeout(4000);
        // throw new Error(`Tab with URL ${url} not found.`);
    }


    //Click Create CFP
    async clickCreateCFP(chooseCFP) {
        // Create a TabSwitcher instance
        // const tabSwitch = new tabSwitcher();
        // await tabSwitch.switchToTab("cfp");

        await this.switchToTab("cfp");
        await this.page.getByRole('button', { name: /Create New CFP/i }).click();
        switch (chooseCFP) {
            case "Quick CFP":
                await this.page.locator("//span[contains(text(),'" + chooseCFP + "')]").nth(0).click();
                console.log(`Clicked ${chooseCFP}`);
                break;
            case "Custom CFP":
                await this.page.locator("//span[contains(text(),'" + chooseCFP + "')]").nth(0).click();
                console.log(`Clicked ${chooseCFP}`);
                await this.page.waitForTimeout(2000);
                await this.page.getByRole('textbox').setInputFiles('src/helper/utils/CFP.pdf');
                await this.page.waitForTimeout(4000);
                break;
        }
        // await this.page.locator("//span[contains(text(),'Quick CFP')]").click();
        await this.page.getByRole('button', { name: /I Agree/i }).click();
    }

    //Power Swapping 
    async powerSwapping(energy) {
        //Text Area
        await this.page.locator(this.text).fill("Power Swapping of " + energy + " MW of energy(Auto Test)");
    }

    //Import/Export
    async firstChoice(choice) {
        choice = choice.toLowerCase().replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });
        console.log(`First choice === ${choice}`);
        await this.page.locator("//label[contains(text(),'" + choice + "')]").check();
    }

    //Result to be Published to all the Responders
    async resultPublish(result) {
        if (result) {
            await this.page.check(this.responderyes);
        }
        else {
            await this.page.check(this.responderno);
        }

    }

    //Import period
    async importPeriod(quantumValue, imp_start_date, imp_end_date, imp_start_time, imp_end_time) {
        //await this.page.locator(this.Add).nth(0).click();
        await this.page.locator(this.fromDate_imp).fill(imp_start_date);
        await this.page.locator(this.toDate_imp).fill(imp_end_date);
        await this.page.locator(this.startTime_imp).selectOption({ label: imp_start_time });
        await this.page.locator(this.endTime_imp).selectOption({ label: imp_end_time });
        await this.page.fill(this.quantum, quantumValue);

        // await this.page.waitForTimeout(2000);
        // const energy = await this.page.getByPlaceholder("Energy").nth(0).textContent();
        // console.log(energy);
    }

    //Minimum Quantum
    async minimumQuantum(minQuantum, minQuantumValue) {
        if (minQuantum) {
            await this.page.check("//label[@for='MinQuantumYes']");
            await this.page.locator("//input[@formcontrolname='min_qty']").fill(minQuantumValue);
        }
        else {
            await this.page.check("//label[@for='MinQuantumNo']");
        }
    }

    //Export period
    async exportPeriod(exp_start_date, exp_end_date, exp_start_time, exp_end_time) {

        //await this.page.locator(this.Add).nth(0).click();
        await this.page.locator(this.fromDate_exp).fill(exp_start_date);
        await this.page.locator(this.toDate_exp).fill(exp_end_date);
        await this.page.locator(this.startTime_exp).selectOption({ label: exp_start_time });
        await this.page.locator(this.endTime_exp).selectOption({ label: exp_end_time });
    }

    //Publishing the CFP date and time
    async publishing_time() {
        // Define currentDate
        let currentDate = new Date();

        // Get current time components
        let currentHours = currentDate.getHours();
        let currentMinutes = currentDate.getMinutes();

        const minutesToAdd = 2;
        const minutesToAdd1 = 17;

        // Calculate the new time
        let newMinutes = (currentMinutes + minutesToAdd) % 60;
        let newHours = currentHours + Math.floor((currentMinutes + minutesToAdd) / 60);
        newHours = newHours % 24; // Ensure hours remain within 24-hour format

        let newMinutes1 = (currentMinutes + minutesToAdd1) % 60;
        let newHours1 = currentHours + Math.floor((currentMinutes + minutesToAdd1) / 60);
        newHours1 = newHours1 % 24; // Ensure hours remain within 24-hour format

        let hour_now = currentHours.toString().padStart(2, '0');
        let minute_now = currentMinutes.toString().padStart(2, '0');
        let hour1 = newHours.toString().padStart(2, '0');
        let minute1 = newMinutes.toString().padStart(2, '0');
        let hour2 = newHours1.toString().padStart(2, '0');
        let minute2 = newMinutes1.toString().padStart(2, '0');

        console.log("-----------------------------------------");

        console.log(`Current Time ${hour_now}:${minute_now}`);
        console.log(`Live Start at ${hour1}:${minute1}`);
        console.log(`Live Ending at ${hour2}:${minute2}`);

        //Hours
        await this.page.locator(this.hh).nth(0).fill('');
        await this.page.locator(this.hh).nth(0).fill(hour1);
        //min
        await this.page.locator(this.mm).nth(0).fill('');
        await this.page.locator(this.mm).nth(0).fill(minute1);
        //Hours
        await this.page.locator(this.hh).nth(1).fill('');
        await this.page.locator(this.hh).nth(1).fill(hour2);
        //Min
        await this.page.locator(this.mm).nth(1).fill('');
        await this.page.locator(this.mm).nth(1).fill(minute2);

    }

    //Response Validity Period
    async response_validityTime(days, hours, minutes) {

        await this.page.getByPlaceholder("Days").nth(0).fill(days);
        await this.page.getByPlaceholder("Hours").nth(0).fill(hours);
        await this.page.getByPlaceholder("Minutes").nth(0).fill(minutes);
    }

    // Contract Awarding Timeline to Responder
    async awarding_time(days, hours, minutes) {
        await this.page.getByPlaceholder("Days").nth(1).fill(days);
        await this.page.getByPlaceholder("Hours").nth(1).fill(hours);
        await this.page.getByPlaceholder("Minutes").nth(1).fill(minutes);
    }

    //LOA issuance timeline by the Initiator
    async loa_Issuance_time(days, hours, minutes) {
        await this.page.getByPlaceholder("Days").nth(2).fill(days);
        await this.page.getByPlaceholder("Hours").nth(2).fill(hours);
        await this.page.getByPlaceholder("Minutes").nth(2).fill(minutes);
    }

    //LOA acceptance timeline by the Responder
    async loa_Acceptance_time(days, hours, minutes) {
        await this.page.getByPlaceholder("Days").nth(3).fill(days);
        await this.page.getByPlaceholder("Hours").nth(3).fill(hours);
        await this.page.getByPlaceholder("Minutes").nth(3).fill(minutes);
    }

    //Other Details
    async otherDetails(index, value) {
        await this.page.locator(this.settlement).selectOption({ index: index });
        await this.page.waitForTimeout(2000);
        if (index == 0 || index >= 3) {
            await this.page.locator("//input[@formcontrolname='price_value']").fill(value);
        }
    }

    //comment Box
    async commentBox(condition) {
        if (condition) {
            await this.page.check("//label[contains(@for,'btn7')]");
        }
        else {
            await this.page.check("//label[contains(@for,'btn8')]");
        }
    }

    //ceiling Return
    async ceilingBaseReturn(Return, ReturnValue) {
        if (Return) {
            await this.page.check(this.ceiling_baseYes);
            await this.page.locator(this.ceiling_Base_return).fill(ReturnValue);
        }
        else {
            await this.page.check(this.ceiling_baseNo);
            console.log(" X No Ceiling or Base Return X");
        }
        //await this.page.locator(this.showHighlight).click();
        await this.page.waitForTimeout(3000);
    }

    //select responder
    async selectResponder(multiple_responder) {
        await this.page.click(this.select_Responder);
        // await this.page.locator(this.search_responder).fill('TickingMinds');
        await this.page.locator(this.search_responder).fill('Tickingminds_');
        await this.page.waitForTimeout(2500);
        const elements = await this.page.$$(this.add_responders);
        // Iterate through each element and perform a click action
        if (multiple_responder) {
            for (const element of elements) {
                await this.page.waitForTimeout(1500);
                await element.click();
                //break;
                //await this.page.waitForTimeout(2000);
            }
            //Select all option
            // await this.page.locator("//input[@id='flexCheckChecked']").click();
        }
        else {
            await this.page.waitForTimeout(1500);
            await this.page.locator("(//div//tbody//td//img)[1]").click();
        }
        await this.page.getByRole('button', { name: /Next/i }).click();
    }

    //Custom guest
    async custom_Guests(custom_Guests) {
        await this.page.getByPlaceholder("Enter Guest Email Id").fill(custom_Guests);

    }

    //remarks
    async remarks(remarks) {
        await this.page.getByPlaceholder("Enter Remarks").fill(remarks);
    }

    //next & publish
    async publish() {
        //await this.page.locator(this.next).click();
        await this.page.getByRole('button', { name: /Next/i }).click();
        await this.page.getByRole('button', { name: /Publish/i }).click();
        await this.page.getByRole('button', { name: /Proceed/i }).click();//New feature click proceed to continue
        await this.page.waitForTimeout(2000);

        //submitted status
        const cfpstatus = await this.page.locator(this.cfp).textContent();
        console.log("----------------" + cfpstatus + "-----------------");
        await expect(cfpstatus).toContain("created successfully");
        const CFP_N = await this.page.locator(this.cfpNumber).innerText();

        this.CFP_Num = CFP_N;
        console.log("CFP ID Status -----------:" + this.CFP_Num);


    }




    //-----------------------------------------------------------------------------------------------------
    //Click Responder Tab
    async clickresponder() {
        // const tabSwitch = new tabSwitcher();
        // await tabSwitch.switchToTab("cfp");
        await this.switchToTab("cfp");
        await this.page.click(this.responder_tab);
    }




    //Place Respond (Responder side)
    async place_Respond(CFP, minQuantumValue1, ReturnValue1) {

        await this.page.reload({ waitUntil: 'load' });
        await this.page.waitForTimeout(4000);
        await this.page.click(this.responder_tab);
        await this.page.waitForTimeout(3000);
        const LiveCFP = await this.page.$$("//div[@class='d-flex low-time-strip']");
        console.log("--------------Live CFP Feed--------------: " + LiveCFP.length);
        const lists = await this.page.$$("//b[text()='CFP ID ']/..");
        console.log("-------------------CFP ID-------------: " + lists.length);
        //check the same cfp number 


        for (let i = 0; i < lists.length; i++) {
            const textContent = await lists[i].textContent();
            //console.log(textContent);
            if (textContent.includes(CFP)) {
                console.log("-------------------CFP---------------: " + CFP);
                await this.page.locator("(//button[contains(text(),'Respond')])[" + (i + 1) + "]").click();
                console.log("                  ✔ Clicked Respond ✔                 ");
                break;
            }
            else {
                console.log("               X No Responders List X               ");
            }
        }
        await this.page.waitForTimeout(3000);


        //Place Response        
        //If it has Min Quantum
        if (await this.page.isVisible("//input[@formcontrolname='min_quantum']")) {
            await this.page.locator("//input[@formcontrolname='min_quantum']").fill(minQuantumValue1);
            await this.page.locator("//input[@formcontrolname='min_quantum']").fill('');
            await this.page.locator("//input[@formcontrolname='min_quantum']").type(minQuantumValue1);
            // await this.page.locator("//input[@formcontrolname='min_quantum']").pressSequentially(minQuantumValue1); 
            // await this.page.$eval('input[formcontrolname="min_quantum"]', (input, minQuantumValue1) => {
            //     input.value = minQuantumValue1;
            // }, minQuantumValue1);

            // await this.page.evaluate(() => {
            //     // Use JavaScript code to inspect the element's properties
            //     const input = document.querySelector("input[formcontrolname='min_quantum']");

            //     // Check if the element exists
            //     if (input) {
            //         // Log the value of the input element
            //         console.log('Value:', input.value);
            //         // Log any other properties you're interested in
            //         console.log('Type:', input.type);
            //         console.log('Is it visible?', input.offsetParent !== null); // Check if it's visible
            //         // Add more properties as needed
            //     } else {
            //         console.log("Element not found!");
            //     }
            // });

            // await this.page.focus("//input[@formcontrolname='min_quantum']");
            // await this.page.waitForSelector("input[formcontrolname='min_quantum']");
            // await this.page.keyboard.type(minQuantumValue1);


            // const selector = "input[formcontrolname='min_quantum']";

            // await this.page.waitForFunction(
            //     (selector) => {
            //         const activeElement = document.activeElement;
            //         const targetElement = document.querySelector(selector);
            //         return activeElement === targetElement;
            //     },
            //     {},
            //     selector
            // );

            //Using Eval function method
            // await this.page.$eval('input[formcontrolname="min_quantum"]', (input, minQuantumValue1) => {
            //     input.value = minQuantumValue1;
            // }, minQuantumValue1);

        } else {
            console.log("--------------------X No Min Quantum X----------------------");
        }

        //If it has Base/ceiling return enter the value and place the 
        if (await this.page.isVisible("//input[@formcontrolname='bid_amount']")) {
            console.log(await this.page.locator("//div[contains(@class,'d-flex align-items-center justify-content-between')]//p").nth(0).textContent());
            //Ener Return ...
            await this.page.locator("//input[@formcontrolname='bid_amount']").fill(ReturnValue1);
            // await this.page.$eval("//input[@formcontrolname='bid_amount']", (input, ReturnValue1) => {
            //     input.value = ReturnValue1;
            // }, ReturnValue1);

            await this.page.locator("//input[@id='flexCheckChecked']").click(); // Click Check Box
        }
        else {
            await this.page.locator("//input[@id='flexCheckChecked']").click(); // Click Check Box
        }




        //Placing the responses....
        await this.page.waitForTimeout(2000);
        //Click place response button...
        await this.page.locator("//button[contains(text(),'Place Response')]").click({ timeout: 50000 });
        await this.page.getByRole('button', { name: /Proceed/i }).click(); //new button
        
        // await this.page.$eval("//button[contains(text(),'Place Response')]", (button) => {
        //     if(button.textContent.includes('Place Response')) {
        //         button.click();
        //     }
        // });

        //Checking the Message Response Placed Successfully is correct or not.
        await this.page.waitForTimeout(2000);

        //Negative Case Checking the error message 
        if (await this.page.isVisible("//h4[ contains(text(),'Please enter response amount smaller than or equal')]")) {
            let msg = await pageFixture.page.locator("//h4[ contains(text(),'Please enter response amount smaller than or equal')]").textContent();
            //const msg = await msgElement.textContent();
            console.log(`An error Message is : ${msg}`);
            await this.page.waitForTimeout(2000);
            await expect(msg).toContain("Please enter response amount smaller than or equal to ceiling percentage");
            await this.page.locator("//img[contains(@class,'cursor-pointer on-h')]").click();
            console.log("-------------------- X Response CFP couldn't placed Successfully X -----------------");
        }
        else {
            console.log("No Error occur while Response placing.........");
        }

        //Checking the Message Response Placed Successfully is correct or not.
        const response = await this.page.locator("//a[contains(text(),'OK')]//preceding::h4[1]").textContent();
        console.log("-----------------------------------------------------------------------");
        console.log(`Response Placed : ${response}    ✔`);
        console.log("-----------------------------------------------------------------------");
        await expect(response).toContain("Response Placed Successfully");
        await this.page.locator("//*[contains(text(),'OK')]").click();
        // await this.page.locator("(//img[contains(@class,'cursor-pointer')])[12]").click();
        await this.page.locator("//span[contains(@class,'d-flex align-items')]/child::img[@class='cursor-pointer']").click();

    }


    async demo_place_Respond(CFP, minQuantumValue1, ReturnValue1) {

        await this.page.reload({ waitUntil: 'load' });
        await this.page.waitForTimeout(4000);
        await this.page.click(this.responder_tab);
        await this.page.waitForTimeout(3000);
        const LiveCFP = await this.page.$$("//div[@class='d-flex low-time-strip']");
        console.log("--------------Live CFP Feed--------------: " + LiveCFP.length);
        const lists = await this.page.$$("//b[text()='CFP ID ']/..");
        console.log("-------------------CFP ID-------------: " + lists.length);
        //check the same cfp number 


        for (let i = 0; i < lists.length; i++) {
            const textContent = await lists[i].textContent();
            //console.log(textContent);
            if (textContent.includes(CFP)) {
                console.log("-------------------CFP---------------: " + CFP);
                await this.page.locator("(//button[contains(text(),'Respond')])[" + (i + 1) + "]").click();
                console.log("                  ✔ Clicked Respond ✔                 ");
                break;
            }
            else {
                console.log("               X No Responders List X               ");
            }
        }
        await this.page.waitForTimeout(3000);


        //Place Response        
        //If it has Min Quantum
        if (await this.page.isVisible("//input[@formcontrolname='min_quantum']")) {
            // await this.page.locator("//input[@formcontrolname='min_quantum']").fill(minQuantumValue1);
            // await this.page.locator("//input[@formcontrolname='min_quantum']").fill('');
            // await this.page.locator("//input[@formcontrolname='min_quantum']").type(minQuantumValue1);
            // await this.page.locator("//input[@formcontrolname='min_quantum']").pressSequentially(minQuantumValue1); 
            // await this.page.$eval('input[formcontrolname="min_quantum"]', (input, minQuantumValue1) => {
            //     input.value = minQuantumValue1;
            // }, minQuantumValue1);

            // await this.page.evaluate(() => {
            //     // Use JavaScript code to inspect the element's properties
            //     const input = document.querySelector("input[formcontrolname='min_quantum']");

            //     // Check if the element exists
            //     if (input) {
            //         // Log the value of the input element
            //         console.log('Value:', input.value);
            //         // Log any other properties you're interested in
            //         console.log('Type:', input.type);
            //         console.log('Is it visible?', input.offsetParent !== null); // Check if it's visible
            //         // Add more properties as needed
            //     } else {
            //         console.log("Element not found!");
            //     }
            // });

            // await this.page.focus("//input[@formcontrolname='min_quantum']");
            // await this.page.waitForSelector("input[formcontrolname='min_quantum']");
            // await this.page.keyboard.type(minQuantumValue1);


            // const selector = "input[formcontrolname='min_quantum']";

            // await this.page.waitForFunction(
            //     (selector) => {
            //         const activeElement = document.activeElement;
            //         const targetElement = document.querySelector(selector);
            //         return activeElement === targetElement;
            //     },
            //     {},
            //     selector
            // );

            await this.page.$eval('input[formcontrolname="min_quantum"]', (input, minQuantumValue1) => {
                input.value = minQuantumValue1;
            }, minQuantumValue1);

        } else {
            console.log("--------------------X No Min Quantum X----------------------");
        }

        //If it has Base/ceiling return enter the value and place the 
        if (await this.page.isVisible("//input[@formcontrolname='bid_amount']")) {
            console.log(await this.page.locator("//div[contains(@class,'d-flex align-items-center justify-content-between')]//p").nth(0).textContent());
            //Ener Return ...
            // await this.page.locator("//input[@formcontrolname='bid_amount']").fill(ReturnValue1);
            await this.page.$eval("//input[@formcontrolname='bid_amount']", (input, ReturnValue1) => {
                input.value = ReturnValue1;
            }, ReturnValue1);

            await this.page.locator("//input[@id='flexCheckChecked']").click(); // Click Check Box
        }
        else {
            await this.page.locator("//input[@id='flexCheckChecked']").click(); // Click Check Box
        }
    }

    //Logout 
    async Logout() {
        //Click the Close button 
        await this.page.locator("//span[contains(@class,'d-flex align-items')]/child::img[@class='cursor-pointer']").click();

        //Click user profile and log out 
        await this.page.locator("//img[@id='userprofile1' or @alt='user']").click();
        await this.page.locator("//a[contains(text(),'Logout')]").click();
    }

    //Collect the error message 
    async ceiling_error() {
        const error = await this.page.locator("//*[contains(text(),'Please enter response amount smaller than or equal to ceiling percentage')]");
        console.log(`An error Message is : ${error}`);
        await expect(error).toContain("Please enter response amount smaller than or equal to ceiling percentage");
        await this.page.locator("(//img[contains(@class,'cursor-pointer')])[14]").click();
        console.log("-------------------- X Response CFP couldn't placed Successfully X -----------------");
    }


    //view response
    async view_Respond(CFP) {
        const LiveCFP = await this.page.$$("//div[@class='d-flex low-time-strip']");
        // console.log("--------------Live CFP Feed--------------: "+LiveCFP.length);
        const lists = await this.page.$$("//b[text()='CFP ID ']/..");
        // console.log("-------------------CFP ID-------------: "+lists.length);
        //check the same cfp number 

        for (let i = 0; i < lists.length; i++) {
            const textContent = await lists[i].textContent();
            //console.log(textContent);
            if (textContent.includes(CFP)) {
                console.log("-------------------CFP---------------: " + CFP);
                await this.page.locator("(//button[contains(text(),'View Response')])[" + (i + 1) + "]").click();
                console.log("               ✔ Clicked view Response ✔            ");
                break;
            }
            else {
                console.log("      X No Responders List X    ");
            }
        }
    }


    //Initiator side for awarding 
    async initiatedFeed(CFP) {
        // const tabSwitch = new tabSwitcher();
        // await tabSwitch.switchToTab("cfp");
        await this.switchToTab("cfp");
        await this.page.waitForTimeout(3000);
        // const initiatedCFP= await this.page.$$("//div[@class='d-flex initiated-time-strip']");
        // console.log("--------------Initiated CFP Feed--------------: "+initiatedCFP.length);

        const lists = await this.page.$$("//b[contains(text(),'CFP ID')]/..");
        console.log("-------------------CFP ID-------------: " + lists.length);

        //check the same cfp number            
        for (let i = 0; i < lists.length; i++) {
            const textContent = await lists[i].textContent();
            //console.log("-----------------------"+textContent);
            if (textContent.includes(CFP)) {
                console.log("^^^^^^^^^^^^CFP^^^^^^^^^^^^^: " + CFP);
                //await this.page.waitForSelector("//span[contains(@class,'digital-time ng-star-inserted')]", { timeout: 900000, negative: true });
                await this.page.locator("(//button//div[contains(@class,'icon-bg position-relative')])[" + (i + 1) + "]").click();
                await this.page.waitForTimeout(2000);
                console.log("--------------View Clicked--------------");
                break;
            }
            else {
                console.log("No Matching CFP found");
            }
        }

    }

    //CFP Expire
    async CFP_Expire() {

        const expired = await this.page.locator("//a[contains(@class,'text-Danger')]").textContent();
        await expect(expired).toContain("EXPIRED");
        console.log("                CFP TimeLine Expired Can't able to Award the CFP            ");

    }

    //Calculation part for the energycalculation_initiator
    async energycalculation_initiator(start_date, end_date, start_time, end_time, quantum) {
        // Combine date and time for start and end
        const startdate = new Date(start_date);
        const enddate = new Date(end_date);
        const startTime = new Date(`${startdate.toISOString().split('T')[0]}T${start_time}`);
        const endTime = new Date(`${enddate.toISOString().split('T')[0]}T${end_time}`);

        // Calculate the time difference in milliseconds
        const timeDifference = endTime - startTime;

        // Convert milliseconds to days, hours, and minutes
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
        const minutes = (timeDifference / (1000 * 60)) % 60;
        const time = hours + minutes / 60;

        // Display the result
        console.log(`Initiator Difference: ${days} days, ${hours + minutes / 60} hours\n`);

        //Calculation part 
        const energy_kwh = (days + 1) * time * quantum * 1000;
        console.log("Expected Energy in KWH :" + energy_kwh);

        // If there is any decimal point we can use this.
        // if (energy_kwh % 1 !== 0) {
        //     const energy_kwh= energy_kwh.toFixed(1)
        //     console.log("Energy in KWH: " + energy_kwh.toFixed(1));
        //   } else {
        //     const energy_kwh= energy_kwh.toFixed(0)
        //     console.log("Energy in KWH: " + energy_kwh.toFixed(0));
        //   }

        //Assertion 
        //import 
        const content1 = await this.page.locator("((//div[contains(@class,'ng-star-inserted')])//h5)[6]").textContent();
        const Energy1 = await this.page.locator("(//td[7])[1]").textContent();
        console.log("<<<<<<<<<<<<<<<<<<<<" + content1 + ">>>>>>>>>>>>>>>>>>>>>>");
        console.log("Actual Energy in KWH :" + Energy1);
        const numericEnergy1 = parseFloat(Energy1);

        // await expect(numericEnergy1).toBe(energy_kwh);
        if (energy_kwh === numericEnergy1) {
            console.log(` ✔ Passed Actual Energy in KWH : ${energy_kwh} is equal to the Expected Energy in KWH : ${numericEnergy1}`);
        } else {
            console.log(` X Failed  Actual Energy in KWH : ${energy_kwh} is not equal to the Expected Energy in KWH : ${numericEnergy1}`);
        }

        //Declaring as a  global 
        global.eng = energy_kwh;

    }

    //Calculation part for the energycalculation_responder
    async energycalculation_responder(start_date, end_date, start_time, end_time, returnpercent) {
        // Combine date and time for start and end
        const startdate = new Date(start_date);
        const enddate = new Date(end_date);
        const startTime = new Date(`${startdate.toISOString().split('T')[0]}T${start_time}`);
        const endTime = new Date(`${enddate.toISOString().split('T')[0]}T${end_time}`);

        // Calculate the time difference in milliseconds
        const timeDifference = endTime - startTime;

        // Convert milliseconds to days, hours, and minutes
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
        const minutes = (timeDifference / (1000 * 60)) % 60;
        const time = hours + minutes / 60;

        // Display the result
        console.log(`Responder Difference: ${days} days, ${hours + minutes / 60} hours\n`);

        const initiator_kwh = global.eng;

        //Calculation part        
        const responder_kwh = initiator_kwh * (returnpercent / 100); //return percentage is
        const responder_megawatt = responder_kwh / (1000 * (days + 1) * time);

        console.log("Expected Energy1 in KWH : " + initiator_kwh);
        console.log("Expected Energy2 in KWH : " + responder_kwh);
        const roundedQuantum = Number(responder_megawatt.toFixed(2));
        console.log("Expected Quantum in MW : " + responder_megawatt);
        console.log("Round off Actual Quantum in MW : " + roundedQuantum);

        //assert 
        //export
        const content2 = await this.page.locator("((//div[contains(@class,'ng-star-inserted')])//h5)[7]").textContent();
        const Energy2 = await this.page.locator("(//td[8])[1]").textContent();
        const quantum = await this.page.locator("(//td[7])[2]").textContent();
        console.log("<<<<<<<<<<<<<<<<" + content2 + ">>>>>>>>>>>>>>>>>>>>");
        console.log("Actual Energy in KWH :" + Energy2);
        console.log("Actual Quantum in MH :" + quantum);
        const numericEnergy1 = parseFloat(Energy2);
        const numericquantum = parseFloat(quantum);

        //  await expect.soft(numericquantum).toBe(roundedQuantum);
        //  await expect.soft(numericEnergy1).toBe(responder_kwh);


        if (responder_kwh === numericEnergy1) {
            console.log(` ✔ Passed Actual Energy in KWH : ${responder_kwh} is equal to the Expected Energy in KWH : ${numericEnergy1}`);
        } else {
            console.log(` X Failed  Actual Energy in KWH : ${responder_kwh} is not equal to the Expected Energy in KWH : ${numericEnergy1}`);
        }
        if (roundedQuantum === numericquantum) {
            console.log(` ✔ Passed Actual Quantum in MW : ${roundedQuantum} is equal to the Expected Quantum in MW : ${numericquantum}`);
        } else {
            console.log(` X Failed Actual Quantum in MW : ${roundedQuantum} is not equal to the Expected Quantum in MW : ${numericquantum}`);
        }
    }


    async multiple_responder() {
        const returns = await page.$$("//table[contains(@class,'table overflow-hidden rounded')]//tbody//tr[1]/td[4]");

        // Initialize an empty array to store objects with index and number
        let numbersArray = [];

        // Loop through the div elements, considering only odd ones
        for (let i = 1; i <= returns.length; i++) {
            const returnsText = await returns[i].innerText();
            // Remove the % symbol and convert to number
            const numberValue = parseFloat(returnsText.replace('%', ''));

            // Create an object containing both index and number
            const obj = {
                index: i,
                value: numberValue
            };

            // Push the object into the array
            numbersArray.push(obj);
        }

        // Find the maximum number and its corresponding index
        let maxNumber = 0;
        let maxIndex;

        for (let i = 0; i < numbersArray.length; i++) {
            if (numbersArray[i].value > maxNumber) {
                maxNumber = numbersArray[i].value;
                maxIndex = numbersArray[i].index;
            }
        }

        // Now maxNumber contains the highest number, and maxIndex contains its corresponding index
        console.log("Highest Number:", maxNumber);
        console.log("Index of Highest Number:", maxIndex);



    }


    //Generate Award
    async generateAward() {
        const returns = await this.page.$$("//table[contains(@class,'table overflow-hidden rounded')]//tbody//tr[1]/td[4]//div");
        console.log(`The lenght of the ruturn (%) :${returns.length}`);
        // Initialize an empty array to store objects with index and number
        let numbersArray = [];

        // Loop through the div elements, considering only odd ones
        for (let i = 0; i < returns.length; i++) {
            // await returns[i+1].highlight();
            const returnsText = await returns[i].innerText();
            // Remove the % symbol and convert to number
            const numberValue = parseFloat(returnsText.replace('%', ''));
            console.log(`The ruturn (%) :${numberValue}`);
            // Create an object containing both index and number
            const obj = {
                index: i,
                value: numberValue
            };

            // Push the object into the array
            numbersArray.push(obj);
        }

        // Find the maximum number and its corresponding index
        let maxNumber = 0;
        let maxIndex;

        for (let i = 0; i < numbersArray.length; i++) {
            if (numbersArray[i].value > maxNumber) {
                maxNumber = numbersArray[i].value;
                maxIndex = numbersArray[i].index;
            }
        }

        // Now maxNumber contains the highest number, and maxIndex contains its corresponding index
        console.log("Highest Number:", maxNumber);
        console.log("Index of Highest Number:", maxIndex + 1);


        //click the award icon & proceed with award
        // const award = await this.page.locator("//a[@ngbtooltip='Click to Award']").nth(0);
        const award = await this.page.locator("(//a[@ngbtooltip='Click to Award'])[" + (maxIndex + 1) + "]");
        if (await award.isVisible()) {
            await award.click();
            await this.page.getByRole('button', { name: /Award/i }).click();
            await this.page.getByRole('button', { name: /Yes/i }).click();
            await this.page.getByRole('button', { name: /Close/i }).click(); //new button
            //asserting the Awarded Successfully.
            const awarded = await this.page.locator("//*[contains(text(),'Responder Awarded successfully')]").textContent();
            await expect(awarded).toContain("Responder Awarded successfully");
            console.log("              ✔ Responder Awarded successfully ✔          ");
        }
        ////button[contains(text(),'Award')]
        ////button[contains(text(),' Yes ')]
        else {
            console.log("------------ X No Award Icon X ------------");
        }
    }


    //reference no 
    // const ref_no= await this.page.locator("//input[@placeholder='rfq']").textContent();
    // const LOA_no= await this.page.locator("//input[@formcontrolname='loi_no']").textContent();
    // const subject = await this.page.locator("//input[@formcontrolname='subject']").textContent();

    // const Utility_1  = await this.page.locator("(//tbody//tr//td)[1]").textContent();
    // const Period_1 =  await this.page.locator("(//tbody//tr//td)[2]").textContent();
    // const Duration_1 =  await this.page.locator("(//tbody//tr//td)[3]").textContent();
    // const Quantum_1 = await this.page.locator("(//tbody//tr//td)[4]").textContent();
    // const Utility_2 =  await this.page.locator("(//tbody//tr//td)[5]").textContent();
    // const Period_2 =  await this.page.locator("(//tbody//tr//td)[6]").textContent();
    // const Duration_2 =  await this.page.locator("(//tbody//tr//td)[7]").textContent();
    // const Quantum_2 =  await this.page.locator("(//tbody//tr//td)[8]").textContent();
    // const Return  = await this.page.locator("(//tbody//tr//td)[9]").textContent();

    // const Delivery_Point  = await this.page.locator("//label[contains(text(),'Delivery Point')]/..").textContent();
    // const General_Terms  = await this.page.locator("//label[contains(text(),'General Terms')]/..").textContent();



    //Generate LOA
    async generateLOA(CFP, imp_start_date, imp_end_date, imp_start_time, imp_end_time, quantum, exp_start_date, exp_end_date, exp_start_time, exp_end_time, returnpercent, Settlement_Price) {
        const loaManagement = new LOAManagement(this.page);
        //click the Generate LOA icon & proceed with LOA
        const LOA = await this.page.locator("//a[contains(text(),'Generate LOA')]");
        if (await LOA.isVisible()) {
            const expire_Time = await this.page.locator("//span[contains(@class,'badge fw-600 bg-danger text-white ng-star-inserted')]").textContent();
            console.log(expire_Time);
            await expect(expire_Time).toContain("Expires");
            await LOA.click();
            await this.page.getByRole('button', { name: /Yes/i }).click();
            console.log("-------------Successfully Navigated to Generate LOA Page----------");
        }
        else {
            console.log("-------------No Generate LOA is Visible----------");
        }

        //switch to the tab
        // const tabSwitch = new tabSwitcher();
        // await tabSwitch.switchToTab("loi");
        await this.switchToTab("loi");

        //Getting the text from the LOA Form After generating the pdf
        const ref_no = (await this.page.locator("//input[@placeholder='rfq']").textContent()).trim();
        // const LOA_no = (await this.page.locator("//input[@formcontrolname='loi_no']").textContent()).trim();
        const subject = (await this.page.locator("//input[@formcontrolname='subject']").textContent()).trim();

        const Utility_1 = (await this.page.locator("(//tbody//tr//td)[1]").textContent()).trim();
        const Period_1 = (await this.page.locator("(//tbody//tr//td)[2]").textContent()).trim();
        const Duration_1 = (await this.page.locator("(//tbody//tr//td)[3]").textContent()).trim();
        const Quantum_1 = (await this.page.locator("(//tbody//tr//td)[4]").textContent()).trim();
        const Utility_2 = (await this.page.locator("(//tbody//tr//td)[5]").textContent()).trim();
        const Period_2 = (await this.page.locator("(//tbody//tr//td)[6]").textContent()).trim();
        const Duration_2 = (await this.page.locator("(//tbody//tr//td)[7]").textContent()).trim();
        const Quantum_2 = (await this.page.locator("(//tbody//tr//td)[8]").textContent()).trim();
        const Return = (await this.page.locator("(//tbody//tr//td)[9]").textContent()).trim();

        const delivery_Point = await this.page.locator("//label[contains(text(),'Delivery Point')]/..").textContent();
        const general_Terms = await this.page.locator("//label[contains(text(),'General Terms')]/..").textContent();

        //Expected Result (Text Document);

        await this.page.getByRole('button', { name: /Verify LOA/i }).click();
        await this.page.getByRole('button', { name: /Generate LOA/i }).click();
        await this.page.getByRole('button', { name: /Yes/i }).click();
        await this.page.getByPlaceholder('Search').fill(CFP);
        await this.page.getByRole('button', { name: /Search/i }).click();

        //Document verification 
        //await loaManagement.LOA_documenttverification(CFP, imp_start_date, imp_end_date, imp_start_time, imp_end_time, quantum, exp_start_date, exp_end_date, exp_start_time, exp_end_time, returnpercent, Settlement_Price);

        //First clear the folder using the method
        const folderPath = 'src/helper/utils/PDF/'; // Specify the path to the folder you want to clear
        await this.clearFolder(folderPath);
        await this.page.waitForTimeout(5000);

        const LOA_no = await this.page.locator("//tbody//td[3]").textContent(); //Get the LOA Number 
        //Click the Download Link and wait for the download
        const [download] = await Promise.all([
            this.page.waitForEvent('download', { timeout: 60000 }), // 60 seconds timeout
            // this.page.click('td.align-middle.cursor-pointer > u.linkColor') 
            this.page.click("//td[contains(@class,'cursor-pointer')]/u")
        ]);


        // Use the suggested filename from the download event to save the file
        const suggestedFileName = download.suggestedFilename();
        const filePath = 'src/helper/utils/PDF/' + suggestedFileName; // Specify the correct folder path 
        await download.saveAs(filePath);

        // Use the 'pdf-parse' module to extract the text from the PDF file
        const dataBuffer = await fs.readFile(filePath); // Use async version of readFile
        const parsedData = await pdf(dataBuffer);
        const text = parsedData.text;

        // Now you can use the extracted text
        console.log(`\nText format Content are : ${text}`);

        // Write the parsed text content to a text file for reference
        await fs.writeFile('src/helper/utils/TextDocuments/data.txt', text); // Specify the correct file path


        const line_1 = `LOA	No.`;
        const line_2 = `${LOA_no}`;
        const line_3 = `Date`;
        const line_4 = `Ticking	Minds`;
        const line_5 = `19,	B2,	Emporio,	33,	10th	Ave,	Ashok	Nagar	Chennai	600083`;
        const line_6 = `Letter	of	Acceptance`;
        const line_7 = `${day}-${month}-${year}`;

        const line_8 = `To,`;
        const line_9 = `Tickingminds_1`;
        const line_10 = `no.144,	ashok	nagar	Chennai	600083`;
        const line_11 = `${data.user2}`;
        const line_12 = `Subject	:	Power	swap	arrangement	by	Ticking	Minds	via	CFP	Ref.	No.	${CFP}.`;
        const line_13 = `Ref:1.	e-Listing	${CFP}	dated`;
        const line_14 = `2.	Your	offer	dated	${day}-${month}-${year}	on	NAME	portal`;

        const line_15 = `Dear	Sir,`;
        const line_16 = `With	reference	to	the	above,	we	are	pleased	to	place	Letter	of	Award	(LoA)	in	favour	of	Tickingminds_1,	as	per`;
        const line_17 = `below	mentioned	arrangement.`;
        const line_18 = `Supply	of	Power	from	${data.Utility_2}	to	${data.Utility_1}`;
        const line_19 = `UtilityPeriodDuration	(Hrs.)Quantum	(MW)`;
        const line_20 = `${data.Utility_1}${imp_start_date.dateStr.split('-').reverse().join('-')}	to	${imp_end_date.dateStr.split('-').reverse().join('-')}${imp_start_time}	-	${imp_end_time}${quantum}`;

        const line_21 = `Return	of	Power	by	${data.Utility_1}	to	${data.Utility_2}`;
        const line_22 = `UtilityPeriod`;
        const line_23 = `Duration`;
        const line_24 = `(Hrs.)`;
        const line_25 = `Quantum	in	MW	(As`;
        const line_26 = `per	return	schedule`;
        const line_27 = `and	%	return`;
        const line_28 = `percentage)`;
        const line_29 = `Return	Ratio`;
        const line_30 = `in	%`;
        const line_31 = `${data.Utility_2}${exp_start_date.dateStr.split('-').reverse().join('-')}	to	${exp_end_date.dateStr.split('-').reverse().join('-')}${exp_start_time}	-	${exp_end_time}${Quantum_2}${returnpercent}`;

        const line_32 = `Delivery	Point`;
        const line_33 = `The	delivery	point,	in	either	case,	shall	be	the	Regional	Periphery	of	Exporting`;
        const line_34 = `Utility.`;
        const line_35 = `Settlement	rate	(Rs./kWh)${Settlement_Price}`;
        const line_36 = `General	Terms	&	Conditions`;
        const line_37 = `As	per	the	Framework	Agreement	/	As	per	the	Listing	Document	(Ref.	No.)`;
        const line_38 = `${CFP}`;

        const line_39 = `You	are	requested	to	acknowledge	the	receipt	of	this	LOA	&	give	your	acceptance	on	it.`;
        const line_40 = `Regards,`;
        const line_41 = `Yours	Faithfully,`;
        const line_42 = `For	Ticking	Minds`;

        const line_43 = `Authorised	Signatory`;
        const line_44 = `(Other	Information	if	any)`;

        // Define the strings you want to check in the PDF content
        const stringsToCheck = [line_1.trim(), line_2.trim(), line_3.trim(), line_4.trim(), line_5.trim(), line_6.trim(), line_7.trim(), line_8.trim(), line_9.trim(), line_10.trim(),
        line_11.trim(), line_12.trim(), line_13.trim(), line_14.trim(), line_15.trim(), line_16.trim(), line_17.trim(), line_18.trim(), line_19.trim(), line_20.trim(),
        line_21.trim(), line_22.trim(), line_23.trim(), line_24.trim(), line_25.trim(), line_26.trim(), line_27.trim(), line_28.trim(), line_29.trim(), line_30.trim(),
        line_31.trim(), line_32.trim(), line_33.trim(), line_34.trim(), line_35.trim(), line_36.trim(), line_37.trim(), line_38.trim(), line_39.trim(), line_40.trim(),
        line_41.trim(), line_42.trim(), line_43.trim(), line_44.trim()];

        // Iterate over each string and assert its presence in the PDF content   
        for (const str of stringsToCheck) {
            //expect(text).toContain(str);
            if ((text.replace(/\s+/g, '')).includes(str.replace(/\s+/g, ''))) {
                //expect.soft(text).toContain(str);
                console.log(`✔ Actual Result  : ${str}\n`);
            } else {
                console.log(`X Expected Result is not equal to Actual Result : ${str}`);
            }
        }


        // const checks = await this.page.$$("//tbody//td");

        // // Iterate through the elements
        // for (let i = 1; i < checks.length; i++) {
        //     // Skip the third element (index 4 & index 5)
        //     if (i === 3 || i === 6) {
        //         continue;
        //     }
        //     // Get the text content of the element and trim whitespace
        //     const element = (await checks[i].textContent()).trim();

        //     // Stop when the eighth element (index 10) has occurred
        //     if (i === 8) {
        //         break;
        //     }

        //     if (text.includes(element)) {
        //         console.log(`${element} is Found`);
        //     } else {
        //         console.log(`${element} is not Found in the Text Document`);
        //     }

        //     // Perform the expectation check
        //     //expect(text).toContain(element);
        //     expect.soft(text).toContain(element);

        // }
        console.log("-------------------LOA Document Verification have Done------------------");


        await this.page.waitForTimeout(5000);
        //Need to verify the time.....
        await this.page.click("//span[text()='Upload']");
        await this.page.waitForSelector("(//input[@type='file'])[2]");
        await this.page.locator("(//input[@type='file'])[2]").setInputFiles('src/helper/utils/LOA.pdf');
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('button', { name: /Upload/i }).click();
        await this.page.waitForTimeout(2000);
        // await expect(await this.page.locator("//div[@ngbtooltip='Re-Upload']")).toBeHidden();
        const loa_assert = await this.page.locator("//*[contains(text(),'LOA has been uploaded successfully')]").textContent();
        expect(loa_assert).toContain("LOA has been uploaded successfully");
        console.log("----------------Successfully Uploaded the document ----------------");

    }


    // Helper function to clear files in the folder
    async clearFolder(folderPath) {
        try {
            const files = await fs.readdir(folderPath);
            for (const file of files) {
                await fs.unlink(folderPath + file);
            }
        } catch (err) {
            console.error('Error clearing folder:', err);
        }
    }

    async expired_initiator_LOA(CFP) {
        //click the Generate LOA icon & proceed with LOA
        const LOA = await this.page.locator("//a[contains(text(),'Generate LOA')]");
        if (await LOA.isVisible()) {
            const expire_Time = await this.page.locator("//span[contains(@class,'badge fw-600 bg-danger text-white ng-star-inserted')]").textContent();
            console.log(`GenerateLOA Timeline: ${expire_Time}`);
            await expect(expire_Time).toContain("Expires");
            await LOA.click();
            await this.page.getByRole('button', { name: /Yes/i }).click();
            console.log("-------------Successfully Navigated to Generate LOA Page----------");
        }
        else {
            console.log("-------------No Generate LOA is Visible----------");
        }

        //switch to the tab
        // const tabSwitch = new tabSwitcher();
        // await tabSwitch.switchToTab("loi");
        await this.switchToTab('loi');
        await this.page.getByRole('button', { name: /Verify LOA/i }).click();
        await this.page.getByRole('button', { name: /Generate LOA/i }).click();
        await this.page.getByRole('button', { name: /Yes/i }).click();
        await this.page.getByPlaceholder('Search').fill(CFP);
        await this.page.getByRole('button', { name: /Search/i }).click();
        //Need to verify the time.....
        await this.page.waitForTimeout(60 * 1000);
        await this.page.click("//span[text()='Upload']");
        await this.page.waitForSelector("(//input[@type='file'])[2]");
        await this.page.locator("(//input[@type='file'])[2]").setInputFiles('src/helper/utils/LOA.pdf');
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('button', { name: /Upload/i }).click();
        await this.page.waitForTimeout(2000);

        //Assert
        const Expired = await this.page.locator("//div[@role='alert' and contains(@class, 'toast-message') and contains(text(), 'Your LOA issuance timeline has been expired')]").textContent();
        await expect(Expired).toContain(" Your LOA issuance timeline has been expired");
        console.log("-------------Initiator can't Generate LOA-------------------- \n !!!!!!!!!!!!!!!!!!!Your LOA issuance timeline has been expired.!!!!!!!!!!!!!!!!!!!!!!!");

    }

}
module.exports = DashboardCFP;