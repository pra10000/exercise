class Auth {

getAuthToken(username = 'admin', password = 'password123') {
  
  const baseApiUrl = Cypress.env('baseApiUrl')
  return cy.request({
    method: 'POST',
    url: `${baseApiUrl}/auth`,
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      username,
      password
    }
  })
}

}

export default new Auth()