# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'User interactions with map', type: :system, js: true do
  let(:user) { create(:user) }

  before do
    visit '/'
    click_link 'Sign In'
    fill_in 'Email', with: user.email
    fill_in 'Password', with: user.password
    click_button 'Sign In'
  end

  it 'place creation form pops up after click on the map' do
    find(id: 'map').click(x: 100, y: 100)
    expect(find(id: 'placeCreate')).to have_field('Title') &&
                                       have_field('Description') &&
                                       have_button('Create')
  end

  it 'marker appears on the map after form has been submitted' do
    find(id: 'map').click(x: 100, y: 100)
    fill_in 'Title', with: 'Test title'
    fill_in 'Description', with: 'Test description'
    click_button 'Create'
    expect(page).to have_content 'Test title'
  end

  it 'markers do not stack on multiple clicks' do
    5.times { find(id: 'map').click(x: 100, y: 100) }
    expect(page).to have_selector(id: 'placeCreate', count: 1)
  end

  it 'incomplete form can not be submitted' do
    find(id: 'map').click(x: 100, y: 100)
    fill_in 'Description', with: 'Test description'
    click_button 'Create'
    expect(page).not_to have_selector id: 'placeView'
  end
end
