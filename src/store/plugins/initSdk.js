import { get, isEqual } from 'lodash-es';
import { handleUnknownError, isNotFoundError } from '../../lib/utils';
import { i18n } from './ui/languages';
import { Universal, MemoryAccount } from '@aeternity/aepp-sdk/es';

(async () => {
  const address = 'ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR';
  const sdk = await Universal({
    url: 'https://sdk-testnet.aepps.com',
    compilerUrl: 'https://compiler.aepps.com',
    accounts: [MemoryAccount({ keypair: {
      secretKey: 'bf66e1c256931870908a649572ed0257876bb84e3cdf71efb12f56c7335fad54d5cf08400e988222f26eb4b02c8f89077457467211a6e6d955edb70749c6a33b',
      publicKey: address,
    }})],
    address,
  });
  console.log('sdk', sdk);
  console.log('balance', await sdk.balance(address));
  console.log('send', await sdk.spend(1, 'ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR'));
})();

export default (store) => {
  let recreateSdk;

  const createSdk = async (network) => {
    const [Ae, ChainNode, Transaction, Contract, Aens, Rpc, Swagger] = (await Promise.all([
      import(/* webpackChunkName: "sdk" */ '@aeternity/aepp-sdk/es/ae'),
      import(/* webpackChunkName: "sdk" */ '@aeternity/aepp-sdk/es/chain/node'),
      import(/* webpackChunkName: "sdk" */ '@aeternity/aepp-sdk/es/tx/tx'),
      import(/* webpackChunkName: "sdk" */ '@aeternity/aepp-sdk/es/ae/contract'),
      import(/* webpackChunkName: "sdk" */ '@aeternity/aepp-sdk/es/ae/aens'),
      import(/* webpackChunkName: "sdk" */ '@aeternity/aepp-sdk/es/rpc/server'),
      import(/* webpackChunkName: "sdk" */ '@aeternity/aepp-sdk/es/utils/swagger'),
    ])).map(module => module.default);

    class App {
      constructor(host) {
        this.host = host;
      }

      async ensureCurrentAccountAccessPure() {
        const accessToAccounts = get(
          store.getters.getApp(this.host), 'permissions.accessToAccounts', [],
        );
        if (accessToAccounts.includes(store.getters['accounts/active'].address)) return;
        const promise = store.dispatch(
          'modals/open',
          { name: 'confirmAccountAccess', appHost: this.host },
        );
        const unsubscribe = store.watch(
          (state, getters) => getters['accounts/active'].address,
          address => accessToAccounts.includes(address) && promise.cancel(),
        );

        try {
          await Promise.race([
            promise,
            new Promise((resolve, reject) => promise.finally(() => {
              if (!promise.isCancelled()) return;
              if (accessToAccounts.includes(store.getters['accounts/active'].address)) {
                resolve();
              } else reject(new Error('Unexpected state'));
            })),
          ]);
        } finally {
          unsubscribe();
        }

        const { address: accountAddress } = store.getters['accounts/active'];
        if (!accessToAccounts.includes(accountAddress)) {
          store.commit('toggleAccessToAccount', { appHost: this.host, accountAddress });
        }
      }

      ensureCurrentAccountAccess() {
        if (!this.accountAccessPromise) {
          this.accountAccessPromise = this.ensureCurrentAccountAccessPure();
          this.accountAccessPromise.finally(() => {
            delete this.accountAccessPromise;
          });
        }
        return this.accountAccessPromise;
      }
    }

    const apps = {};

    const methods = {
      async address(...args) {
        if (args[args.length - 1] instanceof App) {
          await args[args.length - 1].ensureCurrentAccountAccess();
        }
        return store.getters['accounts/active'].address;
      },
      sign: data => store.dispatch('accounts/sign', data),
      signTransaction: txBase64 => store.dispatch('accounts/signTransaction', txBase64),
      readQrCode: ({ title }) => store.dispatch('modals/open', {
        name: 'readQrCode',
        title: title || i18n.t('scan-qr-code'),
      }),
    };

    let sdkActive = false;
    const errorHandler = (error) => {
      if (sdkActive && !isNotFoundError(error)) {
        recreateSdk();
        sdkActive = false;
      }
      throw error;
    };
    const [sdk, middleware] = await Promise.all([
      Ae.compose(
        ChainNode, Transaction, Contract, Aens, Rpc, {
          init(options, { stamp }) {
            const rpcMethods = [
              ...stamp.compose.deepConfiguration.Ae.methods,
              ...stamp.compose.deepConfiguration.Contract.methods,
            ];
            this.rpcMethods = {
              ...rpcMethods
                .map(m => [m, ({ params, origin }) => {
                  const { host } = new URL(origin);
                  const app = apps[host] || (apps[host] = new App(host));
                  return Promise.resolve(this[m](...params, app));
                }])
                .reduce((p, [k, v]) => ({ ...p, [k]: v }), {}),
              ...this.rpcMethods,
            };
          },
          methods,
          deepConfiguration: { Ae: { methods: ['readQrCode'] } },
        },
      )({
        url: network.url,
        internalUrl: network.url,
        compilerUrl: 'https://compiler.aepps.com',
        axiosConfig: { errorHandler },
      }),
      (async () => {
        const swag = await (await fetch(`${network.middlewareUrl}/middleware/api`)).json();
        return Swagger.compose({
          methods: {
            urlFor: path => network.middlewareUrl + path,
            axiosError: () => errorHandler,
          },
        })({ swag });
      })(),
    ]);
    sdkActive = true;
    sdk.middleware = middleware.api;
    return sdk;
  };

  recreateSdk = async () => {
    const { currentNetwork } = store.getters;
    if (store.state.sdk && !store.state.sdk.then) store.state.sdk.destroyInstance();
    const sdkPromise = createSdk(currentNetwork);
    const sdkThenable = { then: sdkPromise.then.bind(sdkPromise) };
    store.commit('setSdk', sdkThenable);
    const sdk = await sdkThenable.then(s => s, (error) => {
      handleUnknownError(error);
      return null;
    });
    if (sdkThenable.then === store.state.sdk.then) store.commit('setSdk', sdk);
    else if (sdk) sdk.destroyInstance();
  };

  let lastNetwork;

  store.watch(
    ({ onLine }, { currentNetwork }) => ({ ...currentNetwork, onLine }),
    async (currentNetwork) => {
      if (isEqual(currentNetwork, lastNetwork)) return;
      lastNetwork = currentNetwork;
      await recreateSdk();
    },
    { immediate: true },
  );
};
