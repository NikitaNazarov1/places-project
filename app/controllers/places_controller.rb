# frozen_string_literal: true

class PlacesController < ApplicationController
  skip_before_action :verify_authenticity_token
  # before_action :signed_in_user
  # before_action :correct_user

  def index
    @places = Place.all
  end

  def show
    @place = Place.find(params[:id])
  end

  def new
    @place = Place.new
  end

  def create
    @place = current_user.places.create(place_params)
    redirect_to current_user
  end

  def edit
    @place = Place.find(params[:id])
  end

  def update
    @place = current_user.places.update(place_params)
    redirect_to current_user
  end

  def destroy
    Place.find(params[:id]).destroy
  end

  private

  def place_params
    params.permit(:title, :description, :coordinates, :user_id)
  end
end
