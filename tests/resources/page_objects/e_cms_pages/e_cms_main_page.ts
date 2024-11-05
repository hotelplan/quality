import { type Page, type Locator, expect } from '@playwright/test';
import exp from 'constants';

export class EcmsMainPage{
    //variables
    readonly page: Page;
    readonly ECMS_Main_Expansion_Arrow: (target: string) => Locator;
    readonly ECMS_Main_Target_Page: (target: string) => Locator;

    readonly ECMS_Main_Content_Fields: Locator;
    readonly ECMS_Main_Content_Tab: Locator;
    readonly ECMS_Main_Content_Banner_Item: Locator;   
    readonly ECMS_Main_Content_Add_Banner: Locator;
    
    readonly ECMS_Main_Content_Banner_Layout: Locator;
    readonly ECMS_Main_Content_Banner_Vertical_Alignment: Locator;
    readonly ECMS_Main_Content_Banner_Horizontal_Alignment: Locator;
    readonly ECMS_Main_Content_Banner_Media_Tab: Locator;
    readonly ECMS_Main_Content_Banner_Add_Media: Locator;
    readonly ECMS_Main_Content_Banner_Media_Exist: Locator;
    readonly ECMS_Main_Content_Banner_Remove_Media: Locator;
    readonly ECMS_Main_Content_Banner_Select_Media: (media: string) => Locator;
    readonly ECMS_Main_Content_Banner_Select_Media_Button: Locator;
    readonly ECMS_Main_Content_Submit_Banner_Button: Locator;
    readonly ECMS_Main_Content_Create_Banner_Button: Locator;

    readonly ECMS_Main_Content_Save_And_Publish_Button: Locator;
    readonly ECMS_Main_Content_Published_Message: Locator;

    readonly ECMS_Main_Search_Tab: Locator;
    readonly ECMS_Main_Search_Current_Default_Program: (program: string) => Locator;
    readonly ECMS_Main_Search_Add_Default_Program: Locator;
    readonly ECMS_Main_Search_Remove_Default_Program: Locator;
    readonly ECMS_Main_Search_Select_Default_Program: (program: string) => Locator;



    //locators
    constructor(page: Page) {
        this.page = page;
        this.ECMS_Main_Expansion_Arrow = (target: string) => page.locator(`//a[text()="${target}"]//preceding-sibling::button`);
        this.ECMS_Main_Target_Page = (target: string) => page.locator(`//a[text()="${target}"]`);

        this.ECMS_Main_Content_Fields = page.getByLabel('Content Fields');
        this.ECMS_Main_Content_Tab = page.getByRole('tab', { name: 'Content', exact: true });
        this.ECMS_Main_Content_Banner_Item = page.locator('//button[@class = "btn-reset umb-outline blockelement-labelblock-editor blockelement__draggable-element"]');
        this.ECMS_Main_Content_Add_Banner = page.getByRole('button', { name: 'Add Banner' });

        this.ECMS_Main_Content_Banner_Layout = page.locator('//option[contains(text(),"Full Bleed")]//parent::select');
        this.ECMS_Main_Content_Banner_Vertical_Alignment = page.locator('//option[text()="Top"]//parent::select');
        this.ECMS_Main_Content_Banner_Horizontal_Alignment = page.locator('//option[text()="Full"]//parent::select');

        this.ECMS_Main_Content_Banner_Media_Tab = page.getByRole('tab', { name: 'Media' });
        this.ECMS_Main_Content_Banner_Add_Media = page.getByRole('button', { name: 'Add', exact: true });
        this.ECMS_Main_Content_Banner_Media_Exist = page.locator('//ng-form[@name = "vm.mediaCardForm"]');
        this.ECMS_Main_Content_Banner_Remove_Media = page.getByRole('button', { name: 'Remove' });

        this.ECMS_Main_Content_Banner_Select_Media = (media: string) => page.locator(`//div[@title = "${media}"]`);
        this.ECMS_Main_Content_Banner_Select_Media_Button = page.getByRole('button', { name: 'Select', exact: true });
        this.ECMS_Main_Content_Submit_Banner_Button = page.getByRole('button', { name: 'Submit' });
        this.ECMS_Main_Content_Create_Banner_Button = page.getByRole('button', { name: 'Create', exact: true });

        this.ECMS_Main_Content_Save_And_Publish_Button = page.getByRole('button', { name: 'Save and publish' });
        this.ECMS_Main_Content_Published_Message = page.getByText('Content published: and visible on the website ×');

        this.ECMS_Main_Search_Tab = page.getByRole('tab', { name: 'Search' });
        this.ECMS_Main_Search_Current_Default_Program = (program: string) => page.locator(`//div[@class="umb-node-preview__content"]//div[text()="${program}"]`);
        this.ECMS_Main_Search_Add_Default_Program = page.getByLabel('Default Program: Add');
        this.ECMS_Main_Search_Remove_Default_Program = page.locator('//button[@ng-click="onRemove()"]');
        this.ECMS_Main_Search_Select_Default_Program = (program: string) => page.locator(`//li[@data-element="tree-item-${program}"]`);

    

    }

