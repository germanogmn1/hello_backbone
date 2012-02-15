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

@@data = []
@@count = 0

get '/tasks' do
  content_type :json
  
  res = JSON.dump @@data
  STDOUT.puts "[GET  /tasks] #{res}"
  res
end

post '/tasks' do
  body = request.body.read
  
  STDOUT.puts "[POST /tasks] #{body}"
  
  task = JSON.parse(body).merge(:id => @@count += 1 )
  @@data << task
  
  # respond with the id
  JSON.dump(task)
end

put '/tasks/:id' do |id|
  body = request.body.read
  
  STDOUT.puts "[PUT  /tasks/#{id}] #{body}"
  
  @@data.find { |task| task[:id] == id.to_i }.update(JSON.parse(body))
end
