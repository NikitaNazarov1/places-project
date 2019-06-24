# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Things user sees on the update page', type: :system do
  include SessionsHelper

  let(:user) { User.create!(valid_params) }
  let(:valid_params) do
    { first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: 'password',
      password_confirmation: 'password' }
  end

  before do
    log_in_as(user)
    visit edit_user_path(user)
  end

  it 'Update from' do
    expect(page).to have_selector('h1', text: 'Update your profile')
  end
  it 'Update my information' do
    fill_in 'First name', with: 'German'
    fill_in 'Password', with: 'password'
    fill_in 'Confirmation', with: 'password'

    click_button 'Save changes'
    expect(page).to have_selector('h1', text: 'German')
  end
end
