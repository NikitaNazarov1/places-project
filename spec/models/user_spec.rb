# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { create(:user) }

  describe '#first_name' do
    it { is_expected.to validate_presence_of(:first_name) }
    it { is_expected.to validate_length_of(:first_name).is_at_most(50) }
  end

  describe '#last_name' do
    it { is_expected.to validate_presence_of(:last_name) }
    it { is_expected.to validate_length_of(:last_name).is_at_most(50) }
  end

  describe '#email' do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_length_of(:email).is_at_most(250) }
    it { is_expected.to allow_value('example@yandex.ru').for(:email) }
  end

  describe '#password' do
    it { is_expected.to have_secure_password }
    it { is_expected.to validate_presence_of(:password) }
    it { is_expected.to validate_length_of(:password).is_at_least(6) }
  end
end
