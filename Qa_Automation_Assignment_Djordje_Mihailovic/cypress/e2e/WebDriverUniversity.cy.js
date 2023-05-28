describe('Home Page', () => {
  
  beforeEach(() => {
      cy.visit('http://www.webdriveruniversity.com/')
  })

  it('Verify title tab text', () => {
      cy.get('#nav-title').should('contain', 'WebdriverUniversity.com (New Approach To Learning)')
  })

  it('Verify JS alert', () => {

      cy.get('#popup-alerts').invoke('removeAttr', 'target').click()
      cy.get('#button1').click()

      cy.on('window:alert', (text) => {
          expect(text).to.equal('I am an alert box!')
      })
  })

  it('Verify Modal Popup', () => {

      cy.get('#popup-alerts').invoke('removeAttr', 'target').click()
      cy.get('#button2').click()

      cy.get('#myModal').should('be.visible')

      const modalTitleText = 'It’s that Easy!!  Well I think it is.....'
      const expectedText = 'We can inject and use JavaScript code if all else fails! Remember always try to use WebDriver Library method(s) first such as WebElement.click(). (The Selenium development team have spent allot of time developing WebDriver functions etc).'

      cy.get('.modal-title').should('have.text', modalTitleText)
      cy.get('.modal-body')
          .then(($modalBody) => {
              const actualText = Cypress.$.map($modalBody, (element) => element.innerText).join(" ").trim()
              expect(actualText).to.equal(expectedText)
          })

      cy.get('.modal-footer > .btn').click()

      cy.get('#myModal').should('not.be.visible')
  })


  it('Verify Alert after AJAX loader', () => {

      Cypress.on('uncaught:exception', (err) => {
          console.error('Uncaught exception:', err)                              // Bypassing the error so that the test will continue
          return false
      })

      cy.get('#popup-alerts').invoke('removeAttr', 'target').click()
      cy.get('#button3').invoke('removeAttr', 'target').click()

      cy.get('#loader', {
          timeout: 15000
      }).should('have.css', 'display', 'none')

      cy.get('[data-target="#myModalClick"]').click()

      const modalTitleText = 'Well Done For Waiting....!!!'
      const modalBodyText = 'The waiting game can be a tricky one; this exercise will hopefully improve your understandings of the various types of waits.'

      cy.get('.modal-title').should('have.text', modalTitleText)
      cy.get('.modal-body').should('include.text', modalBodyText)

  })

  it('Verify JavaScript Confirm Box', () => {

      cy.get('#popup-alerts').invoke('removeAttr', 'target').click()
      cy.get('#button4').click()

      cy.on('window:confirm', (message) => {
          expect(message).to.equal('Press a button!')                         // Stimulate clicking OK button
          return true
      })

      cy.on('window:alert', (message) => {
          expect(message).to.equal('You clicked: Ok')
      })

      cy.get('#button4').click()

      cy.on('window:confirm', (message) => {
          expect(message).to.equal('Press a button!')                       // Simulate clicking the Cancel button
          return false
      })

      cy.on('window:alert', (message) => {
          expect(message).to.equal('You clicked: Cancel')
      })

  })
})