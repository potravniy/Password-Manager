import Marionette from 'backbone.marionette/lib/backbone.marionette.min'
import Backbone from 'backbone/backbone-min'

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
    'click @ui.removeBtn': 'removeModel'
  },
  updateModel: function(e){
    const field = e.target.placeholder
    if(this.model.get(field) === e.target.value) return
    this.model.set(field, e.target.value)
    const collection = this.model.collection.map(function(it){
      return it.attributes
    })
    setPasswords(collection)
  },
  removeModel: function(){
    const that = this
    const collection = this.model.collection.reduce(function(memo, it){
      if(it !== that.model) memo.push(it.attributes)
      return memo
    }, [])
    setPasswords(collection)
    this.model.collection.remove(this.model)
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
      this.collection.push(new ItemModel())
    }
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