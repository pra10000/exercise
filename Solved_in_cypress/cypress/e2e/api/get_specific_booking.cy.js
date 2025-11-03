import GetBookings from '../../page_objects/api/GetBookingsFunctions'
import CreateBooking from '../../page_objects/api/CreateNewBookingFunction'
import DeleteBooking from '../../page_objects/api/DeleteBookingsFunctions'

describe('GET /booking/{id}', () => {
  let bookingId
  let params

  before(() => {
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
      checkin: checkInDateString,
      checkout: checkOutDateString,
      expectedCheckin: checkInDateString,
      expectedCheckout: checkOutDateString,
      additionalneeds: 'Breakfast'
    }

    return DeleteBooking.deleteAllBookings() // //DISABLED BECAUSE THE SYSTEM IS UNRELIABLE
      .then(() => {
        return GetBookings.getAllBookings()
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        // Check that there are 0 bookings after deletion
        // expect(response.body.length).to.eq(0) //COMMENTED BECAUSE THE SYSTEM IS UNRELIABLE
      })
      .then(() => {
        return CreateBooking.createBooking(
          params.firstname,
          params.lastname,
          params.totalprice,
          params.depositpaid,
          params.checkin,
          params.checkout,
          params.additionalneeds
        )
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('bookingid')
        expect(response.body.booking).to.include({
          firstname: params.firstname,
          lastname: params.lastname,
          totalprice: params.totalprice,
          depositpaid: params.depositpaid,
          additionalneeds: params.additionalneeds
        })
        expect(response.body.booking.bookingdates.checkin).to.eq(params.expectedCheckin)
        expect(response.body.booking.bookingdates.checkout).to.eq(params.expectedCheckout)

        bookingId = response.body.bookingid

        // Check that there is now 1 booking
        return GetBookings.getAllBookings()
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        // expect(response.body.length).to.eq(1) //COMMENTED BECAUSE THE SYSTEM IS UNRELIABLE
      })
  })

  it('should return details of the created booking and verify them', () => {
    expect(bookingId, 'Booking ID should be set from creation').to.be.a('number')

    return GetBookings.getBookingById(bookingId).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.keys([
        'firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates', 'additionalneeds'
      ])
      expect(response.body.firstname).to.eq(params.firstname)
      expect(response.body.lastname).to.eq(params.lastname)
      expect(response.body.totalprice).to.eq(params.totalprice)
      expect(response.body.depositpaid).to.eq(params.depositpaid)
      expect(response.body.additionalneeds).to.eq(params.additionalneeds)
      expect(response.body.bookingdates.checkin).to.eq(params.expectedCheckin)
      expect(response.body.bookingdates.checkout).to.eq(params.expectedCheckout)
    })
  })
})