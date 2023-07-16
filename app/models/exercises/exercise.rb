include ActionView::Helpers::SanitizeHelper

module Exercises
  # abstract class
  class Exercise
    include ActiveModel::Model

    attr_accessor :text, :substitutions, :direction
    attr_reader :openedx_code

    validates :text, presence: true

    def prepare_openedx_code!
      raise 'not implemented'
    end

    def openedx_code_ready?
      raise 'not implemented'
    end

    def openedx_code_html
      sanitize(@openedx_code, tags: allowed_html_tags,  attributes: allowed_html_attributes)
    end

    private

    def allowed_html_tags
      %w[problem style div]
    end

    def allowed_html_attributes
      %w[class]
    end
  end
end