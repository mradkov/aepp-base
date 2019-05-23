import login from '../login';

describe('Transfer: Send tokens', () => {
  it('sends tokens', () => {
    login();
    cy.wait(2000);
    let balanceBeforeTransfer;
    cy.get('.balance').invoke('text')
      .then((text) => {
        balanceBeforeTransfer = text;
      });
    cy
      .get('.list-item')
      .contains('Send')
      .click()
      .get('.content.border-dark:first')
      .click()
      .url()
      .should('contain', 'ak_DzELMKnSfJcfnCUZ2SbXUSxRmFYtGrWmMuKiCx68YKLH26kwc')
      .get('input')
      .type('0.0001')
      .get('button')
      .contains('Next')
      .click()
      .get('button')
      .contains('Confirm')
      .click()
      .wait(7000);
    cy.get('.balance').invoke('text')
      .then((balance) => {
        expect(balanceBeforeTransfer).not.to.equal(balance);
      });
  });
});
