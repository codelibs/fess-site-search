import os

import pycmarkgfm
from flask import jsonify, make_response, render_template, request

from .app import app
from .backend import js_exists, upload, wizard


@app.route("/")
def home():
    """overview page (English)"""
    return render_markdown("top.html", "overview.en.md", "en")


@app.route("/ja/")
def home_ja():
    """overview page (Japanese)"""
    return render_markdown("top.html", "overview.ja.md", "ja")


@app.route("/docs/manual")
def manual():
    """manual page (English)"""
    return render_markdown("manual.html", "user-manual.en.md", "en")


@app.route("/ja/docs/manual")
def manual_ja():
    """manual page (Japanese)"""
    return render_markdown("manual.html", "user-manual.ja.md", "ja")


@app.route("/generator", methods=["GET", "POST"])
def generator():
    """page for FSS JS Generator"""
    if request.method == "POST":
        if "file" in request.files:
            return upload(request.form, request.files["file"])
        else:
            return wizard(request.form)

    return render_template("generator.html")


@app.route("/demo/<fname>")
def demo(fname):
    """demo page"""
    my_dic = {}
    my_dic["js_path"] = f"/generates/fess-ss-{fname}.min.js"
    my_dic["js_file"] = f"fess-ss-{fname}.min.js"
    my_dic["search_src"] = f"/search/{fname}?fss.query=test"
    print(my_dic["search_src"])
    return render_template("demo.html", message=my_dic)


@app.route("/search/")
def preview():
    """search page used in preview"""
    my_dic = {}
    my_dic["js_path"] = "/static/fss/fess-ss.js"
    my_dic["page_path"] = "/search/"
    return render_template("search.html", message=my_dic)


@app.route("/search/<fname>")
def search(fname):
    """search frame in demo page"""
    my_dic = {}
    my_dic["js_path"] = f"/generates/fess-ss-{fname}.min.js"
    my_dic["page_path"] = f"/search/{fname}"
    return render_template("search.html", message=my_dic)


@app.route("/api/check_js/<fname>", methods=["GET"])
def check_js(fname):
    """API: check if 'fess-ss-<fname>.min.js' exists"""
    result = js_exists(fname)
    return make_response(jsonify({"result": result}))


# Utility
def render_markdown(html_file, md_file, lang):
    """render a markdown document in DOCS_FOLDER"""
    path = os.path.join(app.config["DOCS_FOLDER"], md_file)
    md_file = open(path, encoding="utf-8")
    md_str = md_file.read()
    md_file.close()
    html = pycmarkgfm.gfm_to_html(md_str)
    my_dic = {"language": lang, "markdown_content": html}
    return render_template(html_file, message=my_dic)
