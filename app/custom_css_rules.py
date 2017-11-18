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


class FontRule(AbstractCSSRule):
    def form_name(self):
        return 'font-family'

    def gen_rule(self, font):
        return '''.fessWrapper {{ font-family: {}; }}'''.format(font)


class BackgroundColorRule(AbstractCSSRule):
    def form_name(self):
        return 'bg-color'

    def gen_rule(self, color):
        return '''.fessWrapper {{background-color: {}; }}'''.format(color)


class ButtonColorRule(AbstractCSSRule):
    def form_name(self):
        return 'button-color'

    def gen_rule(self, color):
        return '''.fessWrapper  #searchButton {{background-color: {};}}'''.format(color)


def get_CSS_rules():
    css_rules = [BackgroundColorRule(), ButtonColorRule(), FontRule()]
    return css_rules
