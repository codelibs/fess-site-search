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
function get_form_value(id) {
    return $(`#wizard-form [name=${id}]`).val();
}

function set_hover_action(target, prop, hover, leave) {
    console.log(target, prop, hover, leave);
    $('#preview-iframe').contents().find(target).hover(
        function(){ // mouse enter
            $(this).css(prop, hover);
        },
        function(){ // mouse leave
            $(this).css(prop, leave);
        }
    );
    console.log($('#preview-iframe').contents().find(target).hover);
}

function apply_hover_style() {
    const target = '.fessWrapper #result li';

    const border = get_form_value('result-border-color');
    const hovered_border = get_form_value('result-border-color-hover');

    if (hovered_border) {
        const hover = `solid 1px ${hovered_border}`;
        const normal = border ? `solid 1px ${border}` : 'none';
        set_hover_action(target, 'border', hover, normal);
    }

    const bg = get_form_value('result-bg-color');
    const hovered_bg = get_form_value('result-bg-color-hover');

    if (hovered_bg) {
        set_hover_action(target, 'background-color', hovered_bg, bg ? bg : '#FFF');
    }
}

function apply_style() {

    const elems = [
        ['font-family', '.fessWrapper', 'font-family', []],
        ['border-color', '.fessWrapper', 'border-color', ['border-style', 'solid']],
        ['bg-color', '.fessWrapper', 'background-color', []],
        ['searchbox-border-color', '.fessWrapper .fessForm', 'border-color', ['border-style', 'solid']],
        ['button-border-color', '.fessWrapper #searchButton', 'border-color', ['border-style', 'solid']],
        ['button-bg-color', '.fessWrapper #searchButton', 'background-color', []],
        ['result-border-color', '.fessWrapper #result li', 'border-color', ['border-style', 'solid']],
        ['result-bg-color', '.fessWrapper #result li', 'background-color', []]
    ];

    elems.forEach(function(e) {
        const val = get_form_value(e[0]);
        if (val) {
            $('#preview-iframe').contents().find(e[1]).css(e[2], val);

            if (e[3]) {
                const opt = e[3];
                $('#preview-iframe').contents().find(e[1]).css(opt[0], opt[1]);
            }

        }
    });

    apply_hover_style();
}
