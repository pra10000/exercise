import SharedUtilities from '../page_objects/e2e/SharedUtilities'
import BookingPage from '../page_objects/e2e/BookingPage'
import ReservationPage from '../page_objects/e2e/ReservationPage'

const startDate = new Date();

const checkOutDate1 = new Date(startDate)
checkOutDate1.setDate(startDate.getDate() + 60)

const checkOutDate2 = new Date(startDate);
checkOutDate2.setDate(startDate.getDate() + 50)

const checkInDate = new Date(startDate);
checkInDate.setDate(startDate.getDate() + 40)

// Define all test scenarios in a single array
const bookingScenarios = [
    { roomType: "Single", days: 20, checkOutDate: checkOutDate1 },
    { roomType: "Single", days: 10, checkOutDate: checkOutDate2 },
    { roomType: "Double", days: 20, checkOutDate: checkOutDate1 },
    { roomType: "Double", days: 10, checkOutDate: checkOutDate2 },
    { roomType: "Suite", days: 20, checkOutDate: checkOutDate1 },
    { roomType: "Suite", days: 10, checkOutDate: checkOutDate2 }
]

describe('Book 10 and 20 days for each type of rooms using a fixture date', function() {

    beforeEach(function() { 
        cy.fixture('book_rooms').as('bookingData').then((data) => {})
    })

    beforeEach(() => {
        SharedUtilities.navigateToTestSiteAndCheckTheSiteUrlAndTitle();
    })

    // Iterate over the scenarios array to create all the tests
    bookingScenarios.forEach((scenario) => {
        
        it(`Book ${scenario.days} days at ${scenario.roomType} Room (Check-in: ${checkInDate})`, function() { 

            const data = this.bookingData;

            cy.log(`Attempting to book ${scenario.roomType} for ${scenario.days} days, Check-out: ${scenario.checkOutDate}`)

            BookingPage.verifyDatesSetThemAndCheckNewValuesOfInputs(checkInDate.toISOString().slice(0, 10),scenario.checkOutDate.toISOString().slice(0, 10))
            ReservationPage.checkPricesDaysAndTotal(scenario.roomType, checkInDate.toISOString().slice(0, 10), scenario.checkOutDate.toISOString().slice(0, 10))
            ReservationPage.clickReserveNowButton()
            ReservationPage.reserveRoom(data.firstName, data.lastName, data.email, data.phone)
        })
    })
})