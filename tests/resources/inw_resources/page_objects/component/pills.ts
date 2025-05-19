import { type Page, type Locator, expect } from '@playwright/test';
import environmentBaseUrl from '../../../../resources/utils/environmentBaseUrl';
import { faker } from '@faker-js/faker';

export class PillsComponent {
    readonly page: Page
    readonly pillLinkStyle: Locator
    readonly pillTitle: Locator
    readonly pillLink: Locator
    readonly pillLinkIcon: Locator
    readonly iconPickerItem: Locator
    readonly pillCtaBtn: Locator
    readonly pillLinkSubmitBtn: Locator
    readonly pillSubmitBtn: Locator
    readonly linkField: Locator
    readonly linkTitleFld: Locator
    readonly urlPickerSubmitBtn: Locator
    readonly linkPicker: Locator

    public iconName: string | null
    public pillTitleText: string
    public pillLinkTitle: string
    public selectedPillStyle: string[]

    constructor(page: Page) {
        this.page = page;
        this.pillLinkStyle = page.locator('select[name="dropDownList"]').nth(2)
        this.pillTitle = page.locator('#title')
        this.pillLink = page.locator('#button_links')
        this.pillLinkIcon = page.locator('.add-link')
        this.iconPickerItem = page.locator('.umb-iconpicker-item')
        this.linkTitleFld = page.locator('#nodeNameLinkPicker')
        this.urlPickerSubmitBtn = page.locator('.btn-success').last()
        this.pillLinkSubmitBtn = page.locator('.btn-primary').last()
        this.pillCtaBtn = page.getByRole('button', { name: 'View All CTA Button: Add url' })
        this.linkPicker = page.locator('button[ng-click="openLinkPicker()"]').nth(1)
        this.linkField = page.locator('#urlLinkPicker')
        this.pillTitleText = faker.word.adjective() + ' ' + faker.word.noun() + ' Pills Automation ' + faker.number.int({ min: 50, max: 1000 })
    }

    async selectPillLinkStyle() {
        const randomIndex = Math.floor(Math.random() * 2) + 1;

        await this.pillLinkStyle.waitFor({ state: 'visible' })
        this.selectedPillStyle = await this.pillLinkStyle.selectOption({ index: randomIndex })
    }

    async fillOutPillTitle() {
        await this.pillTitle.fill(this.pillTitleText)

    }

    async clickAddPillLinkBtn() {
        await this.pillLink.click()

    }

    async addPillLink() {
        await this.pillLinkIcon.click()
        await expect(this.iconPickerItem.nth(0)).toBeVisible()

        const iconPickerItemCount = await this.iconPickerItem.count()
        const iconItemIndex = Math.floor(Math.random() * iconPickerItemCount)
        this.iconName = await this.iconPickerItem.nth(iconItemIndex).locator('a').getAttribute('title')
        await this.iconPickerItem.nth(iconItemIndex).click()

        // await this.linkPicker.click()
        // await this.linkField.waitFor({ state: 'visible' })
        // await this.linkField.fill(environmentBaseUrl.googleLink.testLink)
        // await this.linkTitleFld.fill(this.pillLinkTitle)
        // await this.urlPickerSubmitBtn.click()
        // await this.pillLinkSubmitBtn.click()
    }

    // async addCTAbutton() {
    //     await this.pillCtaBtn.click()
    //     await this.linkField.waitFor({ state: 'visible' })
    //     await this.linkField.fill(environmentBaseUrl.googleLink.testLink)
    //     await this.linkTitleFld.fill(this.ctaButtonLinkTitle)
    //     await this.urlPickerSubmitBtn.click()
    // }

    async validatePillAvailability(newPage, rteContent, pillLinkTitle, ctaButtonLinkTitle, selectedIcon) {
        const pillStyle = this.selectedPillStyle[0].split(':')[1]
        const expectedText = [this.pillTitleText, rteContent, pillLinkTitle, ctaButtonLinkTitle]

        for (const text of expectedText) {
            await expect(newPage.locator('body')).toContainText(text);
        }

        if (pillStyle === 'Rectangle') {
            const actualPillStyle = await newPage.getByText(`${pillLinkTitle}`).evaluate(node => node.parentElement?.parentElement?.className)
            expect(actualPillStyle?.includes('c-catblock'), "Pill Style is correct").toBeTruthy()

        } else if (pillStyle === 'Rounded') {
            const actualPillStyle = await newPage.getByText(`${pillLinkTitle}`).evaluate(node => node.parentElement?.parentElement?.className)
            expect(actualPillStyle?.includes('c-oval-badges'), "Pill Style is correct").toBeTruthy()
        }

        const actualPillIcon = await newPage.getByText(`${pillLinkTitle}`).evaluate(node => node.firstElementChild?.classList.value)
        expect(actualPillIcon?.includes(selectedIcon), "Pill Style is correct").toBeTruthy()

        await expect(newPage.getByText(`${pillLinkTitle}`), "CTA Button link is correct").toHaveAttribute('href', environmentBaseUrl.googleLink.testLink)
        await expect(newPage.locator(`a[title="${ctaButtonLinkTitle}"]`), "CTA Button link is correct").toHaveAttribute('href', environmentBaseUrl.googleLink.testLink)

    }
}

export default PillsComponent