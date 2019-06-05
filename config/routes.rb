# frozen_string_literal: true

Rails.application.routes.draw do
  get 'sessions/new'
  get  '/signup',  to: 'users#new'
  get    'login'   => 'sessions#new'
  post   'login'   => 'sessions#create'
  delete 'logout'  => 'sessions#destroy'
  
  resources :users
  
  root 'static_pages#root'
end
