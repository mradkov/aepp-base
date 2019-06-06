import { prepare } from './utils';

export default (customState) => {
  prepare();
  const state = Cypress._.merge({
    migrations: {
      0: true,
      1: true,
      2: true,
      3: true,
    },
    peerId: 'fnODQ8exZ7bQ42FfDjQp',
    sdkUrl: 'https://sdk-testnet.aepps.com',
    addressBook: [],
    customNetworks: [],
    accounts: {
      list: [
        {
          name: 'Main Account',
          address: 'ak_2swhLkgBPeeADxVTAVCJnZLY5NZtCFiM93JxsEaMuC59euuFRQ',
          source: { type: 'hd-wallet', idx: 0 },
        }],
      activeIdx: 0,
      hdWallet: {
        encryptedWallet: {
          privateKey: {
            type: 'ArrayBuffer',
            data: [
              190, 96, 71, 196, 138, 13, 146, 231, 188, 254, 194, 228, 9, 84, 37, 194,
              20, 111, 152, 160, 13, 178, 184, 78, 227, 44, 123, 59, 20, 234, 57, 98,
            ],
          },
          chainCode: {
            type: 'ArrayBuffer',
            data: [
              23, 87, 236, 64, 170, 77, 245, 206, 203, 88, 122, 155, 211, 78, 151, 217,
              251, 89, 142, 178, 43, 223, 201, 110, 96, 217, 184, 204, 119, 98, 198, 47,
            ],
          },
          mac: {
            type: 'ArrayBuffer',
            data: [133, 226],
          },
          salt: {
            type: 'ArrayBuffer',
            data: [130, 132, 250, 252, 82, 35, 98, 50, 65, 20, 176, 73, 92, 83, 7, 180],
          },
        },
        mnemonicBackedUp: true,
      },
    },
    apps: [],
    cachedAppManifests: {},
    mobile: {
      readSecurityCourses: [],
      followers: {},
    },
  }, customState);
  window.localStorage.vuex = JSON.stringify(state);
  cy
    .viewport('iphone-5')
    .visit('/login')
    .get('input[type=password]').type('1111')
    .get('button')
    .contains('Log in')
    .click()
    .url()
    .should('contain', '/transfer')
    .wait(500);
  return state;
};
