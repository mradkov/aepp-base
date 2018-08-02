import io from 'socket.io-client'
import _ from 'lodash'
import RpcPeer from '../../lib/rpc'

const BACKEND_URL = 'https://signaling.aepps.com'
const PAIR_SYNC_FIELDS = ['apps', 'rpcUrl', 'addresses', 'selectedIdentityIdx', 'addressBook']

export default store => {
  const open = () => {
    const query = { key: store.state.peerId }
    if (process.env.IS_MOBILE_DEVICE) {
      query.followers = Object.keys(store.state.mobile.followers)
    }
    const socket = io(BACKEND_URL, { query })
    const closeCbs = [socket.close.bind(socket)]

    socket.on('exception', console.error)

    let lastReceivedState
    const broadcast = new RpcPeer(
      message => socket.emit('message-to-all', message), {
        setState (state) {
          lastReceivedState = state
          store.replaceState({
            ..._.omit(store.state, PAIR_SYNC_FIELDS),
            ..._.cloneDeep(state)
          })
        }
      })
    socket.on('message', message => broadcast.processMessage(message))

    const getStateForSync = (state, getters) =>
      PAIR_SYNC_FIELDS.reduce((p, n) => ({ ...p, [n]: getters[n] || state[n] }), {})
    const broadcastState = state => {
      if (
        _.isEqual(state, lastReceivedState) || (
          process.env.IS_MOBILE_DEVICE &&
          !Object.values(store.state.mobile.followers).some(({ connected }) => connected))
      ) return
      broadcast.notification('setState', state)
      lastReceivedState = null
    }
    closeCbs.push(store.watch(getStateForSync, broadcastState))

    if (process.env.IS_MOBILE_DEVICE) {
      const syncState = _.throttle(() =>
        broadcastState(getStateForSync(store.state, store.getters)), 500)

      closeCbs.push(store.subscribe(({ type, payload }) => {
        switch (type) {
          case 'addFollower':
            socket.emit('add-follower', payload.id)
            break
          case 'followerConnected':
            syncState()
            break
          case 'removeFollower':
            socket.emit('remove-follower', payload)
            break
        }
      }))

      socket.on('follower-connected', followerId =>
        store.commit('followerConnected', followerId))
      socket.on('follower-disconnected', followerId =>
        store.commit('followerDisconnected', followerId))

      socket.on('message-from-follower', (followerId, request) =>
        new RpcPeer(
          response => socket.emit('message-to-follower', followerId, response), {
            signTransaction: args => store.dispatch('signTransaction', args),
            cancelTransaction: args => store.commit('cancelTransaction', args)
          })
          .processMessage(request))
    } else {
      socket.on('added-to-group', () => store.commit('setRemoteConnected', true))
      socket.on('removed-from-group', () => store.commit('setRemoteConnected', false))

      const leader = new RpcPeer(message => socket.emit('message-to-leader', message))
      socket.on('message-from-leader', message => leader.processMessage(message))
      closeCbs.push(store.subscribe(({ type, payload }) => {
        switch (type) {
          case 'setTransactionToSign':
            if (!payload) return
            leader.call('signTransaction', payload.args).then(payload.resolve, payload.reject)
            break
          case 'cancelTransaction':
            leader.call('cancelTransaction', store.state.desktop.transactionToSignByRemote.args.id)
            break
        }
      }))
    }

    return () => closeCbs.forEach(f => f())
  }

  if (process.env.IS_MOBILE_DEVICE) {
    let closeCb
    store.watch(
      ({ mobile: { followers } }, { loggedIn }) => loggedIn && Object.keys(followers).length,
      isConnectionNecessary => {
        if (isConnectionNecessary && !closeCb) closeCb = open()
        if (!isConnectionNecessary && closeCb) {
          closeCb()
          closeCb = undefined
        }
      },
      { immediate: true })
  } else {
    open(store)
  }
}
