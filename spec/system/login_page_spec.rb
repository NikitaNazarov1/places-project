# frozen_string_literal: true

require 'rails_helper'
RSpec.describe 'Sign In page', type: :system do
  before { visit '/login' }

  it 'there is \'Sign In\' header' do
    expect(page).to have_selector('h1', text: 'Sign In')
  end

  context 'when user is signing in ' do
    let(:user) { create(:user) }

    it 'signs user in' do
      fill_in 'Email', with: user.email
      fill_in 'Password', with: user.password
      click_button 'Sign In'
      expect(page).to have_content('John')
    end
  end
end
