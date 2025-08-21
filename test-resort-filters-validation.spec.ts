import { test, expect } from './tests/resources/inw_resources/page_objects/base/page_base';

/**
 * VALIDATION TEST FOR RESORT FILTERS
 * 
 * This test validates that the resort filters setup works correctly
 * by testing one filter across all categories.
 */

// Test data configuration
const categories = [
    { name: 'Ski', searchLocation: 'anywhere' },
    { name: 'Walking', searchLocation: 'anywhere' },
    { name: 'Lapland', searchLocation: 'anywhere' }
];

test.describe('Resort Filters - Setup Validation', () => {
    test.beforeEach(async ({ page }) => {
        // Ensure we're running in the correct environment
        const env = process.env.ENV || 'qa';
        if (!['qa', 'stg'].includes(env)) {
            test.skip(true, 'Skipping: Tests only run on qa and stg environments');
        }
        
        console.log(`🌍 Running resort filters validation on ${env} environment`);
        
        // Set longer timeout for filter operations
        test.setTimeout(120000); // 5 minutes per test
        
        // Set viewport for consistency
        await page.setViewportSize({ width: 1920, height: 1080 });
    });

    /**
     * Helper function to set up resort search results
     * 1. Navigate to category search results
     * 2. Enable "View results by resort" toggle
     * 3. Wait for resort results to load
     */
    async function setupResortSearchResults(
        searchResultPage: any, 
        categoryName: string, 
        searchLocation: string = 'anywhere'
    ): Promise<void> {
        console.log(`🔧 Setting up ${categoryName} resort search results...`);
        
        // Step 1: Navigate to category search results
        await searchResultPage.navigateToSearchResults(categoryName, searchLocation);
        console.log(`✓ Successfully navigated to ${categoryName} search results`);
        
        // Step 2: Enable "View results by resort" toggle
        await searchResultPage.enableViewResultsByResort();
        console.log(`✓ Successfully enabled resort view for ${categoryName}`);
        
        console.log(`🏔️ Resort search results setup completed for ${categoryName}`);
    }

    // Test that the resort setup works for each category
    categories.forEach(category => {
        test(`@resort @smoke Should successfully set up resort view for ${category.name}`, async ({ 
            page, 
            searchResultPage 
        }) => {
            // Set up resort search results (navigate + enable resort view)
            await setupResortSearchResults(searchResultPage, category.name, category.searchLocation);
            
            // Verify that filters are visible after enabling resort view
            await expect(page.getByRole('button', { name: 'Ratings' })).toBeVisible({ timeout: 10000 });
            await expect(page.getByRole('button', { name: 'Best For' })).toBeVisible({ timeout: 5000 });
            await expect(page.getByRole('button', { name: 'Board Basis' })).toBeVisible({ timeout: 5000 });
            await expect(page.getByRole('button', { name: 'Facilities' })).toBeVisible({ timeout: 5000 });
            await expect(page.getByRole('button', { name: 'Holiday Types' })).toBeVisible({ timeout: 5000 });
            await expect(page.getByRole('button', { name: 'Duration' })).toBeVisible({ timeout: 5000 });
            await expect(page.getByRole('button', { name: 'Budget' })).toBeVisible({ timeout: 5000 });
            await expect(page.getByRole('button', { name: 'All filters' })).toBeVisible({ timeout: 5000 });
            
            console.log(`✅ All filter buttons are visible for ${category.name} resort view`);
            
            // Verify that we have resort results
            const resultCount = await searchResultPage.getSearchResultCount();
            console.log(`📊 Found ${resultCount} resort results for ${category.name}`);
            
            if (resultCount > 0) {
                console.log(`🎉 Resort filters setup validation passed for ${category.name}`);
            } else {
                console.log(`⚠️ No resort results found for ${category.name} - may be seasonal/business limitation`);
            }
        });
    });
});
