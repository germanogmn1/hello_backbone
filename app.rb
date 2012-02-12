require 'sinatra'
require 'less'
require 'json'

set :server, :thin
root_id = self.object_id

get '/' do
  erb :index, locals: {id: root_id}
end

get '/css/*.css' do |path|
  content_type "text/css"
  less :"less/#{path}"
end

@@data = []
@@count = 0

get '/tasks' do
  STDOUT.puts "[GET /tasks]"
  
  content_type :json
  JSON.dump @@data
end

post '/tasks' do
  body = request.body.read
  
  STDOUT.puts "[POST /tasks] #{body}"
  
  task = JSON.parse(body).merge(:id => @@count += 1 )
  @@data << task
  
  200
end