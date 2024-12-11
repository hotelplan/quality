import { type Page, type Locator, expect } from '@playwright/test';

export class RegionPage{
    //variables
    readonly page: Page;

    readonly Region_Header_Home_Icon: Locator;
    readonly Region_Header_Logo: Locator;
    readonly Region_Header_Product: Locator;
    readonly Region_Header_Navigation: Locator;
    readonly Region_Header_Contact: Locator;
    readonly Region_Header_User: Locator;

    readonly Region_Footer_Links: Locator;
    readonly Region_Footer_Socials: Locator;
    readonly Region_Footer_Brands: Locator;
    readonly Region_Footer_Brands_Ski_Symbol: Locator;
    readonly Region_Footer_Brands_Walking_Symbol: Locator;
    readonly Region_Footer_Brands_Lapland_Symbol: Locator;
    readonly Region_Footer_Content_Links: Locator
    readonly Region_Footer_Brand_Details: Locator;

    readonly Region_Hero_Banner: Locator;

    readonly Region_At_a_Glance: Locator;
    readonly Region_At_a_Glance_Content: Locator;
    readonly Region_At_a_Glance_More_Info: Locator;

    readonly Region_Accordion: Locator;


    //locators
    constructor(page: Page) {
        this.page = page;

        this.Region_Header_Home_Icon = page.locator('//div[@class="c-home-menu-wrapper"]');
        this.Region_Header_Logo = page.locator('//a[@class="c-brand__logo"]');
        this.Region_Header_Product = page.locator('//span[@class="c-brand__product"]');
        this.Region_Header_Navigation = page.locator('//nav[@data-module="navigation"]');
        this.Region_Header_Contact = page.locator('//div[@class="c-brand-contact"]');
        this.Region_Header_User = page.locator('//span[@class="c-user"]');

        this.Region_Footer_Links = page.locator('//footer[contains(@class,"c-footer")]//div[@class="container"]//div[contains(@class,"c-footer__links")]');
        this.Region_Footer_Socials = page.locator('//footer[contains(@class,"c-footer")]//div[@class="container"]//div[contains(@class,"c-footer__socials")]');
        this.Region_Footer_Brands = page.locator('//div[contains(@class,"c-footer__brand u-margin-top u-margin-bottom")]');
        this.Region_Footer_Brands_Ski_Symbol = page.locator('//div[contains(@class,"c-footer__brand u-margin-top u-margin-bottom")]//span[@class="s-symbol s-ski"]');
        this.Region_Footer_Brands_Walking_Symbol = page.locator('//div[contains(@class,"c-footer__brand u-margin-top u-margin-bottom")]//span[@class="s-symbol s-walking"]');
        this.Region_Footer_Brands_Lapland_Symbol = page.locator('//div[contains(@class,"c-footer__brand u-margin-top u-margin-bottom")]//span[@class="s-symbol s-lapland"]');
        this.Region_Footer_Content_Links = page.locator('//div[@class="c-footer__content-links"]');
        this.Region_Footer_Brand_Details = page.locator('//div[@class="c-footer__content"]//p[contains(text(),"Inghams")]');

        this.Region_Hero_Banner = page.locator('//div[contains(@class,"c-hero ")]');

        this.Region_At_a_Glance = page.locator('//div[@class="c-geography-context__glance"]');
        this.Region_At_a_Glance_Content = page.locator('//div[contains(@class,"glance-content")]');
        this.Region_At_a_Glance_More_Info = page.locator('//div[contains(@class,"glance")]//a[contains(@class,"more-info")]');

        this.Region_Accordion = page.locator('//div[@class="c-accordion"]');



    }

    //methods



