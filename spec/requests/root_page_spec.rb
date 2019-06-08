# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Root page', type: :request do
  before { get '/' }

  it { expect(response).to have_http_status :ok }
  it { expect(response).to render_template(:root) }
end
