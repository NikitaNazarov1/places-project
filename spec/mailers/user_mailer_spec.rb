# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserMailer, type: :mailer do
  describe 'account_activation' do
    let(:mail) { UserMailer.account_activation(user) }
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

    it 'render the headers' do
      expect(mail.subject).to eq('Account activation')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['places.project.epam@gmail.com'])
    end
  end

  describe 'password_reset' do
    let(:mail) { ActionMailer::Base.deliveries.last }
    let(:new_password) { 'Passw0rd!' }
    let(:user) do
      User.create(params)
    end
    let(:params) do
      {

        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: '1234567',
        password_confirmation: '1234567',
        activated: true
      }
    end

    it 'reset password' do
      visit login_path
      click_on '(forgot password)'
      fill_in 'Email', with: user.email
      expect do
        click_button 'Submit'
      end.to change(ActionMailer::Base.deliveries, :count).by(1)
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['places.project.epam@gmail.com'])
    end
  end
end
