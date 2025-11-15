import traceback
from abc import ABCMeta, abstractmethod


class AbstractConfigRule(metaclass=ABCMeta):

    # Abstract Class for Custom CSS and JSON Rule

    @abstractmethod
    def form_name(self):
        return ""

    @abstractmethod
    def gen_rule(self, val):
        return ""

    def filetype(self):
        return "css"

    def isCheckbox(self):
        return False


def add_rule(json, css, form, rule):
    val = form.get(rule.form_name())

    if rule.isCheckbox():
        if not val:
            val = "unchecked"
        else:
            val = "checked"
    elif not val:
        return (json, css)

    fragment = rule.gen_rule(val)

    if rule.filetype() == "json":
        json += ("" if json == "" else ",") + fragment
    else:
        try:
            css.add(fragment)
        except Exception:
            print("Invalid:\n", fragment)
            print(traceback.format_exc())

    return (json, css)


"""
How to add Custom CSS and JSON Rule:

1. Define a class extending 'AbstractConfigRule'
2. Add the class to a list 'config_rules' in 'get_config_rules'
"""


# General Design
class Font(AbstractConfigRule):
    def form_name(self):
        return "font-family"

    def gen_rule(self, font):
        return f'''.fess-site-search {{font-family: {font};}}'''


class BackgroundColor(AbstractConfigRule):
    def form_name(self):
        return "bg-color"

    def gen_rule(self, color):
        return f'''.fess-site-search {{background-color: {color};}}'''


class BorderColor(AbstractConfigRule):
    def form_name(self):
        return "border-color"

    def gen_rule(self, font):
        return f'''.fess-site-search {{border: solid {font};}}'''


# Search Box
class FormBorderColor(AbstractConfigRule):
    def form_name(self):
        return "searchbox-border-color"

    def gen_rule(self, font):
        return f'''.fess-site-search .fessForm .query {{border: solid {font};}}'''


# Search Button
class ButtonTextColor(AbstractConfigRule):
    def form_name(self):
        return "button-text-color"

    def gen_rule(self, color):
        return f'''.fess-site-search .searchButton {{color: {color};}}'''


class ButtonBorderColor(AbstractConfigRule):
    def form_name(self):
        return "button-border-color"

    def gen_rule(self, color):
        return f'''.fess-site-search .searchButton {{border: solid {color};}}'''


class ButtonBackgroundColor(AbstractConfigRule):

    def form_name(self):
        return "button-bg-color"

    def gen_rule(self, color):
        return f'''.fess-site-search .searchButton {{background-color: {color};}}'''


class ButtonActiveTextColor(AbstractConfigRule):
    def form_name(self):
        return "button-active-text-color"

    def gen_rule(self, color):
        return f'''.fess-site-search .searchButton:active, .fess-site-search .searchButton:hover, .fess-site-search .searchButton:focus {{color: {color};}}'''


class ButtonActiveBorderColor(AbstractConfigRule):
    def form_name(self):
        return "button-active-border-color"

    def gen_rule(self, color):
        return f'''.fess-site-search .searchButton:active, .fess-site-search .searchButton:hover, .fess-site-search .searchButton:focus {{border: solid {color};}}'''


class ButtonActiveBackgroundColor(AbstractConfigRule):

    def form_name(self):
        return "button-active-bg-color"

    def gen_rule(self, color):
        return f'''.fess-site-search .searchButton:active, .fess-site-search .searchButton:hover, .fess-site-search .searchButton:focus {{background-color: {color};}}'''


# Label
class LabelboxVisibility(AbstractConfigRule):
    def form_name(self):
        return "labelbox-visibility"

    def gen_rule(self, visible):
        return ('"enableLabels": true' if visible == "checked" else '"enableLabels": false')

    def filetype(self):
        return "json"

    def isCheckbox(self):
        return True


class LabelboxBorderColor(AbstractConfigRule):
    def form_name(self):
        return "labelbox-border-color"

    def gen_rule(self, color):
        return f'''.fess-site-search select.field-labels, .fess-site-search select.field-labels:focus {{border-color: {color};}}'''


class LabelboxBackgroundColor(AbstractConfigRule):
    def form_name(self):
        return "labelbox-bg-color"

    def gen_rule(self, color):
        return f'''.fess-site-search select.field-labels {{background-color: {color};}}'''


class LabeltabVisibility(AbstractConfigRule):
    def form_name(self):
        return "labeltab-visibility"

    def gen_rule(self, visible):
        return ('"enableLabelTabs": true' if visible == "checked" else '"enableLabelTabs": false')

    def filetype(self):
        return "json"

    def isCheckbox(self):
        return True


class LabeltabBorderColor(AbstractConfigRule):
    def form_name(self):
        return "labeltab-border-color"

    def gen_rule(self, color):
        return f'''.fess-site-search .label-tab {{border-color: {color};}}'''


class LabeltabBackgroundColor(AbstractConfigRule):
    def form_name(self):
        return "labeltab-bg-color"

    def gen_rule(self, color):
        return f'''.fess-site-search .label-tab {{background-color: {color};}}'''


class LabeltabSelectedBorderColor(AbstractConfigRule):
    def form_name(self):
        return "labeltab-selected-border-color"

    def gen_rule(self, color):
        return f'''.fess-site-search .label-tab-selected {{border-color: {color};}}'''


class LabeltabSelectedBackgroundColor(AbstractConfigRule):
    def form_name(self):
        return "labeltab-selected-bg-color"

    def gen_rule(self, color):
        return f'''.fess-site-search .label-tab-selected {{background-color: {color};}}'''


