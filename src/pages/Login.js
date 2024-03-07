const data = require("../helper/utils/data.json");
const pageFixture = require("../hooks/pageFixture");



class Login {
    //Constructor
    constructor(page) {
        this.page = page;
    }

    async login(email, password) {
        await this.page.goto(data.URL,{ waitUntil: 'load' });
        await this.page.getByPlaceholder('Email Address').fill(email);
        await this.page.getByPlaceholder('Password').fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click({ timeout: 50000 });
        await this.page.waitForTimeout(3000);

        //Handling the dialog if they appear due to already the user logged in some other device or browser.
        const dialog = "//*[contains(text(),'Please confirm..')]";
        if (await this.page.isVisible(dialog)) {
            await this.page.getByRole('button', { name: ' Yes ' }).click();
            console.log("-----------------------------------------------------------------------------------------------");
            console.log("                                    ✔ Dialog Box Appeared ✔                                      ");
        }
        console.log("************************************** ✔ Successfully Logged In ✔ **************************************");
        console.log("-----------Page Title -------- :" + await this.page.title());

    }
}
module.exports = Login;