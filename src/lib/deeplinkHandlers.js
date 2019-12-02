const handlers = {};
let lastDeeplink = null;

export const registerDeeplinkHandler = (handler, scope) => {
  const handlerExisted = !!handlers[scope];
  handlers[scope] = handler;
  if (lastDeeplink && !handlerExisted) handler(lastDeeplink);
};

export const runHandlersForDeeplink = (deeplink) => {
  lastDeeplink = deeplink;
  Object.values(handlers).forEach(h => h(deeplink));
};
