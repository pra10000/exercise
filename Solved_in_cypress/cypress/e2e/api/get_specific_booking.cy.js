import GetBookings from '../../page_objects/api/GetBookingsFunctions'
import CreateBooking from '../../page_objects/api/CreateNewBookingFunction'
import DeleteBooking from '../../page_objects/api/DeleteBookingsFunctions'

describe('GET /booking/{id}', () => {
  let bookingId
  let params

  before(() => {
    // First we delete all bookings to be able to create a new one on any date
    DeleteBooking.deleteAllBookings() //DISABLED BECAUSE THE SYSTEM IS UNRELIABLE

    const startDate = new Date()

    const checkOutDate = new Date(startDate)
    checkOutDate.setDate(startDate.getDate() + 30)
    const checkOutDateString = checkOutDate.toISOString().split('T')[0]

    const checkInDate = new Date(startDate)
    checkInDate.setDate(startDate.getDate() + 20)
    const checkInDateString = checkInDate.toISOString().split('T')[0]

    params = {
      firstname: 'Pascal',
      lastname: 'Razvan',
      totalprice: 300,
      depositpaid: true,
      checkin: checkInDate,
      checkout: checkOutDate,
      expectedCheckin: checkInDateString,
      expectedCheckout: checkOutDateString,
      additionalneeds: 'Breakfast'
    }

    CreateBooking.createBooking(
      params.firstname,
      params.lastname,
      params.totalprice,
      params.depositpaid,
      params.checkin,
      params.checkout,
      params.additionalneeds
    ).then((response) => {
      // Create Booking Assertions
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('bookingid')
      expect(response.body.booking).to.include({
        firstname: params.firstname,
        lastname: params.lastname,
        totalprice: params.totalprice,
        depositpaid: params.depositpaid,
        additionalneeds: params.additionalneeds
      })
      // Assertion for dates in the creation response body
      expect(response.body.booking.bookingdates.checkin).to.eq(params.expectedCheckin)
      expect(response.body.booking.bookingdates.checkout).to.eq(params.expectedCheckout)

      bookingId = response.body.bookingid
    })
  })
  
  // ----------------------------------------------------------------------------------

  it('should return details of the created booking and verify them', () => {
    // Assert that the bookingId was successfully set
    expect(bookingId, 'Booking ID should be set from the creation step').to.be.a('number')

    GetBookings.getBookingById(bookingId).then((response) => {
      expect(response.status).to.eq(200);
      
      // 1. Check all expected keys are present
      expect(response.body).to.have.keys([
        'firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates', 'additionalneeds'
      ])

      // 2. Verification of Returned Details
      expect(response.body.firstname).to.eq(params.firstname, 'First name should match')
      expect(response.body.lastname).to.eq(params.lastname, 'Last name should match')
      expect(response.body.totalprice).to.eq(params.totalprice, 'Total price should match') 
      expect(response.body.depositpaid).to.eq(params.depositpaid, 'Deposit paid should match')
      expect(response.body.additionalneeds).to.eq(params.additionalneeds, 'Additional needs should match')
      expect(response.body.bookingdates.checkin).to.eq(params.expectedCheckin, 'Check-in date should match')
      expect(response.body.bookingdates.checkout).to.eq(params.expectedCheckout, 'Check-out date should match')
    })
  })
})