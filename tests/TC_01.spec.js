// @ts-nocheck
const { test, expect } = require('@playwright/test');
const data = require('../Resources/data.json');

const Login =require('../pages/Login');
const Home =require('../pages/Home');
const DashboardCFP =require('../pages/DashboardCFP');
const LOAManagement = require('../pages/LOAManagement');


let storedCFP;

test.describe('TC_002_EXP', () => {
test('Creating CFP from Initiator side', async ({ page,context,browser}) => {
    const login =new Login(page);
    const home= new Home(page);
    const dashboardCFP =new DashboardCFP(page,context,browser);

    await login.login(data.user1,data.user1_password); 
    await home.clickCallForPropsal();
    console.log("Ended");
    // await dashboardCFP.clickCreateCFP();
    // await dashboardCFP.powerSwapping('200');
    // await dashboardCFP.firstChoice("Export");
    // await dashboardCFP.resultPublish(false);
    // await dashboardCFP.importPeriod('200');
    // await dashboardCFP.minimumQuantum(false,null);
    // await dashboardCFP.exportPeriod();
    // await dashboardCFP.date_time();
    // await dashboardCFP.otherDetails(6);
    // await dashboardCFP.commentBox(false);
    // await dashboardCFP.ceilingBaseReturn(false,null);
    // await dashboardCFP.selectResponder();
    // await dashboardCFP.publish();

    storedCFP =dashboardCFP.CFP_Num;        
});



// test('Responding to the CFP from Responder side',async({page,context,browser})=>{
//     const login =new Login(page);
//     const home= new Home(page);
//     const dashboardCFP =new DashboardCFP(page,context,browser);

//     await login.login(data.user2,data.user2_password);
//     await home.clickCallForPropsal();
//     await dashboardCFP.clickresponder();
//     await page.waitForTimeout(90*1000);
//     await dashboardCFP.place_Respond(storedCFP,'50000','120');
// });


// // Need to put wait time here for 15 min

// test('Initiator Awarding/LOA',async({page,context,browser})=>{
//     const login =new Login(page);
//     const home= new Home(page);
//     const dashboardCFP =new DashboardCFP(page,context,browser);

//     await login.login(data.user1,data.user1_password);
//     await home.clickCallForPropsal();

//     //wait time for 15 minutes
//     test.setTimeout(1200000);

//     await page.waitForTimeout(885000);
//     console.log("Wait time is over you can proceed with Awarding");

//     await dashboardCFP.initiatedFeed(storedCFP);
//     await dashboardCFP.generateAward();
//     await dashboardCFP.initiatedFeed(storedCFP);
//     await dashboardCFP.generateLOA(storedCFP);   
// });



// test('Responder Uploading the document',async({page,context,browser})=>{
//     const login =new Login(page);
//     const home= new Home(page);
//     const dashboardCFP =new DashboardCFP(page,context,browser);
//     const loaManagement = new LOAManagement(page);

//     await login.login(data.user2,data.user2_password);
//     await loaManagement.loaGeneration();
//     await loaManagement.uploadDocument(storedCFP);
    
// });

// test('Format D Generation From Initiator Side',async({page,context,browser})=>{
//     const login =new Login(page);
//     const home= new Home(page);
//     const dashboardCFP =new DashboardCFP(page,context,browser);
//     const loaManagement = new LOAManagement(page);

//     await login.login(data.user1,data.user1_password);
//     await loaManagement.loaGeneration();
//     await loaManagement.action(storedCFP);
//     await loaManagement.formatD(storedCFP,'YES','SOLAR','NO','YES');
    
// });
});

