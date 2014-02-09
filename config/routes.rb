XirsysRails::Application.routes.draw do
  root :to => 'demos#new'
  
  resources :xirsys, defaults: {format: :json} do  
    collection do
      get 'getIceServers'
      get 'getToken'
      get 'addRoom'
    end
  end
  
  resources :demos, :path => '/' do  
    collection do
      
      # Tests
      get '/get_token_test' => 'demos#get_token_test'
      get '/get_ice_servers_test' => 'demos#get_ice_servers_test'
      get '/add_room_test' => 'demos#add_room_test'
      
      # Demos
      get '/one_to_one_video' => 'demos#one_to_one_video'
      get '/many_to_many_video' => 'demos#many_to_many_video'
    end
  end

end
