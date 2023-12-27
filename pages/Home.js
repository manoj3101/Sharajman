class Home{

    //Constructor
    constructor(page){
        this.page =page;
    }

    async clickCallForPropsal(){
      await this.page.locator("//*[contains(text(),'Call for Proposal')]").first().click();
      await this.page.click("//*[contains(text(),'Power Swapping')]");
      //await this.page.waitForTimeout(2000);
    }


    //--------------------------------------------------------------------------------------------

    async waitforoneminute(){
      await this.page.waitForTimeout(60000);
      console.log("Waiting");
    }
    async waitforfiteenminutes(){
      this.waitforoneminute();
      this.waitforoneminute();
      this.waitforoneminute();
      this.waitforoneminute();
      this.waitforoneminute();
      this.waitforoneminute();
      this.waitforoneminute();
      this.waitforoneminute();
      this.waitforoneminute();this.waitforoneminute();
      this.waitforoneminute();this.waitforoneminute();


    }
    

  }
    


module.exports = Home;