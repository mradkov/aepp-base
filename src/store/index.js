/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["state"] }] */

import Vue from 'vue';
import Vuex from 'vuex';
import BigNumber from 'bignumber.js';
import { Crypto } from '@aeternity/aepp-sdk';
import { spendTxNative } from '@aeternity/aepp-sdk/es/tx/js';
import { appsRegistry } from '../lib/appsRegistry';
import networksRegistry from '../lib/networksRegistry';
import { MAGNITUDE } from '../lib/constants';
import desktopModule from './modules/desktop';
import mobileModule from './modules/mobile';
import persistState from './plugins/persistState';
import pollBalance from './plugins/pollBalance';
import initEpoch from './plugins/initEpoch';
import ledgerConnection from './plugins/ledgerConnection';
import remoteConnection from './plugins/remoteConnection';
import notificationOnRemoteConnection from './plugins/notificationOnRemoteConnection';
import decryptAccounts from './plugins/decryptAccounts';
import aeppApi from './plugins/aeppApi';
import modals from './plugins/modals';
import registerServiceWorker from './plugins/registerServiceWorker';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    persistState(({
      migrations, apps, rpcUrl, selectedIdentityIdx, addressBook, customNetworks, mobile, desktop,
    }) => ({
      migrations,
      ...process.env.IS_MOBILE_DEVICE ? {
        apps,
        rpcUrl,
        selectedIdentityIdx,
        addressBook,
        customNetworks,
        mobile: {
          keystore: mobile.keystore,
          accountCount: mobile.accountCount,
          followers: Object.entries(mobile.followers)
            .reduce((p, [k, { id, name, disconnectedAt }]) => (
              { ...p, [k]: { id, name, disconnectedAt } }), {}),
          names: mobile.names,
        },
      } : {
        desktop: {
          peerId: desktop.peerId,
          ledgerAccountNumber: desktop.ledgerAccountNumber,
        },
      },
    })),
    pollBalance,
    initEpoch,
    remoteConnection,
    aeppApi,
    modals,
    registerServiceWorker,
    ...process.env.IS_MOBILE_DEVICE
      ? [decryptAccounts, notificationOnRemoteConnection] : [ledgerConnection],
  ],

  modules: process.env.IS_MOBILE_DEVICE ? { mobile: mobileModule } : { desktop: desktopModule },

  state: {
    migrations: {},
    loginTarget: '',
    selectedAppIdxToRemove: -1,
    selectedIdentityIdx: 0,
    balances: {},
    addresses: [],
    rpcUrl: networksRegistry[0].url,
    epoch: null,
    alert: null,
    notification: null,
    apps: Object.keys(appsRegistry),
    addressBook: [],
    customNetworks: [],
  },

  getters: {
    identities: ({ balances }, { addresses }, { mobile }) => addresses.map((e, index) => ({
      balance: balances[e] || BigNumber(0),
      address: e,
      name: process.env.IS_MOBILE_DEVICE ? mobile.names[index] : e.substr(0, 6),
    })),
    activeIdentity: ({ selectedIdentityIdx }, { identities }) => identities[selectedIdentityIdx],
    totalBalance: (state, { identities }) => identities
      .reduce((sum, { balance }) => sum.plus(balance), BigNumber(0)),
    networks: ({ customNetworks }) => [
      ...networksRegistry,
      ...customNetworks.map(network => ({ ...network, custom: true })),
    ],
    currentNetwork: ({ rpcUrl }, { networks }) => networks.find(({ url }) => url === rpcUrl) || {
      name: rpcUrl,
      url: rpcUrl,
    },
  },

  mutations: {
    markMigrationAsApplied(state, migrationId) {
      Vue.set(state.migrations, migrationId, true);
    },
    setLoginTarget(state, loginTarget) {
      state.loginTarget = loginTarget;
    },
    setRPCUrl(state, rpcUrl) {
      state.rpcUrl = rpcUrl;
    },
    setEpoch(state, epoch) {
      state.epoch = epoch;
    },
    addApp(state, app) {
      state.apps.push(app);
    },
    selectAppToRemove(state, selectedAppIdxToRemove = -1) {
      state.selectedAppIdxToRemove = selectedAppIdxToRemove;
    },
    removeSelectedApp(state) {
      state.apps.splice(state.selectedAppIdxToRemove, 1);
      state.selectedAppIdxToRemove = -1;
    },
    selectIdentity(state, selectedIdentityIdx) {
      state.selectedIdentityIdx = selectedIdentityIdx;
    },
    setBalance(state, { address, balance }) {
      Vue.set(state.balances, address, balance);
    },
    setAlert(state, options) {
      state.alert = options;
    },
    setNotification(state, options) {
      state.notification = options;
    },
    addAddressBookItem(state, item) {
      state.addressBook.push(item);
    },
    addNetwork(state, network) {
      state.customNetworks.push(network);
    },
    removeNetwork(state, networkIdx) {
      state.customNetworks.splice(networkIdx - networksRegistry.length, 1);
    },
  },

  actions: {
    alert({ commit }, options) {
      return new Promise(resolve => commit('setAlert', {
        ...options,
        resolve: () => {
          commit('setAlert');
          resolve();
        },
      }));
    },
    setNotification({ commit }, options) {
      commit('setNotification', options);
      if (options.autoClose) setTimeout(() => commit('setNotification'), 3000);
    },
    async addApp({ commit }, arg) {
      if (appsRegistry[arg]) {
        commit('addApp', arg);
        return;
      }

      const path = arg.replace(/^https?:\/\//i, '');
      let name;
      try {
        const response = await fetch(`https://cors-anywhere.herokuapp.com/${path}`);
        const text = await response.text();
        const el = document.createElement('html');
        el.innerHTML = text;
        name = el.getElementsByTagName('title')[0].innerText;
      } catch (e) {
        console.error(e);
      }
      name = name || prompt('Enter Title');
      commit('addApp', { path, name });
    },
    updateAllBalances({ getters: { addresses }, dispatch }) {
      addresses.forEach(address => dispatch('updateBalance', address));
    },
    async updateBalance({ state: { epoch, balances }, commit }, address) {
      const balance = BigNumber(await epoch.balance(address, { format: false }).catch(() => 0))
        .shiftedBy(-MAGNITUDE);
      if (balances[address] && balances[address].isEqualTo(balance)) return;
      commit('setBalance', { address, balance });
    },
    async genSpendTxBinary({ state: { epoch } }, transaction) {
      const spendTx = spendTxNative({
        nonce: +(await epoch.api.getAccountByPubkey(transaction.senderId)).nonce + 1,
        ...transaction,
        fee: transaction.fee.shiftedBy(MAGNITUDE),
        amount: transaction.amount.shiftedBy(MAGNITUDE),
      }).tx;
      return Crypto.decodeBase64Check(spendTx.split('_')[1]);
    },
  },
});

export default store;
