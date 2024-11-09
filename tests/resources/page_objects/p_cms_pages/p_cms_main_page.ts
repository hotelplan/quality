import { type Page, type Locator, expect } from '@playwright/test';
import exp from 'constants';

export class PcmsMainPage{
    //variables
    readonly page: Page;
    readonly PCMS_Main_Expansion_Arrow: (product: string) => Locator;
    readonly PCMS_Main_Group_Page: (group: string) => Locator;
    readonly PCMS_Main_Target_Page: (target: string) => Locator;
 



    //locators
    constructor(page: Page) {
        this.page = page;
        this.PCMS_Main_Expansion_Arrow = (product: string) => page.locator(`//a[text()="${product}"]//preceding-sibling::button`);
        this.PCMS_Main_Group_Page = (group: string) => page.locator(`//a[text()="${group}"]`);
        this.PCMS_Main_Target_Page = (target: string) => page.locator(`//a[contains(@title,"${target}")]`);

    

    }

    //methods
    async PCMS_Expand_Tree(product: string){
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
        await this.PCMS_Main_Expansion_Arrow("Inghams").waitFor({state: 'visible', timeout: 10000});
        await this.PCMS_Main_Expansion_Arrow("Inghams").hover();
        await this.PCMS_Main_Expansion_Arrow("Inghams").click();
        
        await this.PCMS_Main_Expansion_Arrow(product).waitFor({state: 'visible', timeout: 10000});
        await this.PCMS_Main_Expansion_Arrow(product).hover();
        await this.PCMS_Main_Expansion_Arrow(product).click();

        await this.page.waitForTimeout(500);


    }

    async PCMS_Select_Target_Page(group:string, target: string){
        await this.PCMS_Main_Group_Page(group).waitFor({ state: 'visible', timeout: 10000 });
        await this.PCMS_Main_Group_Page(group).hover();
        await this.PCMS_Main_Group_Page(group).click();

        await this.PCMS_Main_Target_Page(target).waitFor({ state: 'visible', timeout: 10000 });
        await this.PCMS_Main_Target_Page(target).hover();
        await this.PCMS_Main_Target_Page(target).click();

        //await expect(this.PCMS_Main_Content_Fields).toBeVisible({timeout: 30000});
    }






    //assertions


}




export default PcmsMainPage;


