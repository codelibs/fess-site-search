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

window.addEventListener("load", () => {
    PreviewSettings.reset();
    PreviewSettings.apply();
});

const PreviewSettings = new class {
    constructor() {
        this.applied = {};
        this.design = {};
    }

    reset() {
        var page_path = $('#preview-iframe').contents().find('script#embed').attr('page_path');
        $('#preview-settings').val('<div class="fess-site-search">\n' +
        '    <fess-search-form\n' +
        '        suggest-url="https://search.n2sm.co.jp"\n' +
        '    ></fess-search-form>\n' +
        '    <fess-search-result\n' +
        '        fess-url="https://search.n2sm.co.jp"\n' +
        '        link-target="_blank"\n' +
        '        :page-size="5"\n' +
        '    ></fess-search-result>\n' +
        '</div>');
    }

    _extractAttributes(tagContent) {
        const regex = /([\w-_:]+)=["']([^"']+)["']/g;
        const matches = tagContent.matchAll(regex);
        return Array.from(matches).reduce((acc, match) => {
            const [fullMatch, key, value] = match;
            acc[key] = value;
            return acc;
        }, {});
    }

    _parse(settingsHtmlStr) {
        const formRegex = /<fess-search-form(.*?)<\/fess-search-form>/s;
        const formMatch = settingsHtmlStr.match(formRegex);
        const formAttributes = formMatch ? this._extractAttributes(formMatch[1]) : {};

        const resultRegex = /<fess-search-result(.*?)<\/fess-search-result>/s;
        const resultMatch = settingsHtmlStr.match(resultRegex);
        const resultAttributes = resultMatch ? this._extractAttributes(resultMatch[1]) : {};

        var attribute = {
            form: formAttributes,
            result: resultAttributes
        };
        return attribute;
    }

    validate(settings) {
        var attribute = this._parse(settings);
        if (attribute === null) {
            $('#preview-settings-savebutton').prop('disabled', true);
        } else {
            $('#preview-settings-savebutton').prop('disabled', false);
        }
    }

    apply() {
        this.reload();
    }

    setDesign(attribute) {
        this.design = attribute;
    }

    reload(callback) {
        var settings = this._parse($('#preview-settings').val());
        var design = this.design;
        $('#preview-iframe').on('load', function () {
            if (callback !== undefined) {
                callback();
            }
            var iframeDocument = this.contentDocument || this.contentWindow.document;

            var parentElement = iframeDocument.createElement('div');
            parentElement.className = 'fess-site-search';

            var formElement = iframeDocument.createElement('fess-search-form');
            for (let id in settings['form']) {
                formElement.setAttribute(id, settings['form'][id]);
            }
            parentElement.appendChild(formElement);

            var resultElement = iframeDocument.createElement('fess-search-result');
            for (let id in settings['result']) {
                resultElement.setAttribute(id, settings['result'][id]);
            }
            for (let id in design) {
                resultElement.setAttribute(id, design[id]);
            }
            parentElement.appendChild(resultElement);

            var $iframeContents = $('#preview-iframe').contents();
            $iframeContents.find('#demo-content').empty();
            $iframeContents.find('#demo-content').append(parentElement);

            // DOMContentLoaded event for init fss.
            var event = iframeDocument.createEvent('Event');
            event.initEvent('DOMContentLoaded', true, true);
            iframeDocument.dispatchEvent(event);
        });
        document.getElementById('preview-iframe').contentWindow.location.reload();
    }
}


function appendIframeDesign(id, cssStr) {
    console.log('appendIframeDesign');
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
    constructor(formId, target, prop, choices = {}) {
        this.formId = formId;
        if (target instanceof Array) {
            this.target = '.fess-site-search ' + target.join(', .fess-site-search ');
        } else {
            this.target = `.fess-site-search ${target}`;
        }
        this.prop = prop;
        this.choices = choices;
        this.type = $(`#wizard-form [name=${this.formId}]`).attr('type');
        this.getValue = () => {
            if (this.type == 'checkbox') {
                var value = $(`#wizard-form [name=${this.formId}]`).prop('checked');
                if (value) {
                    return 'checked';
                } else {
                    return 'unchecked';
                }
            } else {
                var disabled = $(`#wizard-form [name=${this.formId}]`).is(':disabled');
                if (disabled) {
                    return '';
                } else {
                    return $(`#wizard-form [name=${this.formId}]`).val();
                }
            }
        }
    }

    formatter(value) {
        if (this.prop == 'border') {
            return `solid ${value}`;
        } else if (this.type == 'checkbox') {
            return this.choices[value];
        }
        return value;
    }

    toCss() {
        const value = this.getValue();
        if (!value || !this.formatter(value)) {
            return '';
        }
        return `${this.target} {${this.prop}: ${this.formatter(value)}}`;
    }
}

