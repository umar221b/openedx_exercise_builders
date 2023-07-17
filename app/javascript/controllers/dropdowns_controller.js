import { Controller } from "@hotwired/stimulus"
import axios from "../lib/axios";

export default class extends Controller {

    static targets = [ "textarea", "optionsArea", "direction", "outputTextarea", "actionsDiv" ]

    addDropdown() {
        const textarea = this.textareaTarget
        const text = textarea.value
        const cursorPosition = textarea.selectionStart
        const dropdownsCount = textarea.getAttribute('data-dropdowns')
        let dropdownCode = `[[${dropdownsCount}]]`
        // if not the first letter and is not preceded by a new line
        if (cursorPosition !== 0 && text.charAt(cursorPosition - 1) !== '\n')
            dropdownCode = ' ' + dropdownCode
        // if not the last letter and is not followed by a new line
        if (cursorPosition !== text.length && text.charAt(cursorPosition) !== '\n')
            dropdownCode = dropdownCode + ' '
        const prefix = text.substring(0, cursorPosition)
        const suffix = text.substring(cursorPosition)
        const newText = prefix + dropdownCode + suffix

        // set the text area's content to the newText
        textarea.value = newText
        // set the text area's adjusted cursor position
        textarea.selectionStart = cursorPosition + dropdownCode.length

        // add dropdown to options area area
        const dropdownHTML = `<div id="code-${dropdownsCount}" class="mb-3 row dropdown-area" data-options="1"><div id="code-${dropdownsCount}-wrapper" class="col-12"><div class="row mb-2"><div class="col-4"><h6 class="dropdown-label">Dropdown ${dropdownCode}</h6></div><div class="col-8"><button class="btn btn-success btn-sm" data-action="dropdowns#addDropdownOption" data-dropdowns-row-id-param="code-${dropdownsCount}">Add Option</button> <button data-action="dropdowns#removeDropdown" data-dropdowns-row-id-param="code-${dropdownsCount}" class="btn btn-danger btn-sm">Remove Dropdown</button></div></div><div class="row mb-2 dropdown-option" id="code-${dropdownsCount}-option-0"><div class="col-6"><input type="text" class="form-control exercise-dropdown" name="code-${dropdownsCount}-option-0"></div><div class="col-4"><div class="form-check form-switch"><label class="form-check-label" for="code-${dropdownsCount}-option-0-correct">correct?</label><input class="form-check-input" type="checkbox" id="code-${dropdownsCount}-option-0-correct"></div></div><div class="col-2"><button class="btn btn-danger" data-action="dropdowns#removeDropdownOption" data-dropdowns-option-id-param="code-${dropdownsCount}-option-0">X</button></div></div></div></div>`
        const optionsDiv = this.optionsAreaTarget
        optionsDiv.insertAdjacentHTML( 'beforeend', dropdownHTML)
        // increment the data-dropdowns attribute on the textarea
        textarea.setAttribute('data-dropdowns', parseInt(dropdownsCount) + 1)
        textarea.focus()
    }

