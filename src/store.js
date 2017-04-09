import _ from 'underscore'
import AES from 'crypto-js/aes'
import enc_utf8 from 'crypto-js/enc-utf8'

const store = function(){
  const storageName = 'pm'
  const state = {
    data: undefined,
    loggedUser: undefined,
    masterPass: undefined,
    storage: JSON.parse(window.localStorage.getItem(storageName)) || {}
  }
  const API = {
    asyncUpgateLocalStorage: function () {
      setTimeout(function(){
        state.storage[state.loggedUser] = AES.encrypt(JSON.stringify(state.data), state.masterPass).toString()
        window.localStorage.setItem(storageName, JSON.stringify(state.storage))
      }, 0)
    }
  }

  this.getUsersList = function(){
    return _.keys(state.storage)
  }
  this.register = function (user, masterPassword) {
    if(state.storage[user]) {
      state.data = state.loggedUser = state.masterPass = undefined
      return 1
    }
    state.data = []
    state.loggedUser = user
    state.masterPass = masterPassword
    API.asyncUpgateLocalStorage()
    return 0
  }
  this.logIn = function (user, masterPassword) {
    try {
      const bytes = AES.decrypt(state.storage[user], masterPassword)
      state.data = JSON.parse(bytes.toString(enc_utf8))
      state.loggedUser = user
      state.masterPass = masterPassword
      return 0
    } catch (e) {
      state.data = state.loggedUser = state.masterPass = undefined
      return 1
    }
  }
  this.logOut = function(){
    state.data = state.loggedUser = state.masterPass = undefined
    return 0
  }
  this.setPasswords = function(passwords){
    if(state.loggedUser){
      state.data = passwords
      API.asyncUpgateLocalStorage()
      return 0
    } else {
      return 1
    }
  }
  this.getPasswords = function(){
    return state.loggedUser ? state.data : null
  }
  return this
}

export default new store()