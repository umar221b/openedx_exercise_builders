class ApplicationController < ActionController::Base
  before_action :redirect_unauthenticated_users, if: :should_redirect_unauthenticated_users?

  def redirect_unauthenticated_users
    redirect_to new_user_session_path
  end

  private

  def should_redirect_unauthenticated_users?
    !devise_controller? && !user_signed_in?
  end
end
