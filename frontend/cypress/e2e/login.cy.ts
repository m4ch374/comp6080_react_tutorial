describe('Login Happy Path', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage()

    // Visit the login page
    cy.visit('/login')
  })

  it('should successfully login with valid credentials', () => {
    // Verify we're on the login page
    cy.contains('Sign in to your account').should('be.visible')

    // Find and fill in the email input
    cy.get('input[type="email"]').should('be.visible').type('mia@email.com')

    // Find and fill in the password input
    cy.get('input[type="password"]')
      .should('be.visible')
      .type('solongbouldercity')

    // Click the submit button
    cy.get('button[type="submit"]')
      .contains('Sign in')
      .should('be.visible')
      .should('not.be.disabled')
      .click()

    // Wait for the login to complete and verify navigation to dashboard
    cy.url({ timeout: 10000 }).should('include', '/dashboard')

    // Verify we're on the dashboard page by checking for dashboard content
    cy.contains('Welcome to your Dashboard', { timeout: 100 }).should(
      'be.visible'
    )
  })
})
