class User < ApplicationRecord
  # Include devise modules. Others available are:
  # :confirmable, :registerable, :recoverable and :omniauthable
  devise :database_authenticatable, :lockable, :trackable, :rememberable, :validatable, :timeoutable
end
