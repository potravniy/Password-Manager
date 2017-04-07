import Marionette from 'backbone.marionette/lib/backbone.marionette.min'

import { getUsersList } from 'store'
import LoginPage from 'LoginPage'
import RegisterPage from 'RegisterPage'
import Dashboard from 'Dashboard'

export default function(){
  const region = new Marionette.Region({el: "#root"})
  const Login = LoginPage.extend({
    then: function(){
      region.show(new Dashboard())
    },
    registerNewUser: function(){
      region.show(new Register())
    }
  })
  const Register = RegisterPage.extend({
    then: function(){
      region.show(new Dashboard())
    },
    showLoginPage: function(){
      region.show(new Login())
    }
  })
  const usersList = getUsersList()

  if(usersList.length === 0){
    region.show(new Register())
  } else {
    region.show(new Login())
  }
}