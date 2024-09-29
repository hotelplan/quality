import { type Page, type Locator, expect } from '@playwright/test';

export class EcmsMainPage{
    //variables
    readonly page: Page;
    readonly ECMS_Main_Expansion_Arrow: (target: string) => Locator;
    readonly ECMS_Main_Target_Page: (target: string) => Locator;


    //locators
    constructor(page: Page) {
        this.page = page;
        this.ECMS_Main_Expansion_Arrow = (target: string) => page.locator(`//a[text()="${target}"]//preceding-sibling::button`);
        this.ECMS_Main_Target_Page = (target: string) => page.locator(`//a[text()="${target}"]`);
    

    }

    //methods
    async ECMS_Expand_Tree(country?: string, region?: string, resort?: string, accommodation?: string){


    }



    //assertions


}




export default EcmsMainPage;


