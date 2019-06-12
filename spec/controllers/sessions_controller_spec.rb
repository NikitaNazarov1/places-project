# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SessionsController, type: :controller do
  let(:user) do
    User.create(params)
  end
  let(:params) do
    {

      email: 'johndoe@example.com',
      password: 'password'

    }
  end

  let(:invalid_params) do
    {

      email: nil,
      password: nil

    }
  end

  context 'when log in' do
    describe 'GET#new' do
      before { get :new }

      it { expect(response).to be_successful }
      it { is_expected.to render_template(:new) }
    end

    describe 'POST#create' do
      context 'when valid' do
        before { post :create, params: { session: params } }

        it { expect(response).to be_successful }
      end

      context 'when invalid' do
        before { post :create, params: { session: invalid_params } }

        it { is_expected.to render_template(:new) }
      end
    end
  end

  context 'when log out' do
    describe 'DELETE#destroy' do
      before { delete :destroy }

      it { expect(response).to redirect_to(root_url) }
    end
  end
end
