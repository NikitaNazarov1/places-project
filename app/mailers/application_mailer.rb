# frozen_string_literal: true

# Default mailer
class ApplicationMailer < ActionMailer::Base
  default from: 'noreply@example.com'
  layout 'mailer'
end
