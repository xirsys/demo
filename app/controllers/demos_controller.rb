class DemosController < ApplicationController
  
  def new
  end
  
  def get_ice_servers_test
    if params[:room] && params[:username]
      redirect_to getIceServers_xirsys_path(params)
    end
  end
  
  def get_token_test
    if params[:room] && params[:username]
      redirect_to getToken_xirsys_path(params)
    end
  end
  
  def add_room_test
    if params[:room]
      redirect_to addRoom_xirsys_path(params)
    end
  end
  
  def join_room_test
    @show_form = true;
    
    if params[:room] && params[:username]
      @show_form = false;
      gon.room = params[:room]
      gon.username = params[:username]
    end
  end
  
  def one_to_one_video
    @show_form = true;
    
    if params[:room] && params[:username]
      @show_form = false;
      gon.room = params[:room]
      gon.username = params[:username]
    end
  end
  
  def many_to_many_video
  end
  
end