import FessJQuery from 'jquery';

(function($){

FessJQuery.fn.suggestor12 = function(setting) {

	var $boxElement;
	var $textArea;
	var inputText = "";
	var isFocusList = false;
	var listNum = 0;
	var listSelNum = 0;
	var isMouseHover = false;
	var started = false;
	var interval = 5;

	var settingMinTerm = 1;
	var settingAjaxInfo;
	var settingAdjustWidthVal;
	var $settingSearchForm;
	var listSelectedCssInfo;
	var listDeselectedCssInfo;
	var boxCssInfo;

	var suggestingSts = false;

	var suggestor = {
		init: function($element, setting) {
			suggestingSts = false;
			$boxElement = FessJQuery("<div/>");
      $boxElement.addClass("suggestorBox");

			//style sheet
			$boxElement.css("display","none");
			$boxElement.css("position","absolute");
			$boxElement.css("text-align","left");
			$boxElement.css("font-size",$element.css("font-size"));
			if(typeof setting.boxCssInfo === "undefined") {
				$boxElement.css("border","1px solid #cccccc");
				$boxElement.css("-webkit-box-shadow","0 3px 2px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(236, 236, 236, 0.6)");
				$boxElement.css("-moz-box-shadow","0 3px 2px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(236, 236, 236, 0.6)");
				$boxElement.css("box-shadow","0 3px 2px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(236, 236, 236, 0.6)");
				$boxElement.css("background-color","#fff");
			} else {
				$boxElement.css(setting.boxCssInfo);
			}

			$textArea = $element;
			$textArea.attr("autocomplete","off");

			isFocusList = false;
			inputText = $textArea.val();


			//設定
			settingAjaxInfo = setting.ajaxinfo;
			settingMinTerm = setting.minturm;
			$settingSearchForm = setting.searchForm;
			listSelectedCssInfo = setting.listSelectedCssInfo;
			listDeselectedCssInfo = setting.listDeselectedCssInfo;
			settingAdjustWidthVal = setting.adjustWidthVal;

			boxCssInfo = setting.boxCssInfo;


			$boxElement.hover(function() {
				isMouseHover = true;
			}, function() {
				isMouseHover = false;
			});


			//ポジション設定
			this.resize();
			var suggestor = this;
			FessJQuery(window).resize(function() {
				suggestor.resize();
			});

			FessJQuery("body").append($boxElement);

			$settingSearchForm.submit(function(){
				started = false;
				$boxElement.css('display', 'none');
			});
		},

		suggest: function() {
			suggestingSts = true;

			//ポジション設定
			this.resize();

			var suggestor = this;
			inputText = $textArea.val();

			listNum = 0;
			listSelNum = 0;

			if(inputText.length < settingMinTerm) {
				$boxElement.css("display","none");
				suggestingSts = false;
				return;
			}

			FessJQuery.ajax({
				url: settingAjaxInfo.url,
				type:"get",
				dataType: "jsonp",
				cache : false,
				data:{	query: $textArea.val(),
						fields: settingAjaxInfo.fn,
						num: settingAjaxInfo.num * 2,
					    lang: settingAjaxInfo.lang
				},
				traditional: true
			}).done(obj => { suggestor.createAutoCompleteList(obj); }).fail((a,obj,b) => { suggestingSts=false; return; });

		},


		createAutoCompleteList: function(obj) {
			if(started === false || obj.response.status !== 0) {
				suggestingSts = false;
				$boxElement.css("display","none");
				return;
			}

			var hits = obj.response.result.hits;
			var suggestor = this;


			listNum = 0;
			if(typeof hits !== "undefined") {
				var reslist = [];
				for(var i=0;i<hits.length;i++) {
					reslist.push(hits[i].text);
				}
				var $olEle = FessJQuery("<ol/>");
				$olEle.css("list-style","none");
				$olEle.css("padding","0");
				$olEle.css("margin","2px");

				for(var j=0;j<reslist.length && listNum < settingAjaxInfo.num;j++) {
					var str = reslist[j];
					var chkCorrectWord = true;

					var $tmpli = FessJQuery($olEle.children("li"));
					for(var k=0;k<$tmpli.size;k++) {
						if(str === FessJQuery($tmpli[k]).html()) {
							chkCorrectWord = false;
						}
					}

					if(chkCorrectWord) {
						var $liEle = FessJQuery("<li/>");
						$liEle.html(str);
						$liEle.click(function() {
							var str = FessJQuery(this).html();
							suggestor.fixList();
							$textArea.val(str);
							if(typeof $settingSearchForm !== "undefined") {
								$settingSearchForm.submit();
								//$settingSearchForm.trigger("submit");
							}
						});
						$liEle.hover(function() {
							listSelNum = FessJQuery(this).closest("ol").children("li").index(this) + 1;
							FessJQuery(this).closest("ol").children("li").each(function(i){
								if(i === (listSelNum-1)) {
									if(typeof listSelectedCssInfo === 'undefined') {
										FessJQuery(this).css("background-color", "#e5e5e5");
									} else {
										FessJQuery(this).css(listSelectedCssInfo);
									}
								} else {
									if(typeof listDeselectedCssInfo !== 'undefined') {
										FessJQuery(this).css(listDeselectedCssInfo);
									} else {
										if(typeof boxCssInfo === 'undefined' || typeof boxCssInfo["background-color"] === 'undefined') {
											FessJQuery(this).css("background-color", "#ffffff");
										} else {
											FessJQuery(this).css("background-color", boxCssInfo["background-color"]);
										}
									}
								}
							});
						}, function() {
							if( listSelNum === (FessJQuery(this).closest("ol").children("li").index(this) + 1) ) {
								if(typeof listDeselectedCssInfo !== 'undefined') {
									FessJQuery(this).css(listDeselectedCssInfo);
								} else {
									if(typeof boxCssInfo === 'undefined' || typeof boxCssInfo["background-color"] === 'undefined') {
										FessJQuery(this).css("background-color", "#ffffff");
									} else {
										FessJQuery(this).css("background-color", boxCssInfo["background-color"]);
									}
								}
								listSelNum = 0;
							}
						});

						$liEle.css("padding","2px");

						$olEle.append($liEle);
						listNum++;
					}
				}

				if(listNum>0 && $textArea.val().length >= settingMinTerm) {
					$boxElement.html("");
					$boxElement.append($olEle);
					$boxElement.css("display","block");
				} else {
					$boxElement.css("display","none");
				}
			} else {
				$boxElement.css("display","none");
			}
			//ポジション設定
			this.resize();

			suggestingSts = false;
		},

		selectlist: function(direction) {
			if($boxElement.css("display") === "none") {
				return;
			}

			if(direction === "down") {
				listSelNum++;
			} else if(direction === "up") {
				listSelNum--;
			} else {
				return;
			}

			isFocusList = true;

			if(listSelNum < 0){
				listSelNum = listNum;
			} else if(listSelNum > listNum) {
				listSelNum = 0;
			}

			$boxElement.children("ol").children("li").each(function(i){
				if(i === (listSelNum-1)) {
					if(typeof listSelectedCssInfo === 'undefined') {
						FessJQuery(this).css("background-color", "#e5e5e5");
					} else {
						FessJQuery(this).css(listSelectedCssInfo);
					}
					$textArea.val(FessJQuery(this).html());
				} else {
					if(typeof listDeselectedCssInfo !== 'undefined') {
						FessJQuery(this).css(listDeselectedCssInfo);
					} else {
						if(typeof boxCssInfo === 'undefined' || typeof boxCssInfo["background-color"] === 'undefined') {
							FessJQuery(this).css("background-color", "#ffffff");
						} else {
							FessJQuery(this).css("background-color", boxCssInfo["background-color"]);
						}
					}
				}
			});
			if(listSelNum === 0) {
				$textArea.val(inputText);
			}

		},

		fixList: function() {
			if(listSelNum > 0) {
				$textArea.val(FessJQuery($boxElement.children("ol").children("li").get(listSelNum-1)).html());
			}
			inputText = $textArea.val();

			isFocusList = false;
			$boxElement.css("display","none");
			listNum = 0;
		},

		resize: function() {
			$boxElement.css("top",$textArea.offset().top + $textArea.height() + 9);
            $boxElement.css("left",$textArea.offset().left);
			$boxElement.css("height","auto");
			$boxElement.css("width","auto");
			if($boxElement.width() < $textArea.width() + settingAdjustWidthVal) {
				$boxElement.width($textArea.width() + settingAdjustWidthVal);
			}
		}
	};

	suggestor.init(FessJQuery(this), setting);

	FessJQuery(this).keydown(function(e){
		if( ((e.keyCode >= 48) && (e.keyCode <= 90))
			 || ((e.keyCode >= 96) && (e.keyCode <= 105))
			 || ((e.keyCode >= 186) && (e.keyCode <= 226))
			 || e.keyCode === 8
			 || e.keyCode === 32
			 || e.keyCode === 46
			 ) {
			started = true;
			isFocusList = false;
		} else if(e.keyCode === 38) {
			if($boxElement.css("display") !== "none") {
				e.preventDefault();
			}
			suggestor.selectlist("up");
		} else if(e.keyCode === 40) {
			if($boxElement.css("display") === "none") {
				suggestor.suggest();
			} else {
				suggestor.selectlist("down");
			}
		} else if(e.keyCode === 13) {
			if(isFocusList) {
				suggestor.fixList();
			}
		}
	});
	FessJQuery(this).keyup(function(e){
		if( ((e.keyCode >= 48) && (e.keyCode <= 90))
			 || ((e.keyCode >= 96) && (e.keyCode <= 105))
			 || ((e.keyCode >= 186) && (e.keyCode <= 226))
			 || e.keyCode === 8
			 || e.keyCode === 32
			 || e.keyCode === 46
			 ) {
			isFocusList = false;
		} else if(e.keyCode === 38) {
/*			if($boxElement.css("display") !== "none") {
				var strTmp = $textArea.val();
				$textArea.val("");
				$textArea.focus();
				$textArea.val(strTmp);
			} */
		}
	});
	FessJQuery(this).blur(function(){
		if(!isMouseHover) {
			suggestor.fixList();
		}
	});

	//テキストエリア監視
	setInterval(() => {
		if(interval < 5) {
			interval = interval + 1;
		} else {
			if($textArea.val() !== inputText) {
				if(!isFocusList && started && !suggestingSts) {
					//リスト選択中でなければ更新
					suggestor.suggest();
					interval = 0;
				}
			}
		}
	}, 100);

}
})(FessJQuery);
