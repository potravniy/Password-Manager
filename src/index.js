import Marionette from 'backbone.marionette/lib/backbone.marionette.min'

import { getUsersList, logOut } from 'store'
import LoginPage from 'LoginPage'
import RegisterPage from 'RegisterPage'
import DashboardPage from 'DashboardPage'

window.addEventListener('load', controller)

function controller(){
  const region = new Marionette.Region({el: "#root"})

  const Register = RegisterPage.extend({
    then: function(){
      region.show(new Dashboard())
    },
    showLoginPage: function(){
      region.show(new Login())
    }
  })

  const Login = LoginPage.extend({
    then: function(){
      region.show(new Dashboard())
    },
    registerNewUser: function(){
      region.show(new Register())
    }
  })

  const Dashboard = DashboardPage.extend({
    exit: function(){
      logOut()
      this.lock()
      region.show(new Login())
    }
  })

  if(getUsersList().length === 0){
    region.show(new Register())
  } else {
    region.show(new Login())
  }
}