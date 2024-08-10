import { expect } from '@playwright/test';


async function Check_LaplandCountryCode(apiContext:any, baseUrl: string, CountryCode: string) {
    const response = await apiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Alapland&filter=countryCode%3A${CountryCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
    const responseBody = await response.json();
        
    console.log(await response.status()); // Log the status for debugging
    console.log(responseBody); // Log the response body for debugging
        
    expect(response.status()).toBe(200);

    // Check the response body structure and content
    expect(responseBody).toHaveProperty('items');
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.items.length).toEqual(1);

    // Check the first item in the response body
    const content = responseBody.items[0];

    expect(content).toHaveProperty('contentType');
    expect(content.contentType).toBe('countryLapland');

    expect(content).toHaveProperty('name');
    expect(content.name).not.toBeNull();

    expect(content).toHaveProperty('createDate');
    expect(content.createDate).not.toBeNull();

    expect(content).toHaveProperty('updateDate');
    expect(content.updateDate).not.toBeNull();

    expect(content).toHaveProperty('route');
    expect(content.route).not.toBeNull();

    expect(content).toHaveProperty('id');
    expect(content.id).not.toBeNull();


    expect(content).toHaveProperty('properties');
    expect(content).toHaveProperty('properties');
    expect(content.properties).toHaveProperty('countryCode');
    expect(content.properties.countryCode).toBe(CountryCode);
}


async function Check_LaplandRegionCode(apiContext:any, baseUrl: string, RegionCode: string) {
    const response = await apiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Alapland&filter=regionCode%3A${RegionCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
    const responseBody = await response.json();
    
    console.log(await response.status()); // Log the status for debugging
    console.log(responseBody); // Log the response body for debugging

    expect(response.status()).toBe(200);

    // Check the response body structure and content
    expect(responseBody).toHaveProperty('items');
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.items.length).toEqual(1);

    // Check the first item in the response body
    const content = responseBody.items[0];

    expect(content).toHaveProperty('contentType');
    expect(content.contentType).toBe('regionLapland');

    expect(content).toHaveProperty('name');
    expect(content.name).not.toBeNull();

    expect(content).toHaveProperty('createDate');
    expect(content.createDate).not.toBeNull();

    expect(content).toHaveProperty('updateDate');
    expect(content.updateDate).not.toBeNull();

    expect(content).toHaveProperty('route');
    expect(content.route).not.toBeNull();

    expect(content).toHaveProperty('id');
    expect(content.id).not.toBeNull();


    expect(content).toHaveProperty('properties');
    expect(content).toHaveProperty('properties');
    expect(content.properties).toHaveProperty('regionCode');
    expect(content.properties.regionCode).toBe(RegionCode);
}


async function Check_LaplandResortCode(apiContext:any, baseUrl: string, ResortCode: string) {
    const response = await apiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Alapland&filter=resortCode%3A${ResortCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
    const responseBody = await response.json();

    console.log(await response.status()); // Log the status for debugging
    console.log(responseBody); // Log the response body for debugging

    expect(response.status()).toBe(200);

    // Check the response body structure and content
    expect(responseBody).toHaveProperty('items');
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.items.length).toEqual(1);

    // Check the first item in the response body
    const content = responseBody.items[0];

    expect(content).toHaveProperty('contentType');
    expect(content.contentType).toBe('resortLapland');

    expect(content).toHaveProperty('name');
    expect(content.name).not.toBeNull();

    expect(content).toHaveProperty('createDate');
    expect(content.createDate).not.toBeNull();

    expect(content).toHaveProperty('updateDate');
    expect(content.updateDate).not.toBeNull();

    expect(content).toHaveProperty('route');
    expect(content.route).not.toBeNull();

    expect(content).toHaveProperty('id');
    expect(content.id).not.toBeNull();


    expect(content).toHaveProperty('properties');
    expect(content).toHaveProperty('properties');
    expect(content.properties).toHaveProperty('resortCode');
    expect(content.properties.resortCode).toBe(ResortCode);
}


