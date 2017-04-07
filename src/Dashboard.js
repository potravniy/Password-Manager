import Marionette from 'backbone.marionette/lib/backbone.marionette.min'
import Backbone from 'backbone/backbone-min'

import { setPasswords, getPasswords } from 'store'

const ItemModel = Backbone.Model.extend({
  target: '',
  username: '',
  pass: ''
})

const Item = Marionette.ItemView.extend({
  template: '#dashboard-item__tpl',
  tagName: 'li',
  className: 'listItem',
  model: ItemModel,
})

const DashboardView = Marionette.CompositeView.extend({
  template: '#dashboard__tpl',
  className: 'dashboard',
  childView: Item,
  childViewContainer: '.list',
  initialize: function(){
    this.collection = new Backbone.Collection(getPasswords())
  },
  ui: {
    addBtn: '.add'
  },
  events: {
    'click @ui.addBtn': 'addNewItem'
  },
  addNewItem: function(){
    this.collection.push(new ItemModel())
  },
  onRender: function(){
    document.querySelector('.lock').src = '/img/lock_open.svg'
  },
  onBeforeDesroy: function(){
    document.querySelector('.lock').src = '/img/lock_locked.svg'
  }
})

export default DashboardView