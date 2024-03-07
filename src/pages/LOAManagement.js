const { test, expect } = require('@playwright/test');
const data = require("../helper/utils/data.json");
const pdf = require('pdf-parse');
const fs = require('fs').promises; // Import fs module with promises
const DashboardCFP = require("../pages/DashboardCFP");


const currentDate = new Date();
// Get day, month, and year
const day = String(currentDate.getDate()).padStart(2, '0');
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Note: Month is zero-based
const year = currentDate.getFullYear();



class LOAManagement {

    //Constructor
    constructor(page) {
        this.page = page;
    }

    //xpath
    application_no = null;
    //Methods
    //LOA Generation Page
    async loaGeneration(CFP) {


        const home = await this.page.locator("(//span[contains(@class,'m-icon ng-star-inserted')])[2]");
        await home.hover();
        await this.page.locator("//span[contains(text(),'LOA Management')]").click();
        await this.page.locator("//span[contains(text(),'LOA Generation')]").click();
        // await this.page.locator("//span[contains(text(),'GNA Format - D')]").click();


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

    async LOA_documenttverification(CFP, imp_start_date, imp_end_date, imp_start_time, imp_end_time, quantum, exp_start_date, exp_end_date, exp_start_time, exp_end_time, returnpercent, Settlement_Price) {
        //First clear the folder using the method
        const folderPath = 'src/helper/utils/PDF/'; // Specify the path to the folder you want to clear
        await this.clearFolder(folderPath);
        await this.page.waitForTimeout(5000);

        //Click the Download Link and wait for the download
        const [download] = await Promise.all([
            this.page.waitForEvent('download', { timeout: 60000 }), // 60 seconds timeout
            // this.page.click('td.align-middle.cursor-pointer > u.linkColor')
            this.page.click("//td[contains(@class,'cursor-pointer')]/u"),
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
        console.log(`Text format Content are : ${text}`);

        // Write the parsed text content to a text file for reference
        await fs.writeFile('src/helper/utils/TextDocuments/data.txt', text); // Specify the correct file path

        const line_1 = `LOA	No.`;
        const line_2 = `LOA/00494`;
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
        const line_20 = `${data.Utility_1}${imp_start_date}	to	${imp_end_date}${imp_start_time}	-	${imp_end_time}${quantum}`;

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
        const line_31 = `${data.Utility_2}${exp_start_date}	to	${exp_end_date}${exp_start_time}	-	${exp_end_time}${Quantum_2}${returnpercent}`;

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
                console.log(`✔ Actual Result is equal to Expected Result : ${str}\n`);
            } else {
                console.log(`X Expected Result is not equal to Actual Result : ${str}`);
            }
        }
        console.log("-------------------Document Verification have Done------------------");


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

    // Helper function to clear a file
    async clearFile(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error('Error clearing file:', err);
            }
        }
    }


