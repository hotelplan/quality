import { type Page, type Locator, expect } from '@playwright/test';

export class PcmsSignInPage{
    //variables
    readonly page: Page;
    readonly PCMS_SignIn_Email_Field: Locator;
    readonly PCMS_SignIn_Password_Field: Locator;
    readonly PCMS_SignIn_Login_Button: Locator;

    readonly PCMS_Start_Tour_Button: Locator;
    readonly PCMS_Close_Tour_Button: Locator;
    readonly PCMS_Welcome_Heading: Locator;

    //locators
    constructor(page: Page) {
        this.page = page;
        this.PCMS_SignIn_Email_Field = page.getByLabel('Email');
        this.PCMS_SignIn_Password_Field = page.getByLabel('Password');
        this.PCMS_SignIn_Login_Button = page.getByLabel('Login');

        this.PCMS_Start_Tour_Button = page.getByRole('button', { name: 'Start tour' })
        this.PCMS_Close_Tour_Button = page.getByRole('button', { name: 'Close', exact: true })
        this.PCMS_Welcome_Heading = page.getByRole('heading', { name: 'Welcome to Umbraco' })

    }

    //methods
    async PCMS_Login(Email: any, Password: any){

        await this.PCMS_SignIn_Email_Field.waitFor({state: 'visible', timeout: 10000});  
        await this.PCMS_SignIn_Email_Field.fill(Email);
        await this.PCMS_SignIn_Password_Field.waitFor({state: 'visible', timeout: 10000});  
        await this.PCMS_SignIn_Password_Field.fill(Password);
        await this.PCMS_SignIn_Login_Button.waitFor({state: 'visible', timeout: 10000});
        await this.PCMS_SignIn_Login_Button.hover();
        await this.PCMS_SignIn_Login_Button.click();

        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');

        await this.page.waitForTimeout(10000);

        if(await this.PCMS_Start_Tour_Button.isVisible()){
            await this.PCMS_Close_Tour_Button.waitFor({state: 'visible', timeout: 10000});
            await this.PCMS_Close_Tour_Button.hover();
            await this.PCMS_Close_Tour_Button.click();
        }

        await expect(this.PCMS_Welcome_Heading).toBeVisible({timeout: 30000});
    }



    //assertions


}




export default PcmsSignInPage;