    //methods
    async ECMS_Expand_Tree(product: string, secondary_product: string | null, country: string | null, region: string | null, resort: string | null){
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
        await this.ECMS_Main_Expansion_Arrow("Home").waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Expansion_Arrow("Home").hover();
        await this.ECMS_Main_Expansion_Arrow("Home").click();
        
        await this.ECMS_Main_Expansion_Arrow(product).waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Expansion_Arrow(product).hover();
        await this.ECMS_Main_Expansion_Arrow(product).click();

        await this.page.waitForTimeout(500);

        if(await this.ECMS_Main_Expansion_Arrow("Resorts").isVisible()){
            await this.ECMS_Main_Expansion_Arrow("Resorts").hover();
            await this.ECMS_Main_Expansion_Arrow("Resorts").click();
        }
        else if(await this.ECMS_Main_Expansion_Arrow("Destinations").isVisible()){
            await this.ECMS_Main_Expansion_Arrow("Destinations").hover();
            await this.ECMS_Main_Expansion_Arrow("Destinations").click();
        }
        else{
            await this.ECMS_Main_Expansion_Arrow("Ski Resorts").hover();
            await this.ECMS_Main_Expansion_Arrow("Ski Resorts").click();
        }

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


    }

    async ECMS_Select_Target_Page(target: string){
        await this.ECMS_Main_Target_Page(target).waitFor({ state: 'visible', timeout: 10000 });
        await this.ECMS_Main_Target_Page(target).hover();
        await this.ECMS_Main_Target_Page(target).click();

        await expect(this.ECMS_Main_Content_Fields).toBeVisible({timeout: 30000});
    }


    async ECMS_Modify_Hero_Banner(media_name: string){
        await this.ECMS_Main_Content_Tab.waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Content_Tab.hover();
        await this.ECMS_Main_Content_Tab.click();

        await this.page.waitForTimeout(2000);

        if(await this.ECMS_Main_Content_Banner_Item.isVisible()){
            await this.ECMS_Main_Content_Banner_Item.hover({timeout: 10000});
            await this.ECMS_Main_Content_Banner_Item.click({timeout: 10000});
        }
        else{
            await this.ECMS_Main_Content_Add_Banner.hover({timeout: 10000});
            await this.ECMS_Main_Content_Add_Banner.click({timeout: 10000});
        }

        await this.ECMS_Main_Content_Banner_Layout.selectOption({label: 'Full Bleed'}); // will create randomizer for this
        await this.ECMS_Main_Content_Banner_Vertical_Alignment.selectOption({label: 'Top'}); // will create randomizer for this
        await this.ECMS_Main_Content_Banner_Horizontal_Alignment.selectOption({label: 'Full'}); // will create randomizer for this

        await this.ECMS_Main_Content_Banner_Media_Tab.waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Content_Banner_Media_Tab.hover();
        await this.ECMS_Main_Content_Banner_Media_Tab.click();

        await this.page.waitForTimeout(3000);

        if(await this.ECMS_Main_Content_Banner_Media_Exist.isVisible()){
            await this.ECMS_Main_Content_Banner_Media_Exist.hover();
            await this.ECMS_Main_Content_Banner_Remove_Media.click();
        }

        await this.ECMS_Main_Content_Banner_Add_Media.waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Content_Banner_Add_Media.hover();
        await this.ECMS_Main_Content_Banner_Add_Media.click();

        await this.ECMS_Main_Content_Banner_Select_Media(media_name).waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Content_Banner_Select_Media(media_name).hover();
        await this.ECMS_Main_Content_Banner_Select_Media(media_name).click();

        await expect(this.ECMS_Main_Content_Banner_Select_Media_Button).toBeEnabled({timeout: 10000});
        await this.ECMS_Main_Content_Banner_Select_Media_Button.hover({timeout: 10000});
        await this.ECMS_Main_Content_Banner_Select_Media_Button.click({timeout: 10000});

        if(await this.ECMS_Main_Content_Submit_Banner_Button.isVisible()){
            await this.ECMS_Main_Content_Submit_Banner_Button.hover();
            await this.ECMS_Main_Content_Submit_Banner_Button.click();

        }
        else{
            await this.ECMS_Main_Content_Create_Banner_Button.hover();
            await this.ECMS_Main_Content_Create_Banner_Button.click();
        }

        await this.ECMS_Main_Content_Save_And_Publish_Button.waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Content_Save_And_Publish_Button.hover();
        await this.ECMS_Main_Content_Save_And_Publish_Button.click();

        await this.ECMS_Main_Content_Published_Message.hover();
        await expect(this.ECMS_Main_Content_Published_Message).toBeVisible({timeout: 30000});

    }