class FssConfig {
    constructor(formId, name, choices = {}) {
        this.formId = formId;
        this.name = name;
        this.choices = choices;
        this.type = $(`#wizard-form [name=${this.formId}]`).attr('type');
        this.getValue = () => {
            if (this.type == 'checkbox') {
                var value = $(`#wizard-form [name=${this.formId}]`).prop('checked');
                if (value) {
                    return 'checked';
                } else {
                    return 'unchecked';
                }
            } else {
                return $(`#wizard-form [name=${this.formId}]`).val();
            }
        }
    }

    get value() {
        const value = this.getValue();
        if (!value) {
            return '';
        }
        if (this.type == 'checkbox') {
            return this.choices[value];
        }
        return value.toString();
    }
}

function applyWizardDesign() {
    console.log('applyWizardDesign');
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
        new FssDesign('labelbox-border-color',          ['select.field-labels', 'select.field-labels:focus'], 'border-color'),
        new FssDesign('labelbox-bg-color',               'select.field-labels',                               'background-color'),
        new FssDesign('labeltab-border-color',          '.label-tab',          'border-color'),
        new FssDesign('labeltab-bg-color',              '.label-tab',          'background-color'),
        new FssDesign('labeltab-selected-border-color', '.label-tab-selected', 'border-color'),
        new FssDesign('labeltab-selected-bg-color',     '.label-tab-selected', 'background-color'),
        // Order Box
        new FssDesign('orderbox-border-color',          ['select.sort', 'select.sort:focus'], 'border-color'),
        new FssDesign('orderbox-bg-color',               'select.sort',                       'background-color'),
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
        // Result: Snippet
        new FssDesign('result-snippet-color', '#result .body .description', 'color'),
        // Result: URL
        new FssDesign('result-url-visibility', '#result .site cite', 'display', {checked: 'inline', unchecked: 'none'}),
        new FssDesign('result-url-color',      '#result .site cite', 'color'),
        // Result: Details
        new FssDesign('result-details-color',      '#result .info', 'color')
    ];

    const configs = [
        // Label
        new FssConfig('labelbox-visibility', ':enable-label',     {checked: 'true', unchecked: 'false'}),
        new FssConfig('labeltab-visibility', ':enable-label-tab', {checked: 'true', unchecked: 'false'}),
        // Order Box
        new FssConfig('orderbox-visibility',         ':enable-order',      {checked: 'true', unchecked: 'false'}),
        new FssConfig('orderbox-verbose-visibility', ':enable-all-orders', {checked: 'true', unchecked: 'false'}),
        // Result: Snippet
        new FssConfig('result-thumbnail-visibility', ':enable-thumbnail', {checked: 'true', unchecked: 'false'}),
        // Result: Details
        new FssConfig('result-details-visibility', ':enable-details', {checked: 'true', unchecked: 'false'})
    ];

    let cssStr = '';
    designs.forEach(d => {
        cssStr += d.toCss();
    });

    let attribute = {}
    configs.forEach(c => {
        if (c.value !== '') {
            attribute[c.name] = c.value;
        }
    });

    PreviewSettings.setDesign(attribute);
    PreviewSettings.reload(() => { appendIframeDesign(WIZARD_STYLE_ID, cssStr); });
}

/*
  Preview: Upload
*/
function applyUploadedDesign() {
    resetIframeDesign();
    PreviewSettings.setDesign({});
    PreviewSettings.reload(() => {
        const files = $('#custom-css')[0].files;
        const reader = new FileReader();

        reader.onload = event => {
            const cssStr = event.target.result;
            appendIframeDesign(UPLOADED_STYLE_ID, cssStr);
        };

        for (const f of files) {
            if (f.type === 'text/css') {
                reader.readAsText(f);
            }
        }
    });
}
