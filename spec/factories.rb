# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    first_name { 'Ivan' }
    last_name { 'Ivanov' }
    email { Faker::Internet.email }
    password { '123456' }
    password_confirmation { '123456' }
  end
end
