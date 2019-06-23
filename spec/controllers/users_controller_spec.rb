# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  let(:admin) do
    User.create(admin_params)
  end
  let(:admin_params) do
    {
      first_name: 'admin',
      last_name: 'adminov',
      email: 'admin@gmail.com',
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
      email: 'johndoe@example.com',
      password: 'password',
      password_confirmation: 'password'

    }
  end

  let(:invalid_params) do
    {
      first_name: nil,
      last_name: nil,
      email: nil,
      password: nil,
      password_confirmation: nil
    }
  end

  describe 'GET#new' do
    before { get :new }

    it { expect(response).to be_successful }
    it { is_expected.to render_template(:new) }
  end

  describe 'GET#show' do
    before { get :show, params: { id: user.id } }

    it { expect(response).to be_successful }
    it { is_expected.to render_with_layout('application') }
    it { is_expected.to render_template(:show) }
  end

  describe 'POST#create' do
    context 'with permitting params' do
      it {
        expect(user).to permit(:first_name, :last_name, :email, :password, :password_confirmation)
          .for(:create, params: { user: params })
          .on(:user)
      }
    end

    context 'with valid params' do
      before { post :create, params: { user: params } }

      it { is_expected.to redirect_to assigns(:user) }
    end

    context 'with invalid params' do
      before { post :create, params: { user: invalid_params } }

      it { is_expected.to render_template(:new) }
    end
  end

  describe 'destroy' do
    before { delete :destroy, params: { id: user.id } }

    context 'when delete normal user' do
      it { expect { user.destroy }.to change(User, :count).by(-1) }
    end

    context 'when delete themselves' do
      it { expect { admin.destroy }.not_to change(User, :count) }
    end
  end
end
