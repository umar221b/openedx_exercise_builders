import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

    static targets = [ "textarea", "correctAnswersArea" ]

    addBlank() {
        const textarea = this.textareaTarget
        const text = textarea.value
        const cursorPosition = textarea.selectionStart
        const blanksCount = textarea.getAttribute('data-blanks')
        let blankCode = `[[${blanksCount}]]`
        // if not the first letter and is not preceded by a new line
        if (cursorPosition !== 0 && text.charAt(cursorPosition - 1) !== '\n')
            blankCode = ' ' + blankCode
        // if not the last letter and is not followed by a new line
        if (cursorPosition !== text.length && text.charAt(cursorPosition) !== '\n')
            blankCode = blankCode + ' '
        const prefix = text.substring(0, cursorPosition)
        const suffix = text.substring(cursorPosition)
        const newText = prefix + blankCode + suffix

        // set the text area's content to the newText
        textarea.value = newText
        // set the text area's adjusted cursor position
        textarea.selectionStart = cursorPosition + blankCode.length

        // add blank to correct answers area
        const correctAnswersDiv = this.correctAnswersAreaTarget
        correctAnswersDiv.innerHTML += `<div class="row mb-3"><div class="col-1 pt-1 pb-1"><span>${blankCode}:</span></div><div class="col-11"><input type="text" class="form-control" name="code-${blanksCount}"></div></div>`

        // increment the data-blanks attribute on the textarea
        textarea.setAttribute('data-blanks', parseInt(blanksCount) + 1)
    }
}
