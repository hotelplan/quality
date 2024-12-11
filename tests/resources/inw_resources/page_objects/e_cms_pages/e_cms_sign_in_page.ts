import { type Page, type Locator, expect } from '@playwright/test';

export class EcmsSignInPage{
    //variables
    readonly page: Page;
    readonly ECMS_SignIn_Email_Field: Locator;
    readonly ECMS_SignIn_Password_Field: Locator;
    readonly ECMS_SignIn_Login_Button: Locator;

    readonly ECMS_Start_Tour_Button: Locator;
    readonly ECMS_Close_Tour_Button: Locator;
    readonly ECMS_Welcome_Heading: Locator;

    //locators
    constructor(page: Page) {
        this.page = page;
        this.ECMS_SignIn_Email_Field = page.getByLabel('Email');
        this.ECMS_SignIn_Password_Field = page.getByLabel('Password');
        this.ECMS_SignIn_Login_Button = page.getByLabel('Login');

        this.ECMS_Start_Tour_Button = page.getByRole('button', { name: 'Start tour' })
        this.ECMS_Close_Tour_Button = page.getByRole('button', { name: 'Close', exact: true })
        this.ECMS_Welcome_Heading = page.getByRole('heading', { name: 'Welcome to Umbraco' })

    }

    //methods
    async ECMS_Login(Email: any, Password: any){

        await this.ECMS_SignIn_Email_Field.waitFor({state: 'visible', timeout: 10000});  
        await this.ECMS_SignIn_Email_Field.fill(Email);
        await this.ECMS_SignIn_Password_Field.waitFor({state: 'visible', timeout: 10000});  
        await this.ECMS_SignIn_Password_Field.fill(Password);
        await this.ECMS_SignIn_Login_Button.waitFor({state: 'visible', timeout: 10000});
        await this.ECMS_SignIn_Login_Button.hover();
        await this.ECMS_SignIn_Login_Button.click();

        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');

        await this.page.waitForTimeout(10000);

        if(await this.ECMS_Start_Tour_Button.isVisible()){
            await this.ECMS_Close_Tour_Button.waitFor({state: 'visible', timeout: 10000});
            await this.ECMS_Close_Tour_Button.hover();
            await this.ECMS_Close_Tour_Button.click();
        }
        await expect(this.ECMS_Welcome_Heading).toBeVisible({timeout: 30000});
    }



    //assertions


}




export default EcmsSignInPage;