async function Check_SantaCountryCode(apiContext:any, baseUrl: string, CountryCode: string) {
    const response = await apiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Asanta&filter=countryCode%3A${CountryCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
    const responseBody = await response.json();
        
    console.log(await response.status()); // Log the status for debugging
    console.log(responseBody); // Log the response body for debugging
        
    expect(response.status()).toBe(200);

    // Check the response body structure and content
    expect(responseBody).toHaveProperty('items');
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.items.length).toEqual(1);

    // Check the first item in the response body
    const content = responseBody.items[0];

    expect(content).toHaveProperty('contentType');
    expect(content.contentType).toBe('countryLapland');

    expect(content).toHaveProperty('name');
    expect(content.name).not.toBeNull();

    expect(content).toHaveProperty('createDate');
    expect(content.createDate).not.toBeNull();

    expect(content).toHaveProperty('updateDate');
    expect(content.updateDate).not.toBeNull();

    expect(content).toHaveProperty('route');
    expect(content.route).not.toBeNull();

    expect(content).toHaveProperty('id');
    expect(content.id).not.toBeNull();


    expect(content).toHaveProperty('properties');
    expect(content).toHaveProperty('properties');
    expect(content.properties).toHaveProperty('countryCode');
    expect(content.properties.countryCode).toBe(CountryCode);
}


async function Check_SantaRegionCode(apiContext:any, baseUrl: string, RegionCode: string) {
    const response = await apiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Asanta&filter=regionCode%3A${RegionCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
    const responseBody = await response.json();
    
    console.log(await response.status()); // Log the status for debugging
    console.log(responseBody); // Log the response body for debugging

    expect(response.status()).toBe(200);

    // Check the response body structure and content
    expect(responseBody).toHaveProperty('items');
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.items.length).toEqual(1);

    // Check the first item in the response body
    const content = responseBody.items[0];

    expect(content).toHaveProperty('contentType');
    expect(content.contentType).toBe('regionLapland');

    expect(content).toHaveProperty('name');
    expect(content.name).not.toBeNull();

    expect(content).toHaveProperty('createDate');
    expect(content.createDate).not.toBeNull();

    expect(content).toHaveProperty('updateDate');
    expect(content.updateDate).not.toBeNull();

    expect(content).toHaveProperty('route');
    expect(content.route).not.toBeNull();

    expect(content).toHaveProperty('id');
    expect(content.id).not.toBeNull();


    expect(content).toHaveProperty('properties');
    expect(content).toHaveProperty('properties');
    expect(content.properties).toHaveProperty('regionCode');
    expect(content.properties.regionCode).toBe(RegionCode);
}


async function Check_SantaResortCode(apiContext:any, baseUrl: string, ResortCode: string) {
    const response = await apiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Asanta&filter=resortCode%3A${ResortCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
    const responseBody = await response.json();

    console.log(await response.status()); // Log the status for debugging
    console.log(responseBody); // Log the response body for debugging

    expect(response.status()).toBe(200);

    // Check the response body structure and content
    expect(responseBody).toHaveProperty('items');
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.items.length).toEqual(1);

    // Check the first item in the response body
    const content = responseBody.items[0];

    expect(content).toHaveProperty('contentType');
    expect(content.contentType).toBe('resortLapland');

    expect(content).toHaveProperty('name');
    expect(content.name).not.toBeNull();

    expect(content).toHaveProperty('createDate');
    expect(content.createDate).not.toBeNull();

    expect(content).toHaveProperty('updateDate');
    expect(content.updateDate).not.toBeNull();

    expect(content).toHaveProperty('route');
    expect(content.route).not.toBeNull();

    expect(content).toHaveProperty('id');
    expect(content.id).not.toBeNull();


    expect(content).toHaveProperty('properties');
    expect(content).toHaveProperty('properties');
    expect(content.properties).toHaveProperty('resortCode');
    expect(content.properties.resortCode).toBe(ResortCode);
}


