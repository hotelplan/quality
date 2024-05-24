import { type Page, type Locator , expect } from '@playwright/test';

export class HomePage{
    //variables
    readonly page: Page;
    readonly Our_History_Button: Locator;
    readonly About_Us_Header: Locator;
    readonly Search_Field: Locator;
    readonly Search_Button: Locator;
    readonly Search_Result: Locator;

    


    //constructor // locators
    constructor(page: Page) {
        this.page = page;
        this.Our_History_Button = page.getByRole('link', { name: 'Our History' }).first();
        this.About_Us_Header = page.getByRole('heading', { name: 'ABOUT US' });
        this.Search_Field = page.getByPlaceholder('Site search');
        this.Search_Button = page.getByRole('button', { name: 'Search' });
        this.Search_Result = page.getByText('ERROR 500: INTERNAL SERVER ERROR We’re sorry, the Inghams website is');
    }



    //methods
    async click_Our_History() {
        await this.Our_History_Button.focus();
        await this.Our_History_Button.click();
    }

    async check_Our_History() {
        await expect(this.page).toHaveURL('https://inghams-v2.newdev.hotelplan.co.uk/about-us');
        await expect (this.About_Us_Header).toBeVisible();
    }



    async Search(keyword:string){
        await this.Search_Field.fill(keyword);
        await this.Search_Button.click();
        await expect(this.Search_Result).toContainText(keyword);
    }


}

export default HomePage