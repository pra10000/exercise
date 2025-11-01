import SharedUtilities from './SharedUtilities'
import BookingPage from './BookingPage';

class ReservationPage {
    //Locators
    get BookThisRoomTitle(){
        return cy.contains('Book This Room')
    }

    get ReserveNowButton(){
        return cy.get('#doReservation')
    }

    get FirstNameInput(){
        return cy.get('input[name="firstname"]')
    }

    get LastNameInput(){
        return cy.get('input[name="lastname"]')
    }

    get EmailInput(){
        return cy.get('input[name="email"]')
    }

    get PhoneInput(){
        return cy.get('input[name="phone"]')
    }

    get ReserveNowButtonWithoutId(){
        return cy.contains('button', 'Reserve Now')
    }

    GetPriceUnderBookThisRoom(){
        return cy.contains('Book This Room')
            .parents('.card-body') 
            .find('.text-primary')
            .invoke('text')
            .then((rawText) => {
                return SharedUtilities.extractNumericValues(rawText)
        })
    }

    GetPriceUnderPriceSummary(){
        return cy.contains('Price Summary')
            .parents('.card-body') 
            .find('.justify-content-between')
            .find('span:first-child')
            .invoke('text')
            .then((rawText) => {
                return SharedUtilities.extractNumericValues(rawText)[0]
        })
    }

    GetTotalWithoutFeesOfReservedDaysUnderPriceSummary(){
        return cy.contains('Price Summary')
            .parents('.card-body') 
            .find('.justify-content-between')
            .first()
            .find('span:last-child')
            .invoke('text')
            .then((rawText) => {
                return SharedUtilities.extractNumericValues(rawText)
        })
    }

    GetNumberOfReservedDaysUnderPriceSummary(){
        return cy.contains('Price Summary')
            .parents('.card-body') 
            .find('.justify-content-between')
            .find('span:first-child')
            .invoke('text')
            .then((rawText) => {
                return SharedUtilities.extractNumericValues(rawText)[1]
        })
    }

    GetFeeAsIntWithHelper = (label) => {
        return cy.contains('span', label)
            .siblings('span')               
            .invoke('text')                
            .then((rawText) => {
                return SharedUtilities.extractNumericValues(rawText)
            })
    }

    GetServiceFee(){
        return this.GetFeeAsIntWithHelper('Service fee')
    }
    
    GetCleaningFee(){
        return this.GetFeeAsIntWithHelper('Cleaning fee')
    }

    GetTotalPriceWithFees(){
        return this.GetFeeAsIntWithHelper('Total')
    }

    //Methods
    checkBookThisRoomTitleExistsAndIsVisble(){
        this.BookThisRoomTitle.should('exist').and('be.visible')
    }

    clickReserveNowButton() {
        this.ReserveNowButton.click()
    }

    fillFirstName(firstName){
        this.FirstNameInput.should('not.have.attr', 'disabled')
        this.FirstNameInput.type(firstName)
    }
    
    fillLastName(lastName){
        this.LastNameInput.should('not.have.attr', 'disabled')
        this.LastNameInput.type(lastName)   
    }

    fillEmail(email){
        this.EmailInput.should('not.have.attr', 'disabled')
        this.EmailInput.type(email)   
    }

    fillPhone(phone){
        this.PhoneInput.should('not.have.attr', 'disabled')
        this.PhoneInput.type(phone) 
    }

    clickReserveNowButtonWithoutId(){
        this.ReserveNowButtonWithoutId.click()
    }

    reserveRoom(firstName, lastName, email, phone){
        // 1 Fill reservation form
        this.fillFirstName(firstName)
        this.fillLastName(lastName)
        this.fillEmail(email)
        this.fillPhone(phone)
    
        // 2 Click Reserve Now button and set intercept
        cy.intercept('POST', '/api/booking').as('postBooking')
        this.clickReserveNowButtonWithoutId()
    
        // 3 Check post was triggered
        cy.wait('@postBooking').then((interception) => {
            expect(interception).to.not.be.null
        })
    }

    checkPricesDaysAndTotal(typeOfRoom, checkInDate, checkOutDate){
        // 1 Compare price of room from booking page to the price on the reservation page
        // a.Get the price from the room card
        BookingPage.GetPriceFromRoomCard(typeOfRoom).then((priceFromRoomCard) => {
            
            // b.Book the room and verify we're on the reservation page
            BookingPage.clickBookNowButtonOfGivenTypeOfRoom(typeOfRoom)
            cy.url().should('include', 'reservation')
            this.checkBookThisRoomTitleExistsAndIsVisble()

            // c.Now get the price from the reservation page
            this.GetPriceUnderBookThisRoom().then((priceFromReservationPage) => {
            
                //d.Finally compare the two prices
                expect(priceFromRoomCard).to.eq(priceFromReservationPage)
            })
        })

        // 2 Compare price under Book This Room with the price from summary price
        this.GetPriceUnderBookThisRoom().then((priceUnderBookThisRoom) => {
            this.GetPriceUnderPriceSummary().then((priceFromSummary) => {
                expect(priceUnderBookThisRoom).to.eq(priceFromSummary)
            })
        })

        // 3 Check number of days is correct
        this.GetNumberOfReservedDaysUnderPriceSummary().then((numberOfDays) => {
            expect(numberOfDays).to.eq(SharedUtilities.getNumberOfDays(checkInDate,checkOutDate))
        })

        // 4 Check the total sum of money without fees is correct
        this.GetPriceUnderBookThisRoom().then((priceUnderBookThisRoom) => {
            this.GetTotalWithoutFeesOfReservedDaysUnderPriceSummary().then((totalPriceWithoutFees) => {
                expect(totalPriceWithoutFees).to.eq(priceUnderBookThisRoom*SharedUtilities.getNumberOfDays(checkInDate,checkOutDate))
            })
        })

        // 5 Check total with fees
        this.GetTotalPriceWithFees().then((totalPrice) => {
            this.GetTotalWithoutFeesOfReservedDaysUnderPriceSummary().then((totalPriceWithoutFees) => {
                this.GetCleaningFee().then((cleaningFee) => {
                    this.GetServiceFee().then((serviceFee) => {
                        expect(totalPrice).to.eq(totalPriceWithoutFees + cleaningFee + serviceFee)
                    })
                })
            })
        })
    }
}

export default new ReservationPage();