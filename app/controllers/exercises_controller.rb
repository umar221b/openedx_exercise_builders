class ExercisesController < ApplicationController
  # List exercise types
  def index; end

  # View each exercise's building page
  def blanks; end
  def dropdowns; end
  def vocabulary; end
  def vocabulary_table; end
  def fill_table; end

  # Generate the exercise
  def create
    unless exercise_class
      render json: { error: 'Invalid exercise type' }
      return
    end
    exercise = exercise_class.new(exercise_params)
    all_good = true
    if exercise.valid?
      exercise.prepare_openedx_code!
      all_good = false unless exercise.openedx_code_ready?
    else
      all_good = false
    end
    if all_good
      render json: { response: exercise.openedx_code_html }
    else
      render json: { error: exercise.errors.full_messages.join(', ') }, status: :bad_request
    end
  end

  private

  def exercise_params
    params.require(:exercise).permit(:text, :direction, substitutions: {})
  end

  def exercise_class
    case params[:exercise][:type]
    when 'blanks'
      Exercises::BlanksExercise
    when 'dropdowns'
      Exercises::DropdownsExercise
    when 'vocabulary'
      Exercises::VocabularyExercise
    when 'vocabulary_table'
      Exercises::VocabularyTableExercise
    when 'vocabulary_table'
      Exercises::FillTableExercise
    else
      nil
    end
  end
end
