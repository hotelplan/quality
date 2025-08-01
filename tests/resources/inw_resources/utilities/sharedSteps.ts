import { type Page, type Locator, expect, FrameLocator } from '@playwright/test';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import { faker } from '@faker-js/faker';

export class SharedSteps {
    readonly page: Page
    readonly globalSearch: Locator
    readonly globalSearchInput: Locator
    readonly globalSearchFirstResult: Locator
    readonly contentTab: Locator
    readonly addContentBtn: Locator
    readonly searchComponentFld: Locator
    readonly componentRes: Locator
    readonly createComponentBtn: Locator
    readonly saveAndPublishBtn: Locator
    readonly publishNotification: Locator
    readonly infoTab: Locator
    readonly pageLink: Locator
    readonly genericContentPage: string
    readonly rteFrame: FrameLocator
    readonly rteParagraph: Locator
    readonly urlPickerBtn: Locator
    readonly linkField: Locator
    readonly linkTitleFld: Locator
    readonly urlPickerSubmitBtn: Locator
    readonly pillLinkSubmitBtn: Locator
    readonly iconPickerBtn: Locator
    readonly iconPickerItem: Locator
    readonly linkPickerBtn: Locator
    readonly pillCtabutton: Locator
    readonly newGenericContentPage: string
    readonly homeMenu: Locator
    readonly genericContentPageButton: Locator
    readonly genericContentPageName: Locator
    readonly actionsButton: Locator
    readonly deleteButton: (pageName: string) => Locator
    readonly deleteConfirmation: Locator
    readonly okButton: Locator
    readonly homeLink: Locator
    readonly homeDocumentTypeLink: Locator
    readonly homeListViewBtn: Locator
    readonly homeListViewToggle: Locator
    readonly saveAndCloseHomeBtn: Locator
    readonly homeChildItems: Locator
    readonly homePageTiles: Locator
    readonly deletePageBtn: Locator
    readonly deletePageConfirmationBtn: Locator
    readonly pageEditorSubHeader: Locator
    readonly skiHolidaysMenu: Locator
    readonly walkingHolidaysMenu: Locator
    readonly laplandHolidaysMenu: Locator
    readonly destinationsMenu: Locator
    readonly productCarouselMoreInfoBtn: Locator
    readonly productCarouselViewDetailsBtn: Locator
    readonly searchBar: Locator
    readonly emptySearchBarText: Locator
    readonly searchBarButton: Locator
    public randomCountry: string
    public randomRegion: string
    public resortProductCarouselTitle: string | null | undefined
    public accommodationProductCarouselTitle: string | null | undefined


