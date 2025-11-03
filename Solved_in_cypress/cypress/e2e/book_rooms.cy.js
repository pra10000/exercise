import SharedUtilities from '../page_objects/e2e/SharedUtilities'
import BookingPage from '../page_objects/e2e/BookingPage'
import ReservationPage from '../page_objects/e2e/ReservationPage'
import DeleteBooking from '../page_objects/api/DeleteBookingsFunctions'

const startDate = new Date();

const checkOutDate = new Date(startDate)
checkOutDate.setDate(startDate.getDate() + 30)

const checkInDate = new Date(startDate)
checkInDate.setDate(startDate.getDate() + 20)

const days = SharedUtilities.getNumberOfDays(checkInDate,checkOutDate)

// Define all test scenarios in a single array
const bookingScenarios = [
    { roomType: "Single"},
    { roomType: "Double"},
    { roomType: "Suite"}
]

describe(`Book ${days} days for each type of rooms`, function() {
    beforeEach(() => {
        cy.fixture('book_rooms').as('bookingData').then((data) => {})
        SharedUtilities.navigateToTestSiteAndCheckTheSiteUrlAndTitle()
        //First we delete all bookings to be able to create a new one on any date
        DeleteBooking.deleteAllBookings() //DISABLED BECAUSE THE SYSTEM IS UNRELIABLE
        //This would have make the test resilient and not fail because we book on the same dates. However if you want to see the test running just change the dates to a date with no reservations
    })

    // Iterate over the scenarios array to create all the tests
    bookingScenarios.forEach((scenario) => {
        
        it(`Book ${days} days at ${scenario.roomType} Room (Check-in: ${checkInDate})`, function() { 
            const data = this.bookingData
            BookingPage.verifyDatesAndSetThem(checkInDate.toISOString().slice(0, 10), checkOutDate.toISOString().slice(0, 10))
            BookingPage.checkTheNewDateInputsValues(checkInDate.toISOString().slice(0, 10), checkOutDate.toISOString().slice(0, 10))
            ReservationPage.clcikReserveNowOnGivenTypeOfRoomAndCheckPricesDaysAndTotal(scenario.roomType, checkInDate.toISOString().slice(0, 10),checkOutDate.toISOString().slice(0, 10))
            ReservationPage.clickReserveNowButton()
            ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered(data.firstName, data.lastName, data.email, data.phone)
            ReservationPage.checkBookingConfirmedTitleAndTextExistsAndIsVisible()
            SharedUtilities.checkGivenTextIsVisble(checkInDate.toISOString().slice(0, 10))
            SharedUtilities.checkGivenTextIsVisble(checkOutDate.toISOString().slice(0, 10))
        })
    }) 
})