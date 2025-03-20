import { test as setup } from '../tests/resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../tests/resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;

setup(`ECMS User Login`, async ({ page, ecmsSignInpage }) => {
    console.log('CMS User setting up...')

    await page.goto(ECMSurl + '/umbraco/login', { waitUntil: 'domcontentloaded' });
    await ecmsSignInpage.ECMS_Login(process.env.ECMS_USERNAME, process.env.ECMS_PASSWORD);
    await page.context().storageState({ path: '.auth/cmsUserStorageState.json' as string });
    console.log('CMS User  Successfully Login...')

});