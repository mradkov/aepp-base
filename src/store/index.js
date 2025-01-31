/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["state"] }] */

import { pick } from 'lodash-es';
import Vue from 'vue';
import Vuex from 'vuex';
import VueRx from 'vue-rx';
import '../lib/storeErrorHandler';
import rootModule from './modules/root';
import desktopModule from './modules/desktop';
import mobileModule from './modules/mobile';
import accountsModule from './modules/accounts';
import persistState from './plugins/persistState';
import remoteConnection from './plugins/remoteConnection';
import initSdk from './plugins/initSdk';
import registerServiceWorker from './plugins/registerServiceWorker';
import reverseIframe from './plugins/reverseIframe';
import syncLedgerAccounts from './plugins/syncLedgerAccounts';

Vue.use(Vuex);
Vue.use(VueRx);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    persistState(
      state => state,
      ({
        migrations, sdkUrl, customNetworks,
        apps, peerId, languages, currencies,
        accounts: { list, activeIdx, hdWallet: { encryptedWallet, mnemonicBackedUp } = {} } = {},
        appsMetadata: { cachedManifests } = {},
        mobile: { readSecurityCourses, followers, skipAddingToHomeScreen } = {},
        desktop: { showGuideOnStartup } = {},
      }) => ({
        migrations,
        peerId,
        languages,
        currencies,
        sdkUrl,
        customNetworks,
        accounts: {
          list: list.map(({ address, source }) => {
            switch (source.type) {
              case 'hd-wallet':
                return {
                  address,
                  source: pick(source, ['type', 'idx']),
                };
              default:
                return { address, source };
            }
          }),
          activeIdx,
          hdWallet: { encryptedWallet, mnemonicBackedUp },
        },
        appsMetadata: { cachedManifests },
        apps,
        ...process.env.IS_MOBILE_DEVICE ? {
          mobile: {
            readSecurityCourses,
            followers: Object.entries(followers)
              .reduce((p, [k, { id, name, disconnectedAt }]) => (
                { ...p, [k]: { id, name, disconnectedAt } }), {}),
            skipAddingToHomeScreen,
          },
        } : {
          desktop: { showGuideOnStartup },
        },
      }),
    ),
    ...process.env.RUNNING_IN_POPUP ? [] : [
      initSdk,
      remoteConnection,
      registerServiceWorker,
      reverseIframe,
      ...process.env.IS_MOBILE_DEVICE ? [] : [syncLedgerAccounts],
    ],
  ],

  modules: {
    ...process.env.RUNNING_IN_POPUP ? {} : {
      ...process.env.IS_MOBILE_DEVICE
        ? { mobile: mobileModule }
        : { desktop: desktopModule },
    },
    accounts: accountsModule,
  },

  ...rootModule,
});

export default store;
