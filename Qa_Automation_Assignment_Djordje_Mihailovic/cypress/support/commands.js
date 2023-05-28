import '@4tw/cypress-drag-drop'
import 'cypress-real-events/support'

Cypress.Commands.add('verifyCartItems', (foods, quantities) => {
    cy.get('.cart-item').as('cartItems');
    foods.forEach((food, index) => {
      cy.get('@cartItems')
        .eq(index)
        .should('contain', food)
        .should('contain', quantities[index]);
    });
});

Cypress.Commands.add('addToCartByText', (text) => {
    cy.get(`.product:contains(${text})`).first().contains('ADD TO CART', { timeout: 10000 }).click();
  });
  
