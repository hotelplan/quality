import { type Page, type Locator, expect } from '@playwright/test';
// import { link } from 'node:fs/promises';

export class Linkpage {
    //variables
    readonly page: Page;
    readonly header_link: (link_type: string) => Locator;
    readonly region_link: (primary_link: string) => Locator;
    readonly country_tours: (secondary_link: string) => Locator;
    readonly dropdown_result: Locator;
    readonly div_filters: Locator;
    readonly breadcrumbs: Locator;
    readonly trip_bodydetails: Locator;
    readonly advance_search: Locator;
    readonly footer_link: (primary_link: string) => Locator;


    //locators
    constructor(page: Page) {
        this.page = page;
        this.header_link = (link_type: string) => page.locator(`a[class="exp-nav-new__primary-link"]`).getByText(link_type);
        this.region_link = (primary_link: string) => page.getByRole('link', {name: primary_link, exact: true});
        this.country_tours = (secondary_link: string) => page.getByRole('link', {name: secondary_link, exact: true});
        this.dropdown_result = page.locator('div[class="exp-nav-new__tertiary exp-nav-new__tertiary--active"]');
        this.div_filters = page.locator('//div[@class="filter-panel__wrapper"]');
        this.breadcrumbs = page.locator('//div[@class="breadcrumbs-inner"]');
        this.trip_bodydetails = page.locator('//body[@data-class="explore-destinationcountry"]');
        this.advance_search = page.locator('//a[@class="exp-pt-load-btn exp-pt-load-btn--advanced"]');
        this.footer_link = (primary_link: string) => page.locator(`div[class="ft-main-footer"]`).getByText(primary_link);
        
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
    async destinationlink_checker(link_type: string, primary_link: string, secondary_link: string) {
        const split_tours = secondary_link.split(" tours");
        const secondary_name = split_tours.find(split_tours => split_tours);
        console.log(secondary_name);
        await expect(this.trip_bodydetails).toContainText(secondary_link);
        await expect(this.trip_bodydetails).toContainText(`Tours to ${secondary_name}`);
        await expect(this.trip_bodydetails).toContainText(`Ways to explore ${secondary_name}`);
        await expect(this.trip_bodydetails).toContainText(`Discover our ${secondary_name} tours`);
        await expect(this.trip_bodydetails).toContainText(`Our most popular ${secondary_name} tours`);
        await expect(this.trip_bodydetails).toContainText(`An adventure travel company you can trust`);
        await expect(this.trip_bodydetails).toContainText(`${secondary_name} tour reviews`);
        await expect(this.trip_bodydetails).toContainText(`Need some inspiration for your ${secondary_name} tour?`);
        await expect(this.breadcrumbs).toHaveText(`${link_type} ${primary_link} ${secondary_name}`);

        await this.advance_search.waitFor({ state: 'visible', timeout: 10000 });
        await this.advance_search.hover();
        await this.advance_search.click();

        await expect(this.div_filters).toContainText(`${secondary_name}`);
    }
    async footerLink(primary_link: string) {
        await this.footer_link(primary_link).waitFor({ state: 'visible', timeout: 15000 });
        await this.footer_link(primary_link).hover();
        await this.footer_link(primary_link).click();
    }
}
export default Linkpage;