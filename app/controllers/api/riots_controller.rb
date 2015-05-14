class Api::RiotsController < ApplicationController

	def index
  		@riots = Riot.all
  		render json: @riots
  	end


  def show
  	@riot = Riot.find(params[:id])
  	render json: @riot
  end

	def search
		riots = Riot.after_year(params[:after_year]).before_year(params[:before_year])
		render json: riots
	end


	def search
		riots = Riot.all

		if params[:after_year]
			riots = riots.after_year(params[:after_year])
		end

		if params[:before_year]
			riots = riots.before_year(params[:before_year])
		end

		if params[:min_injuries]
			riots = riots.min_injuries(params[:min_injuries])
		end

		if params[:max_injuries]
			riots = riots.max_injuries(params[:max_injuries])
		end

		if params[:description_long]
			riots = riots.description_long(params[:description_long])
		end

		if params[:description_short]
			riots = riots.description_short(params[:description_short])
		end

		if params[:city_state]
			riots = riots.city_state(params[:city_state])
		end

		render json: riots
	end

	# def search
	#   riots = Riot.after_year(params[:after_year]).before_year(params[:before_year])
	#   render json: riots
	# end ^^^ this would be an action that goes in the riots controller thats in the api riots controller, then we just have to set up a route for that, use that route in the ajax call. We do the ajax call in welcome.js, we can make another button for it
end
