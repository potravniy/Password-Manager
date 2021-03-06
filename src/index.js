import Marionette from 'backbone.marionette/lib/backbone.marionette.min'

import store from 'store'
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
      store.logOut()
      this.close()
      region.show(new Login())
    }
  })

  if(store.getUsersList().length === 0){
    region.show(new Register())
  } else {
    region.show(new Login())
  }
}