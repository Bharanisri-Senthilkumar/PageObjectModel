import { test, expect } from '@playwright/test';
import Signin from '../pages/signIn.js';
import FlightSearch from '../pages/flights.js';
import SearchResultPage from '../pages/SearchResultsPage.js';
import Logindata from '../Json/logindata.json';
import SearchAPIInputData from '../Json/SearchAPIInputData.json';

test.describe('Flight end to end testing', () => {
  test('Login with Valid Credentials', async ({ page }) => {
    const signinPage = new Signin(page);
    await signinPage.navigatetopage();
    await expect(page).toHaveTitle("Get Fares - Same Flights Lowest Fares");

    await signinPage.logincredentials(Logindata.Username, Logindata.Password);
    await expect(page.locator('.loader-box-content')).toBeHidden({ timeout: 30000 });

    await signinPage.otpfunction();
    await expect(page).toHaveURL('https://uat.getfares.com/flight', { timeout: 600000 });
  });

  SearchAPIInputData.forEach((data, index) => {
    test(`Flight Search Test case ${index + 1}`, async ({ page }) => {
      const flightSearch = new FlightSearch(page);
      await flightSearch.searchfunction(data);

      const searchResultPage = new SearchResultPage(page);
      await searchResultPage.SearchResults(data);
    });
  });
});
