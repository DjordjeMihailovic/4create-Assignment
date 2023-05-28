describe('Assignment Automation Test', () => {

  it('Automated Steps', () => {

      cy.intercept('GET', 'https://rahulshettyacademy.com/seleniumPractise/data/products.json').as('productsApi')

      // 1. Openning the browser and navigating to provided URL, maximising the window

      const HomeURL = 'https://rahulshettyacademy.com/seleniumPractise/#/'
      cy.visit(HomeURL)
      cy.viewport(window.screen.width, window.screen.height)
      cy.url().should('eq', HomeURL)

      // 2.1 Adding one item to the basket 4 items and then add another 3 items once; confirm that they are present in basket

      cy.wait('@productsApi')

      for (let i = 0; i < 4; i++) {
          cy.addToCartByText('Brocolli')
      }

      const otherItems = ['Carrot', 'Tomato', 'Beans']                          // NOTE: Since it is expected that the 3 items should only be present once in the basket, it was interpreted that the selection
      otherItems.forEach(function($value) {                                     // of those items was of testers choice; Otherwise, pseudocode for selecting truly random items would have been implemented:
          cy.addToCartByText($value)                                            // cy.get('.product').then($products => { cy.wrap($products).eq(Math.floor(Math.random() * $products.length)) ...
      })

      cy.get('.cart-icon').click()
      cy.verifyCartItems(['Brocolli', 'Carrot', 'Tomato', 'Beans'], ['4 No', '1 No', '1 No', '1 No'])

      // 2.2 (BONUS) adding min and max priced items; item not previously added; Proceed to Checkout

      const rawpriceList = []
      cy.get('.product-price').each(($el) => {

          let price = parseFloat($el.text())
          if (!isNaN(price)) {
              rawpriceList.push(price)
          }

      }).then(() => {

          const priceList = [...new Set(rawpriceList)]

          let minPrice = Math.min(...priceList)
          let maxPrice = Math.max(...priceList)

          priceList.splice(priceList.indexOf(minPrice), 1)                      // NOTE: The solution makes a list of all unique prices; it provides the min and max price and a 3rd random one
          priceList.splice(priceList.indexOf(maxPrice), 1)                      // exluding the min and max; it then adds the first element to the cart respectively matching the price value
          priceList.pop()

          let randomOtherIndex = [Math.floor(Math.random() * priceList.length)]
          let randomOtherPrice = priceList[randomOtherIndex]

          cy.addToCartByText(minPrice)
          cy.addToCartByText(maxPrice)
          cy.addToCartByText(randomOtherPrice)

      })

      cy.get('.cart-icon').click()
      cy.get('button').contains('PROCEED TO CHECKOUT').click()
      cy.url().should('eq', 'https://rahulshettyacademy.com/seleniumPractise/#/cart')

      // 3. Enter a promo code using the Total Amount number

      cy.get('.totAmt').invoke('text').as('totalAmount')
      cy.get('@totalAmount').then(($amount) => {
          cy.get('input.promoCode').type($amount)
      })

      // 4. Click on apply button

      cy.get('.promoBtn').contains('Apply').click()
      cy.get('.promoInfo', {
          timeout: 10000
      }).contains('Invalid code').should('exist')

      // 5. Click on Place order button

      cy.get('button').contains('Place Order').click()

      cy.url().should('eq', 'https://rahulshettyacademy.com/seleniumPractise/#/country')
      cy.get('label').contains('Choose Country').should('be.visible')
      cy.get('select').should('be.visible')
      cy.get('input[type="checkbox"]').should('be.visible')
          .next().contains('Terms & Conditions')

      // 6.1 Click on Choose Country Dropdown (Select should be disabled); 6.2 Randomly choose a country

      cy.get('option').contains('Select').should('be.disabled')

      cy.get('select').then($select => {
          const optionsCount = $select.find('option').length
          const randomOption = Cypress._.random(1, optionsCount - 1)                      // Random option is not counting option 0 (Select option)
          cy.get('select').select(randomOption)
      })

      cy.get('button').contains('Proceed').click()
      cy.get('.errorAlert').contains('Please accept Terms & Conditions - Required').should('be.visible')

      // 7. Check Terms and Conditions and click Proceed

      cy.get('input[type="checkbox"]').check()
      cy.get('button').contains('Proceed').click()
      cy.contains('Thank you, your order has been placed successfully').should('be.visible')
      cy.url({
          timeout: 10000
      }).should('eq', HomeURL)

      // 8. Open a new tab and go to new provided link

      const newHomeURL = 'http://www.webdriveruniversity.com/'                             // NOTE: Cypress does not support visiting HTTP URLs due to security reasons by default,
      cy.visit(newHomeURL)                                                                 // {chromeWebSecurity: false} was added to the config file in the root of the project in order to bypass the issue
      cy.url().should('eq', newHomeURL)                                                    // by disabling web security on Chrome browser for testing

      // 9. Scroll down to Actions and take a screenshot; Click on Actions

      cy.get('h1').contains('ACTIONS').scrollIntoView()
      cy.screenshot('ACTIONS_screenshoot', {
          capture: 'viewport'
      })

      cy.get('#actions').invoke('removeAttr', 'target').click()                            // NOTE: Cypress does not support multiple tabs; '.invoke('removeAttr', 'target')' was applied to the element
      cy.url().should('eq', 'http://www.webdriveruniversity.com/Actions/index.html')       // to prevent it from openning the URL in a new tab as a common solution to this issue encountered in Cypress

      // 10. Go back to the Home page and take a screenshot; go to a new Actions tab and verify that the title contains Actions

      cy.go('back')
      cy.screenshot('HomePage_screenshoot', {
          capture: 'viewport'
      })

      cy.go('forward')                                                                    // NOTE: Another solution to bypass tab manipulation not supported by Cypress
      cy.get('title').should('contain', 'Actions')

      // 11. Drag and drop "Drag me" element to "Drop here" box

      cy.get('#draggable').drag('#droppable', ({
          force: true
      }))                                                                                 // Package '@4tw/cypress-drag-drop' was imported for a reliable solution
      cy.get('#droppable').should('contain', 'Dropped!')

      // 12. "Link 1" is not visible

      cy.get('a').contains('Link 1').should('not.be.visible')

      // 13. Hover over "Hover Over Me First!"; "Link 1" should be visible

      cy.get('button').contains('Hover Over Me First!').realHover()                       // Package 'cypress-real-events/support' was imported for a reliable solution
      cy.get('a').contains('Link 1').should('be.visible')

      // 14 / 15 Click on "Link 1" and verify message; save message in a variable that can be accessed outside the test / terminating session

      cy.get('a').contains('Link 1').click()

      let alertMessage
      cy.on('window:alert', ($alert) => {
          alertMessage = $alert
          expect(alertMessage).to.equal('Well done you clicked on the link!')             // Cypress is automaticaly clicking OK in case where it is the only option for an Alert message
      }).then(() => {
          cy.writeFile('cypress/fixtures/alertMessage.json', {
                alertMessage
          })
      })

      // 16. Close all tabs and browser

      cy.window().then(($win) => {
          $win.close()
      })

      // 17. Open browser again and go to Link

      const ContactUsURL = 'http://www.webdriveruniversity.com/Contact-Us/contactus.html'
      cy.visit(ContactUsURL)
      cy.url().should('eq', ContactUsURL)

      // 18. Enter saved Alert variable in Comment text box

      cy.fixture('alertMessage.json').then(($fixture) => {

          const alertMessageContent = $fixture.alertMessage
          cy.get('textarea[placeholder="Comments"]').type(alertMessageContent)
          cy.get('textarea[placeholder="Comments"]').should('have.value', alertMessageContent)

      })
  })
})