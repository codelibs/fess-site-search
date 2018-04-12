from abc import ABCMeta, abstractmethod
import traceback


class AbstractCSSRule(metaclass=ABCMeta):

    # Abstract Class for Custom CSS Rule

    @abstractmethod
    def form_name(self):
        return ''

    @abstractmethod
    def gen_rule(self, val):
        return ''


def add_rule(css, form, rule):
    val = form.get(rule.form_name())

    if not val:
        return css

    rule = rule.gen_rule(val)

    try:
        css.add(rule)
    except:
        print('Invalid:\n', rule)
        print(traceback.format_exc())

    return css


"""
How to add Custom CSS Rule:

1. Define a class extending 'AbstractCSSRule'
2. Add the class to a list 'css_rules' in 'get_CSS_rules'
"""


# General
class Font(AbstractCSSRule):
    def form_name(self):
        return 'font-family'

    def gen_rule(self, font):
        return '''.fessWrapper {{ font-family: {}; }}'''.format(font)


class BackgroundColor(AbstractCSSRule):
    def form_name(self):
        return 'bg-color'

    def gen_rule(self, color):
        return '''.fessWrapper {{background-color: {}; }}'''.format(color)


class BorderColor(AbstractCSSRule):
    def form_name(self):
        return 'border-color'

    def gen_rule(self, font):
        return '''.fessWrapper {{ border: solid {}; }}'''.format(font)


# Search Box
class FormBorderColor(AbstractCSSRule):
    def form_name(self):
        return 'searchbox-border-color'

    def gen_rule(self, font):
        return '''.fessWrapper .fessForm, .fessFormOnly {{ border: solid {}; }}'''.format(font)


# Search Button
class ButtonTextColor(AbstractCSSRule):
    def form_name(self):
        return 'button-text-color'

    def gen_rule(self, color):
        return '''.fessWrapper .searchButton {{color: {};}}'''.format(color)


class ButtonBorderColor(AbstractCSSRule):
    def form_name(self):
        return 'button-border-color'

    def gen_rule(self, color):
        return '''.fessWrapper .searchButton {{border: solid {};}}'''.format(color)


class ButtonBackgroundColor(AbstractCSSRule):

    def form_name(self):
        return 'button-bg-color'

    def gen_rule(self, color):
        return '''.fessWrapper .searchButton {{background-color: {};}}'''.format(color)


class ButtonActiveTextColor(AbstractCSSRule):
    def form_name(self):
        return 'button-active-text-color'

    def gen_rule(self, color):
        return '''.fessWrapper .searchButton:active, .fessWrapper .searchButton:hover, .fessWrapper .searchButton:focus {{color: {};}}'''.format(color)


class ButtonActiveBorderColor(AbstractCSSRule):
    def form_name(self):
        return 'button-active-border-color'

    def gen_rule(self, color):
        return '''.fessWrapper .searchButton:active, .fessWrapper .searchButton:hover, .fessWrapper .searchButton:focus {{border: solid {};}}'''.format(color)


class ButtonActiveBackgroundColor(AbstractCSSRule):

    def form_name(self):
        return 'button-active-bg-color'

    def gen_rule(self, color):
        return '''.fessWrapper .searchButton:active, .fessWrapper .searchButton:hover, .fessWrapper .searchButton:focus {{background-color: {};}}'''.format(color)


# Result: Component
class ResultBorderColor(AbstractCSSRule):
    def form_name(self):
        return 'result-border-color'

    def gen_rule(self, color):
        return '''.fessWrapper  #result li {{border: solid {};}}'''.format(color)


class ResultBackgroundColor(AbstractCSSRule):
    def form_name(self):
        return 'result-bg-color'

    def gen_rule(self, color):
        return '''.fessWrapper  #result li {{background-color: {};}}'''.format(color)


class ResultBorderColorHover(AbstractCSSRule):
    def form_name(self):
        return 'result-border-color-hover'

    def gen_rule(self, color):
        return '''.fessWrapper  #result li:hover {{border: solid {};}}'''.format(color)


class ResultBackgroundColorHover(AbstractCSSRule):
    def form_name(self):
        return 'result-bg-color-hover'

    def gen_rule(self, color):
        return '''.fessWrapper  #result li:hover {{background-color: {};}}'''.format(color)


# Result: Title
class ResultTitleColor(AbstractCSSRule):
    def form_name(self):
        return 'result-title-color'

    def gen_rule(self, color):
        return '''.fessWrapper #result .title a:link {{color: {};}}'''.format(color)


class ResultVisitedTitleColor(AbstractCSSRule):
    def form_name(self):
        return 'result-visited-title-color'

    def gen_rule(self, color):
        return '''.fessWrapper #result .title a:visited {{color: {};}}'''.format(color)


class ResultHoveredTitleColor(AbstractCSSRule):
    def form_name(self):
        return 'result-hovered-title-color'

    def gen_rule(self, color):
        return '''.fessWrapper #result .title a:hover {{color: {};}}'''.format(color)


class ResultActiveTitleColor(AbstractCSSRule):
    def form_name(self):
        return 'result-active-title-color'

    def gen_rule(self, color):
        return '''.fessWrapper #result .title a:active {{color: {};}}'''.format(color)


# Result: URL
class ResultUrlColor(AbstractCSSRule):
    def form_name(self):
        return 'result-url-color'

    def gen_rule(self, color):
        return '''.fessWrapper #result .body cite {{color: {};}}'''.format(color)


# Result: URL
class ResultSnippetColor(AbstractCSSRule):
    def form_name(self):
        return 'result-snippet-color'

    def gen_rule(self, color):
        return '''.fessWrapper #result .body .description {{color: {};}}'''.format(color)


def get_CSS_rules():
    css_rules = [
        Font(), BackgroundColor(), BorderColor(),
        FormBorderColor(),
        ButtonTextColor(), ButtonBorderColor(), ButtonBackgroundColor(),
        ButtonActiveTextColor(), ButtonActiveBorderColor(), ButtonActiveBackgroundColor(),
        ResultBorderColor(), ResultBackgroundColor(), ResultBorderColorHover(), ResultBackgroundColorHover(),
        ResultTitleColor(), ResultVisitedTitleColor(), ResultHoveredTitleColor(), ResultActiveTitleColor(),
        ResultUrlColor(),
        ResultSnippetColor()
    ]
    return css_rules
