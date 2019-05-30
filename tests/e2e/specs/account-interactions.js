import { prepare } from '../utils';
import login from '../login';

const testRecoverPhrase = 'kick ball lyrics ozone trash rather gym stable nurse place butter plug';

describe('Account interactions ', () => {
  it('recovers account', () => {
    prepare();
    cy
      .viewport('iphone-5')
      .visit('/')
      .get('.button-plain')
      .contains('Recover')
      .click()
      .get('textarea')
      .type('kick')
      .get('.button-plain')
      .contains('Recover account')
      .should('be.disabled')
      .get('textarea')
      .type(' ball lyrics ozone trash rather gym stable nurse place butter plug    ')
      .get('.button-plain')
      .contains('Recover account')
      .click()
      .wait(3000)
      .get('.ae-address')
      .should('contain', '29v KMz Zx');
  });

  it('deletes recovery phrase', () => {
    prepare();
    let stateBeforeDelete;
    cy
      .viewport('iphone-5')
      .visit('/')
      .get('.button-plain')
      .contains('Recover')
      .click()
      .get('textarea')
      .type(testRecoverPhrase)
      .get('.button-plain')
      .contains('Recover account')
      .click()
      .get('.button-plain')
      .contains('later')
      .click()
      .get('.button-plain')
      .contains('Settings')
      .click()
      .get('.content')
      .contains('Backup Recovery Phrase')
      .click()
      .get('.button-plain:last')
      .click()
      .wait(7000)
      .get('.button-plain:last')
      .click()
      .then(() => {
        stateBeforeDelete = JSON.parse(localStorage.vuex);
      });
    testRecoverPhrase.split(' ').forEach((word) => {
      cy.get('.button-mnemonic-word').contains(word).click();
    });
    cy
      .get('.button-plain:last')
      .click()
      .get('.button-plain')
      .contains('Delete')
      .click()
      .then(() => {
        const state = JSON.parse(localStorage.vuex);
        expect(stateBeforeDelete.accounts.hdWallet.encryptedWallet.mnemonic)
          .equal(testRecoverPhrase);
        expect('mnemonic' in state.accounts.hdWallet.encryptedWallet).equal(false);
        expect(state.accounts.hdWallet.mnemonicBackedUp).equal(true);
      });
  });

  it('logs out', () => {
    login();
    cy
      .get('.button-plain')
      .contains('Settings')
      .click()
      .get('.content')
      .contains('Logout')
      .click()
      .url()
      .should('contain', '/login');
  });

  it('resets key storage', () => {
    login();
    cy
      .get('.button-plain')
      .contains('Settings')
      .click()
      .get('.content')
      .contains('Reset Key Storage')
      .click()
      .get('.button-plain')
      .contains('Cancel')
      .click()
      .url()
      .should('contain', '/settings')
      .get('.content')
      .contains('Reset Key Storage')
      .click()
      .get('.button-plain')
      .contains('Reset')
      .click()
      .get('.button-plain:first')
      .should('contain', 'Recover')
      .then(() => {
        const state = JSON.parse(localStorage.vuex);
        expect(state.accounts.hdWallet.encryptedWallet).equal(null);
        expect(state.accounts.list.length).equal(0);
        expect(state.accounts.activeIdx).equal(0);
        expect(state.addressBook.length).equal(0);
        expect(state.apps.length).equal(0);
        expect(state.customNetworks.length).equal(0);
        expect(Object.values(state.migrations).every(migration => migration === true)).equal(true);
        expect(Cypress._.isEmpty(state.cachedAppManifests)).equal(true);
        expect(Cypress._.isEmpty(state.mobile.followers)).equal(true);
        expect(state.sdkUrl).equal('https://sdk-mainnet.aepps.com');
      });
  });

  it('creates account', () => {
    prepare();
    cy
      .viewport('iphone-5')
      .visit('/')
      .get('.button-plain')
      .contains('See how it works')
      .click()
      .get('a')
      .eq(5)
      .should('contain', 'Next')
      .get('span > a:last')
      .click()
      .get('.note')
      .should('contain', 'Create dedicated accounts')
      .get('a')
      .eq(5)
      .should('contain', 'Start')
      .invoke('attr', 'href')
      .should('contain', '/')
      .get('a:first')
      .should('contain', 'Skip')
      .invoke('attr', 'href')
      .should('contain', '/')
      .get('a:first')
      .click()
      .get('.button-plain')
      .contains('Create')
      .click()
      .url()
      .should('contain', '/transfer');
  });

  it('creates password', () => {
    prepare();
    cy
      .viewport('iphone-5')
      .get('.button-plain')
      .contains('later')
      .click()
      .get('.button-plain')
      .contains('Settings')
      .click()
      .get('.content')
      .contains('Wallet Authentication')
      .click()
      .wait(4000)
      .get('.content:first')
      .click()
      .get('input[type=password]:first')
      .type('1111')
      .get('input[type=password]:last')
      .type('1111')
      .get('.button-plain')
      .contains('Confirm')
      .click()
      .wait(100)
      .get('.button-plain:first')
      .click()
      .get('.content')
      .contains('Logout')
      .click()
      .url()
      .should('contain', '/login')
      .get('input[type=password]')
      .type('1111')
      .get('button')
      .contains('Log in')
      .click()
      .url()
      .should('contain', '/settings');
  });
});
