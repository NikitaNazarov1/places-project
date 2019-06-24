# frozen_string_literal: true

class PlacesController < ApplicationController
  skip_before_action :verify_authenticity_token
  # before_action :signed_in_user, only: [:create, :destroy]
  # before_action :correct_user,   only: :destroy

  def index
    @places = current_user.places
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
    @place = Place.find(params[:id])
    @place.update(place_params)
  end

  def destroy
    current_user.places.destroy(params[:id])
  end

  private

  def place_params
    params.permit(:title, :description, :coordinates, :user_id)
  end
end
