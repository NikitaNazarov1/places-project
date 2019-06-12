# frozen_string_literal: true

require 'rails_helper'
RSpec.describe 'Things user sees on the root page', type: :system do
  before { visit '/login' }

  it 'Log in title' do
    expect(page).to have_selector('h1', text: 'Log in')
  end
  context 'when log in ' do
    before do
      User.create(first_name: 'John',
                  last_name: 'Doe',
                  email: 'johndoe@example.com',
                  password: 'password',
                  password_confirmation: 'password')
    end

    it 'Signs me in' do
      fill_in 'Email', with: 'johndoe@example.com'
      fill_in 'Password', with: 'password'
      click_button 'Log in'
      expect(page).to have_content('Account')
    end
  end
end