    async ECMS_Add_Default_Program_Header_Footer(program: string){
        await this.ECMS_Main_Search_Tab.waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Search_Tab.hover();
        await this.ECMS_Main_Search_Tab.click();

        await this.page.waitForTimeout(3000);

        if(await this.ECMS_Main_Search_Add_Default_Program.isVisible()){
            await this.ECMS_Main_Search_Add_Default_Program.hover();
            await this.ECMS_Main_Search_Add_Default_Program.click();

            await this.ECMS_Main_Search_Select_Default_Program(program).waitFor({state: 'visible', timeout: 10000});
            await this.ECMS_Main_Search_Select_Default_Program(program).hover();
            await this.ECMS_Main_Search_Select_Default_Program(program).click();

            await expect(this.ECMS_Main_Search_Current_Default_Program(program)).toBeVisible({timeout: 10000});
        }
        else{
            await this.ECMS_Main_Search_Remove_Default_Program.hover();
            await this.ECMS_Main_Search_Remove_Default_Program.click();

            await expect(this.ECMS_Main_Search_Current_Default_Program(program)).not.toBeVisible({timeout  : 10000});
            await expect(this.ECMS_Main_Search_Add_Default_Program).toBeVisible({timeout: 10000});

            await this.ECMS_Main_Search_Add_Default_Program.hover();
            await this.ECMS_Main_Search_Add_Default_Program.click();

            await this.ECMS_Main_Search_Select_Default_Program(program).waitFor({state: 'visible', timeout: 10000});
            await this.ECMS_Main_Search_Select_Default_Program(program).hover();
            await this.ECMS_Main_Search_Select_Default_Program(program).click();

            await expect(this.ECMS_Main_Search_Current_Default_Program(program)).toBeVisible({timeout: 10000});
        }

        await this.ECMS_Main_Content_Save_And_Publish_Button.waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Content_Save_And_Publish_Button.hover();
        await this.ECMS_Main_Content_Save_And_Publish_Button.click();

        await this.ECMS_Main_Content_Published_Message.hover();
        await expect(this.ECMS_Main_Content_Published_Message).toBeVisible({timeout: 30000});

    }


    async ECMS_Remove_Default_Program_Header_Footer(){
        await this.ECMS_Main_Search_Tab.waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Search_Tab.hover();
        await this.ECMS_Main_Search_Tab.click();

        await this.page.waitForTimeout(3000);

        if(await this.ECMS_Main_Search_Add_Default_Program.isHidden()){
            await this.ECMS_Main_Search_Remove_Default_Program.hover();
            await this.ECMS_Main_Search_Remove_Default_Program.click();

            await expect(this.ECMS_Main_Search_Add_Default_Program).toBeVisible({timeout: 10000});

        }

        await this.ECMS_Main_Content_Save_And_Publish_Button.waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_Main_Content_Save_And_Publish_Button.hover();
        await this.ECMS_Main_Content_Save_And_Publish_Button.click();

        await this.ECMS_Main_Content_Published_Message.hover();
        await expect(this.ECMS_Main_Content_Published_Message).toBeVisible({timeout: 30000});

    }






    //assertions


}




export default EcmsMainPage;


