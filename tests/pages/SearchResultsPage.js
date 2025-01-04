import { expect } from '@playwright/test';
import Searchapi from '../pages/SearchAPI.js';
import FlightSearch from '../pages/flights.js';

class SearchResultPage {
    constructor(page, request) {
        this.page = page
        this.request = request
    }
    async SearchResults(data) {
        console.log(data)
        await this.APIresponse(data)
        await this.ValidateUI(data)

    }
    async APIresponse(data) {
        const APIsearch = new Searchapi(this.request)
        const apires = await APIsearch.SearchApiResponse(data)
        console.log(`this is api  ${apires.traceId}`)
        return apires;
    }
    async formatDate(input) {
        // Remove ordinal suffixes (st, nd, rd, th)
        const cleanedDate = input.replace(/(st|nd|rd|th)/g, '').trim();
    
        // Parse the cleaned date into a Date object
        const date = new Date(cleanedDate);
    
        // Check if the date is valid
        if (isNaN(date)) {
            throw new Error('Invalid date format');
        }
    
        // Extract year, month, and day
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
    
        // Return the formatted date as YYYY-MM-DD
        return `${year}-${month}-${day}`;
    }
    
    
    async ValidateUI(data) {
        const apires = await this.APIresponse(data)
        await this.searching()
        const ItineraryContainer = await this.page.locator('#itinerary_container')
        const Itinerarycount= await ItineraryContainer.count()

        console.log(`Itinerarycount ${Itinerarycount}`)
        let j = 0;
        for (let i = 0; i < Itinerarycount; i++) {
            console.log("enters the for lopp of validate UI")
            //to check airline
            const Airline = apires.flights[i].airline
            const UIAirlineText = await this.page.locator('.airline_details').nth(i).textContent();
            const UIAirline = UIAirlineText.split('|').map(item => item.trim());
            console.log(UIAirline[0])
            console.log(`airline ${Airline}, UIAirlineText ${UIAirlineText}`)
            expect(UIAirline[0]).toBe(Airline)
            await this.page.locator('text="Flight Details"').nth(i).click()
            //to check orign and destination
            const UIOriginText = await this.page.locator('.flt-origin').nth(i).textContent();
            expect(UIOriginText.trim()).toBe(apires.flights[i].segGroups[0].origin);
            expect(UIDestinationText.trim()).toBe(apires.flights[i].segGroups[0].destination)
            console.log("origin checked")
            //to check the flight number
            const Fnum =await this.page.locator('div.col-8 .flt-number').nth(i).textContent();
            const flightNum=Fnum.split("-").map(item=>item.trim())
            expect(flightNum[1]).toBe(apires.flights[i].segGroups[0].segs[0].flightNum)
            //to check the terminal
            const eachSegment=await ItineraryContainer.nth(i).locator('.flt-bkg-information-panel').count()
            console.log(eachSegment)
            let depterminalText,ariterminalText,depterminalNumber,ariterminalNumber;
            for(let x = 0 ;x < eachSegment  ; x++)
            {
                console.log(j)
            depterminalText = await this.page.locator('.flt-airport-nm').nth(j).textContent();
            ariterminalText = await this.page.locator('.flt-airport-nm').nth(j+1).textContent();
            depterminalNumber = depterminalText.match(/Terminal\s(\d+)/)[1];
            ariterminalNumber = ariterminalText.match(/Terminal\s(\d+)/)[1];
            //console.log("flight NUM checked")
            expect(depterminalNumber).toBe(apires.flights[i].segGroups[0].segs[x].depTerminal)
            expect(ariterminalNumber).toBe(apires.flights[i].segGroups[0].segs[x].arrTerminal)
            console.log("One segment checked")
            j+=2
            //to check the cabin class without branded fares.
            const UICabin= await this.page.locator('.card_class').nth(i).textContent()
            console.log(`UICabin value is ${UICabin}`)
            const APICabin = apires.flights[i].fareGroups[0].segInfos[0].cabinClass
            console.log(`API Cabin Class ${APICabin}`)
            expect(UICabin.trim()).toBe(APICabin)
            console.log("Cabin is correct")
            //to check the departure date and arrival date
            let UIDepartDatecount = await this.page.locator('.flt-date').count()
            console.log(`UIDepartDateCount ${UIDepartDatecount}`)
            for(let k =0; k< UIDepartDatecount;k+=3){
            const UIDepartDateFulltext = await this.page.locator('.flt-date').nth(k).textContent()
            const UIDepartDate=UIDepartDateFulltext.split(',')[1]
            console.log(UIDepartDate)
            const departDate = await this.formatDate(UIDepartDate)
            console.log(`UI Depart Date ${departDate}`)
            const UIArrivalDateFulltext = await this.page.locator('.flt-date').nth(k+2).textContent()
            const UIArrivalDate=UIArrivalDateFulltext.split(',')[1]
            console.log(UIArrivalDate)
            const ArrivalDate = await this.formatDate(UIArrivalDate)
            console.log(`UI Arrival Date ${ArrivalDate}`)
            const APIDepartdate =apires.flights[i].segGroups[0].segs[x].departureOn.split('T')[0]
            const APIArivalDate=apires.flights[i].segGroups[0].segs[x].arrivalOn.split('T')[0]
            console.log(`APIDepartdate ${APIDepartdate} and APIArivalDate ${APIArivalDate}`)
            expect(departDate).toBe(APIDepartdate)
            expect(ArrivalDate).toBe(APIArivalDate)
            //to check the Equipment 
            const Eqpcount=await this.page.locator('.flt-number').count()
            for (let l=0;l<Eqpcount;l++){
            const uiEqpType=await this.page.locator('.flt-number').nth(l+1).textContent()
            const uiEqpsplit= uiEqpType.split('-')[1]
            console.log(`UI Eqp type ${uiEqpsplit}`)
            const APIEqpType=apires.flights[i].segGroups[0].segs[x].eqpType
            expect(uiEqpsplit.trim()).toBe(APIEqpType)
            }
            }

        }
        }
    }
    async searching() {
        await this.page.locator('text="Search"').click()
        await expect(this.page.locator('.loader-box-content')).toBeVisible()
        await this.page.waitForSelector('.loader-box-content', { state: 'hidden', timeout: 180000 });
        // await this.page.click('.nav-item-text:has-text("Flights")')
        //     await this.page.evaluate(() => localStorage.removeItem('lastSearch'));
        //     await this.page.reload();
    }

}
export default SearchResultPage;