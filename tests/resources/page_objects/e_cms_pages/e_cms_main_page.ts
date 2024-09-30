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

        //getByLabel('Content Fields')
    

    }

    //methods
    async ECMS_Expand_Tree(product: string, secondary_product: string | null, country: string | null, region: string | null, resort: string | null, accommodation: string | null){
        
        await this.ECMS_Main_Expansion_Arrow("Home").waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Expansion_Arrow("Home").hover();
        await this.ECMS_Main_Expansion_Arrow("Home").click();
        
        await this.ECMS_Main_Expansion_Arrow(product).waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Expansion_Arrow(product).hover();
        await this.ECMS_Main_Expansion_Arrow(product).click();

        await this.ECMS_Main_Expansion_Arrow("Resorts").waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Expansion_Arrow("Resorts").hover();
        await this.ECMS_Main_Expansion_Arrow("Resorts").click();

        if (secondary_product != null) {
            await this.ECMS_Main_Expansion_Arrow(secondary_product).waitFor({ state: 'visible', timeout: 10000 });
            await this.ECMS_Main_Expansion_Arrow(secondary_product).hover();
            await this.ECMS_Main_Expansion_Arrow(secondary_product).click();

            await this.ECMS_Main_Expansion_Arrow("Resorts").waitFor({state: 'visible', timeout: 10000});
            await this.ECMS_Main_Expansion_Arrow("Resorts").hover();
            await this.ECMS_Main_Expansion_Arrow("Resorts").click();
        }

        if (country != null) {
            await this.ECMS_Main_Expansion_Arrow(country).waitFor({ state: 'visible', timeout: 10000 });
            await this.ECMS_Main_Expansion_Arrow(country).hover();
            await this.ECMS_Main_Expansion_Arrow(country).click();
        }

        if (region != null) {
            await this.ECMS_Main_Expansion_Arrow(region).waitFor({ state: 'visible', timeout: 10000 });
            await this.ECMS_Main_Expansion_Arrow(region).hover();
            await this.ECMS_Main_Expansion_Arrow(region).click();
        }

        if (resort != null) {
            await this.ECMS_Main_Expansion_Arrow(resort).waitFor({ state: 'visible', timeout: 10000 });
            await this.ECMS_Main_Expansion_Arrow(resort).hover();
            await this.ECMS_Main_Expansion_Arrow(resort).click();
        }

        if (accommodation != null) {
            await this.ECMS_Main_Expansion_Arrow(accommodation).waitFor({ state: 'visible', timeout: 10000 });
            await this.ECMS_Main_Expansion_Arrow(accommodation).hover();
            await this.ECMS_Main_Expansion_Arrow(accommodation).click();
        }


    }

    async ECMS_Select_Target_Page(target: string){
        await this.ECMS_Main_Target_Page(target).waitFor({ state: 'visible', timeout: 10000 });
        await this.ECMS_Main_Target_Page(target).hover();
        await this.ECMS_Main_Target_Page(target).click();
    }




    //assertions


}




export default EcmsMainPage;


