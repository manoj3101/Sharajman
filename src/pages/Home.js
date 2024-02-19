const pageFixture= require("../hooks/pageFixture");

class Home{

    // Constructor
    constructor(page){
        this.page =page;
    }

    //method
    async clickCallForPropsal(){
      // try {
      //   await this.page.locator("(//*[contains(text(),'Call for Proposal')])[1]").click();
      // } catch (error) {
      //   await this.page.locator("(//*[contains(text(),'Call for Proposal')])[1]").first().click();
      //   console.log(error);
      // }
      await this.page.locator("(//*[contains(text(),'Call for Proposal')])[1]").click();
      await this.page.click("//*[contains(text(),'Power Swapping')]");
      //await this.page.waitForTimeout(2000);
    }
    

  }
    


module.exports = Home;