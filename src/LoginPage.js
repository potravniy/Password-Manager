import Marionette from 'backbone.marionette/lib/backbone.marionette.min'
import _ from 'underscore/underscore-min'

import { logIn } from 'store'

const LoginPageView = Marionette.ItemView.extend({
  template: '#init-page__tpl',
  className: 'login init-page',
  templateHelpers: {
    title: 'Login',
    switchBtn: 'Register new user'
  },
  ui: {
    'form': '#init_page',
    'registerBtn': '.switch'
  },
  events: {
    'submit @ui.form': 'login',
    'click @ui.registerBtn': 'registerNewUser'
  },
  login: function(e){
    e.preventDefault()
    const formData = this.ui.form.serializeArray()
    const user = formData[0].value
    const password = formData[1].value
    if(logIn(user, password) === 0){
      this.then()
    } else {
      alert('Wrong username / password')
    }
  }
})

export default LoginPageView