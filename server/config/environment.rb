# -*- encoding : utf-8 -*-
# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Dziura::Application.initialize!

# Do debuggera
SCRIPT_LINES__ = {} if ENV['RAILS_ENV'] == 'development'
