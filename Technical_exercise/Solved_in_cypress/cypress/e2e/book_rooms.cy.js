import SharedUtilities from '../page_objects/e2e/SharedUtilities';
import BookingPage from '../page_objects/e2e/BookingPage';


//We will use the Check Availability filter to be able to set the dates because using the reservation page doesn't work
describe('Book 10 and 20 days for each type of rooms at specific dates in future', () => {
  it('Book 20 days at Single Room on starting date:', () => {
    SharedUtilities.navigateToTestSiteAndCheckTheSiteUrlAndTitle()
    BookingPage.bookGivenTypeOfRoomOnGivenInterval("Single",'2025-11-23','2025-11-30')
  })
  
  it('Book 10 days at Single Room on starting date:', () => {
    SharedUtilities.navigateToTestSiteAndCheckTheSiteUrlAndTitle()
  })

  it('Book 20 days at Double Room on starting date:', () => {
    SharedUtilities.navigateToTestSiteAndCheckTheSiteUrlAndTitle()
  })
  
  it('Book 10 days at Double Room on starting date:', () => {
    SharedUtilities.navigateToTestSiteAndCheckTheSiteUrlAndTitle()
  })
    
  it('Book 20 days at Suite on starting date:', () => {
    SharedUtilities.navigateToTestSiteAndCheckTheSiteUrlAndTitle()
  })
  
  it('Book 10 days at Suite on starting date:', () => {
    SharedUtilities.navigateToTestSiteAndCheckTheSiteUrlAndTitle()
  })
})