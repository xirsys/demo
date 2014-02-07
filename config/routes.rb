XirsysRails::Application.routes.draw do
  root :to => 'visitors#new'
  
  resources :xirsys, defaults: {format: :json} do  
    collection do
      get 'getIceServers'
      post 'getIceServers'
      get 'getToken'
      post 'getToken'
      get 'addRoom'
      post 'addRoom'
    end
  end
end
