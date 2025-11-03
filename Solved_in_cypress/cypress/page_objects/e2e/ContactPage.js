class ContactPage {
    //Locators
    get ContactNameInput() {
        return cy.get('[data-testid="ContactName"]')
    }

    get ContactEmailInput() {
        return cy.get('[data-testid="ContactEmail"]')
    }

    get ContactPhoneInput() {
        return cy.get('[data-testid="ContactPhone"]')
    }

    get ContactSubjectInput() {
        return cy.get('[data-testid="ContactSubject"]')
    }

    get ContactDescriptionTextarea() {
        return cy.get('[data-testid="ContactDescription"]')
    }
    
    get SubmitButton() {
        return cy.contains('button', 'Submit')
    }

    get ContactFormThankYouMessage(){
        return cy.contains('Thanks for getting in touch')
    }

    get WeWillGetBackToYouMessage(){
        return cy.contains("We'll get back to you about")
    }

    get AsSoonAsPossibleMessage(){
        return cy.contains('as soon as possible.')
    }

    get EmailAddressWrongFormedErrorMessage(){
        return cy.contains('must be a well-formed email address')
    }

    getFieldShouldNotBeBlankErrorMessageOfGivenField(field){
        return cy.contains(`${field} should not be blank`)
    }

    //Methods
    fillName(name) {
        this.ContactNameInput.type(name)
    }

    fillEmail(email) {
        this.ContactEmailInput.type(email)
    }

    fillPhone(phone) {
        this.ContactPhoneInput.type(phone)
    }

    fillSubject(subject) {
        this.ContactSubjectInput.type(subject)
    }

    fillMessage(message) {
        this.ContactDescriptionTextarea.type(message)
    }

    clickSubmitButton() {
        this.SubmitButton.click()
    }
    
    fillAllInputs(name, email, phone, subject, message) {
        if(name!=""){
            this.fillName(name)
        }
        if(email!=""){
            this.fillEmail(email)
        }
        if(phone!=""){
            this.fillPhone(phone)
        }
        if(subject!=""){
            this.fillSubject(subject)
        }
        if(message!=""){
            this.fillMessage(message)
        }
    }
    
    checkContactFormThankYouMessageIsVisible(){
        this.ContactFormThankYouMessage.should('be.visible')
    }

    checkWeWillGetBackToYouMessageIsVisible(){
        this.WeWillGetBackToYouMessage.should('be.visible')
    }
    
    checkAsSoonAsPossibleMessageIsVisible(){
        this.AsSoonAsPossibleMessage.should('be.visible')
    }

    checkEmailBlankErrorMessage(){
        this.EmailBlankErrorMessage.should('be.visible')
    }

    checkEmailAddressWrongFormedErrorMessageShouldExist(){
        this.EmailAddressWrongFormedErrorMessage.should('exist')
    }



}

export default new ContactPage()