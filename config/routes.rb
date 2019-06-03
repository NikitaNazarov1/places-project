Rails.application.routes.draw do
  root 'static_pages#root'
  get  '/signup',  to: 'users#new'
  resources :users
end
