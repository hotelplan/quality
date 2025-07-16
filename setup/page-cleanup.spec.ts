import { test } from '../tests/resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../tests/resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;

test.use({ storageState: '.auth/ecmsUserStorageState.json' });

test(`Delete all Automation pages @page-cleanup`, async ({ sharedSteps, page }) => {
    await page.goto(ECMSurl + '/umbraco#/content')

    await test.step(`Click home`, async () => {
        await sharedSteps.clickHomeLink()
    });

    await test.step(`Click Info tab`, async () => {
        await sharedSteps.clickInfoTab()
    });

    await test.step(`Click Home Document Type link`, async () => {
        await sharedSteps.clickHomeDocumentTypeLink()
    });

    await test.step(`Change Home List view`, async () => {
        await sharedSteps.changeHomeListView()
    });

    await test.step(`Click Home Child Items button`, async () => {
        await sharedSteps.clickHomeChildItemsBtn()
    });

    await test.step(`Select all Automation pages`, async () => {
        await sharedSteps.selectAutomationPageTiles()
    });

    await test.step(`Delete all Automation pages`, async () => {
        await sharedSteps.deletePageConfirmation()
    });

    await test.step(`Click Info tab`, async () => {
        await sharedSteps.clickInfoTab()
    });

    await test.step(`Click Home Document Type link`, async () => {
        await sharedSteps.clickHomeDocumentTypeLink()
    });

    await test.step(`Change back the Home List view settings`, async () => {
        await sharedSteps.changeHomeListView()
    });
})