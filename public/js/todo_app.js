jQuery(function() {
  window.Todo = Todo = {}
  
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
    template: _.template($("#task-item-template").html()),
    
    render: function() {
      var rendered = this.template(this.model.toJSON());
      this.$el.html(rendered);
      return this;
    }
  });
  
  Todo.AppView = Backbone.View.extend({
    el: $("#todo-app"),
    
    events: {
      "submit #new-task": "createTask"
    },
    
    initialize: function() {
      this.taskList = new Todo.TaskListCollection;
      
      this.taskList.on('add', this.addOne, this);
      this.taskList.on('reset', this.addAll, this);
      
      this.taskList.fetch();
    },
    
    createTask: function() {
      window.el = this.el;
      var taskName = this.$('#new-task input[name="name"]').val();
      this.taskList.create({name: taskName});
      this.$('#new-task')[0].reset();
      return false;
    },
    
    addOne: function(task) {
      var view = new Todo.TaskItemView({model: task});
      $("#todo-list").append(view.render().el);
    },
    
    addAll: function(task) {
      this.taskList.each(this.addOne);
      var view = new Todo.TaskItemView({model: task});
      $("#todo-list").append(view.render().el);
    }
  });
  
  new Todo.AppView();
  
});