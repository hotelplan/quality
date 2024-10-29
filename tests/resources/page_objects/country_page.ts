import { type Page, type Locator, expect } from '@playwright/test';

export class CountryPage{
    //variables
    readonly page: Page;

    readonly Country_Header_Home_Icon: Locator;
    readonly Country_Header_Logo: Locator;
    readonly Country_Header_Product: Locator;
    readonly Country_Header_Navigation: Locator;
    readonly Country_Header_Contact: Locator;
    readonly Country_Header_User: Locator;

    readonly Country_Hero_Banner: Locator;


    //locators
    constructor(page: Page) {
        this.page = page;

        this.Country_Header_Home_Icon = page.locator('//div[@class="c-home-menu-wrapper"]');
        this.Country_Header_Logo = page.locator('//a[@class="c-brand__logo"]');
        this.Country_Header_Product = page.locator('//span[@class="c-brand__product"]');
        this.Country_Header_Navigation = page.locator('//nav[@data-module="navigation"]');
        this.Country_Header_Contact = page.locator('//div[@class="c-brand-contact"]');
        this.Country_Header_User = page.locator('//span[@class="c-user"]');

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
            await expect(ClassAttribute).toContain("alignment-vertical-" + verticalname);
        }

        if(horizontal){
            await expect(ClassAttribute).toContain("alignment-horizontal-" + horizontalname);
        }

    }



    //assertions
    async Check_Walking_Country_Page_Header() {
        await expect(this.Country_Header_Home_Icon).toBeVisible({timeout: 30000});
        await expect(this.Country_Header_Logo).toBeVisible({timeout: 30000});
        await expect(this.Country_Header_Product).toBeVisible({timeout: 30000});
        await expect(this.Country_Header_Navigation).toBeVisible({timeout: 30000});
        await expect(this.Country_Header_Contact).toBeVisible({timeout: 30000});
        await expect(this.Country_Header_User).toBeVisible({timeout: 30000});

        await expect(this.Country_Header_Product).toContainText('WALKING');

        await expect(this.Country_Header_Navigation).toContainText('Destinations');
        await expect(this.Country_Header_Navigation).toContainText('Holiday Types');
        await expect(this.Country_Header_Navigation).toContainText('Lakes and Mountains');
        await expect(this.Country_Header_Navigation).toContainText('Holiday by Train');
        await expect(this.Country_Header_Navigation).toContainText('Inspire Me');
        await expect(this.Country_Header_Navigation).toContainText('Deals and Offers');
    }


}




export default CountryPage;