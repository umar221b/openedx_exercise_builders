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
        correctAnswersDiv.innerHTML += `<div id="code-${blanksCount}" class="row mb-3"><div class="col-2 pt-1 pb-1"><span>${blankCode}:</span></div><div class="col-8"><input type="text" class="form-control" name="code-${blanksCount}"></div><div class="col-2"><button class="btn btn-danger" data-action="exercises#removeBlank" data-exercises-row-id-param="code-${blanksCount}">X</button></div></div>`

        // increment the data-blanks attribute on the textarea
        textarea.setAttribute('data-blanks', parseInt(blanksCount) + 1)
    }

    removeBlank(event) {
        const code = event.params['rowId']
        const blankCorrectAnswer = document.getElementById(code)
        blankCorrectAnswer.remove()
        const blankNumber = parseInt(code.substring(5))
        const blankCode = `[[${blankNumber}]]`
        const textarea = this.textareaTarget
        const text = textarea.value
        let prefixEnd = text.indexOf(blankCode)

        // if code has been removed manually just return
        if (prefixEnd === -1)
            return

        let suffixStart = prefixEnd + blankCode.length

        // if code is at the beginning of the text or a line and is at the end of the text or a line (on a separate line)
        if ((prefixEnd === 0 || text.charAt(prefixEnd - 1) === '\n') && (prefixEnd + blankCode.length === text.length || text.charAt(prefixEnd + blankCode.length) === '\n'))
            --prefixEnd
        // if code is not at the beginning of the text and is preceded by a space and is at the end of text or at the end of a line
        else if (prefixEnd !== 0 && text.charAt(prefixEnd - 1) === ' ' && (prefixEnd + blankCode.length === text.length || text.charAt(prefixEnd + blankCode.length) === '\n'))
            --prefixEnd
        // if code is not at the end of the text and is followed by a space and is at the beginning of text or at the beginning of a line
        else if (prefixEnd + blankCode.length !== text.length && text.charAt(prefixEnd + 1) === ' ' && (prefixEnd === 0 || text.charAt(prefixEnd - 1) === '\n'))
            ++suffixStart
        // code is in the middle of a line
        else {
            if (text.charAt(prefixEnd - 1) === ' ')
                --prefixEnd
            else if (text.charAt(prefixEnd + blankCode.length) === ' ')
                ++suffixStart
        }
        let prefix = ''
        let suffix = ''
        if (prefixEnd >= 0)
            prefix = text.substring(0, prefixEnd)
        if (suffixStart < text.length)
            suffix = text.substring(suffixStart)
        const newTest = prefix + suffix
        textarea.value = newTest
    }

}
