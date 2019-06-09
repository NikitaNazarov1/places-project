# frozen_string_literal: true

Rails.application.routes.draw do
  root 'static_pages#root'
  get  '/signup',  to: 'users#new'
  get 'sessions/new'
  get    'login'   => 'sessions#new'
  post   'login'   => 'sessions#create'
  delete 'logout'  => 'sessions#destroy'
  resources :users
end
