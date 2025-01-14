import appsMetadata from './appsMetadata';
import pathTracker from './pathTracker';
import connectionStatusTracker from './connectionStatusTracker';
import desktopGuide from './desktopGuide';
import languages from './languages';
import currencies from './currencies';
import ledgerConnection from './ledgerConnection';
import modals from './modals';
import names from './names';
import notificationOnRemoteConnection from './notificationOnRemoteConnection';
import observables from './observables';
import unlockWalletIfNotEncrypted from './unlockWalletIfNotEncrypted';
import veeValidate from './veeValidate';

export default store => [
  appsMetadata,
  connectionStatusTracker,
  languages,
  currencies,
  modals,
  names,
  observables,
  veeValidate,
  ...process.env.IS_MOBILE_DEVICE
    ? [
      pathTracker,
      notificationOnRemoteConnection,
      unlockWalletIfNotEncrypted,
    ]
    : [
      desktopGuide,
      ledgerConnection,
    ],
].forEach(plugin => plugin(store));
