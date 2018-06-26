/*
  Prevent Double Submissions
*/
function preventDoubleSubmission() {
    var self = this;
    $(':submit', self).prop('disabled', true);
    setTimeout(function() {
        $(':submit', self).prop('disabled', false);
    }, 10000);
}

$('#wizard-form').submit(preventDoubleSubmission);
$('#upload-form').submit(preventDoubleSubmission);

/*
  Preview: Common
*/
const WIZARD_STYLE_ID = 'wizard-style';
const UPLOADED_STYLE_ID = 'uploaded-style';

function appendIframeDesign(id, cssStr) {
    $('#preview-iframe')
        .contents()
        .find('head')
        .append(`<style id="${id}">${cssStr}</style>`);
}

function resetIframeDesign() {
    let content = $('#preview-iframe').contents();
    content.find(`#${WIZARD_STYLE_ID}`).remove();
    content.find(`#${UPLOADED_STYLE_ID}`).remove();
}

/*
  Preview: Wizard
*/
class FssDesign {
    constructor(formId, target, prop) {
        this.formId = formId;
        if(target instanceof Array) {
            this.target = '.fessWrapper ' + target.join(', .fessWrapper ');
        } else {
            this.target = `.fessWrapper ${target}`;
        }
        this.prop = prop;
    }

    formatter(value) {
        if (this.prop == 'border') {
            return `solid ${value}`;
        }
        return value;
    }

    toCss() {
        const value = $(`#wizard-form [name=${this.formId}]`).val();
        if (!value) {
            return '';
        }
        return `${this.target} {${this.prop}: ${this.formatter(value)}}`;
    }
}

function applyWizardDesign() {
    resetIframeDesign();

    const designs = [
        // General
        new FssDesign('font-family',  '', 'font-family'),
        new FssDesign('border-color', '', 'border'),
        new FssDesign('bg-color',     '', 'background-color'),
        // Search Box
        new FssDesign('searchbox-border-color', '.fessForm', 'border'),
        // Search Button
        new FssDesign('button-text-color', '.searchButton', 'color'),
        new FssDesign('button-border-color', '.searchButton', 'border'),
        new FssDesign('button-bg-color',     '.searchButton', 'background-color'),
        new FssDesign('button-active-text-color',
                      ['.searchButton:active', '.searchButton:hover', '.searchButton:focus'], 'color'),
        new FssDesign('button-active-border-color',
                      ['.searchButton:active', '.searchButton:hover', '.searchButton:focus'], 'border'),
        new FssDesign('button-active-bg-color',
                      ['.searchButton:active', '.searchButton:hover', '.searchButton:focus'], 'background-color'),
        // Label
        new FssDesign ('label-border-color', ['.not-selected', '.not-selected:focus'], 'border'),
        new FssDesign ('label-bg-color', '.not-selected', 'background-color'),
        new FssDesign ('label-selected-border-color', ['.selected', '.selected:focus'], 'border'),
        new FssDesign ('label-selected-bg-color', '.selected', 'background-color'),
        // Result: General
        new FssDesign('result-border-color',       '#result li',       'border'),
        new FssDesign('result-bg-color',           '#result li',       'background-color'),
        new FssDesign('result-border-color-hover', '#result li:hover', 'border'),
        new FssDesign('result-bg-color-hover',     '#result li:hover', 'background-color'),
        // Result: Title
        new FssDesign('result-title-color',         '#result .title a:link',    'color'),
        new FssDesign('result-visited-title-color', '#result .title a:visited', 'color'),
        new FssDesign('result-hovered-title-color', '#result .title a:hover',   'color'),
        new FssDesign('result-active-title-color',  '#result .title a:active',  'color'),
        // Result: URL
        new FssDesign('result-url-color', '#result .body cite', 'color'),
        // Result: Snippet
        new FssDesign('result-snippet-color', '#result .body .description', 'color')
    ];

    let cssStr = '';
    designs.forEach(function(d) {
        cssStr += d.toCss();
    });

    appendIframeDesign(WIZARD_STYLE_ID, cssStr);
}

/*
  Preview: Upload
*/
function applyUploadedDesign() {
    resetIframeDesign();

    const files = $('#custom-css')[0].files;
    const reader = new FileReader();

    reader.onload = function(event) {
        const cssStr = event.target.result;
        appendIframeDesign(UPLOADED_STYLE_ID, cssStr);
    };

    for (const f of files) {
        if (f.type === 'text/css') {
            reader.readAsText(f);
        }
    }
}
