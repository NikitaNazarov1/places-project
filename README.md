# README

## Places project status:
  - [![Build Status](https://travis-ci.com/labs-ruby/places-project.svg?branch=master)](https://travis-ci.com/labs-ruby/places-project)

## Necessary steps to get the application up and running:

Ruby version:
  - 2.6.3

Rails version:
  - 5.2.3

System dependencies:
  - are managed by [Bundler](https://bundler.io/) *see Gemfile for details*

Configuration:
  - see `/config` directory

Database initialization:
  - `rake db:setup` *create, load schema and seed*
  - `rake db:migrate`

How to run the test suite:
  - `rake` *will run all RSpec and RuboCop checks*
  - `bundle exec rspec` *only RSpec*

Services:
  - [Google Maps API](https://developers.google.com/maps/documentation/)

Deployment:
  - we use [Heroku](https://heroku.com)
