# frozen_string_literal: true

require 'rails_helper'
RSpec.describe 'Sign Up page', type: :system do
  before { visit '/signup' }

  let(:user) { create(:user) }
  let(:string) { 'Please check your email to activate your account.' }

  it 'there is \'Sign Up\' title' do
    expect(page).to have_selector('h1', text: 'Sign Up')
  end

  it 'user can sign up' do
    fill_in 'First name', with: user.first_name
    fill_in 'Last name', with: user.last_name
    fill_in 'Email', with: 'email_that_do@not.exists'
    fill_in 'Password', with: user.password
    fill_in 'Password confirmation', with: user.password
    click_button 'Sign Up'
    expect(page).to have_content(string)
  end
end
