const data = require('../Resources/data.json');


class Login{
    //Constructor
    constructor(page){
        this.page =page;
    }

    async login(email ,password){
        await this.page.goto(data.URL);
        await this.page.getByPlaceholder('Email Address').fill(email);
        await this.page.getByPlaceholder('Password').fill(password);
        await this.page.getByRole('button',{name:'Login'}).click();
        await this.page.waitForTimeout(3000);

        //handling Dialog
        const dialog="//*[contains(text(),'Please confirm..')]";
        if (await this.page.isVisible(dialog)) {
            await this.page.getByRole('button',{name:' Yes '}).click();
            console.log("---------------Dialog Appeared----------------")
        }
        console.log("---------------Successfully Logged In ------------------");
        console.log("-----------Title -------- :"+ await this.page.title());

    }
}
module.exports = Login;