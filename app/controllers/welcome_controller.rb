class WelcomeController < ApplicationController
  
  def index
  	@riot = Riot.new
  end

  
end
