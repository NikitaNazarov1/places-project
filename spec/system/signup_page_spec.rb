# frozen_string_literal: true

require 'rails_helper'
RSpec.describe 'Things user sees on the root page', type: :system do
  before { visit '/signup' }

  it 'Sign up title' do
    expect(page).to have_selector('h1', text: 'Sign up')
  end
  it 'Form for registration' do
    fill_in 'First name', with: 'Ivan'
    fill_in 'Last name', with: 'Ivanov'
    fill_in 'Email', with: 'johndoe@example.com'
    fill_in 'Password', with: 'password'
    fill_in 'Confirmation', with: 'password'
    click_button 'Create my account'
    expect(page).to have_content('Account')
  end
end