    constructor(page: Page) {
        this.page = page;
        this.globalSearch = page.locator(`//*[@data-element='global-search']`);
        this.globalSearchInput = page.getByPlaceholder('Type to search...')
        this.globalSearchFirstResult = page.locator('.umb-search-item').first()
        this.addContentBtn = page.getByRole('button', { name: 'Add content' })
        this.searchComponentFld = page.locator('#block-search')
        this.componentRes = page.locator('umb-block-card')
        this.contentTab = page.getByRole('tab', { name: 'Content', exact: true })
        this.createComponentBtn = page.locator('.btn-primary')
        this.saveAndPublishBtn = page.locator('[data-element="button-saveAndPublish"]')
        this.infoTab = page.locator('[data-element="sub-view-umbInfo"]')
        this.pageLink = page.locator('[icon="icon-out"]')
        this.publishNotification = page.locator('.umb-notifications__notifications > li')
        this.rteFrame = page.frameLocator('[title="Rich Text Area"]');
        this.rteParagraph = this.rteFrame.locator('#tinymce');
        this.urlPickerBtn = page.getByRole('button', { name: 'Url Picker: Add url' })
        this.linkPickerBtn = page.locator('button[ng-click="openLinkPicker()"]')
        this.linkField = page.locator('#urlLinkPicker')
        this.linkTitleFld = page.locator('#nodeNameLinkPicker')
        this.urlPickerSubmitBtn = page.locator('.btn-success').last()
        this.pillLinkSubmitBtn = page.locator('.btn-primary').last()
        this.iconPickerBtn = page.locator('[data-element="sortable-thumbnails"]')
        this.iconPickerItem = page.locator('.umb-iconpicker-item')
        this.pillCtabutton = page.getByRole('button', { name: 'View All CTA Button: Add url' })
        //The location of the Generic Content Page name can be placed in a separate file.
        this.genericContentPage = 'Automation SKI Components'
        this.newGenericContentPage = 'Automation Test Page'
        this.homeMenu = page.getByRole('button', { name: 'Open context menu for Home' });
        this.genericContentPageButton = page.getByRole('button', { name: 'Generic Content Page' })
        this.genericContentPageName = page.getByRole('textbox', { name: 'Generic Content Page Name' })
        this.actionsButton = page.getByRole('button', { name: 'Actions' });
        this.deleteButton = (pageName: string) => page.getByRole('button', { name: `Delete ${pageName}` })
        this.deleteConfirmation = page.locator('//localize[text()="was deleted"]')
        this.okButton = page.getByRole('button', { name: 'OK' })
        this.homeLink = page.getByRole('link', { name: 'Home' })
        this.homeDocumentTypeLink = page.getByRole('button', { name: 'Open  Home...' })
        this.homeListViewBtn = page.getByRole('button', { name: 'List view' })
        this.homeListViewToggle = page.locator('[id="sub-view-1"] .umb-toggle__toggle');
        this.saveAndCloseHomeBtn = page.getByRole('button', { name: 'Save and close' })
        this.homeChildItems = page.locator('.umb-sub-views-nav').getByRole('button', { name: 'Child items' })
        this.homePageTiles = page.locator('.umb-content-grid__item');
        this.deletePageBtn = page.getByRole('button', { name: 'Delete...' })
        this.deletePageConfirmationBtn = page.getByRole('button', { name: 'Yes, delete' })
        this.pageEditorSubHeader = page.locator('.umb-editor-sub-header');
        this.skiHolidaysMenu = page.getByRole('banner').getByRole('link', { name: 'Ski Holidays' })
        this.walkingHolidaysMenu = page.getByRole('link', { name: 'Walking Holidays' })
        this.laplandHolidaysMenu = page.getByRole('link', { name: 'Lapland Holidays' })
        this.destinationsMenu = page.getByRole('link', { name: 'Destinations', exact: true })
        this.productCarouselMoreInfoBtn = page.getByRole('link', { name: 'More info' })
        this.productCarouselViewDetailsBtn = page.getByRole('link', { name: 'View details' })
        this.searchBar = page.locator('#accommsTripBar')
        this.emptySearchBarText = page.locator('.c-search-criteria-bar__empty-trip-label')
        this.searchBarButton = page.locator('.c-search-criteria-bar__right-section .c-btn')
    }

    async createGenericContentPage() {
        const pageName = this.newGenericContentPage + ' ' + crypto.randomUUID().slice(0, 8);
        await this.homeMenu.waitFor({ state: 'visible' })
        await this.homeMenu.click()
        await this.genericContentPageButton.waitFor({ state: 'visible' })
        await this.genericContentPageButton.click()
        await this.genericContentPageName.waitFor({ state: 'visible' })
        await this.genericContentPageName.fill(pageName)
        return pageName
    }

    async deleteGenericContentPage(pageName: string) {
        await this.actionsButton.waitFor({ state: 'visible' })
        await this.actionsButton.click()
        await this.deleteButton(pageName).waitFor({ state: 'visible' })
        await this.deleteButton(pageName).click()
        await this.okButton.waitFor({ state: 'visible' })
        await this.okButton.click()
        await this.deleteConfirmation.waitFor({ state: 'visible' })
        await this.okButton.waitFor({ state: 'visible' })
        await this.okButton.click()

    }

    async searchAndSelectNewGenericContentPage(pageName: string) {
        await this.globalSearch.waitFor({ state: 'visible' })
        await this.globalSearch.click()
        await this.globalSearchInput.fill(pageName)
        await this.globalSearchInput.press('Enter')
        await expect(this.globalSearchFirstResult).toBeVisible()
        await this.globalSearchFirstResult.click()
    }

