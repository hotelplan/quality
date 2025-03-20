import { test as setup } from '../tests/resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../tests/resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;
const PCMSurl = environmentBaseUrl[env].p_cms;

setup(`ECMS User Login`, async ({ page, ecmsSignInpage }) => {
    console.log('ECMS User setting up...')

    await page.goto(ECMSurl + '/umbraco/login', { waitUntil: 'domcontentloaded' });
    await ecmsSignInpage.ECMS_Login(process.env.ECMS_USERNAME, process.env.ECMS_PASSWORD);
    await page.context().storageState({ path: '.auth/ecmsUserStorageState.json' as string });
    console.log('ECMS User  Successfully Login...')

});

setup(`PCMS User Login`, async ({ page, ecmsSignInpage }) => {
    console.log('PCMS User setting up...')

    await page.goto(PCMSurl + '/umbraco/login', { waitUntil: 'domcontentloaded' });
    await ecmsSignInpage.ECMS_Login(process.env.PCMS_USERNAME, process.env.PCMS_PASSWORD);
    await page.context().storageState({ path: '.auth/pcmsUserStorageState.json' as string });
    console.log('PCMS User  Successfully Login...')

});