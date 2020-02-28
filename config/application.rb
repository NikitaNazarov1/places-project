# frozen_string_literal: true

require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module PlacesProject
  # Application default setup
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2
    config.generators do |g|
      g.assets false
      g.helper false
      g.test_framework :rspec, controller_specs: false, view_specs: false
    end
    config.i18n.available_locales = [:en, :ru]
    config.i18n.enforce_available_locales = false
    config.time_zone = "Minsk"
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
    config.action_view.embed_authenticity_token_in_remote_forms = true
  end
end