    removeDropdown(event) {
        const code = event.params['rowId']
        const dropdownCorrectAnswer = document.getElementById(code)
        dropdownCorrectAnswer.remove()
        const dropdownNumber = parseInt(code.substring(5))
        const dropdownCode = `[[${dropdownNumber}]]`
        const textarea = this.textareaTarget
        const text = textarea.value
        let prefixEnd = text.indexOf(dropdownCode)

        // if code has been removed manually just return
        if (prefixEnd === -1)
            return

        let suffixStart = prefixEnd + dropdownCode.length

        // if code is at the beginning of the text or a line and is at the end of the text or a line (on a separate line)
        if ((prefixEnd === 0 || text.charAt(prefixEnd - 1) === '\n') && (prefixEnd + dropdownCode.length === text.length || text.charAt(prefixEnd + dropdownCode.length) === '\n'))
            --prefixEnd
        // if code is not at the beginning of the text and is preceded by a space and is at the end of text or at the end of a line
        else if (prefixEnd !== 0 && text.charAt(prefixEnd - 1) === ' ' && (prefixEnd + dropdownCode.length === text.length || text.charAt(prefixEnd + dropdownCode.length) === '\n'))
            --prefixEnd
        // if code is not at the end of the text and is followed by a space and is at the beginning of text or at the beginning of a line
        else if (prefixEnd + dropdownCode.length !== text.length && text.charAt(prefixEnd + 1) === ' ' && (prefixEnd === 0 || text.charAt(prefixEnd - 1) === '\n'))
            ++suffixStart
        // code is in the middle of a line
        else {
            if (text.charAt(prefixEnd - 1) === ' ')
                --prefixEnd
            else if (text.charAt(prefixEnd + dropdownCode.length) === ' ')
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

    addDropdownOption(event) {
        const dropdownCode = event.params['rowId']
        const dropdownArea = document.getElementById(dropdownCode)

        const optionsCount = dropdownArea.getAttribute('data-options')
        dropdownArea.setAttribute('data-options', parseInt(optionsCount) + 1)

        const optionHTML = `<div class="row mb-2 dropdown-option" id="${dropdownCode}-option-${optionsCount}"><div class="col-6"><input type="text" class="form-control exercise-dropdown" name="${dropdownCode}-option-${optionsCount}"></div><div class="col-4"><div class="form-check form-switch"><label class="form-check-label" for="${dropdownCode}-option-${optionsCount}-correct">correct?</label><input class="form-check-input" type="checkbox" id="${dropdownCode}-option-${optionsCount}-correct"></div></div><div class="col-2"><button class="btn btn-danger" data-action="dropdowns#removeDropdownOption" data-dropdowns-option-id-param="${dropdownCode}-option-${optionsCount}">X</button></div></div>`

        const dropdownsWrapper = document.getElementById(`${dropdownCode}-wrapper`)
        dropdownsWrapper.insertAdjacentHTML( 'beforeend', optionHTML)
    }

    removeDropdownOption(event) {
        const optionCode = event.params['optionId']
        console.log(optionCode)
        console.log(event.params)
        const option = document.getElementById(optionCode)
        console.log(option)
        option.remove()
    }

    switchDirection() {
        const textarea = this.textareaTarget
        textarea.dir = textarea.dir === "rtl" ? "ltr" : "rtl"
        setTimeout(function (){
            textarea.focus()
        }, 100);

    }

    submitExercise() {
        const textarea = this.textareaTarget
        const text = textarea.value
        const optionsHash = {}

        document.querySelectorAll('.dropdown-area').forEach(function(dropdownArea) {
            const options = []
            const dropdownId = dropdownArea.id
            document.querySelectorAll(`#${dropdownId} .dropdown-option`).forEach(function (dropdownOption) {
                const input = document.getElementsByName(dropdownOption.id)[0]
                const correctSwitch = document.getElementById(`${dropdownOption.id}-correct`)
                options.push({ option: input.value, correct: correctSwitch.checked })
            });

            optionsHash[dropdownArea.id] = options
        });

        axios.post("/exercises", { exercise: {type: 'dropdowns', text: text, substitutions: optionsHash, direction: textarea.dir}}).then((data) => {
            // remove the error alert if it is shown
            const errorAlert = document.getElementById('extra-flash-alert')
            if (errorAlert)
                errorAlert.remove()

            // set the response to the output text area and display it
            const outputTextarea = this.outputTextareaTarget
            outputTextarea.innerHTML = data.data['response']
            outputTextarea.classList.remove("d-none");

            const copyButton = document.getElementById('copy-button')
            if (!copyButton) {
                const actionsDiv = this.actionsDivTarget
                actionsDiv.innerHTML = "<button id=\"copy-button\" class=\"btn btn-lg btn-warning\" data-action=\"dropdowns#copyGeneratedCode\">Copy</button>" + actionsDiv.innerHTML
            }
        }).catch((error) => {
            // hide the output text area
            const outputTextarea = this.outputTextareaTarget
            outputTextarea.classList.add("d-none");

            // display an error alert
            const extraAlertDiv = document.getElementById('extra-flash-alert')
            if (!extraAlertDiv) {
                const mainContainer = document.getElementById('alerts-container')
                mainContainer.innerHTML += `<div id="extra-flash-alert" class="alert alert-danger" role="alert">${error.response.data['error']}</div>`
            }
            else {
                extraAlertDiv.innerHTML = error.response.data['error']
            }

            const copyButton = document.getElementById('copy-button')
            copyButton.remove()
        });
    }

    copyGeneratedCode() {
        const outputTextarea = this.outputTextareaTarget
        outputTextarea.select();
        outputTextarea.setSelectionRange(0, 99999); // For mobile devices
        navigator.clipboard.writeText(outputTextarea.textContent);
    }
}
