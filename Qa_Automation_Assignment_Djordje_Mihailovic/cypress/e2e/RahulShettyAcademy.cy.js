describe('Page Assignment Test Cases', () => {

  beforeEach(() => {
      cy.visit('https://rahulshettyacademy.com/seleniumPractise/')
  })

  it('Display the search bar', () => {
      cy.get('.search-keyword').should('be.visible')
  })

  it('Display the search button', () => {
      cy.get('.search-button').should('be.visible')
  })

  it('Display header links', () => {
      const headerLinks = ['Free Access to InterviewQues/ResumeAssistance/Material', 'Top Deals', 'Flight Booking']
      headerLinks.forEach(function($value) {
          cy.get('[class^="cart-header-navlink"]').contains($value).should('be.visible')
      })
  })

  it('Display the product cards', () => {
      cy.get('.product').should('have.length.greaterThan', 0).and('be.visible')
  })

  it('Display search results for a valid product name', () => {

      const searchTerm = 'Cucumber'

      cy.get('.search-keyword').type(searchTerm)
      cy.get('.product:visible').should('have.length', 1)
      cy.get('.product:visible').should('contain', searchTerm)
  })

  it('Display no search results for an invalid product name', () => {

      const searchTerm = 'bobTest123'

      cy.get('.search-keyword').type(searchTerm)
      cy.get('.product:visible').should('not.exist')
      cy.contains('Sorry, no products matched your search!').should('be.visible')
  })

  it('Display no search results for other product text', () => {

      const searchTerm = '120'

      cy.get('.search-keyword').type(searchTerm)
      cy.get('.product:visible').should('not.exist')
      cy.contains('Sorry, no products matched your search!').should('be.visible')
  })

  it('Clear the search input', () => {

      const searchTerm = 'Tomato'

      cy.get('.search-keyword').type(searchTerm)
      cy.get('.product:visible').should('have.length', 1)

      cy.get('.search-keyword').clear()
      cy.get('.product:visible').should('have.length.greaterThan', 0)
      cy.get('.search-keyword').should('have.value', '')
  })


  it("Display results for partial search", () => {

      const searchInput = 'cu'

      cy.get('.search-keyword').type(searchInput)
      cy.get('.product').each(($product) => {

          const productName = $product.find('.product-name').text()                          // This case will fail as intended; Search functionality is displaying results containing searchInput
          expect(productName.toLowerCase().startsWith(searchInput)).to.be.true               // and not only those starting with searchInput

      })
  })
})