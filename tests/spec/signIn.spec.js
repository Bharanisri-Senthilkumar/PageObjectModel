import { test, expect, chromium } from '@playwright/test';
import Signin from '../pages/signIn.js';
import SearchAPIInputData from '../Json/SearchAPIInputData.json';
import Logindata from '../Json/logindata.json';
import FlightSearch from '../pages/flights.js';
import SearchResultPage from '../pages/SearchResultsPage.js';
let browser, context, page;
test.beforeAll(async ({request}) => {
  test.setTimeout(600000);
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  const signinPage = new Signin(page,request);
  await signinPage.navigatetopage();
  await expect(page).toHaveTitle("Get Fares - Same Flights Lowest Fares");
  await signinPage.logincredentials(Logindata.Username, Logindata.Password);
  await expect(page.locator('.loader-box-content')).toBeHidden({ timeout: 30000 });
  await signinPage.otpfunction();
  await expect(page).toHaveURL('https://uat.getfares.com/flight', { timeout: 600000 });
 
});
test.afterAll(async () => {
  await browser.close();
});
test.describe('End to End testing',() => {
  SearchAPIInputData.forEach((data) => {
    test("Search", async ({request}) => {
      test.setTimeout(600000);
      const search = new FlightSearch(page);
      await search.searchfunction(data);
      console.log(data);

      const searchResult = new SearchResultPage(page,request);
      await searchResult.SearchResults(data);
    });
  });
});
