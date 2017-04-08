import Marionette from 'backbone.marionette/lib/backbone.marionette.min'
import Backbone from 'backbone'
import Clipboard from 'clipboard/dist/clipboard.min'

import { setPasswords, getPasswords } from 'store'

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
    if(this.model.get(e.target.placeholder) !== e.target.value) {
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
    this.collection.set(getPasswords())
    this.checkCollection()
    this.attachClipboardCopier()
    lockIcon.src = '/img/lock_open.svg'
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
    "remove": "checkCollection"
  },
  addNewItem: function(){
    this.collection.push(new ItemModel())
  },
  checkCollection: function(){
    if(this.collection.length === 0){
      this.addNewItem()
    }
  },
  attachClipboardCopier: function(){
    this.clipboard = new Clipboard('.copy')
    const $el = this.$el
    this.clipboard.on('success', function(e) {
      const input = $el.find(e.trigger.dataset.clipboardTarget)
      const oldValue = input.val()
      input.val(' copying...')
      input.attr('type', 'text')
      input.css('color', "#494")
      setTimeout(function(){
        input.css('color', "")
        input.attr('type', 'password')
        input.val(oldValue)
        input.blur()
      }, 1000)
    })
    this.clipboard.on('error', function(e) {
      $el.find(e.trigger.dataset.clipboardTarget)
      .blur()
    });
  },
  close: function(){
    lockIcon.src = '/img/lock_locked.svg'
    this.clipboard.off()
    this.clipboard.destroy()
  }
})

export default DashboardView