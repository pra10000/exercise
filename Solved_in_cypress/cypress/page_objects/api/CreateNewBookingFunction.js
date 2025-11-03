class CreateBooking {

createBooking(firstname, lastname, totalprice, depositpaid, checkin, checkout, additionalneeds) {
 
  const baseApiUrl = Cypress.env('baseApiUrl')

  const bookingData = {
    firstname,
    lastname,
    totalprice,
    depositpaid,
    bookingdates: {
      checkin,
      checkout
    },
    additionalneeds
  };

  return cy.request({
    method: 'POST',
    url: `${baseApiUrl}/booking`,
    headers: {
      'Content-Type': 'application/json'
    },
    body: bookingData
  });
}

}

export default new CreateBooking()