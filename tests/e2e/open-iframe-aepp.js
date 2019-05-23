import login from './login';

export default (aeppUrl = 'http://example-aepp.origin.aepps.com', allow = true, time = 1000) => {
  const stateBefore = login();
  cy
    .get('.button-plain')
    .contains('æpps')
    .click()
    .url()
    .should('contain', '/browser')
    .get('.button-plain.right')
    .click()
    .get('input')
    .type(aeppUrl)
    .get('form')
    .submit()
    .wait(time)
    .get('button')
    .contains(allow ? 'Allow' : 'Deny')
    .click();
  return stateBefore;
};
