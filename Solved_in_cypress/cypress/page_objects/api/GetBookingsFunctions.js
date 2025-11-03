class GetBookings {

getAllBookings() {
  const baseApiUrl = Cypress.env('baseApiUrl')
  return cy.request({
    method: 'GET',
    url: `${baseApiUrl}/booking`
  })
}

getBookingById(bookingId) {
  const baseApiUrl = Cypress.env('baseApiUrl')
  return cy.request({
    method: 'GET',
    url: `${baseApiUrl}/booking/${bookingId}`,
    failOnStatusCode: false
  })
}

}

export default new GetBookings()