    async searchPage(pageName: string) {
        await this.globalSearch.waitFor({ state: 'visible' })
        await this.globalSearch.click()
        await this.globalSearchInput.fill(pageName)
        await this.globalSearchInput.press('Enter')
        await expect(this.globalSearchFirstResult).toBeVisible()
        await this.globalSearchFirstResult.click()
    }

    async clickContentTab() {
        await this.contentTab.waitFor({ state: 'visible' })
        await this.contentTab.click()
    }

    async clickAddContentBtn() {
        await this.addContentBtn.waitFor({ state: 'visible' })
        await this.addContentBtn.click()
    }

    async searchComponent(component: string) {
        await this.searchComponentFld.pressSequentially(component)
    }

    async selectComponent() {
        await this.componentRes.waitFor({ state: 'visible' })
        await this.componentRes.click()
    }

    async clickCreateBtn(locator: number = 0) {
        if (locator == 1) {
            //for some reason, the locator .btn primary is not working so we need to use nth(0) to select
            const createComponentBtnOtherLocator = this.page.locator('.btn-primary').nth(0)
            await createComponentBtnOtherLocator.click()
        } else {
            await this.createComponentBtn.waitFor({ state: 'visible' })
            await this.createComponentBtn.click()
        }

    }
    async clickSaveAndPublishBtn() {
        await this.saveAndPublishBtn.waitFor({ state: 'visible' })
        await this.saveAndPublishBtn.click()
        await this.publishNotification.waitFor({ state: 'visible' })
        const notif = await this.publishNotification.textContent()

        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {

            if (notif?.includes('Content published:  and visible on the website')) {
                console.log(notif, ' - Content published: and visible on the website');
                await expect(this.publishNotification).toHaveCount(1);
                await expect(this.publishNotification).toHaveCount(0);
                break;
            } else {
                console.log(notif, ' - Recursive issue');
                await this.page.locator('umb-button').filter({ hasText: 'Save and publish' }).getByRole('button').click();
                await expect(this.publishNotification).toHaveCount(1);

                const updatedNotif = await this.publishNotification.textContent()
                console.log('Waiting for the notification to appear again...', updatedNotif);
                if (updatedNotif?.includes('Content published:  and visible on the website')) {
                    console.log(updatedNotif, ' 2nd - Content published: and visible on the website');
                    await expect(this.publishNotification).toHaveCount(0);
                    break;
                }
            }

            attempts++;
        }

    }

    async clickInfoTab() {
        await this.infoTab.waitFor({ state: 'visible' })
        await this.infoTab.click()
    }

    async clickPageLink() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.pageLink.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded')
        await newPage.bringToFront()

