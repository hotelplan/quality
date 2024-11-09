import { type Page, type Locator, expect } from '@playwright/test';
import exp from 'constants';

export class PcmsMainPage{
    //variables
    readonly page: Page;
    readonly ECMS_Main_Expansion_Arrow: (target: string) => Locator;
 



    //locators
    constructor(page: Page) {
        this.page = page;
        this.ECMS_Main_Expansion_Arrow = (target: string) => page.locator(`//a[text()="${target}"]//preceding-sibling::button`);

    

    }

    //methods






    //assertions


}




export default PcmsMainPage;


