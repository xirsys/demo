class DemosController < ApplicationController
  
  def new
  end
  
  def about
  end
  
  def get_ice_servers_test
    params[:demo] = 'get_ice_servers_test'
    
    if params[:room] && params[:username]
      redirect_to getIceServers_xirsys_path(params)
    end
  end
  
  def get_token_test
  end
  
  def add_room_test
  end
  
  def one_to_one_video
  end
  
  def many_to_many_video
  end
  
end