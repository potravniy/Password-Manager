import Marionette from 'backbone.marionette/lib/backbone.marionette.min'
import _ from 'underscore'

import { register, getUsersList } from 'store'

const RegisterPageView = Marionette.ItemView.extend({
  template: '#init-page__tpl',
  className: 'login init-page',
  templateHelpers: {
    title: 'Register',
    switchBtn: 'Show login page'
  },
  ui: {
    'user': '#user-name',
    'form': '#init_page',
    'login': '.switch'
  },
  events: {
    'blur @ui.user': 'checkName',
    'submit @ui.form': 'register',
    'click @ui.login': 'showLoginPage'
  },
  checkName: function(e){
    if(_.contains(getUsersList(), e.target.value)){
      alert('This name is used already.')
    }
  },
  register: function(e){
    e.preventDefault()
    const formData = this.ui.form.serializeArray()
    const user = formData[0].value
    const password = formData[1].value
    const confirm = formData[2].value
    if(password !== confirm){
      alert('Passwords are not equal!')
      return
    }
    if(register(user, password) === 0){
      alert('New user registered.')
      this.then()
    } else {
      alert('This name is in use already.')
    }
  }
})

export default RegisterPageView