// const { chromium ,firefox,context} = require("@playwright/test");
// const pageFixture =require("./pageFixture");

// class tabSwitcher{

//     constructor(page, context, browser) {
//         this.page = page;
//         this.context = context;
//         this.browser = browser;        
//     }
//     async  switchToTab(url) {

//         await this.page.waitForTimeout(4000);
//         const allPages = await this.page.context().pages();
//         console.log("All Contexts ============" + allPages.length);
//         for (const page of allPages) {
//             if ((await page.url()).includes(url)) {
//                 console.log("URL :"+await this.page.url());
//                 this.page = page;
//                 await this.page.bringToFront();
//             }
//         }
//         // throw new Error(`Tab with URL ${url} not found.`);
//     }
// }

// module.exports= tabSwitcher;