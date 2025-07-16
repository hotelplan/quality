import { test as teardown } from '../tests/resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../tests/resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;

teardown.use({ storageState: '.auth/ecmsUserStorageState.json' });

teardown(`Delete all Automation pages`, async ({ sharedSteps, page }) => {
    await page.goto(ECMSurl + '/umbraco#/content')

    await teardown.step(`Click home`, async () => {
        await sharedSteps.clickHomeLink()
    });

    await teardown.step(`Click Info tab`, async () => {
        await sharedSteps.clickInfoTab()
    });

    await teardown.step(`Click Home Document Type link`, async () => {
        await sharedSteps.clickHomeDocumentTypeLink()
    });

    await teardown.step(`Change Home List view`, async () => {
        await sharedSteps.changeHomeListView()
    });

    await teardown.step(`Click Home Child Items button`, async () => {
        await sharedSteps.clickHomeChildItemsBtn()
    });

    await teardown.step(`Select all Automation pages`, async () => {
        await sharedSteps.selectAutomationPageTiles()
    });

    await teardown.step(`Delete all Automation pages`, async () => {
        await sharedSteps.deletePageConfirmation()
    });

    await teardown.step(`Click Info tab`, async () => {
        await sharedSteps.clickInfoTab()
    });

    await teardown.step(`Click Home Document Type link`, async () => {
        await sharedSteps.clickHomeDocumentTypeLink()
    });

    await teardown.step(`Change back the Home List view settings`, async () => {
        await sharedSteps.changeHomeListView()
    });
})