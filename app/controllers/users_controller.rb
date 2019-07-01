# frozen_string_literal: true

# class Users controller
class UsersController < ApplicationController
  before_action :logged_in_user, only: %i[index edit update destroy following
                                          followers]

  before_action :correct_user, only: %i[edit update]

  before_action :admin_user, only: :destroy

  def destroy
    User.find(params[:id]).destroy
    redirect_to users_url
  end

  def following
    @title = t('.followees')
    @user  = User.find(params[:id])
    @users = @user.following.paginate(page: params[:page])
    render 'show_follow'
  end

  def followers
    @title = t('.followers')
    @user  = User.find(params[:id])
    @users = @user.followers.paginate(page: params[:page])
    render 'show_follow'
  end

  def index
    @users = User.paginate(page: params[:page])
  end

  def show
    @user = User.find(params[:id])
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      @user.send_activation_email
      flash[:info] = 'Please check your email to activate your account.'
      redirect_to login_path
    else
      render 'new'
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    @user.update(user_params)
    render 'edit'
  end

  private

  def admin_user
    redirect_to(root_url) unless current_user.admin?
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email,
                                 :password, :password_confirmation)
  end

  def logged_in_user
    return if logged_in?

    store_location
    flash[:danger] = t('.please_sign_in')
    redirect_to login_url
  end

  def correct_user
    @user = User.find(params[:id])
    redirect_to(root_url) unless current_user?(@user)
  end
end
