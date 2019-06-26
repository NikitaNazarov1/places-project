# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Things user sees on the root page', type: :system do
  before { visit '/' }

  it '\'Menu\' navbar' do
    expect(page).to have_selector('nav', text: 'Menu')
  end

  it '\'Sign Up/In\' links in the navbar' do
    expect(page).to have_selector('nav', text: 'Sign Up') &&
                    have_selector('nav', text: 'Sign In')
  end

  it 'beautiful Bootstrap layout' do
    expect(page).to have_selector('body', class: 'd-flex') &&
                    have_selector('div', class: 'container').at_least(1)
  end

  it 'general project desription' do
    expect(page).to have_title('Places') &&
                    have_text('mark') &&
                    have_text('share')
  end
end
