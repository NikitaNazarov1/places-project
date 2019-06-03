# frozen_string_literal: true

# Default Active Record usage
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
end
