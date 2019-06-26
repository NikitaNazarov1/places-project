# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Things user sees on the update page', type: :system do
  let(:user) { create(:user) }

  before do
    sign_in(user)
    visit edit_user_path(user)
  end

  it 'Update from' do
    expect(page).to have_selector('h1', text: 'Edit your profile')
  end

  it 'Update my information' do
    fill_in 'First name', with: 'G3rmaN'
    fill_in 'Password', with: '1234567'
    fill_in 'Password confirmation', with: '1234567'

    click_button 'Save changes'
    expect(page).to have_selector('h1', text: 'G3rmaN')
  end
end
