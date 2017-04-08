import Marionette from 'backbone.marionette/lib/backbone.marionette.min'
import Backbone from 'backbone/backbone-min'
import Clipboard from 'clipboard/dist/clipboard.min'

import { setPasswords, getPasswords } from 'store'

const ItemModel = Backbone.Model.extend({
  defaults:{
    target: '',
    username: '',
    password: ''
  }
})

const Item = Marionette.ItemView.extend({
  template: '#dashboard-item__tpl',
  templateHelpers: function(){
    return {
      clip: 'clip' + this.model.cid
    }
  },
  tagName: 'li',
  className: 'listItem',
  model: ItemModel,
  ui: {
    target: '.target',
    username: '.username',
    password: '.password',
    removeBtn: '.remove',
    inputs: 'input.dash'
  },
  events: {
    'blur @ui.inputs': 'updateModel',
    'click @ui.removeBtn': 'removeModel',
    'blur @ui.password': 'hidePass',
    'focus @ui.password': 'showPass'
  },
  updateModel: function(e){
    if(this.model.get(e.target.placeholder) === e.target.value) {
      return
    } else {
      this.model.set(e.target.placeholder, e.target.value)
      setPasswords(this.model.collection.toJSON())
    }
  },
  removeModel: function(){
    const collection = this.model.collection
    collection.remove(this.model)
    setPasswords(collection.toJSON())
  },
  hidePass: function(e){
    e.target.type='password'
  },
  showPass: function(e){
    e.target.type='text'
  }
})

const DashboardView = Marionette.CompositeView.extend({
  template: '#dashboard__tpl',
  className: 'dashboard',
  childView: Item,
  childViewContainer: '.list',
  initialize: function(){
    this.collection = new Backbone.Collection(getPasswords())
    if(this.collection.length === 0){
      this.addNewItem()
    }
  },
  ui: {
    addBtn: '.add',
    saveBtn: '.save',
    exitBtn: '.exit'
  },
  events: {
    'click @ui.addBtn': 'addNewItem',
    'click @ui.saveBtn': 'save',
    'click @ui.exitBtn': 'exit'
  },
  addNewItem: function(){
    this.collection.push(new ItemModel())
  },
  save: function(){
    setPasswords(this.collection.toJSON())
  },
  onRender: function(){
    document.querySelector('.lock').src = '/img/lock_open.svg'
    this.clipboard = new Clipboard('.copy')
    this.clipboard.on('success', function(e) {
      const input = document.getElementById(e.trigger.dataset.clipboardTarget.substring(1))
      const oldValue = input.value
      input.value = ' copying...'
      input.type = 'text'
      input.style.color = "#494"
      setTimeout(function(){
        input.style.color = ''
        input.type = 'password'
        input.value = oldValue
        input.blur()
      }, 1000)
    })
    this.clipboard.on('error', function(e) {
      document.getElementById(e.trigger.dataset.clipboardTarget.substring(1))
      .blur()
    });
  },
  lock: function(){
    this.clipboard.off()
    this.clipboard.destroy()
    document.querySelector('.lock').src = '/img/lock_locked.svg'
  }
})


export default DashboardView