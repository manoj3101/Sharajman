// @ts-nocheck
const { test, expect } = require('@playwright/test');
const data = require('../../helper/utils/data.json');
const pageFixture = require("../../hooks/pageFixture");


const Login = require("../../pages/Login");
const Home = require("../../pages/Home");
const DashboardCFP = require("../../pages/DashboardCFP");
const LOAManagement = require("../../pages/LOAManagement");



let cfpNumber;

test.describe('TC_IM_006', () => {
    test('Creating CFP from Initiator side', async ({ page, context, browser, browserName }) => {
        const login = new Login(page);
        const home = new Home(page);
        const dashboardCFP = new DashboardCFP(page, context, browser);



        console.log(`Launching ${browserName} Browser`);

        await login.login(data.user1, data.user1_password);

        await home.clickCallForPropsal();

        await dashboardCFP.clickCreateCFP(data.TC_06.chooseCFP);

        await dashboardCFP.powerSwapping(data.TC_06.Power_swapping);

        await dashboardCFP.firstChoice(data.TC_06.Fisrt_choice);

        await dashboardCFP.resultPublish(data.TC_06.Result_Published);

        await dashboardCFP.importPeriod(data.TC_06.Quantum_value, data.TC_06.imp_start_date, data.TC_06.imp_end_date, data.TC_06.imp_start_time, data.TC_06.imp_end_time);

        await dashboardCFP.minimumQuantum(data.TC_06.Minimum_Quantum, data.TC_06.Minimum_QuantumValue);

        await dashboardCFP.exportPeriod(data.TC_06.exp_start_date, data.TC_06.exp_end_date, data.TC_06.exp_start_time, data.TC_06.exp_end_time);

        await dashboardCFP.publishing_time();

        await dashboardCFP.response_validityTime(data.TC_06.response_days, data.TC_06.response_hours, data.TC_06.response_mins);

        await dashboardCFP.awarding_time(data.TC_06.award_days, data.TC_06.award_hours, data.TC_06.award_mins);

        await dashboardCFP.loa_Issuance_time(data.TC_06.loa_issuance_days, data.TC_06.loa_issuance_hours, data.TC_06.loa_issuance_mins);

        await dashboardCFP.loa_Acceptance_time(data.TC_06.loa_acceptance_days, data.TC_06.loa_acceptance_hours, data.TC_06.loa_acceptance_mins);

        await dashboardCFP.otherDetails(data.TC_06.index, data.TC_06.Settlement_Price);

        await dashboardCFP.commentBox(data.TC_06.query_Box);

        await dashboardCFP.ceilingBaseReturn(data.TC_06.Ceiling_Base_Return, data.TC_06.Ceiling_Base_Return_value);

        await dashboardCFP.selectResponder(data.TC_06.multiple_responder);

        await dashboardCFP.custom_Guests(data.TC_06.custom_Guests);

        await dashboardCFP.remarks(data.TC_06.remarks);

        await dashboardCFP.publish();

        console.log("--------------------CFP has been created and Published Successfully-----------------");

        cfpNumber = dashboardCFP.CFP_Num;
    });


    test('Responding to the CFP from Responder side', async ({ page, context, browser }) => {
        const login = new Login(page);

        const home = new Home(page);

        const dashboardCFP = new DashboardCFP(page, context, browser);

        await login.login(data.user2, data.user2_password);

        await home.clickCallForPropsal();

        await dashboardCFP.clickresponder();

        test.setTimeout(160 * 1000);

        await page.waitForTimeout(90 * 1000);

        await dashboardCFP.place_Respond(cfpNumber, data.TC_06.minQuantumValue1, data.TC_06.ReturnValue1);

        await dashboardCFP.view_Respond(cfpNumber);

        await dashboardCFP.energycalculation_initiator(data.TC_06.imp_start_date, data.TC_06.imp_end_date, data.TC_06.imp_start_time, data.TC_06.imp_end_time, data.TC_06.minQuantumValue1);

        await dashboardCFP.energycalculation_responder(data.TC_06.exp_start_date, data.TC_06.exp_end_date, data.TC_06.exp_start_time, data.TC_06.exp_end_time, data.TC_06.ReturnValue1);


        console.log("--------------------Response CFP placed Successfully-----------------");
    });


    // Need to put wait time here for 15 min

    test('Initiator Awarding/LOA', async ({ page, context, browser }) => {
        const login = new Login(page);
        const home = new Home(page);
        const dashboardCFP = new DashboardCFP(page, context, browser);

        await login.login(data.user1, data.user1_password);

        await home.clickCallForPropsal();

        test.setTimeout(1200000);

        await page.waitForTimeout(885000);

        console.log("Wait time is over Awarding CFP has started......");


        await dashboardCFP.initiatedFeed(cfpNumber);

        await dashboardCFP.generateAward();

        await dashboardCFP.initiatedFeed(cfpNumber);

        await dashboardCFP.energycalculation_initiator(data.TC_06.imp_start_date, data.TC_06.imp_end_date, data.TC_06.imp_start_time, data.TC_06.imp_end_time, data.TC_06.Quantum_value);

        await dashboardCFP.energycalculation_responder(data.TC_06.exp_start_date, data.TC_06.exp_end_date, data.TC_06.exp_start_time, data.TC_06.exp_end_time, data.TC_06.ReturnValue1);

        await dashboardCFP.generateLOA(cfpNumber, data.TC_06.imp_start_date, data.TC_06.imp_end_date, data.TC_06.imp_start_time, data.TC_06.imp_end_time, data.TC_06.Quantum_value, data.TC_06.exp_start_date, data.TC_06.exp_end_date, data.TC_06.exp_start_time, data.TC_06.exp_end_time, data.TC_06.ReturnValue1, data.TC_06.Settlement_Price);

        console.log("--------------------Awarding and LOA has generated Successfully-----------------");

        console.log("Initiator Uploaded the LOA documents successfully. \n <<<<<<<<<<<LOA has been uploaded successfully.>>>>>>>>>>>>>>");

    });


    test('Responder Uploading the document', async ({ page, context, browser }) => {
        const login = new Login(page);
        const home = new Home(page);
        const dashboardCFP = new DashboardCFP(page, context, browser);
        const loaManagement = new LOAManagement(page);

        await login.login(data.user2, data.user2_password);

        await loaManagement.loaGeneration();

        await loaManagement.uploadDocument(cfpNumber);

        console.log("Responder Uploaded the documents successfully  \n <<<<<<<<<<<LOA has been uploaded successfully.>>>>>>>>>>>>>>");

    });

    test('Format D Generation From Initiator Side', async ({ page, context, browser }) => {
        const login = new Login(page);
        const home = new Home(page);
        const dashboardCFP = new DashboardCFP(page, context, browser);
        const loaManagement = new LOAManagement(page);

        await login.login(data.user1, data.user1_password);

        await loaManagement.loaGeneration();

        await loaManagement.action(cfpNumber);

        await loaManagement.formatD(data.TC_06.GTAM, data.TC_06.source_of_generation, data.TC_06.RPO, data.TC_06.TGNA, data.TC_06.imp_start_date, data.TC_06.imp_end_date, data.TC_06.imp_start_time, data.TC_06.imp_end_time, data.TC_06.Quantum_value);

    });

    test('Format D Generation From Responder Side', async ({ page, context, browser }) => {
        const login = new Login(page);
        const home = new Home(page);
        const dashboardCFP = new DashboardCFP(page, context, browser);
        const loaManagement = new LOAManagement(page);

        await login.login(data.user2, data.user2_password);

        await loaManagement.loaGeneration();

        await loaManagement.action_FormatD(cfpNumber);

        await loaManagement.formatD(data.TC_06.GTAM, data.TC_06.source_of_generation, data.TC_06.RPO, data.TC_06.TGNA, data.TC_06.exp_start_date, data.TC_06.exp_end_date, data.TC_06.exp_start_time, data.TC_06.imp_end_time, data.TC_06.minQuantumValue1);

    });

});

