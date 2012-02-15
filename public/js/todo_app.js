window.Todo = Todo = {
  init: function() {
    new Todo.AppView();
  }
}

Todo.Task = Backbone.Model.extend({
  defaults: {
    done: false
  }
});

Todo.TaskListCollection = Backbone.Collection.extend({
  model: Todo.Task,
  url: "/tasks"
});

Todo.TaskItemView = Backbone.View.extend({
  tagName:  "li",
  
  events: {
    'change input[type="checkbox"]': "toggle"
  },
  
  initialize: function() {
    this.template = _.template($("#task-item-template").html());
    this.model.bind('change', this.render, this);
  },
  
  render: function() {
    var rendered = this.template(this.model.toJSON());
    this.$el.html(rendered);
    return this;
  },
  
  toggle: function(e) {
    this.model.save({done: e.target.checked});
  }
});

Todo.AppView = Backbone.View.extend({
  el: "#todo-app",
  
  events: {
    "submit #new-task": "createTask"
  },
  
  initialize: function() {
    this.taskList = new Todo.TaskListCollection;
    
    this.taskList.on('add', this.renderOne, this);
    this.taskList.on('reset', this.renderAll, this);
    
    this.taskList.fetch();
  },
  
  createTask: function() {
    var taskName = this.$('#new-task input[name="name"]').val();
    this.taskList.create({name: taskName});
    this.$('#new-task')[0].reset();
    return false;
  },
  
  renderOne: function(task) {
    var view = new Todo.TaskItemView({model: task});
    var renderedItem = view.render().el;
    $("#todo-list").append(renderedItem);
  },
  
  renderAll: function(task) {
    this.taskList.each(this.renderOne);
  }
});