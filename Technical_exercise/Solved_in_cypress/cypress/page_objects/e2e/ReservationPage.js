import SharedUtilities from './SharedUtilities'

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
}

export default new ReservationPage();