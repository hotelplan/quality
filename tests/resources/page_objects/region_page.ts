import { type Page, type Locator, expect } from '@playwright/test';

export class RegionPage{
    //variables
    readonly page: Page;
    readonly Region_Hero_Banner: Locator;


    //locators
    constructor(page: Page) {
        this.page = page;
        this.Region_Hero_Banner = page.locator('//section[contains(@class,"c-hero")]//div[contains(@class,"c-hero is-active")]');



    }

    //methods
    async Region_Hero_Banner_Checker(media: string, layout?: string, vertical?: string, horizontal?: string) {
        
        const mediaName = media.toLowerCase();
        const layoutname = layout?.toLowerCase();
        const verticalname = vertical?.toLowerCase();
        const horizontalname = horizontal?.toLowerCase();
        
        await expect(this.Region_Hero_Banner).toBeVisible({timeout: 30000});
        const ClassAttribute = await this.Region_Hero_Banner.getAttribute('class');
        const Style = await this.Region_Hero_Banner.getAttribute('style');
        
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




export default RegionPage;