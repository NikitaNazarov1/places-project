# frozen_string_literal: true

class Place < ApplicationRecord
  belongs_to :user

  validates :title, presence: true, length: { maximum: 50 }

  validates :description, presence: true, length: { maximum: 300 }

  validates :coordinates, presence: true
  validates :user_id, presence: true
end
