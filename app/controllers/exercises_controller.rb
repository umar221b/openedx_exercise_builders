class ExercisesController < ApplicationController
  def index; end

  def blanks; end
  def dropdowns; end
  def vocabulary; end
  def vocabulary_table; end

  def create
    puts params
    render json: { response: :hi }
  end
end
