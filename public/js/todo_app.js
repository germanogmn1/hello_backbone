window.Todo = Todo = {
  init: function() {
    this.appView = new Todo.AppView();
  }
}

Todo.Task = Backbone.Model.extend({
  defaults: {
    done: false
  },
  
  validate: function(attrs) {
    var strip = function(str) {
      return str.replace(/^\s+/, '').replace(/\s+$/, '');
    };
    if (!attrs.name || !strip(attrs.name).length) {
      return true;
    }
  }
});

Todo.TaskListCollection = Backbone.Collection.extend({
  model: Todo.Task,
  url: "/tasks"
});

Todo.TaskItemView = Backbone.View.extend({
  tagName:  "li",
  
  events: {
    'change input[type="checkbox"]': "toggle",
    "click .destroy": "destroy"
  },
  
  initialize: function() {
    this.template = _.template($("#task-item-template").html());
    this.model.bind('change', this.render, this);
    this.model.bind('remove', this.remove, this);
  },
  
  render: function() {
    var rendered = this.template(this.model.toJSON());
    this.$el.html(rendered);
    return this;
  },
  
  remove: function() {
    this.$el
      .css("background-color", "#ffcccc")
      .animate({opacity: 0}, 500, function(){ $(this).remove(); });
  },
  
  toggle: function(e) {
    this.model.save({done: e.target.checked});
  },
  
  destroy: function(e) {
    this.model.destroy();
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