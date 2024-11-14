import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5173/');
    await expect(page.locator('#location')).toContainText('Unknown');
    await expect(page.locator('#current')).toContainText('Currently: 0°');
    await expect(page.locator('#highLow')).toContainText('High: 0° Low: 0°');
    await page.waitForTimeout(3000); // Wait for all the data to load in the drop downs
});

test('search by city', async ({ page }) => {
    await page.getByRole('button', { name: 'Select a country' }).click();
    await page.getByRole('option', { name: 'Canada' }).click();
    await page.getByRole('button', { name: 'Select a province' }).click();
    await page.getByRole('option', { name: 'Ontario' }).click();
    await page.getByLabel('City', { exact: true }).click();
    await page.getByLabel('City', { exact: true }).fill('Sarnia');
    await page.getByRole('button').nth(4).click();
    await expect(page.locator('#location')).toContainText('Sarnia, CA');
    await expect(page.locator('#weatherIcon')).toBeVisible();
    await expect(page.locator('#weatherDate')).toBeVisible();
    await expect(page.locator('#current')).not.toContainText('Currently: 0°');
    await expect(page.locator('#highLow')).not.toContainText('High: 0° Low: 0°');
    await expect(page.locator('#location')).not.toContainText('Unknown');
});

test('search by zip/postal code', async ({ page }) => {
    await page.getByRole('tab', { name: 'By Zip/Postal Code' }).click();
    await page.getByRole('button', { name: 'Select a country' }).click();
    await page.getByRole('option', { name: 'United States', exact: true }).click();
    await page.getByLabel('Zip/Postal Code', { exact: true }).click();
    await page.getByLabel('Zip/Postal Code', { exact: true }).fill('90210');
    await page.getByRole('button').nth(3).click();
    await expect(page.locator('#location')).toContainText('Beverly Hills, US');
    await expect(page.locator('#weatherIcon')).toBeVisible();
    await expect(page.locator('#weatherDate')).toBeVisible();
    await expect(page.locator('#current')).not.toContainText('Currently: 0°');
    await expect(page.locator('#highLow')).not.toContainText('High: 0° Low: 0°');
    await expect(page.locator('#location')).not.toContainText('Unknown');
});

test('search by geo coordinates', async ({ page }) => {
    await page.getByRole('tab', { name: 'By Geo Coordinates' }).click();
    await page.getByLabel('Latitude').click();
    await page.getByLabel('Latitude').fill('31.222220');
    await page.getByLabel('Longitude').click();
    await page.getByLabel('Longitude').fill('121.458060');
    await page.getByLabel('By Geo Coordinates').getByRole('button').click();
    await expect(page.locator('#location')).toContainText('Shanghai, CN');
    await expect(page.locator('#weatherIcon')).toBeVisible();
    await expect(page.locator('#weatherDate')).toBeVisible();
    await expect(page.locator('#current')).not.toContainText('Currently: 0°');
    await expect(page.locator('#highLow')).not.toContainText('High: 0° Low: 0°');
    await expect(page.locator('#location')).not.toContainText('Unknown');
});

test('changing measurement units changes the result', async ({ page }) => {
    await page.getByRole('button', { name: 'Select a country' }).click();
    await page.getByRole('option', { name: 'United Kingdom' }).click();
    await page.getByRole('button', { name: 'Select a province' }).click();
    await page.getByRole('option', { name: 'England' }).click();
    await page.getByLabel('City', { exact: true }).click();
    await page.getByLabel('City', { exact: true }).fill('London');
    await page.getByRole('button').nth(4).click();
    await page.getByRole('heading', { name: 'London, GB' }).click();
    await expect(page.locator('#weatherIcon')).toBeVisible();
    await expect(page.locator('#weatherDate')).toBeVisible();
    // Capture current weather numbers to see if changing to metric changes the results
    await expect(page.locator('#current')).not.toContainText('Currently: 0°');
    let currentTemp = await page.locator('#current').innerText();
    await expect(page.locator('#highLow')).not.toContainText('High: 0° Low: 0°');
    let highLowTemp = await page.locator('#highLow').innerText();
    await expect(page.locator('#location')).not.toContainText('Unknown');
    await page.getByRole('button', { name: 'Imperial' }).click();
    await page.getByRole('option', { name: 'Metric' }).click();
    await page.getByRole('button').nth(4).click();
    await expect(page.locator('#current')).not.toContainText(currentTemp);
    currentTemp = await page.locator('#current').innerText();
    await expect(page.locator('#highLow')).not.toContainText(highLowTemp);
    highLowTemp = await page.locator('#highLow').innerText();
    await page.getByRole('button', { name: 'Metric' }).click();
    await page.getByRole('option', { name: 'Standard' }).click();
    await page.getByRole('button').nth(4).click();
    await expect(page.locator('#current')).not.toContainText(currentTemp);
    await expect(page.locator('#highLow')).not.toContainText(highLowTemp);
});