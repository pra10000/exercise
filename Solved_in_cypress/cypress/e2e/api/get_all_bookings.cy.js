import GetBookings from '../../page_objects/api/GetBookingsFunctions'

describe('GET /booking', () => {
  it('should return status 200 and a list of bookings', () => {
    GetBookings.getAllBookings().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
    })
  })
})