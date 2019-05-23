import login from '../login';

describe('Transfer: Transaction history/details', () => {
  it('shows list of transactions', () => {
    login({ accounts: { activeIdx: 2 } });
    cy
      .wait(2000)
      .get('.list-item')
      .contains('Transactions')
      .click()
      .wait(2000)
      .get('.list-item-transaction')
      .should(($lis) => {
        expect($lis).to.have.length(10);
      });
  });

  it('shows transaction details', () => {
    login({ accounts: { activeIdx: 2 } });
    cy
      .wait(1000)
      .get('.list-item')
      .contains('Transactions')
      .click()
      .wait(2000)
      .get('.list-item-transaction:last')
      .click()
      .wait(2000)
      .get('.content:first')
      .should('contain', 'You received')
      .get('.details-amount')
      .should('contain', '2')
      .get('.ae-address')
      .should(($spans) => {
        expect($spans).to.have.length(3);
        expect($spans.eq(0).text().replace(/\s/g, '')).to.equal('ak_2swhLkgBPeeADxVTAVCJnZLY5NZtCFiM93JxsEaMuC59euuFRQ');
        expect($spans.eq(1).text().replace(/\s/g, '')).to.equal('ak_21tentxmY6ccVCLy2FH5wqF9ePq6jrXtWQ2sYs99AT89sMewy2');
        expect($spans.eq(2).text().replace(/\s/g, '')).to.equal('th_2C19sX9D5g3JmfyzMUFxQqn5QLiAmxSuY9oq4hdNrpkcav1koA');
      })
      .get('.button-plain')
      .contains('View in explorer')
      .invoke('attr', 'href')
      .should('contain', 'th_2C19sX9D5g3JmfyzMUFxQqn5QLiAmxSuY9oq4hdNrpkcav1koA');
  });
});