# Order Box
class OrderboxVisibility(AbstractConfigRule):
    def form_name(self):
        return "orderbox-visibility"

    def gen_rule(self, visible):
        return ('"enableOrder": true' if visible == "checked" else '"enableOrder": false')

    def filetype(self):
        return "json"

    def isCheckbox(self):
        return True


class OrderboxVerboseVisibility(AbstractConfigRule):
    def form_name(self):
        return "orderbox-verbose-visibility"

    def gen_rule(self, visible):
        return ('"enableAllOrders": true' if visible == "checked" else '"enableAllOrders": false')

    def filetype(self):
        return "json"

    def isCheckbox(self):
        return True


class OrderboxBorderColor(AbstractConfigRule):
    def form_name(self):
        return "orderbox-border-color"

    def gen_rule(self, color):
        return f'''.fess-site-search select.sort, .fess-site-search select.sort:focus {{border-color: {color};}}'''


class OrderboxBackgroundColor(AbstractConfigRule):
    def form_name(self):
        return "orderbox-bg-color"

    def gen_rule(self, color):
        return f'''.fess-site-search select.sort {{background-color: {color};}}'''


# Result: General
class ResultBorderColor(AbstractConfigRule):
    def form_name(self):
        return "result-border-color"

    def gen_rule(self, color):
        return f'''.fess-site-search  #result li {{border: solid {color};}}'''


class ResultBackgroundColor(AbstractConfigRule):
    def form_name(self):
        return "result-bg-color"

    def gen_rule(self, color):
        return f'''.fess-site-search  #result li {{background-color: {color};}}'''


class ResultBorderColorHover(AbstractConfigRule):
    def form_name(self):
        return "result-border-color-hover"

    def gen_rule(self, color):
        return f'''.fess-site-search  #result li:hover {{border: solid {color};}}'''


class ResultBackgroundColorHover(AbstractConfigRule):
    def form_name(self):
        return "result-bg-color-hover"

    def gen_rule(self, color):
        return f'''.fess-site-search  #result li:hover {{background-color: {color};}}'''


# Result: Title
class ResultTitleColor(AbstractConfigRule):
    def form_name(self):
        return "result-title-color"

    def gen_rule(self, color):
        return f'''.fess-site-search #result .title a:link {{color: {color};}}'''


class ResultVisitedTitleColor(AbstractConfigRule):
    def form_name(self):
        return "result-visited-title-color"

    def gen_rule(self, color):
        return f'''.fess-site-search #result .title a:visited {{color: {color};}}'''


class ResultHoveredTitleColor(AbstractConfigRule):
    def form_name(self):
        return "result-hovered-title-color"

    def gen_rule(self, color):
        return f'''.fess-site-search #result .title a:hover {{color: {color};}}'''


class ResultActiveTitleColor(AbstractConfigRule):
    def form_name(self):
        return "result-active-title-color"

    def gen_rule(self, color):
        return f'''.fess-site-search #result .title a:active {{color: {color};}}'''


# Result: Snippet
class ResultThumbnailVisibility(AbstractConfigRule):
    def form_name(self):
        return "result-thumbnail-visibility"

    def gen_rule(self, visible):
        return ('"enableThumbnail": true' if visible == "checked" else '"enableThumbnail": false')

    def filetype(self):
        return "json"

    def isCheckbox(self):
        return True


class ResultSnippetColor(AbstractConfigRule):
    def form_name(self):
        return "result-snippet-color"

    def gen_rule(self, color):
        return f'''.fess-site-search #result .body .description {{color: {color};}}'''


# Result: URL
class ResultUrlVisibility(AbstractConfigRule):
    def form_name(self):
        return "result-url-visibility"

    def gen_rule(self, visible):
        return ""'.fess-site-search #result .site cite {{display: {};}}'''.format("inline" if visible == "checked" else "none")

    def isCheckbox(self):
        return True


class ResultUrlColor(AbstractConfigRule):
    def form_name(self):
        return "result-url-color"

    def gen_rule(self, color):
        return f'''.fess-site-search #result .site cite {{color: {color};}}'''


# Result: Details
class ResultDetailsVisibility(AbstractConfigRule):
    def form_name(self):
        return "result-details-visibility"

    def gen_rule(self, visible):
        return ('"enableDetails": true' if visible == "checked" else '"enableDetails": false')

    def filetype(self):
        return "json"

    def isCheckbox(self):
        return True


class ResultDetailsColor(AbstractConfigRule):
    def form_name(self):
        return "result-details-color"

    def gen_rule(self, color):
        return f'''.fess-site-search #result .info {{color: {color};}}'''


def get_config_rules():
    config_rules = [
        Font(), BackgroundColor(), BorderColor(),
        FormBorderColor(),
        ButtonTextColor(), ButtonBorderColor(), ButtonBackgroundColor(),
        ButtonActiveTextColor(), ButtonActiveBorderColor(), ButtonActiveBackgroundColor(),
        LabelboxVisibility(), LabelboxBorderColor(), LabelboxBackgroundColor(),
        LabeltabVisibility(), LabeltabBorderColor(), LabeltabBackgroundColor(), LabeltabSelectedBorderColor(), LabeltabSelectedBackgroundColor(),
        OrderboxVisibility(), OrderboxVerboseVisibility(),
        OrderboxBorderColor(), OrderboxBackgroundColor(),
        ResultBorderColor(), ResultBackgroundColor(), ResultBorderColorHover(), ResultBackgroundColorHover(),
        ResultTitleColor(), ResultVisitedTitleColor(), ResultHoveredTitleColor(), ResultActiveTitleColor(),
        ResultThumbnailVisibility(), ResultSnippetColor(),
        ResultUrlVisibility(), ResultUrlColor(),
        ResultDetailsVisibility(), ResultDetailsColor()
    ]
    return config_rules
