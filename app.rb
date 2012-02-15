require 'sinatra'
require 'less'
require 'json'

set :server, :thin
root_id = self.object_id

get '/' do
  erb :index
end

get '/css/*.css' do |path|
  content_type "text/css"
  less :"less/#{path}"
end

task_list = []
last_id = 0

get '/tasks' do
  STDOUT.puts "[GET /tasks]"
  
  content_type :json
  JSON.dump task_list
end

post '/tasks' do
  body = request.body.read
  
  STDOUT.puts "[POST /tasks] #{body}"
  
  task = JSON.parse(body).merge(id: last_id += 1)
  task_list << task
  
  # respond with the id
  content_type :json
  JSON.dump(task)
end

put '/tasks/:id' do |id|
  body = request.body.read
  
  STDOUT.puts "[PUT /tasks/#{id}] #{body}"
  
  task_list.find { |task| task[:id] == id.to_i }.update(JSON.parse(body))
end

delete '/tasks/:id' do |id|
  STDOUT.puts "[DELETE /tasks/#{id}]"
  
  task_list.delete_if { |task| task[:id] == id.to_i }
  200
end
