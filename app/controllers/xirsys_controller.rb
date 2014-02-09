require 'net/http'
require 'net/https'
require 'erb'
include ERB::Util

class XirsysController < ApplicationController
  before_filter :store_xirsys_credentials
  skip_before_filter :verify_authenticity_token
  
  def getIceServers
    # Set the POST variables
    uri = URI.parse('https://api.xirsys.com/getIceServers')
    path = '/getIceServers'
    fields_string = ''  
        
    fields = { 'domain'      => url_encode(@xirsys_domain),
               'application' => url_encode(@xirsys_application),
               'room'        => url_encode(params[:room]),
               'username'    => url_encode(params[:username]),
               'ident'       => url_encode(@xirsys_ident),
	             'secret'      => url_encode(@xirsys_secret),
               'secure'      => '1' }

    # URLify the POST data
    fields.each do |key, value|
      fields_string += key + '=' + value + '&'
    end
    fields_string.gsub!(/&$/, "")

    # Open connection
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    # Execute request
    @result = http.post(path, fields_string)

    # Get response
    # puts @result.body

    respond_to do |format|
      format.json { render json: @result.body }
    end
  end
  
  def getToken
  	# Set the POST variables
    uri = URI.parse('https://api.xirsys.com/getToken')

    path = '/getToken'
    fields_string = ''  
    
    fields = { 'domain'      => url_encode(@xirsys_domain),
               'application' => url_encode(@xirsys_application),
               'room'        => url_encode(params[:room]),
               'username'    => url_encode(params[:username]),
	             'ident'       => url_encode(@xirsys_ident),
	             'secret'      => url_encode(@xirsys_secret),
               'secure'      => '1' }
   
    # URLify the POST data
    fields.each do |key, value|
      fields_string += key + '=' + value + '&'
    end
    fields_string.gsub!(/&$/, "")

    # Open connection
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    # Execute request
    @result = http.post(path, fields_string)

    # Get response
    # puts @result.body

    respond_to do |format|
      format.json { render json: @result.body }
    end
  end

  def addRoom
  	# Set the POST variables
    uri = URI.parse('https://api.xirsys.com/addRoom')

    path = '/addRoom'
    fields_string = ''

    fields = { 'domain'      => url_encode(@xirsys_domain),
               'application' => url_encode(@xirsys_application),
               'room'        => url_encode(params[:room]),
	             'ident'       => url_encode(@xirsys_ident),
	             'secret'      => url_encode(@xirsys_secret),
               'secure'      => '1' }

    # URLify the POST data
    fields.each do |key, value|
      fields_string += key + '=' + value + '&'
    end
    fields_string.gsub!(/&$/, "")

    # Open connection
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    # Execute request
    @result = http.post(path, fields_string)

    # Get response
    # puts @result.body
    
    respond_to do |format|
      format.json { render json: @result.body }
    end
  end
  
  private
  def store_xirsys_credentials
    @xirsys_domain = ENV['XIRSYS_DOMAIN']
    @xirsys_application = ENV['XIRSYS_APPLICATION']
    @xirsys_ident = ENV['XIRSYS_IDENT']
    @xirsys_secret = ENV['XIRSYS_SECRET']
  end
end