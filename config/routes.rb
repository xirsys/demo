XirsysRails::Application.routes.draw do
  root :to => 'demos#new'
  
  resources :xirsys, defaults: {format: :json} do  
    collection do
      get  'getIceServers'
      post 'getIceServers'
      get  'getToken'
      post 'getToken'
      get  'addRoom'
      post 'addRoom'
    end
  end
  
  resources :demos, :path => '/' do  
    collection do
      
      # Tests
      get '/get_token_test' => 'demos#get_token_test'
      get '/get_ice_servers_test' => 'demos#get_ice_servers_test'
      get '/add_room_test' => 'demos#add_room_test'
      get '/join_room_test' => 'demos#join_room_test'
      
      # Demos
      get '/one_to_one_video' => 'demos#one_to_one_video'
      get '/many_to_many_video' => 'demos#many_to_many_video'
      get '/many_to_many_video_dynamic' => 'demos#many_to_many_video_dynamic'
    end
  end

end
