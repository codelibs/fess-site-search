/*
  Prevent Double Submission
*/
function prevent_double_submission() {
    var self = this;
    $(":submit", self).prop("disabled", true);
    setTimeout(function() {
        $(":submit", self).prop("disabled", false);
    }, 10000);
};

$('#wizard-form').submit(prevent_double_submission);
$('#upload-form').submit(prevent_double_submission);


/*
  Preview Modal
*/
class FssDesign {
    constructor(form_id, target, prop, pseudo_class=null, parent_form=null) {
        this.form_id = form_id;
        this.target = `.fessWrapper ${target}`;
        this.prop = prop;
    }

    formatter(value) {
        if (this.prop == 'border') {
            return `solid ${value}`;
        }
        return value;
    }

    to_css() {
        const value = $(`#wizard-form [name=${this.form_id}]`).val();
        if (!value) {
            return '';
        }
        return `${this.target} {${this.prop}: ${this.formatter(value)}}`;
    }
}

function apply_design() {

    const designs = [
        // General
        new FssDesign('font-family',  '', 'font-family'),
        new FssDesign('border-color', '', 'border'),
        new FssDesign('bg-color',     '', 'background-color'),
        // Search Box
        new FssDesign('searchbox-border-color', '.fessForm', 'border'),
        // Search Button
        new FssDesign('button-border-color', '#searchButton', 'border'),
        new FssDesign('button-bg-color',     '#searchButton', 'background-color'),
        // Result: General
        new FssDesign('result-border-color',       '#result li',       'border'),
        new FssDesign('result-bg-color',           '#result li',       'background-color'),
        new FssDesign('result-border-color-hover', '#result li:hover', 'border'),
        new FssDesign('result-bg-color-hover',     '#result li:hover', 'background-color'),
        // Result: Title
        new FssDesign('result-title-color',         '#result .title a:link',    'color'),
        new FssDesign('result-visited-title-color', '#result .title a:visited', 'color'),
        new FssDesign('result-hovered-title-color', '#result .title a:hover',   'color'),
        new FssDesign('result-active-title-color',  '#result .title a:active',  'color')
    ];

    let css_str = '';
    designs.forEach(function(d) {
        css_str += d.to_css();
    });

    $('#preview-iframe').contents().find('head').append(`<style>${css_str}</style>`);

    // Reset custom design when closing modal
    $('#preview-modal').on('hide.bs.modal', function () {
        document.getElementById('preview-iframe').contentWindow.location.reload(true);
    });
}
