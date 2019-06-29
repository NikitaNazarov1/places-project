# frozen_string_literal: true

# class Application controller
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionsHelper
  before_action :set_locale

  def set_locale
    logger.debug "* Accept-Language: #{request.env['HTTP_ACCEPT_LANGUAGE']}"
    I18n.locale = extract_locale_from_accept_language_header
    logger.debug "* Locale set to: #{I18n.locale}"
  end

  private

  def logged_in_user
    return if logged_in?

    store_location
    flash[:danger] = 'Please, sign in.'
    redirect_to login_url
  end

  def extract_locale_from_accept_language_header
    request.env['HTTP_ACCEPT_LANGUAGE'].to_s.scan(/^[a-z]{2}/).first
  end
end
