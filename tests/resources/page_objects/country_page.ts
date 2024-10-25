import { type Page, type Locator, expect } from '@playwright/test';

export class CountryPage{
    //variables
    readonly page: Page;
    readonly Country_Hero_Banner: Locator;


    //locators
    constructor(page: Page) {
        this.page = page;
        this.Country_Hero_Banner = page.locator('//div[contains(@class,"c-hero is-active")]');



    }

    //methods
    async Country_Hero_Banner_Checker(media: string, layout?: string, vertical?: string, horizontal?: string) {
        
        const mediaName = media.toLowerCase();
        const layoutname = layout?.toLowerCase();
        const verticalname = vertical?.toLowerCase();
        const horizontalname = horizontal?.toLowerCase();
        
        await expect(this.Country_Hero_Banner).toBeVisible({timeout: 30000});
        const ClassAttribute = await this.Country_Hero_Banner.getAttribute('class');
        const Style = await this.Country_Hero_Banner.getAttribute('style');
        
        console.log('Class Attribute:', ClassAttribute);
        console.log('Style:', Style);

        await expect(Style).toContain(mediaName);

        if(vertical){
            await expect(ClassAttribute).toContain("c-hero__content-alignment-vertical-" + verticalname);
        }

        if(horizontal){
            await expect(ClassAttribute).toContain("c-hero__content-alignment-" + horizontalname);
        }

    }



    //assertions


}




export default CountryPage;