# frozen_string_literal: true

FactoryBot.define do
  factory :relationship do
    follower_id { 1 }
    followed_id { 1 }
  end

  factory :user do
    first_name { 'John' }
    last_name { 'Doe' }
    email { Faker::Internet.email }
    password { '1234567' }
    password_confirmation { '1234567' }
  end
end
