import runMigrations, { registerMigration } from './runner';
import fixEasCounterIssue from './00-fix-aes-ctr-counter-issue';
import resetAppsStateField from './01-reset-apps-state-field';
import buildAccountsArray from './02-build-accounts-array';
import setMnemonicBackedUp from './03-set-mnemonic-backed-up';
import updateSdkUrl from './04-update-sdk-url';

registerMigration(fixEasCounterIssue);
registerMigration(resetAppsStateField);
registerMigration(buildAccountsArray);
registerMigration(setMnemonicBackedUp);
registerMigration(updateSdkUrl);

export default runMigrations;
