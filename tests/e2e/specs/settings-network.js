import login from '../login';

describe('Settings: Network', () => {
  it('changes node', () => {
    const stateBefore = login();
    cy
      .get('.button-plain')
      .contains('Settings')
      .click()
      .url()
      .should('contain', '/settings')
      .get('.content')
      .contains('Network')
      .click()
      .url()
      .should('contain', '/network')
      .get('.content')
      .contains('Fortuna-net')
      .click()
      .wait(2000)
      .then(() => {
        const state = JSON.parse(localStorage.vuex);
        expect(state.sdkUrl).not.equal(stateBefore.rpcUrl);
        expect(state.sdkUrl).equal('https://sdk-mainnet.aepps.com');
      });
  });

  it('adds custom node', () => {
    login();
    cy
      .get('.button-plain')
      .contains('Settings')
      .click()
      .url()
      .should('contain', '/settings')
      .get('.content')
      .contains('Network')
      .click()
      .url()
      .should('contain', '/network')
      .get('.content')
      .contains('Connect to another node')
      .click()
      .get('input:first')
      .type('test')
      .get('input:last')
      .type('test')
      .get('.button-plain')
      .contains('Connect')
      .click()
      .then(() => {
        const state = JSON.parse(localStorage.vuex);
        expect(state.sdkUrl).equal('http://test/');
        expect(state.customNetworks[0].name).equal('test');
        expect(state.customNetworks[0].url).equal('http://test/');
      });
  });
});
