import { type Page, type Locator, expect } from '@playwright/test';
import environmentBaseUrl from '../../../../resources/utils/environmentBaseUrl';
import { faker } from '@faker-js/faker';
export class CTAButtonComponent {
    readonly page: Page
    readonly themeDropdown: Locator
    readonly positionHorizontalDropdown: Locator
    readonly linkField: Locator
    readonly linkTitleFld: Locator
    readonly urlPickerBtn: Locator
    readonly urlPickerSubmitBtn: Locator
    readonly iconPickerBtn: Locator
    readonly iconPickerItem: Locator
    readonly createCTAButtonBtn: Locator
    public theme: string
    public ctaButtonTitle: string
    public iconName: string | null
    public ctaBtnTheme: string[]
    public ctaBtnHorizontalposition: string[]

    constructor(page: Page) {
        this.page = page;
        this.themeDropdown = page.locator('#theme')
        this.positionHorizontalDropdown = page.locator('#positionHorizontal')
        this.linkField = page.locator('#urlLinkPicker')
        this.linkTitleFld = page.locator('#nodeNameLinkPicker')
        this.urlPickerSubmitBtn = page.locator('.btn-success').last()
        this.urlPickerBtn = page.getByRole('button', { name: 'Url Picker: Add url' })
        this.iconPickerBtn = page.locator('[data-element="sortable-thumbnails"]')
        this.iconPickerItem = page.locator('.umb-iconpicker-item')
        this.createCTAButtonBtn = page.locator('.btn-primary')
        this.ctaButtonTitle = faker.word.adjective() + ' ' + faker.word.noun() + ' CTA Button Automation ' + faker.number.int({ min: 50, max: 1000 })

    }
    async setupCtaButton() {
        const themeRandomIndex = Math.floor(Math.random() * 3);
        const positionHorizontalRandomIndex = Math.floor(Math.random() * 4);

        await this.themeDropdown.click()
        this.ctaBtnTheme = await this.themeDropdown.selectOption({ index: themeRandomIndex })
        await this.positionHorizontalDropdown.click()
        this.ctaBtnHorizontalposition = await this.positionHorizontalDropdown.selectOption({ index: positionHorizontalRandomIndex })
        await this.urlPickerBtn.click()
        await this.linkField.waitFor({ state: 'visible' })
        await this.linkField.fill(environmentBaseUrl.googleLink.testLink)
        await this.linkTitleFld.fill(this.ctaButtonTitle)
        await this.urlPickerSubmitBtn.click()
        await this.iconPickerBtn.click()
        await expect(this.iconPickerItem.nth(0)).toBeVisible()

        const iconPickerItemCount = await this.iconPickerItem.count()
        const iconItemIndex = Math.floor(Math.random() * iconPickerItemCount)
        this.iconName = await this.iconPickerItem.nth(iconItemIndex).locator('a').getAttribute('title')
        await this.iconPickerItem.nth(iconItemIndex).click()

    }

    async validateCtaButtonAvailability(newPage) {
        const expectedCTABtnTheme = this.ctaBtnTheme[0].split(':')[1]
        await expect(newPage.locator('body'), "CTA Button title text is available on the page").toContainText(this.ctaButtonTitle);
        await expect(newPage.locator(`a[title="${this.ctaButtonTitle}"]`), "CTA Button title is available on the page").toBeVisible()
        await expect(newPage.locator(`a[title="${this.ctaButtonTitle}"]`), "CTA Button link is correct").toHaveAttribute('href', environmentBaseUrl.googleLink.testLink)
        await expect(newPage.locator(`a[title="${this.ctaButtonTitle}"] [aria-labelledby='${this.iconName}']`), "CTA Button icon is correct").toBeVisible()
        const actualCTABtnClassName = await newPage.locator(`a[title="${this.ctaButtonTitle}"]`).evaluate(node => node.className)
        expect(actualCTABtnClassName.includes(expectedCTABtnTheme), "CTA button theme is correct").toBeTruthy()

        if (expectedCTABtnTheme == 'right') {
            expect(await newPage.locator(`a[title="${this.ctaButtonTitle}"]`).evaluate(node => window.getComputedStyle(node.parentElement!).justifyContent), "CTA button is correctly positioned on the right").toBe('end')

        } else if (expectedCTABtnTheme == 'center') {
            expect(await newPage.locator(`a[title="${this.ctaButtonTitle}"]`).evaluate(node => window.getComputedStyle(node.parentElement!).justifyContent), "CTA button is correctly positioned on the center").toBe('center')

        } else if (expectedCTABtnTheme == 'left') {
            expect(await newPage.locator(`a[title="${this.ctaButtonTitle}"]`).evaluate(node => window.getComputedStyle(node.parentElement!).justifyContent), "CTA button is correctly positioned on the left").toBe('start')

        } else if (expectedCTABtnTheme == 'full') {
            expect(await newPage.locator(`a[title="${this.ctaButtonTitle}"]`).evaluate(node => window.getComputedStyle(node.parentElement!).display), "CTA button is correctly set to full width").toBe('block')

        }

    }

}

export default CTAButtonComponent