/// <reference types="cypress" />

context('Cart Actions', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  it('Add items to cart', () => {
    cy.get('[data-cy=add-to-cart-2]').click();
    cy.get('[data-cy=add-to-cart-3]').click();
    cy.get('[data-cy=badge-count]').should('have.text', '2');
  })

  it('Open Cart and check Items', () =>{
    cy.get('[data-cy=add-to-cart-1]').click();
    cy.get('[data-cy=add-to-cart-4]').click();
    cy.get('[data-cy=shopping-cart-button]').click();
    cy.get('[data-cy=cart-item-2]').should('be.visible');
    cy.get('[data-cy=cart-item-3]').should('be.visible');
  })

  it('Purchase Items', () => {
    cy.get('[data-cy=add-to-cart-1]').click();
    cy.get('[data-cy=add-to-cart-2]').click();
    cy.get('[data-cy=shopping-cart-button]').click();
    cy.get('[data-cy=purchase-cart]').click();
    cy.get('[data-cy=purchase-dialog]').should('have.text', 'You have successfully purchased!');
  })

  it('Show Purchase History', () => {
    cy.get('[data-cy=add-to-cart-3]').click();
    cy.get('[data-cy=shopping-cart-button]').click();
    cy.get('[data-cy=continue-shopping]').click();
    cy.get('[data-cy=recent-purchases-button]').click();
    cy.get('[data-cy=purchase-list-item-3]').invoke('text').should('include', 'ADELOST');
  })
})
