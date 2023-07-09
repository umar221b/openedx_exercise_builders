Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "exercises#index"

  devise_for :users, skip: %i[ registrations unlocks ]

  resources :exercises, only: %i[index create] do
    collection do
      get 'blanks'
      get 'dropdowns'
      get 'vocabulary'
      get 'vocabulary_table'
    end
  end
end
