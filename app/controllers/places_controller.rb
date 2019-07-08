# frozen_string_literal: true

# rubocop:disable Metrics/AbcSize
class PlacesController < ApplicationController
  def index
    str = request.referer
    user_id = str.split('/').last
    @user = User.find_by(id: user_id)
    @places = @user.places
    render json: @places
  end

  def show
    @place = Place.find(params[:id])
  end

  def new
    @place = Place.new
  end

  def create
    @place = current_user.places.create(place_params)
  end

  def edit
    @place = Place.find(params[:id])
  end

  def update
    str = request.referer
    user_id = str.split('/').last
    @user = User.find_by(id: user_id)
    return unless current_user == @user

    @place = Place.find(params[:id])
    @place.update(place_params)
  end

  def destroy
    str = request.referer
    user_id = str.split('/').last
    @user = User.find_by(id: user_id)
    if current_user.admin?
      @user.places.destroy(params[:id])
    else
      current_user.places.destroy(params[:id])
    end
  end

  private

  def place_params
    params.permit(:title, :description, :coordinates, :user_id)
  end
end
# rubocop:enable Metrics/AbcSize
