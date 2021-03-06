# frozen_string_literal: true

require 'rails_helper'

RSpec.describe RelationshipsController, type: :controller do
  let(:admin) do
    User.create(admin_params)
  end
  let(:admin_params) do
    {
      first_name: 'Main',
      last_name: 'Admin',
      email: 'admin@example.com',
      password: '1234567',
      password_confirmation: '1234567',
      admin: true
    }
  end
  let(:user) do
    User.create(params)
  end
  let(:params) do
    {

      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: '1234567',
      password_confirmation: '1234567'

    }
  end

  describe 'Follow' do
    context 'when one user follow to other user' do
      it { expect { user.follow(admin) }.to change(Relationship, :count).by(1) }
    end
  end

  describe 'Unfollow' do
    before { user.follow(admin) }

    context 'when one user unfollow from other user' do
      it { expect { user.unfollow(admin) }.to change(Relationship, :count).by(-1) }
    end
  end
end
