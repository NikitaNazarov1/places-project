# frozen_string_literal: true

Rails.application.routes.draw do
  root 'static_pages#root'
  get 'signup',  to: 'users#new'
  get 'sessions/new'
  get 'login'   => 'sessions#new'
  post 'login'   => 'sessions#create'
  post 'users/:id' => 'places#create'
  delete 'logout'  => 'sessions#destroy'
  resources :users do
    member do
      get :following, :followers
    end
  end
  resources :relationships, only: [:create, :destroy]
  resources :users
  resources :places
  resources :account_activations, only: [:edit]
  resources :password_resets,     only: [:new, :create, :edit, :update]
end