    //Format D Document Verification
    async formatD_DocumentVerification(imp_start_date, imp_end_date, imp_start_time, imp_end_time, quantum, gtam, source, rpo, tGna) {
        //First clear the folder using the method
        const folderPath = 'src/helper/utils/PDF/'; // Specify the path to the folder you want to clear
        await this.clearFolder(folderPath);

        //Document verification 
        const [download] = await Promise.all([
            this.page.waitForEvent('download', { timeout: 60000 }), // 60 seconds timeout
            this.page.click("//td[contains(@class, 'align-middle')]//span[contains(text(), 'Format-D GENERATED')]")
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


        //Expected Result text 
        const line_1 = `Format-D`;
        const line_2 = `T-GNA	(Bilateral	Transaction)	Application	for	Grant	of	T-GNA`;
        const line_3 = `1Application	No.${this.application_no}Date	:	${day}-${month}-${year}`;
        const line_4 = `2Applicant	NameTickingMindsRegistration	Code`;
        const line_5 = `T-GNA	Request`;
        const line_6 = `DateHours`;
        const line_7 = `FromToFromTo`;

        const line_8 = `${imp_start_date.dateStr.split('-').reverse().join('-')}${imp_end_date.dateStr.split('-').reverse().join('-')}${imp_start_time}${imp_end_time}${quantum}`;
        const line_9 = `Name	of	Entity`;
        const line_10 = `Injecting	entity	(mandatory	for	Exigency	T-`;
        const line_11 = `GNAS	application)`;
        const line_12 = `Drawee	Entity`;
        const line_13 = `${data.Utility_2}${data.Utility_1}`;
        const line_14 = `5Injecting	RegionNRLDC`;

        const line_15 = `6RouteNR-SR`;
        const line_16 = `Entity	in	which	it	is`;
        const line_17 = `embedded`;
        const line_18 = `DL-SLDCTN-SLDC`;
        const line_19 = `8Whether	the	transaction	under	GTAM	(Yes/No)${gtam}`;
        const line_20 = `Source	of	generation	is	solar/non	solar/hydro	(applicable	in	case	of	Exigency	T-`;

        const line_21 = `GNA	application)`;
        const line_22 = `${source}`;
        const line_23 = `10Whether	the	transaction	is	for	meeting	RPO	obligation${rpo}`;
        const line_24 = `Granting	T-GNA/T-GNARE	exigency	application	in	part	quantum	and	part	period`;
        const line_25 = `or	both	in	case	of	constrains	as	per	available	transmission	capability	**	For`;
        const line_26 = `Exigency	Application15`;
        const line_27 = `${tGna}`;
        const line_28 = `Declaration:`;
        const line_29 = `The	provisions	of	the	Electricity	Act	2003,	Indian	Electricity	Grid	Code	and	all	applicable	CERC	regulations	with	respect	to`;
        const line_30 = `T-GNA/T-GNARE	transactions	in	interstate	transmission,	as	amended	from	time	to	time	are	hereby	understood	and	shall	be`;
        const line_31 = `binding.`;

        const line_32 = `Necessary	infrastructure	for	time-block	wise	metering	and	accounting	in	accordance	with	the	provisions	of	the	Grid	code`;
        const line_33 = `and	appropriate	communication	system	in	accordance	with	the	provisions	of	the	Communication	Regulations	are	in	place`;
        const line_34 = `for	the	point	of	drawal	and	point	of	injection,	if	available.`;
        const line_35 = `The	Nodal	Agency	is	indemnified	at	all	times	from	any	and	all	claims,	actions	and	all	other	obligations	by	or	to	third	parties`;
        const line_36 = `arising	out	of	or	resulting	from	the	transactions	under	T-GNA/T-GNARE.`;
        const line_37 = `4.There	is	a	valid	contract	for	the	proposed	scheduling.`;
        const line_38 = `Name:..........................................`;
        const line_39 = `Designation:..........................................`;

        // Define the strings you want to check in the PDF content
        const stringsToCheck = [line_1.trim(), line_2.trim(), line_3.trim(), line_4.trim(), line_5.trim(), line_6.trim(), line_7.trim(), line_8.trim(), line_9.trim(), line_10.trim(),
        line_11.trim(), line_12.trim(), line_13.trim(), line_14.trim(), line_15.trim(), line_16.trim(), line_17.trim(), line_18.trim(), line_19.trim(), line_20.trim(),
        line_21.trim(), line_22.trim(), line_23.trim(), line_24.trim(), line_25.trim(), line_26.trim(), line_27.trim(), line_28.trim(), line_29.trim(), line_30.trim(),
        line_31.trim(), line_32.trim(), line_33.trim(), line_34.trim(), line_35.trim(), line_36.trim(), line_37.trim(), line_38.trim(), line_39.trim()];



        // Iterate over each string and assert its presence in the PDF content   
        for (const str of stringsToCheck) {
            //expect(text).toContain(str);
            if ((text.replace(/\s+/g, '')).includes(str.replace(/\s+/g, ''))) {
                //expect.soft(text).toContain(str);
                console.log(`✔ Actual Result is equal to Expected Result : ${str}\n`);
            } else {
                console.log(`X Expected Result is not equal to Actual Result : ${str}`);
            }
        }
        console.log("-------------------Format-D Document Verification Done Successfully------------------");


        // //Iterate the element in the format-D page
        // const checks = await this.page.$$("//tbody//td");

        // // Iterate through the elements
        // for (let i = 1; i < checks.length; i++) {
        //     // Get the text content of the element and trim whitespace
        //     const element = (await checks[i].textContent()).trim();
        //     if (text.includes(element)) {
        //         console.log(`${element} is Found in the Document`);
        //     } else {
        //         console.log(`${element} is not Found in the Text Document`);
        //     }
        //     // Perform the expectation check
        //     // expect.soft(text).toContain(element);
        // }
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


    async formatD(gtam, source, rpo, tGna, imp_start_date, imp_end_date, imp_start_time, imp_end_time, quantum) {
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

        this.application_no = randomNumber.toString();

        console.log(`Application Number : ${this.application_no}`);

        //Application Number
        await this.page.getByPlaceholder('Search Organization').fill(this.application_no);

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

        //Format-D document verification
        await this.page.waitForTimeout(5000);
        await this.formatD_DocumentVerification(imp_start_date, imp_end_date, imp_start_time, imp_end_time, quantum, gtam, source, rpo, tGna);


    }

}

module.exports = LOAManagement;