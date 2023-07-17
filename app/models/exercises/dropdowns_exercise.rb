module Exercises
  class DropdownsExercise < Exercise

    validate :placeholders_equal_to_inputs
    validate :dropdowns_have_exactly_one_correct_answer
    validate :inputs_cannot_be_blank

    def prepare_openedx_code!
      code = "<problem>"
      code += css
      code += "<div class=\"custom-paragraph-dropdowns\">"
      substitutions_code = {}
      @substitutions.each do |placeholder, options|
        number = placeholder.split('-')[1]
        options_code = ''
        options.each do |option|
          options_code += "<option correct=\"#{option[:correct]}\">#{option[:option]}</option>"
        end
        substitutions_code["[[#{number}]]"] = "<optionresponse><optioninput>#{options_code}</optioninput></optionresponse>"
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
    def placeholders_equal_to_inputs
      matches = @text.scan(/\[\[\d+\]\]/)
      return if matches.size == @substitutions.size

      errors.add(:base, 'Number of placeholders in text (e.g., [[0]], [[1]], etc) must be equal to the number of dropdowns')
    end

    def dropdowns_have_exactly_one_correct_answer
      @substitutions.each do |_dropdownId, options|
        sum_correct = 0
        options.each do |option|
          if option[:correct]
            sum_correct += 1
          end
        end

        if sum_correct != 1
          errors.add(:base, 'Each dropdown must have exactly 1 correct answer')
        end
      end
    end

    def inputs_cannot_be_blank
      has_blank_input = false
      @substitutions.each do |_dropdownId, options|
        has_blank_input = options.any? { |option| option[:option].blank? }
      end

      return unless has_blank_input

      errors.add(:base, 'All options must be filled')
    end

    # overrides
    def allowed_html_tags
      super + %w[optionresponse optioninput option]
    end

    def allowed_html_attributes
      super + %w[correct]
    end

    # helpers
    def css
      "
      <style>
        .custom-paragraph-dropdowns {
          text-align: #{@direction == 'rtl' ? 'right' : 'left'};
          direction: #{@direction};
        }
        .custom-paragraph-dropdowns .wrapper-problem-response {
          display: inline;
        }
        .custom-paragraph-dropdowns .inputtype.option-input {
          display: inline;
        }
        .custom-paragraph-dropdowns .wrapper-problem-response .inputtype.option-input .indicator-container {
          margin-left: 0;
        }
        .custom-paragraph-dropdowns .answer {
          margin-left: 16px;
          margin-right: 16px;
        }
        .custom-paragraph-dropdowns .answer:empty {
          margin-left: 0;
          margin-right: 0;
        }
      </style>
      "
    end
  end
end