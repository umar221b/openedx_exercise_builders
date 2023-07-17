module Exercises
  class BlanksExercise < Exercise

    validate :placeholders_equal_to_inputs
    validate :inputs_cannot_be_blank

    def prepare_openedx_code!
      code = "<problem>"
      code += css
      code += "<div class=\"custom-paragraph-blanks\">"
      substitutions_code = {}
      @substitutions.each do |placeholder, answer|
        number = placeholder.split('-')[1]
        substitutions_code["[[#{number}]]"] = "<stringresponse answer=\"#{answer}\"><textline size=\"20\"/></stringresponse>"
      end

      temp_text = @text.dup
      puts substitutions_code
      re = Regexp.union(substitutions_code.keys)
      puts re
      temp_text.gsub!(re, substitutions_code)

      code += "\n#{temp_text}"
      code += "\n</div>"
      code += "\n</problem>"
      @openedx_code = code
    end

    def openedx_code_ready?
      !@openedx_code.blank?
    end

    private

    # validations
    def inputs_cannot_be_blank
      return unless @substitutions.any? { |_key, value| value.blank? }

      errors.add(:base, 'All correct answers must be filled')
    end

    def placeholders_equal_to_inputs
      matches = @text.scan(/\[\[\d+\]\]/)
      return if matches.size == @substitutions.size

      errors.add(:base, 'Number of placeholders in text (e.g., [[0]], [[1]], etc) must be equal to the number of blanks with correct answers')
    end

    # overrides
    def allowed_html_tags
      super + %w[stringresponse textline]
    end

    def allowed_html_attributes
      super + %w[answer size]
    end

    # helpers
    def css
      "
      <style>
        .custom-paragraph-blanks {
          line-height: 4em;
          text-align: #{@direction == 'rtl' ? 'right' : 'left'};
          direction: #{@direction};
        }
        .custom-paragraph-blanks .wrapper-problem-response {
          display: inline;
        }
        .custom-paragraph-blanks .textline {
          display: inline;
        }
        .custom-paragraph-blanks .unanswered {
          display: inline;
        }
        .custom-paragraph-blanks .correct {
          display: inline;
        }
        .custom-paragraph-blanks .incorrect {
          display: inline;
        }
        .custom-paragraph-blanks .answer {
          margin-left: 16px;
        }
        .custom-paragraph-blanks .answer:empty {
          margin-left: 0;
        }
        .custom-paragraph-blanks .wrapper-problem-response .unanswered .trailing_text {
          margin-right: 0 !important;
        }
      </style>
      "
    end
  end
end