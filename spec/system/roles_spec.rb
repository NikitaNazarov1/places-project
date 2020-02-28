# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Roles behaviour', type: :system, js: true do
  let(:user) { create(:user) }
  let(:admin_params) do
    {
      first_name: 'Main',
      last_name: 'Admin',
      email: 'main.admin@example.com',
      password: 'adm1n999',
      admin: true
    }
  end
  let(:admin) do
    User.create(admin_params)
  end

  it 'admin can not delete himself' do
    sign_in(admin)
    click_link 'Find someone'
    expect(page).not_to have_text 'Main Admin |'
  end

  it 'admin can delete users' do
    sign_in(user)
    click_link 'Sign out'
    page.driver.browser.switch_to.alert.accept
    sign_in(admin)
    click_link 'Find someone'
    first('#user_deletion_link').click
    page.driver.browser.switch_to.alert.accept
    expect(page).to have_selector('#user_deletion_link', maximum: 1)
  end

  it 'user can not delete others' do
    sign_in(admin)
    click_link 'Sign out'
    page.driver.browser.switch_to.alert.accept
    sign_in(user)
    click_link 'Find someone'
    expect(page).not_to have_text 'delete'
  end

  it 'admin can delete user\'s places' do
    sign_in(user)
    find(id: 'map').click(x: 100, y: 100)
    fill_in 'Title', with: 'Test title'
    fill_in 'Description', with: 'Test description'
    click_button 'Create'
    click_link 'Sign out'
    page.driver.browser.switch_to.alert.accept
    sign_in(admin)
    click_link 'Find someone'
    click_link 'John Doe'
    click_button 'Follow'
    find('area[title="Test title"]', visible: false).click
    click_button 'Delete'
    page.driver.browser.switch_to.alert.accept
    expect(page).not_to have_text 'Test title'
  end

  it 'user can not delete others\' places' do
    sign_in(admin)
    find(id: 'map').click(x: 100, y: 100)
    fill_in 'Title', with: 'Test title'
    fill_in 'Description', with: 'Test description'
    click_button 'Create'
    click_link 'Sign out'
    page.driver.browser.switch_to.alert.accept
    sign_in(user)
    click_link 'Find someone'
    click_link 'Main Admin'
    click_button 'Follow'
    find('area[title="Test title"]', visible: false).click
    expect(page).not_to have_text 'Delete'
  end
end
