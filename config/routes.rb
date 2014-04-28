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
      get  'addApplication'
      post 'addApplication'
      get  'addDomain'
      post 'addDomain'
    end
  end

end