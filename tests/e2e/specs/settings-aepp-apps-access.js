import giveAccessToAepp from '../open-iframe-aepp';

describe('Settings: Aepp account access', () => {
  it('denys access to account', () => {
    giveAccessToAepp(undefined, false, 5000);
    cy
      .then(() => {
        const state = JSON.parse(localStorage.vuex);
        expect(state.apps.length).equal(0);
      });
  });

  it('gives access to account', () => {
    giveAccessToAepp();
    cy
      .then(() => {
        const state = JSON.parse(localStorage.vuex);
        expect(state.apps[0].host).equal('example-aepp.origin.aepps.com');
        expect(state.apps[0].permissions.accessToAccounts.length).equal(1);
        expect(state.apps[0].permissions.accessToAccounts[0]).equal('ak_2swhLkgBPeeADxVTAVCJnZLY5NZtCFiM93JxsEaMuC59euuFRQ');
      });
  });

  it('toggles access to account', () => {
    giveAccessToAepp();
    cy
      .get('.button-plain')
      .contains('Settings')
      .click()
      .get('.content')
      .contains('Aepp account access')
      .click()
      .get('.content')
      .should(($lis) => {
        expect($lis).to.have.length(1);
      })
      .click()
      .get('.content:first')
      .click()
      .get('.button-plain:first')
      .click()
      .get('.content')
      .should(($content) => {
        expect($content).to.have.length(0);
      })
      .then(() => {
        const state = JSON.parse(localStorage.vuex);
        expect(state.apps[0].host).equal('example-aepp.origin.aepps.com');
        expect(state.apps[0].permissions.accessToAccounts.length).equal(0);
      });
  });
});
