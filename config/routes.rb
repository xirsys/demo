XirsysRails::Application.routes.draw do
  root :to => 'demos#new'
  
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
