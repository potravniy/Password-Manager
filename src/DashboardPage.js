import Marionette from 'backbone.marionette/lib/backbone.marionette.min'
import Backbone from 'backbone'
import Clipboard from 'clipboard/dist/clipboard.min'

import store from 'store'

const lockIcon = document.querySelector('.lock')

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
    if(this.model.get(e.target.name) !== e.target.value) {
      this.model.set(e.target.name, e.target.value)
      store.setPasswords(this.model.collection.toJSON())
      this.triggerMethod('save')
    }
  },
  removeModel: function(){
    this.model.collection.remove(this.model)
  },
  hidePass: function(e){
    e.target.type='password'
  },
  showPass: function(e){
    e.target.type='text'
  },
  onShow: function(){
    if(this.model.get('target') === ''
    && this.model.get('username') === ''
    && this.model.get('password') === ''){
      this.$el.find('.target').focus()
    }
  }
})

const DashboardView = Marionette.CompositeView.extend({
  template: '#dashboard__tpl',
  className: 'dashboard',
  childView: Item,
  childViewContainer: '.list',
  collection: new Backbone.Collection(),
  initialize: function(){
    this.collection.set(store.getPasswords())
    this.checkIfCollectionEmpty()
    this.attachClipboardCopier()
    lockIcon.src = 'img/lock_open.svg'
  },
  ui: {
    addBtn: '.add',
    exitBtn: '.exit'
  },
  events: {
    'click @ui.addBtn': 'addNewItem',
    'click @ui.exitBtn': 'exit'
  },
  collectionEvents: {
    "remove": "updateStoreAfterRemove"
  },
  childEvents: {
    save: function(){
      this.saveBtn.addClass('pseudo-focus')
      setTimeout(this.saveBtn.removeClass.bind(this.saveBtn, 'pseudo-focus'), 300)
    }
  },
  addNewItem: function(){
    this.collection.push(new ItemModel())
  },
  updateStoreAfterRemove: function(){
    store.setPasswords(this.collection.toJSON())
    this.checkIfCollectionEmpty()
  },
  checkIfCollectionEmpty: function(){
    if(this.collection.length === 0) this.addNewItem()
  },
  attachClipboardCopier: function(){
    this.clipboard = new Clipboard('.copy')
    const $el = this.$el
    this.clipboard.on('success', this.showNotificationFromClipboard.bind(this))
    this.clipboard.on('error', function(e) {
      $el.find(e.trigger.dataset.clipboardTarget).blur()
    });
  },
  showNotificationFromClipboard: function(e) {
    const input = this.$el.find(e.trigger.dataset.clipboardTarget)
    const oldValue = input.val()
    var newValue = 'copying'
    input.val(newValue)
    input.attr('type', 'text')
    input.css('color', "#494")
    const id = setInterval(function(){
      newValue += '.'
      input.val(newValue)
    }, 80)
    setTimeout(function(){
      clearInterval(id)
      input.css('color', "")
      input.attr('type', 'password')
      input.val(oldValue)
      input.blur()
    }, 1000)
  },
  onShow: function(){
    this.saveBtn = this.$el.find('.save')
  },
  close: function(){
    lockIcon.src = 'img/lock_locked.svg'
    this.clipboard.off()
    this.clipboard.destroy()
  }
})

export default DashboardView