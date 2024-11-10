import { type Page, type Locator, expect } from '@playwright/test';
import exp from 'constants';

export class PcmsMainPage{
    //variables
    readonly page: Page;
    readonly PCMS_Main_Expansion_Arrow: (product: string) => Locator;
    readonly PCMS_Main_Group_Page: (group: string) => Locator;
    readonly PCMS_Main_Target_Page: (target: string) => Locator;
    readonly PCMS_Main_Content_Fields: Locator;

    readonly PCMS_Main_Country_Tab: Locator;
    readonly PCMS_Main_Locale_Tab: Locator;
    readonly PCMS_Main_Headings_Tab: Locator;

    readonly PCMS_Main_Locale_Language: Locator;
    readonly PCMS_Main_Locale_Currency: Locator;
    readonly PCMS_Main_Locale_Timezone: Locator;

    readonly PCMS_Main_Content_Save_And_Publish_Button: Locator;
    readonly PCMS_Main_Content_Published_Message: Locator;
 



    //locators
    constructor(page: Page) {
        this.page = page;
        this.PCMS_Main_Expansion_Arrow = (product: string) => page.locator(`//a[text()="${product}"]//preceding-sibling::button`);
        this.PCMS_Main_Group_Page = (group: string) => page.locator(`//a[text()="${group}"]`);
        this.PCMS_Main_Target_Page = (target: string) => page.locator(`//a[contains(@title,"${target}")]`);
        this.PCMS_Main_Content_Fields = page.getByLabel('Content Fields');

        this.PCMS_Main_Country_Tab = page.getByRole('tab', { name: 'Country' });
        this.PCMS_Main_Locale_Tab = page.getByRole('tab', { name: 'Locale' });
        this.PCMS_Main_Headings_Tab = page.getByRole('tab', { name: 'Headings' });

        this.PCMS_Main_Locale_Language = page.locator('//option[contains(text(),"English")]//parent::select');
        this.PCMS_Main_Locale_Currency = page.locator('//option[contains(text(),"EUR")]//parent::select');
        this.PCMS_Main_Locale_Timezone = page.locator('//option[contains(text(),"GMT")]//parent::select');

        this.PCMS_Main_Content_Save_And_Publish_Button = page.getByRole('button', { name: 'Save and publish' });
        this.PCMS_Main_Content_Published_Message = page.getByText('Content published: and visible on the website ×');


    

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

        await expect(this.PCMS_Main_Content_Fields).toBeVisible({timeout: 30000});
    }


    async PCMS_Modify_Country_Locale(){
        await this.PCMS_Main_Locale_Tab.waitFor({ state: 'visible', timeout: 10000 });
        await this.PCMS_Main_Locale_Tab.hover();
        await this.PCMS_Main_Locale_Tab.click();

        await this.page.waitForTimeout(500);

        await this.PCMS_Main_Locale_Language.waitFor({ state: 'visible', timeout: 10000 });
        await this.PCMS_Main_Locale_Currency.waitFor({ state: 'visible', timeout: 10000 });
        await this.PCMS_Main_Locale_Timezone.waitFor({ state: 'visible', timeout: 10000 });

        // Get all options
        const LanguageOptions = await this.PCMS_Main_Locale_Language.locator('option').allTextContents();
        const CurrencyOptions = await this.PCMS_Main_Locale_Currency.locator('option').allTextContents();
        const TimezoneOptions = await this.PCMS_Main_Locale_Timezone.locator('option').allTextContents();

        // Randomize options
        const LanguagerandomOption = LanguageOptions[Math.floor(Math.random() * LanguageOptions.length)];
        const CurrencyrandomOption = CurrencyOptions[Math.floor(Math.random() * CurrencyOptions.length)];
        const TimezonerandomOption = TimezoneOptions[Math.floor(Math.random() * TimezoneOptions.length)];

        // Set dropdown to random option
        await this.PCMS_Main_Locale_Language.selectOption({ label: LanguagerandomOption });
        await this.PCMS_Main_Locale_Currency.selectOption({ label: CurrencyrandomOption });
        await this.PCMS_Main_Locale_Timezone.selectOption({ label: TimezonerandomOption });

        await this.PCMS_Main_Content_Save_And_Publish_Button.waitFor({state: 'visible', timeout: 10000});
        await this.PCMS_Main_Content_Save_And_Publish_Button.hover();
        await this.PCMS_Main_Content_Save_And_Publish_Button.click();

        await this.PCMS_Main_Content_Published_Message.hover();
        await expect(this.PCMS_Main_Content_Published_Message).toBeVisible({timeout: 30000});

        return{
            LanguagerandomOption,
            CurrencyrandomOption,
            TimezonerandomOption
        }

    }






    //assertions


}




export default PcmsMainPage;


