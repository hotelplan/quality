import { type Page, type Locator, expect } from '@playwright/test';

export class Linkpage {
    //variables
    readonly page: Page;
    readonly header_link: (link_type: string) => Locator;
    readonly region_link: (primary_link: string) => Locator;
    readonly country_tours: (secondary_link: string) => Locator;
    readonly dropdown_result: Locator;
    readonly div_filters: Locator;


    //locators
    constructor(page: Page) {
        this.page = page;
        this.header_link = (link_type: string) => page.locator(`a[class="exp-nav-new__primary-link"]`).getByText(link_type);
        // this.region_link = (primary_link: string) => page.locator(`a[class="exp-nav-new__secondary-link"]`).getByText(primary_link);
        this.region_link = (primary_link: string) => page.getByRole('link', {name: primary_link, exact: true});
        // this.country_tours = (secondary_link: string) => page.locator(`a[class="exp-nav-new__secondary-link"]`).getByText(secondary_link);
        this.country_tours = (secondary_link: string) => page.getByRole('link', {name: secondary_link, exact: true});
        this.dropdown_result = page.locator('div[class="exp-nav-new__tertiary exp-nav-new__tertiary--active"]');
        this.div_filters = page.locator('//div[@class="filter-panel__wrapper"]');
    }

    //methods
    async headerLink(active: string, filtersearch: string, link_type: string, primary_link: string, secondary_link: string, url: string){
        await this.header_link(link_type).waitFor({ state: 'visible', timeout: 15000 });
        await this.header_link(link_type).hover();
        await this.header_link(link_type).click();

        if (!secondary_link){
            console.log(url);
        }
        else {
            if (active == 'FALSE'){
                if (!filtersearch) {
                    await expect(this.dropdown_result).toBeVisible({timeout: 30000});
                    await this.region_link(primary_link).waitFor({ state: 'visible', timeout: 10000 });
                    await this.region_link(primary_link).hover();
                    await this.region_link(primary_link).click();
    
                    await this.country_tours(secondary_link).waitFor({ state: 'visible', timeout: 10000 });
                    await this.country_tours(secondary_link).hover();
                    await this.country_tours(secondary_link).click();
    
                    console.log(url);
                    await expect(this.page).toHaveURL(url);
                }
                else {
                    await expect(this.dropdown_result).toBeVisible({timeout: 30000});
                    await this.region_link(primary_link).waitFor({ state: 'visible', timeout: 10000 });
                    await this.region_link(primary_link).hover();
                    await this.region_link(primary_link).click();
    
                    await this.country_tours(secondary_link).waitFor({ state: 'visible', timeout: 10000 });
                    await this.country_tours(secondary_link).hover();
                    await this.country_tours(secondary_link).click();
    
                    console.log(url);
                    await expect(this.page).toHaveURL(url);
                    await expect(this.div_filters).toContainText(primary_link);
                    await expect(this.div_filters).toContainText(secondary_link);
                }
            }
            else {
                await expect(this.dropdown_result).toBeVisible({timeout: 30000});
                await this.country_tours(secondary_link).waitFor({ state: 'visible', timeout: 10000 });
                await this.country_tours(secondary_link).hover();
                await this.country_tours(secondary_link).click();
    
                console.log(url);
                await expect(this.page).toHaveURL(url);
            }
        }
    }
}
export default Linkpage;