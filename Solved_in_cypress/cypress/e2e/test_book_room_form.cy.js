import SharedUtilities from '../page_objects/e2e/SharedUtilities'
import BookingPage from '../page_objects/e2e/BookingPage'
import ReservationPage from '../page_objects/e2e/ReservationPage'
import CommonErrorsInFormsPage from '../page_objects/e2e/CommonErrorsInFormsPage'

const startDate = new Date();

const checkOutDate = new Date(startDate)
checkOutDate.setDate(startDate.getDate() + 60)

const checkInDate = new Date(startDate);
checkInDate.setDate(startDate.getDate() + 40)

describe('Test booking form errors in various scenarios', () => {
    beforeEach(() => {
        cy.fixture('book_rooms').as('bookingData').then((data) => {})
        SharedUtilities.navigateToTestSiteAndCheckTheSiteUrlAndTitle()
        BookingPage.verifyDatesAndSetThem(checkInDate.toISOString().slice(0, 10),checkOutDate.toISOString().slice(0, 10))
        BookingPage.clickBookRoomOfTheGivenTypeOfRoomAndCheckPageChanges("Single")
        ReservationPage.clickReserveNowButton()
    })
    
    it('Check error for empty first name', function() {
        const data = this.bookingData
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered("", data.lastName, data.email, data.phone)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,18)
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Firstname")
    })

    it('Check error for empty last name', function(){
        const data = this.bookingData
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered(data.firstName, "", data.email, data.phone)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,30)
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Lastname")
    })

    it('Check error for empty email', function() {
        const data = this.bookingData
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered(data.firstName, data.lastName, "", data.phone)
        CommonErrorsInFormsPage.checkEmptyErrorsNumberVisibleOnTheScreen(1)
    })

    it('Check error for empty phone', function() {
        const data = this.bookingData
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered(data.firstName, data.lastName, data.email, "")
        CommonErrorsInFormsPage.checkEmptyErrorsNumberVisibleOnTheScreen(1)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(11,21)
    })

    it('Check errors for empty form', function() {
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered("", "", "", "")
        CommonErrorsInFormsPage.checkEmptyErrorsNumberVisibleOnTheScreen(2)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,18)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,30)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(11,21)
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Firstname")
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Lastname")
    })

    it('Check error for too long first name', function() {
        const data = this.bookingData
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered("TestFirstName0123456789", data.lastName, data.email, data.phone)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,18)
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldDoesntExist("Firstname")
    })

    it('Check error for too long last name', function(){
        const data = this.bookingData
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered(data.firstName, "TestLasttName01234567890123456789", data.email, data.phone)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,30)
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldDoesntExist("Lastname")
    })

    it('Check error for too long phone', function() {
        const data = this.bookingData
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered(data.firstName, data.lastName, data.email, "0123456789012345678900")
        CommonErrorsInFormsPage.checkEmptyErrorsNumberVisibleDoesntExist()
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(11,21)
    })

    it('Check errors for too long entries', function() {
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered("TestFirstName0123456789", "TestLasttName01234567890123456789", "email01234567890123456789@yahoo.com", "0123456789012345678900")
        CommonErrorsInFormsPage.checkEmptyErrorsNumberVisibleDoesntExist()
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,18)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,30)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(11,21)
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldDoesntExist("Firstname")
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldDoesntExist("Lastname")
    })

    it('Check error for too short first name', function() {
        const data = this.bookingData
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered("Te", data.lastName, data.email, data.phone)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,18)
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldDoesntExist("Firstname")
    })

    it('Check error for too short last name', function(){
        const data = this.bookingData
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered(data.firstName, "Te", data.email, data.phone)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,30)
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldDoesntExist("Lastname")
    })

    it('Check error for too short phone', function() {
        const data = this.bookingData
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered(data.firstName, data.lastName, data.email, "0123456789")
        CommonErrorsInFormsPage.checkEmptyErrorsNumberVisibleDoesntExist()
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(11,21)
    })

    it('Check errors for too short entries', function() {
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered("Te", "Te", "em@yahoo.com", "0123456789")
        CommonErrorsInFormsPage.checkEmptyErrorsNumberVisibleDoesntExist()
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,18)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(3,30)
        CommonErrorsInFormsPage.checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(11,21)
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldDoesntExist("Firstname")
        CommonErrorsInFormsPage.checkFieldShouldNotBeBlankErrorMessageOfGivenFieldDoesntExist("Lastname")
    })

    it('Check error for wrong filled email', function() {
        const data = this.bookingData
        ReservationPage.fillFormReserveRoomAndCheckIfPostWasTriggered(data.firstName, data.lastName, "111111", data.phone)
        CommonErrorsInFormsPage.checkEmailAddressWrongFormedErrorMessageShouldExist()
    })
})