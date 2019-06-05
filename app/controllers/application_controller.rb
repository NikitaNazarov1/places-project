# frozen_string_literal: true

# class Application controller
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionsHelper
end