        return newPage
    }

    async validatePageUrl(newPage) {
        const formattedUrlPart = this.genericContentPage.replace(/\s+/g, '-').toLowerCase();
        await expect(newPage).toHaveURL(new RegExp(`.*${formattedUrlPart}`));
    }

    async fillOutRTETextEditor(component: string = 'common') {
        //Rich text content is initialized here to meet test cases that require unique input.
        const richTextContent = faker.lorem.paragraph()

        if (component == 'Good to know item') {
            const goodToKnowItemDescription = faker.word.adjective() + ' ' + faker.word.noun() + ' Item Description Automation ' + faker.number.int({ min: 50, max: 1000 })
            await this.page.waitForLoadState('domcontentloaded')
            await this.page.locator('iframe').nth(1).contentFrame().locator('#tinymce').fill(goodToKnowItemDescription)
            return goodToKnowItemDescription
        } else {
            await this.page.waitForLoadState('domcontentloaded')
            await this.rteParagraph.waitFor({ state: 'visible' })
            await this.rteParagraph.click()
            await this.rteParagraph.fill(richTextContent);
            await this.rteParagraph.focus()
            await this.rteParagraph.click()
            return richTextContent

        }
    }

    async fillOutGoogleLink(title: string) {
        await this.linkField.waitFor({ state: 'visible' })
        await this.linkField.fill(environmentBaseUrl.googleLink.testLink)
        await this.linkTitleFld.fill(title)
        await this.urlPickerSubmitBtn.click()
    }

    async pickComponentLink(component: string = 'common') {
        if (component == 'Good to know item') {
            const goodToKnowLinkTitle = faker.word.noun() + ' Good to know Link ' + faker.number.int({ min: 50, max: 1000 })
            await this.linkPickerBtn.nth(1).click()
            await this.fillOutGoogleLink(goodToKnowLinkTitle)

            return goodToKnowLinkTitle

        } else if (component == 'Pills') {
            const pillLinkTitle = faker.word.noun() + ' Pill Link ' + faker.number.int({ min: 50, max: 1000 })
            await this.linkPickerBtn.nth(2).click()
            await this.fillOutGoogleLink(pillLinkTitle)
            await this.pillLinkSubmitBtn.click()

            return pillLinkTitle

        } else if (component == 'CTA Button') {
            const ctaButtonTitle = faker.word.adjective() + ' ' + faker.word.noun() + ' CTA Button Automation ' + faker.number.int({ min: 50, max: 1000 })
            await this.urlPickerBtn.click()
            await this.fillOutGoogleLink(ctaButtonTitle)

            return ctaButtonTitle

        } else if (component == 'Pill CTA Button') {
            const pillCtaButtonTitle = faker.word.adjective() + ' ' + faker.word.noun() + ' Button ' + faker.number.int({ min: 50, max: 1000 })

            await this.pillCtabutton.click()
            await this.fillOutGoogleLink(pillCtaButtonTitle)

            return pillCtaButtonTitle
        }

        return '';
    }

    async selectComponentIcon() {
        await this.iconPickerBtn.click()
        await expect(this.iconPickerItem.nth(0)).toBeVisible()

        const iconPickerItemCount = await this.iconPickerItem.count()
        const iconItemIndex = Math.floor(Math.random() * iconPickerItemCount)
        const iconName = await this.iconPickerItem.nth(iconItemIndex).locator('a').getAttribute('title')
        await this.iconPickerItem.nth(iconItemIndex).click()

        return iconName
    }
    async validateNewPageUrl(newPage) {
        const formattedUrlPart = this.newGenericContentPage.replace(/\s+/g, '-').toLowerCase();
        await expect(newPage).toHaveURL(new RegExp(`.*${formattedUrlPart}`));
        await this.clickAcceptAllCookiesBtn(newPage)
    }

    async clickAcceptAllCookiesBtn(newPage) {
        const acceptAllCookiesBtn = newPage.getByRole('button', { name: 'Accept All Cookies' })
        await acceptAllCookiesBtn.waitFor({ state: 'visible' })
            .catch(async () => {
                console.log('Accept All Cookies button not found, skipping click action');
            });

        await acceptAllCookiesBtn.click();

    }

    async clickHomeLink() {
        await this.homeLink.waitFor({ state: 'visible' })
        await this.homeLink.click()
    }

    async clickHomeDocumentTypeLink() {
        await this.homeDocumentTypeLink.click()
    }

    async changeHomeListView() {
        await this.homeListViewBtn.click()
        await this.homeListViewToggle.click()
        await this.saveAndCloseHomeBtn.click()
        await expect(this.publishNotification).toHaveCount(1);
        await expect(this.publishNotification).toHaveCount(0);
    }

    async clickHomeChildItemsBtn() {
        await this.homeChildItems.click()
    }

    async selectAutomationPageTiles() {
        await this.homePageTiles.nth(0).waitFor({ state: 'visible' })
        const homePageTilesCount = await this.homePageTiles.count()
        for (let i = 0; i < homePageTilesCount; i++) {
            const homePageTile = await this.homePageTiles.locator('a').nth(i).textContent()
            if (homePageTile?.includes('Automation Test Page')) {
                await this.homePageTiles.nth(i).click()
            }
        }
    }

    async deletePageConfirmation() {
        await this.deletePageBtn.click()
        await this.deletePageConfirmationBtn.click()
        await expect(this.publishNotification).toHaveCount(1);
        await expect(this.publishNotification).toHaveCount(0);
    }

    async clickProductMenu(string = 'Ski') {
        if (string === 'Ski') {
            await this.skiHolidaysMenu.click()
        } else if (string === 'Walking') {
            await this.walkingHolidaysMenu.click()
        } else if (string === 'Lapland') {
            await this.laplandHolidaysMenu.click()
        }

    }

    async hoverDestinationsMenu() {
        await this.destinationsMenu.waitFor({ state: 'visible' })
        await this.destinationsMenu.hover()
    }

    async selectCountry() {
        const countries = ['Andorra', 'Austria', 'Canada', 'France', 'Italy', 'Norway', 'Switzerland']
        this.randomCountry = countries[Math.floor(Math.random() * countries.length)];
        const selectedCountry = this.page.getByRole('link', { name: `open ${this.randomCountry}` })

        await selectedCountry.waitFor({ state: 'visible' })
        await selectedCountry.click()

    }

    async selectRegion() {
        const region = ['Three Valleys Ski Area', 'Tignes-Val d’Isere Ski Area', 'Arlberg Ski Area', 'The Dolomites Ski Area', 'Jungfrau Ski Region', 'Aosta Valley Ski Area', 'Portes du Soleil Ski Area', 'The Ski Juwel Area']
        this.randomRegion = region[Math.floor(Math.random() * region.length)];
        const selectedRegion = this.page.getByRole('link', { name: `${this.randomRegion}` })

        await selectedRegion.waitFor({ state: 'visible' })
        await selectedRegion.click()

    }


    async validateInwURL(page = 'country') {
        if (page === 'country') {
            const formattedCountry = this.randomCountry.toLowerCase().replace(/\s+/g, '-');
            await expect(this.page).toHaveURL(new RegExp(formattedCountry, 'i'));
        } else if (page === 'resort') {
            const formattedResort = this.resortProductCarouselTitle?.toLowerCase().replace(/\s+/g, '-');
            if (formattedResort) {
                await expect(this.page).toHaveURL(new RegExp(formattedResort, 'i'));
            }
        } else if (page === 'region') {
            const formattedRegion = this.randomRegion.toLowerCase().replace(/\s+/g, '-');
            await expect(this.page).toHaveURL(new RegExp(formattedRegion, 'i'));
        } else if (page === 'accommodation') {
            const formmattedAccommodation = this.accommodationProductCarouselTitle?.toLowerCase().replace(/\s+/g, '-');
            if (formmattedAccommodation) {
                await expect(this.page).toHaveURL(new RegExp(formmattedAccommodation, 'i'));
            }
        }

    }

    async selectResortCard() {
        const resortCardCount = await this.productCarouselMoreInfoBtn.count();
        const randomIndex = Math.floor(Math.random() * resortCardCount);

        await this.productCarouselMoreInfoBtn.nth(randomIndex).waitFor({ state: 'visible' });
        this.resortProductCarouselTitle = await this.productCarouselMoreInfoBtn.nth(randomIndex).evaluate(node => node.parentElement?.parentElement?.previousElementSibling?.querySelector('h3')?.textContent);
        await this.productCarouselMoreInfoBtn.nth(randomIndex).click();
    }

    async selectAccommodationCard() {
        const accommodationCardCount = await this.productCarouselViewDetailsBtn.count();
        const randomIndex = Math.floor(Math.random() * accommodationCardCount);

        await this.productCarouselViewDetailsBtn.nth(randomIndex).waitFor({ state: 'visible' });
        this.accommodationProductCarouselTitle = await this.productCarouselViewDetailsBtn.nth(randomIndex).evaluate(node => node.parentElement?.parentElement?.previousElementSibling?.previousElementSibling?.previousElementSibling?.querySelector('h3')?.textContent);
        await this.productCarouselViewDetailsBtn.nth(randomIndex).click();
    }

    async validateSearchBarAvailability() {
        await this.searchBar.waitFor({ state: 'visible' });
        const isSearchBarVisible = await this.searchBar.isVisible();
        expect(isSearchBarVisible).toBeTruthy();
    }

    async validateSearchBarText() {
        const expectedText = 'Check availability to see more accurate pricing'
        await this.searchBar.waitFor({ state: 'visible' });
        const searchBarText = await this.emptySearchBarText.textContent();
        expect(searchBarText).toContain(expectedText);
    }

    async validateSearchBarButtonText() {
        const expectedButtonText = 'Check Availability';
        await this.searchBarButton.waitFor({ state: 'visible' });
        const buttonText = await this.searchBarButton.textContent();
        expect(buttonText).toContain(expectedButtonText);
    }

}

export default SharedSteps