    //assertions
    async Check_Walking_Region_Page_Header() {
        await expect(this.Region_Header_Home_Icon).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Logo).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Product).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Navigation).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Contact).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_User).toBeVisible({timeout: 10000});

        await expect(this.Region_Header_Product).toContainText('WALKING');

        await expect(this.Region_Header_Navigation).toContainText('Destinations');
        await expect(this.Region_Header_Navigation).toContainText('Holiday Types');
        await expect(this.Region_Header_Navigation).toContainText('Lakes and Mountains');
        await expect(this.Region_Header_Navigation).toContainText('Holiday by Train');
        await expect(this.Region_Header_Navigation).toContainText('Inspire Me');
        await expect(this.Region_Header_Navigation).toContainText('Deals and Offers');
    }


    async Check_Ski_Region_Page_Header() {
        await expect(this.Region_Header_Home_Icon).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Logo).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Product).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Navigation).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Contact).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_User).toBeVisible({timeout: 10000});

        await expect(this.Region_Header_Product).toContainText('SKI');

        await expect(this.Region_Header_Navigation).toContainText('Destinations');
        await expect(this.Region_Header_Navigation).toContainText('Holiday Types');
        await expect(this.Region_Header_Navigation).toContainText('Ski Chalets');
        await expect(this.Region_Header_Navigation).toContainText('Late Ski Deals');
    }


    async Check_Lapland_Region_Page_Header() {
        await expect(this.Region_Header_Home_Icon).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Logo).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Product).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Navigation).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Contact).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_User).toBeVisible({timeout: 10000});

        await expect(this.Region_Header_Product).toContainText('LAPLAND');

        await expect(this.Region_Header_Navigation).toContainText('Destinations');
        await expect(this.Region_Header_Navigation).toContainText('Excursions');
        await expect(this.Region_Header_Navigation).toContainText('Santa Breaks');
        await expect(this.Region_Header_Navigation).toContainText('Lapland deals & offers');
        await expect(this.Region_Header_Navigation).toContainText('Insider Guides');
        await expect(this.Region_Header_Navigation).toContainText('Lapland late Deals');

    }


    async Check_Walking_Region_Page_Footer() {
        await expect(this.Region_Footer_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Socials).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Ski_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Walking_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Lapland_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Content_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brand_Details).toBeVisible({timeout: 10000});

        await expect(this.Region_Footer_Links).toContainText('Manage my booking');
        await expect(this.Region_Footer_Links).toContainText('Agent login');
        await expect(this.Region_Footer_Links).toContainText('Help and FAQs');
        await expect(this.Region_Footer_Links).toContainText('Contact us');
        await expect(this.Region_Footer_Links).toContainText('About Us');
        await expect(this.Region_Footer_Links).toContainText('Walking With Inghams');
        await expect(this.Region_Footer_Links).toContainText('Walking Deals & offers');

        await expect(this.Region_Footer_Socials).toContainText('Walking');

        await expect(this.Region_Footer_Brands).toContainText('Ski');
        await expect(this.Region_Footer_Brands).toContainText('Walking');
        await expect(this.Region_Footer_Brands).toContainText('Lapland');

        await expect(this.Region_Footer_Content_Links).toContainText('Terms and conditions');
        await expect(this.Region_Footer_Content_Links).toContainText('Privacy policy');
        await expect(this.Region_Footer_Content_Links).toContainText('Modern Slavery statement');
        await expect(this.Region_Footer_Content_Links).toContainText('Accessibility');
        await expect(this.Region_Footer_Content_Links).toContainText('Sitemap');
        await expect(this.Region_Footer_Content_Links).toContainText('Cookie settings');

        await expect(this.Region_Footer_Brand_Details).toContainText('Inghams is a brand of Hotelplan Limited, “part of the Hotelplan UK Group” © 2024. All Rights Reserved. Registered in England and Wales as Hotelplan Ltd. Registered No 350786. ATOL 0025. ABTA V4871. VAT No: GB 217 4698 42.');
    }


    async Check_Ski_Region_Page_Footer() {
        await expect(this.Region_Footer_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Socials).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Ski_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Walking_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Lapland_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Content_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brand_Details).toBeVisible({timeout: 10000});

        await expect(this.Region_Footer_Links).toContainText('Manage my booking');
        await expect(this.Region_Footer_Links).toContainText('Agent login');
        await expect(this.Region_Footer_Links).toContainText('Help and FAQs');
        await expect(this.Region_Footer_Links).toContainText('Contact us');
        await expect(this.Region_Footer_Links).toContainText('About Us');
        await expect(this.Region_Footer_Links).toContainText('Ski Holidays');
        await expect(this.Region_Footer_Links).toContainText('Ski deals & offers');

        await expect(this.Region_Footer_Socials).toContainText('Ski');

        await expect(this.Region_Footer_Brands).toContainText('Ski');
        await expect(this.Region_Footer_Brands).toContainText('Walking');
        await expect(this.Region_Footer_Brands).toContainText('Lapland');

        await expect(this.Region_Footer_Content_Links).toContainText('Terms and conditions');
        await expect(this.Region_Footer_Content_Links).toContainText('Privacy policy');
        await expect(this.Region_Footer_Content_Links).toContainText('Modern Slavery statement');
        await expect(this.Region_Footer_Content_Links).toContainText('Accessibility');
        await expect(this.Region_Footer_Content_Links).toContainText('Sitemap');
        await expect(this.Region_Footer_Content_Links).toContainText('Cookie settings');

        await expect(this.Region_Footer_Brand_Details).toContainText('Inghams is a brand of Hotelplan Limited, “part of the Hotelplan UK Group” © 2024. All Rights Reserved. Registered in England and Wales as Hotelplan Ltd. Registered No 350786. ATOL 0025. ABTA V4871. VAT No: GB 217 4698 42.');
    }


    async Check_Lapland_Region_Page_Footer() {
        await expect(this.Region_Footer_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Socials).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Ski_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Walking_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Lapland_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Content_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brand_Details).toBeVisible({timeout: 10000});

        await expect(this.Region_Footer_Links).toContainText('Manage my booking');
        await expect(this.Region_Footer_Links).toContainText('Agent login');
        await expect(this.Region_Footer_Links).toContainText('Help and FAQs');
        await expect(this.Region_Footer_Links).toContainText('Contact us');
        await expect(this.Region_Footer_Links).toContainText('About Us');
        await expect(this.Region_Footer_Links).toContainText('Lapland Excursions');
        await expect(this.Region_Footer_Links).toContainText('Lapland deals & offers');

        await expect(this.Region_Footer_Socials).toContainText('Lapland');

        await expect(this.Region_Footer_Brands).toContainText('Ski');
        await expect(this.Region_Footer_Brands).toContainText('Walking');
        await expect(this.Region_Footer_Brands).toContainText('Lapland');

        await expect(this.Region_Footer_Content_Links).toContainText('Terms and conditions');
        await expect(this.Region_Footer_Content_Links).toContainText('Privacy policy');
        await expect(this.Region_Footer_Content_Links).toContainText('Modern Slavery statement');
        await expect(this.Region_Footer_Content_Links).toContainText('Accessibility');
        await expect(this.Region_Footer_Content_Links).toContainText('Sitemap');
        await expect(this.Region_Footer_Content_Links).toContainText('Cookie settings');

        await expect(this.Region_Footer_Brand_Details).toContainText('Inghams is a brand of Hotelplan Limited, “part of the Hotelplan UK Group” © 2024. All Rights Reserved. Registered in England and Wales as Hotelplan Ltd. Registered No 350786. ATOL 0025. ABTA V4871. VAT No: GB 217 4698 42.');
    }


    async Check_Walking_Region_Page_Header_Not_Visible() {
        await expect(this.Region_Header_Home_Icon).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Logo).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Product).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Navigation).toBeHidden({timeout: 10000});
        await expect(this.Region_Header_Contact).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_User).toBeVisible({timeout: 10000});

        await expect(this.Region_Header_Product).toContainText('WALKING');

        await expect(this.Region_Header_Navigation).not.toContainText('Destinations');
        await expect(this.Region_Header_Navigation).not.toContainText('Holiday Types');
        await expect(this.Region_Header_Navigation).not.toContainText('Lakes and Mountains');
        await expect(this.Region_Header_Navigation).not.toContainText('Holiday by Train');
        await expect(this.Region_Header_Navigation).not.toContainText('Inspire Me');
        await expect(this.Region_Header_Navigation).not.toContainText('Deals and Offers');
    }


    async Check_Ski_Region_Page_Header_Not_Visible() {
        await expect(this.Region_Header_Home_Icon).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Logo).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Product).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Navigation).toBeHidden({timeout: 10000});
        await expect(this.Region_Header_Contact).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_User).toBeVisible({timeout: 10000});

        await expect(this.Region_Header_Product).toContainText('SKI');

        await expect(this.Region_Header_Navigation).not.toContainText('Destinations');
        await expect(this.Region_Header_Navigation).not.toContainText('Holiday Types');
        await expect(this.Region_Header_Navigation).not.toContainText('Ski Chalets');
        await expect(this.Region_Header_Navigation).not.toContainText('Late Ski Deals');
    }


    async Check_Lapland_Region_Page_Header_Not_Visible() {
        await expect(this.Region_Header_Home_Icon).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Logo).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Product).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_Navigation).toBeHidden({timeout: 10000});
        await expect(this.Region_Header_Contact).toBeVisible({timeout: 10000});
        await expect(this.Region_Header_User).toBeVisible({timeout: 10000});

        await expect(this.Region_Header_Product).toContainText('LAPLAND');

        await expect(this.Region_Header_Navigation).not.toContainText('Destinations');
        await expect(this.Region_Header_Navigation).not.toContainText('Excurions');
        await expect(this.Region_Header_Navigation).not.toContainText('Santa Breaks');
        await expect(this.Region_Header_Navigation).not.toContainText('Laplnd deals & offers');
        await expect(this.Region_Header_Navigation).not.toContainText('Insider Guides');
        await expect(this.Region_Header_Navigation).not.toContainText('Lapland late Deals');
    }


    async Check_Walking_Region_Page_Footer_Not_Visible() {
        await expect(this.Region_Footer_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Socials).toBeHidden({timeout: 10000});
        await expect(this.Region_Footer_Brands).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Ski_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Walking_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Lapland_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Content_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brand_Details).toBeVisible({timeout: 10000});

        await expect(this.Region_Footer_Links).toContainText('Manage my booking');
        await expect(this.Region_Footer_Links).toContainText('Agent login');
        await expect(this.Region_Footer_Links).toContainText('Help and FAQs');
        await expect(this.Region_Footer_Links).toContainText('Contact us');
        await expect(this.Region_Footer_Links).toContainText('About Us');
        await expect(this.Region_Footer_Links).not.toContainText('Walking With Inghams');
        await expect(this.Region_Footer_Links).not.toContainText('Walking Deals & offers');

        await expect(this.Region_Footer_Brands).toContainText('Ski');
        await expect(this.Region_Footer_Brands).toContainText('Walking');
        await expect(this.Region_Footer_Brands).toContainText('Lapland');

        await expect(this.Region_Footer_Content_Links).toContainText('Terms and conditions');
        await expect(this.Region_Footer_Content_Links).toContainText('Privacy policy');
        await expect(this.Region_Footer_Content_Links).toContainText('Modern Slavery statement');
        await expect(this.Region_Footer_Content_Links).toContainText('Accessibility');
        await expect(this.Region_Footer_Content_Links).toContainText('Sitemap');
        await expect(this.Region_Footer_Content_Links).toContainText('Cookie settings');

        await expect(this.Region_Footer_Brand_Details).toContainText('Inghams is a brand of Hotelplan Limited, “part of the Hotelplan UK Group” © 2024. All Rights Reserved. Registered in England and Wales as Hotelplan Ltd. Registered No 350786. ATOL 0025. ABTA V4871. VAT No: GB 217 4698 42.');
    }


    async Check_Ski_Region_Page_Footer_Not_Visible() {
        await expect(this.Region_Footer_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Socials).toBeHidden({timeout: 10000});
        await expect(this.Region_Footer_Brands).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Ski_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Walking_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Lapland_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Content_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brand_Details).toBeVisible({timeout: 10000});

        await expect(this.Region_Footer_Links).toContainText('Manage my booking');
        await expect(this.Region_Footer_Links).toContainText('Agent login');
        await expect(this.Region_Footer_Links).toContainText('Help and FAQs');
        await expect(this.Region_Footer_Links).toContainText('Contact us');
        await expect(this.Region_Footer_Links).toContainText('About Us');
        await expect(this.Region_Footer_Links).not.toContainText('Walking With Inghams');
        await expect(this.Region_Footer_Links).not.toContainText('Walking Deals & offers');

        await expect(this.Region_Footer_Brands).toContainText('Ski');
        await expect(this.Region_Footer_Brands).toContainText('Walking');
        await expect(this.Region_Footer_Brands).toContainText('Lapland');

        await expect(this.Region_Footer_Content_Links).toContainText('Terms and conditions');
        await expect(this.Region_Footer_Content_Links).toContainText('Privacy policy');
        await expect(this.Region_Footer_Content_Links).toContainText('Modern Slavery statement');
        await expect(this.Region_Footer_Content_Links).toContainText('Accessibility');
        await expect(this.Region_Footer_Content_Links).toContainText('Sitemap');
        await expect(this.Region_Footer_Content_Links).toContainText('Cookie settings');

        await expect(this.Region_Footer_Brand_Details).toContainText('Inghams is a brand of Hotelplan Limited, “part of the Hotelplan UK Group” © 2024. All Rights Reserved. Registered in England and Wales as Hotelplan Ltd. Registered No 350786. ATOL 0025. ABTA V4871. VAT No: GB 217 4698 42.');
    }


    async Check_Lapland_Region_Page_Footer_Not_Visible() {
        await expect(this.Region_Footer_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Socials).toBeHidden({timeout: 10000});
        await expect(this.Region_Footer_Brands).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Ski_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Walking_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brands_Lapland_Symbol).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Content_Links).toBeVisible({timeout: 10000});
        await expect(this.Region_Footer_Brand_Details).toBeVisible({timeout: 10000});

        await expect(this.Region_Footer_Links).toContainText('Manage my booking');
        await expect(this.Region_Footer_Links).toContainText('Agent login');
        await expect(this.Region_Footer_Links).toContainText('Help and FAQs');
        await expect(this.Region_Footer_Links).toContainText('Contact us');
        await expect(this.Region_Footer_Links).toContainText('About Us');
        await expect(this.Region_Footer_Links).not.toContainText('Lapland Excursions');
        await expect(this.Region_Footer_Links).not.toContainText('Lapland deals & offers');


        await expect(this.Region_Footer_Brands).toContainText('Ski');
        await expect(this.Region_Footer_Brands).toContainText('Walking');
        await expect(this.Region_Footer_Brands).toContainText('Lapland');

        await expect(this.Region_Footer_Content_Links).toContainText('Terms and conditions');
        await expect(this.Region_Footer_Content_Links).toContainText('Privacy policy');
        await expect(this.Region_Footer_Content_Links).toContainText('Modern Slavery statement');
        await expect(this.Region_Footer_Content_Links).toContainText('Accessibility');
        await expect(this.Region_Footer_Content_Links).toContainText('Sitemap');
        await expect(this.Region_Footer_Content_Links).toContainText('Cookie settings');

        await expect(this.Region_Footer_Brand_Details).toContainText('Inghams is a brand of Hotelplan Limited, “part of the Hotelplan UK Group” © 2024. All Rights Reserved. Registered in England and Wales as Hotelplan Ltd. Registered No 350786. ATOL 0025. ABTA V4871. VAT No: GB 217 4698 42.');
    }


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
            await expect(ClassAttribute).toContain("alignment-vertical-" + verticalname);
        }

        if(horizontal){
            await expect(ClassAttribute).toContain("alignment-horizontal-" + horizontalname);
        }

    }


    async Check_At_a_Glance(target: string, parameter?: any) {

        console.log(parameter);

        await expect(this.Region_At_a_Glance).toBeVisible({timeout: 30000});
        try{
            await expect(this.Region_At_a_Glance).toContainText(target);
        }
        catch{
            console.log('Region At a Glance Not Found:', target);
        }

        await expect(this.Region_At_a_Glance_Content).toBeVisible({timeout: 30000});
        await expect(this.Region_At_a_Glance_Content).toContainText(parameter.LanguagerandomOption);
        await expect(this.Region_At_a_Glance_Content).toContainText(parameter.CurrencyrandomOption);
        await expect(this.Region_At_a_Glance_Content).toContainText(parameter.TimezonerandomOption);

        await expect(this.Region_At_a_Glance_More_Info).toBeVisible({timeout: 30000});
        await expect(this.Region_At_a_Glance_More_Info).toBeEnabled();

        const MoreInfoURL = await this.Region_At_a_Glance_More_Info.getAttribute('href');
        await expect(MoreInfoURL).not.toBeNull();

    }


    async Check_Accordions() {
        await expect(this.Region_Accordion).toBeVisible({timeout: 30000});
        await expect(this.Region_Accordion).toContainText('RTE Test Accordion Item');
        await expect(this.Region_Accordion).toContainText('Image Carousel Test Accordion Item');
        await expect(this.Region_Accordion).toContainText('RTE Test Accordion Item Content: The quick brown fox jumps over the lazy dog.');

        const RegionAccordion = this.Region_Accordion;
        const allElements = await RegionAccordion.locator('*').elementHandles();

        for (const element of allElements) {
            const tagName = await element.evaluate(el => (el as Element).tagName);
            const attributes = await element.evaluate(el => Array.from((el as Element).attributes).map(attr => ({ name: attr.name, value: attr.value })));
            for (const attribute of attributes) {
                if (attribute.value.includes('Bamboo 1283976')) {
                    await expect(attribute.value).toContain('Bamboo 1283976');
                    console.log('Accordion Item Found:', attribute.value);
                    break;
                }
            }
        }


        for (const element of allElements) {
            const tagName = await element.evaluate(el => (el as Element).tagName);
            const attributes = await element.evaluate(el => Array.from((el as Element).attributes).map(attr => ({ name: attr.name, value: attr.value })));
            for (const attribute of attributes) {
                if (attribute.value.includes('291A0817')) {
                    await expect(attribute.value).toContain('291A0817');
                    console.log('Accordion Item Found:', attribute.value);
                    break;
                }
            }
        }

        
        for (const element of allElements) {
            const tagName = await element.evaluate(el => (el as Element).tagName);
            const attributes = await element.evaluate(el => Array.from((el as Element).attributes).map(attr => ({ name: attr.name, value: attr.value })));
            for (const attribute of attributes) {
                if (attribute.value.includes('Test Inghams Ski Adobestock 232841876')) {
                    await expect(attribute.value).toContain('Test Inghams Ski Adobestock 232841876');
                    console.log('Accordion Item Found:', attribute.value);
                    break;
                }
            }
        }

        
    }




}




export default RegionPage;