async function Check_SkiCountryCode(apiContext:any, baseUrl: string, CountryCode: string) {
    const response = await apiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Aski&filter=countryCode%3A${CountryCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
    const responseBody = await response.json();
        
    console.log(await response.status()); // Log the status for debugging
    console.log(responseBody); // Log the response body for debugging
        
    expect(response.status()).toBe(200);

    // Check the response body structure and content
    expect(responseBody).toHaveProperty('items');
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.items.length).toEqual(1);

    // Check the first item in the response body
    const content = responseBody.items[0];

    expect(content).toHaveProperty('contentType');
    expect(content.contentType).toBe('countrySki');

    expect(content).toHaveProperty('name');
    expect(content.name).not.toBeNull();

    expect(content).toHaveProperty('createDate');
    expect(content.createDate).not.toBeNull();

    expect(content).toHaveProperty('updateDate');
    expect(content.updateDate).not.toBeNull();

    expect(content).toHaveProperty('route');
    expect(content.route).not.toBeNull();

    expect(content).toHaveProperty('id');
    expect(content.id).not.toBeNull();


    expect(content).toHaveProperty('properties');
    expect(content).toHaveProperty('properties');
    expect(content.properties).toHaveProperty('countryCode');
    expect(content.properties.countryCode).toBe(CountryCode);
}


async function Check_SkiRegionCode(apiContext:any, baseUrl: string, RegionCode: string) {
    const response = await apiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Aski&filter=regionCode%3A${RegionCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
    const responseBody = await response.json();
    
    console.log(await response.status()); // Log the status for debugging
    console.log(responseBody); // Log the response body for debugging

    expect(response.status()).toBe(200);

    // Check the response body structure and content
    expect(responseBody).toHaveProperty('items');
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.items.length).toEqual(1);

    // Check the first item in the response body
    const content = responseBody.items[0];

    expect(content).toHaveProperty('contentType');
    expect(content.contentType).toBe('regionSki');

    expect(content).toHaveProperty('name');
    expect(content.name).not.toBeNull();

    expect(content).toHaveProperty('createDate');
    expect(content.createDate).not.toBeNull();

    expect(content).toHaveProperty('updateDate');
    expect(content.updateDate).not.toBeNull();

    expect(content).toHaveProperty('route');
    expect(content.route).not.toBeNull();

    expect(content).toHaveProperty('id');
    expect(content.id).not.toBeNull();


    expect(content).toHaveProperty('properties');
    expect(content).toHaveProperty('properties');
    expect(content.properties).toHaveProperty('regionCode');
    expect(content.properties.regionCode).toBe(RegionCode);
}


async function Check_SkiResortCode(apiContext:any, baseUrl: string, ResortCode: string) {
    const response = await apiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Aski&filter=resortCode%3A${ResortCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
    const responseBody = await response.json();

    console.log(await response.status()); // Log the status for debugging
    console.log(responseBody); // Log the response body for debugging

    expect(response.status()).toBe(200);

    // Check the response body structure and content
    expect(responseBody).toHaveProperty('items');
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.items.length).toEqual(1);

    // Check the first item in the response body
    const content = responseBody.items[0];

    expect(content).toHaveProperty('contentType');
    expect(content.contentType).toBe('resortSki');

    expect(content).toHaveProperty('name');
    expect(content.name).not.toBeNull();

    expect(content).toHaveProperty('createDate');
    expect(content.createDate).not.toBeNull();

    expect(content).toHaveProperty('updateDate');
    expect(content.updateDate).not.toBeNull();

    expect(content).toHaveProperty('route');
    expect(content.route).not.toBeNull();

    expect(content).toHaveProperty('id');
    expect(content.id).not.toBeNull();


    expect(content).toHaveProperty('properties');
    expect(content).toHaveProperty('properties');
    expect(content.properties).toHaveProperty('resortCode');
    expect(content.properties.resortCode).toBe(ResortCode);
}


export const PCMS = {
    Check_LaplandCountryCode,
    Check_LaplandRegionCode,
    Check_LaplandResortCode,
    Check_SantaCountryCode,
    Check_SantaRegionCode,
    Check_SantaResortCode,
    Check_SkiCountryCode,
    Check_SkiRegionCode,
    Check_SkiResortCode
};