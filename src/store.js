import _ from 'underscore/underscore-min'
import AES from 'crypto-js/aes'
import enc_utf8 from 'crypto-js/enc-utf8'

const storageName = 'pm'
const storage = JSON.parse(window.localStorage.getItem(storageName)) || {}
let data,
    loggedUser,
    masterPass

export const getUsersList = function(){
  return _.keys(storage)
}
export const logIn = function (user, masterPassword) {
  try {
    const bytes = AES.decrypt(storage[user], masterPassword)
    data = JSON.parse(bytes.toString(enc_utf8))
    loggedUser = user
    masterPass = masterPassword
    return 0
  } catch (e) {
    data = loggedUser = masterPass = undefined
    return 1
  }
}
export const register = function (user, masterPassword) {
  if(storage[user]) {
    data = loggedUser = masterPass = undefined
    return 1
  }
  data = []
  loggedUser = user
  masterPass = masterPassword
  upgateStorage()
  return 0
}
export const setPasswords = function(passwords){
  if(loggedUser && Array.isArray(passwords)){
    data = passwords
    upgateStorage()
    return 0
  } else {
    return 1
  }
}
export const getPasswords = function(){
  return loggedUser ? data : null
}
function upgateStorage() {
  setTimeout(function(){
    storage[loggedUser] = AES.encrypt(JSON.stringify(data), masterPass).toString()
    window.localStorage.setItem(storageName, JSON.stringify(storage))
  }, 4)
}