# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Place, type: :model do
  subject { place }

  let(:user) { create(:user) }

  let(:place) do
    Place.new(title: 'Example title', description: 'Example description',
              coordinates: '90.003130,-180.31840', user_id: user.id)
  end

  describe '#title' do
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_length_of(:title).is_at_most(50) }
  end

  describe '#description' do
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_length_of(:description).is_at_most(300) }
  end

  describe '#coordinates' do
    it { is_expected.to validate_presence_of(:coordinates) }
  end

  describe '#user_id' do
    it { is_expected.to validate_presence_of(:user_id) }
  end
end
