(function(window, document){
	"use strict";

	function j2eObject() {}
	var j2eObjectArr = [], j2eKeyframeConfig = [];

	var _commonConfig = {
				cssFix: "",
				cssAnimation: false,
				styleSheetsIndex: 0
			},
			transformKey = {
				translate: "px",translate3d: "px",translateX: "px",translateY: "px",translateZ: "px",scale: "",scale3d: "",
				scaleX: "",scaleY: "",scaleZ: "",rotate: "deg",rotate3d: "deg",rotateX: "deg",rotateY: "deg",rotateZ: "deg",
				skew: "deg",skewX: "deg",skewY: "deg",perspective: "px"
			},
			cssUnitValue = {
				backgroundColor : "",borderColor: "",borderLeftColor: "",borderRightColor: "",borderTopColor: "",
				boxShadow: "",columnRule: "",columnRuleColor: "",columns: "",filter: "",flexGrow: "",flexShrink: "",
				fontWeight: "",opacity: "",order: "",outline: "",outlineColor: "",outlineOffset: "",textDecorationColor: "",
				textShadow: "",transformOrigin: ""
			},
			J2E_CONSTANT = {
				STYLESHEET_LOCALNAME: "style",
				START_RULE_KEY_NAME: "0%",
				END_RULE_KEY_NAME: "100%",
				ABSOLUTE_POSITION_TYPE: "absolute",
				RELATIVE_POSITION_TYPE: "relative",
				INCREASE: "+=",
				DECREASE: "-=",
				J2E_ANIMATE_ID_NAME: "j2eAnimateIdNo_",
				J2E_ANIMATE_ID_KEY: "j2eid"
			};


	var
		_j2e = {
			selector: function(e) {

				if(e !== document && e !== window) {
					var renderConfig = {};
					var cloneObject = new j2eObject;

					if(typeof e == "object") {
						renderConfig.targetElement = e;
					} else {
						let c = "";
						if(e !== null) {
							c = e.substr(0, 1);
						};

						if(c === ".") {
							renderConfig.targetElement = document.getElementsByClassName(e.substr(1, e.length))[0];
						}
						else if(c === "#") {
							renderConfig.targetElement = document.getElementById(e.substr(1, e.length));
						}
					}

					//고유 아이디 부여
					if(renderConfig.targetElement.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY) === null) {
						renderConfig.targetElement.setAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY, J2E_CONSTANT.J2E_ANIMATE_ID_NAME + j2eObjectArr.length);
					}

					if(j2eObjectArr[renderConfig.targetElement.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY)] === undefined) {
						cloneObject.renderConfig = renderConfig;
						j2eObjectArr.push(renderConfig.targetElement.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY));
						j2eObjectArr[renderConfig.targetElement.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY)] = renderConfig;
					} else {
						cloneObject.renderConfig = j2eObjectArr[renderConfig.targetElement.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY)];
					}

					return cloneObject;
				} else {
					console.error("document, window 객체는 사용할 수 없습니다.");
					return e;
				}
			},
			addRole: function(s) {
				var j2eCheckKeyframeConfig = {};
				var keyframes = '@' + _commonConfig.cssFix + "keyframes " + s.name + " { ";
				keyframes += _j2eCssUtil.createRole(s.role, j2eCheckKeyframeConfig);
				keyframes += "}";

				if(j2eKeyframeConfig[s.name] === undefined) {
					j2eKeyframeConfig.push(s.name);
					j2eKeyframeConfig[s.name] = j2eCheckKeyframeConfig;
					j2eCheckKeyframeConfig.index = document.styleSheets[_commonConfig.styleSheetsIndex].cssRules.length;
				}
				document.styleSheets[_commonConfig.styleSheetsIndex].insertRule( keyframes, document.styleSheets[_commonConfig.styleSheetsIndex].cssRules.length );

				var stylesheetValue = _j2eCssUtil.getStyleSheet(s.name);
				if(stylesheetValue.keyframes.findRule(J2E_CONSTANT.START_RULE_KEY_NAME) === null) {
					j2eCheckKeyframeConfig.j2ePositionType = J2E_CONSTANT.RELATIVE_POSITION_TYPE;
				} else {
					j2eCheckKeyframeConfig.j2ePositionType = J2E_CONSTANT.ABSOLUTE_POSITION_TYPE;
				}
			}
		};


	var
		_j2eUtil = {
			createFunction: function(n, c) {
				j2eObject.prototype[n] = c;
			},
			init: function() {
				var cssAnimation = false,
						animationstring = 'animation',
						keyframeprefix = '',
						domPrefixes = 'Webkit/Moz/O/ms/Khtml'.split('/'),
						pfx = '';

				if( document.body.style.animationName ) { cssAnimation = true; }

				if( cssAnimation === false ) {
				  for( var i = 0, iLength = domPrefixes.length; i < iLength; i++ ) {
						if( document.body.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
						  pfx = domPrefixes[ i ];
						  animationstring = pfx + 'Animation';
						  keyframeprefix = '-' + pfx.toLowerCase() + '-';
						  cssAnimation = true;
						  break;
						}
				  }
				}

				_commonConfig.cssFix = keyframeprefix;
				_commonConfig.cssAnimation = cssAnimation;

				//style 유무 판단, styleSheets에서 위치 조회
				var styleTagCheck = false;
				for(let i = 0, iLength = document.styleSheets.length; i < iLength; i++) {
					if(document.styleSheets[i].ownerNode.localName === J2E_CONSTANT.STYLESHEET_LOCALNAME) {
						_commonConfig.styleSheetsIndex = i;
						styleTagCheck = true;
						break;
					}
				}

				//X브라우징 되는지 확인 해야됨
				if(!styleTagCheck) {
					var head = document.getElementsByTagName("head")[0];
					if (head) {
						var styleEl = document.createElement("style");
						styleEl.type = "text/css";
						head.appendChild(styleEl);
						styleEl = null;

						for(let i = document.styleSheets.length-1; i >= 0; i--) {
							if(document.styleSheets[i].ownerNode.localName === J2E_CONSTANT.STYLESHEET_LOCALNAME) {
								_commonConfig.styleSheetsIndex = i;
								break;
							}
						}
					}
				}
			}
		};


	var
		_j2eCssUtil = {
			createRole: function(s, j2eCheckKeyframeConfig) {
				var roleText = "";
				var transformRoleText = " transform: ";
				var transformRoleUse = false;
				var increaseAndDecreaseArray = [];
				var newItem = [];

				for(let key in s) {
					transformRoleText = " transform: ";
					transformRoleUse = false;
					let keyText = s[key].share === "from" ? J2E_CONSTANT.START_RULE_KEY_NAME+" " : s[key].share === "to" ? J2E_CONSTANT.END_RULE_KEY_NAME+" " : s[key].share.replace("%", "")+"% ";
					roleText += keyText	+ "{";
					for(let subKey in s[key]) {
						//transform 조합
						if(subKey !== "share") {
							if(transformKey[subKey] !== undefined) {
								transformRoleUse = true;
								let textKey = s[key][subKey].replace(J2E_CONSTANT.INCREASE, "").replace(J2E_CONSTANT.DECREASE, "");
								let unit = isNaN(textKey) === false ? transformKey[subKey] : "";

								transformRoleText += " " + subKey + "(" + textKey + unit + ")";

								//증감 유무 체크
								if(s[key][subKey].indexOf(J2E_CONSTANT.INCREASE) === 0 || s[key][subKey].indexOf(J2E_CONSTANT.DECREASE) === 0) {
									if(increaseAndDecreaseArray[keyText] === undefined) {
										increaseAndDecreaseArray.push(keyText);
									}

									newItem.push(subKey);
									newItem[subKey] = s[key][subKey];
									increaseAndDecreaseArray[keyText] = newItem;
								}
							}
						}
					}

					if(transformRoleUse) {
						roleText += transformRoleText + ";";
					}

					var bodyCheckStyle = document.body.style;
					for(let subKey in s[key]) {
						//css 조합
						if(subKey !== "share") {
							if(bodyCheckStyle[subKey] !== undefined) {
								let unit = "";
								let textKey = s[key][subKey].replace(J2E_CONSTANT.INCREASE, "").replace(J2E_CONSTANT.DECREASE, "");
								if(isNaN(textKey) === false) {
									unit = cssUnitValue[subKey] !== undefined ? cssUnitValue[subKey] : "px";
								}

								//증감 유무 체크
								if(s[key][subKey].indexOf(J2E_CONSTANT.INCREASE) === 0 || s[key][subKey].indexOf(J2E_CONSTANT.DECREASE) === 0) {
									if(increaseAndDecreaseArray[keyText] === undefined) {
										increaseAndDecreaseArray.push(keyText);
									}

									newItem.push(subKey);
									newItem[subKey] = s[key][subKey];
									increaseAndDecreaseArray[keyText] = newItem;
								}

								roleText += " " + _j2eCssUtil.getChangeCssKey(subKey) + ": " + textKey + unit + ";";
							}
						}
					}

					roleText += "} ";
				}

				j2eCheckKeyframeConfig.increaseAndDecrease = increaseAndDecreaseArray;

				return roleText;
			},
			setStartingPositionRule: function(elm, animationName) {
				var stylesheetValue = _j2eCssUtil.getStyleSheet(animationName);

				if(stylesheetValue.keyframes.findRule(J2E_CONSTANT.START_RULE_KEY_NAME) === null) {
					stylesheetValue.keyframes.appendRule(J2E_CONSTANT.START_RULE_KEY_NAME+" {}");
				} else {
					stylesheetValue.keyframes.deleteRule(J2E_CONSTANT.START_RULE_KEY_NAME);
					stylesheetValue.keyframes.appendRule(J2E_CONSTANT.START_RULE_KEY_NAME+" {}");
				}

				//상대위치 타입이면 현제 위치를 시작 위치로 변경 해준다.
				if(j2eKeyframeConfig[animationName].j2ePositionType === J2E_CONSTANT.RELATIVE_POSITION_TYPE) {
					let endRuleStyle = stylesheetValue.keyframes.findRule(J2E_CONSTANT.END_RULE_KEY_NAME).style;
					let startRuleStyle = stylesheetValue.keyframes.findRule(J2E_CONSTANT.START_RULE_KEY_NAME).style;
					if(window.getComputedStyle != undefined) {
						for(let item = 0, itemLenght = endRuleStyle.length; item < itemLenght; item++) {
							startRuleStyle[endRuleStyle[item]] = getComputedStyle(elm, null)[endRuleStyle[item]];
						}
					} else {
						for(let item = 0, itemLenght = endRuleStyle.length; item < itemLenght; item++) {
							//여기로직은 확인 못해봄 TEST요함
							startRuleStyle[endRuleStyle[item]] = elm.currentStyle[endRuleStyle[item]];
						}
					}
				}
			},
			setIncreaseAndDecreasePosition: function(elm, animationName) {
				var stylesheetValue = _j2eCssUtil.getStyleSheet(animationName);

				for(let i = 0, iLength = j2eKeyframeConfig[animationName].increaseAndDecrease.length; i < iLength; i++) {
					let key = j2eKeyframeConfig[animationName].increaseAndDecrease[i];
					let rule = stylesheetValue.keyframes.findRule(j2eKeyframeConfig[animationName].increaseAndDecrease[i]);

					for(let item = 0, itemLenght = rule.style.length; item < itemLenght; item++) {
						let moveValue = j2eKeyframeConfig[animationName].increaseAndDecrease[key][rule.style[item]];

						if(moveValue !== undefined) {
							let styleValue = window.getComputedStyle != undefined ? getComputedStyle(elm, null)[rule.style[item]] : elm.currentStyle[rule.style[item]];

							if(moveValue.indexOf(J2E_CONSTANT.INCREASE) === 0) {
								rule.style[rule.style[item]] = Number(moveValue.replace(J2E_CONSTANT.INCREASE,"")) + Number(styleValue.replace(/[(A-Z)]/gi,"")) + styleValue.replace(/[^(A-Z)]/gi,"");
							} else if (moveValue.indexOf(J2E_CONSTANT.DECREASE) === 0) {
								rule.style[rule.style[item]] = Number(moveValue.replace(J2E_CONSTANT.INCREASE,"")) - Number(styleValue.replace(/[(A-Z)]/gi,"")) + styleValue.replace(/[^(A-Z)]/gi,"");
							}
						}
					}
				}
			},
			getChangeCssKey: function(w) {
				var wordChk = /[A-Z]/;

				if(wordChk.test(w)) {
					for(let i = 0, wordLength = w.length; i < wordLength; i++) {
						if(wordChk.test(w[i])) {
							w = w.replace(w.charAt(i), "-"+w.charAt(i).toLowerCase());
						}
					}
				}
				return w;
			},
			getStyleSheet: function(animationName) {
				var stylesheet = document.styleSheets[_commonConfig.styleSheetsIndex],
						keyframes = stylesheet.cssRules[j2eKeyframeConfig[animationName].index],
						cssRules = keyframes.cssRules;

				return {stylesheet: stylesheet, keyframes: keyframes, cssRules: cssRules}
			},
			startAnimate: function(elm, animationName, animationDuration, that) {

				// elm.style.animation = animationName + " " + animationDuration;
				//
				// //증감 연산일 경우 (TEST: 더 나은 방법이 있는지 고민 해볼것)
				// if(j2eKeyframeConfig[animationName].increaseAndDecrease.length > 0) {
				// 	var newone = elm.cloneNode(true);
				// 	elm.parentNode.replaceChild(newone, elm);
				// 	that.renderConfig.targetElement = newone;
				// }

				elm.style.animation='';
				setTimeout(function () {elm.style.animation = animationName + " " + animationDuration;},10)
			}
		};


		_j2eUtil.createFunction("animate", function(s, t) {
			var funS = typeof(s) === "object" ? s : typeof(t) === "object" ? t : null;
			var funT = typeof(s) === "number" ? s+"s" : typeof(t) === "number" ? t+"s" : null;

			if(funS === null) {
				console.error("animate 설정이 잘 못 되었습니다.");
				return;
			}
			if(funT === null) {
				console.error("시간 설정이 잘 못 되었습니다.");
				return;
			}
			if(funS.name === undefined) {
				console.error("role을 지정하지 않았습니다.");
				return;
			}

			//룰 추가
			if(funS.role !== undefined) {
				_j2e.addRole(funS);
			}

			var animationSyntax = "";
			var animationName = funS.name;
			var animationDuration = funT;

			var elm = this.renderConfig.targetElement;

			// 현재위치 세팅
			if(j2eKeyframeConfig[animationName].j2ePositionType === J2E_CONSTANT.RELATIVE_POSITION_TYPE) {
				_j2eCssUtil.setStartingPositionRule(elm, animationName);
			}

			//위치 증감 세팅
			if(j2eKeyframeConfig[animationName].increaseAndDecrease.length > 0) {
				_j2eCssUtil.setIncreaseAndDecreasePosition(elm, animationName);
			}


			elm.style.animation = '';
			_j2eCssUtil.startAnimate(elm, animationName, animationDuration, this);

			return this;
		});

		_j2eUtil.createFunction("setAnimationDelay", function(t) {

			if(isNaN(t)) {
				console.error("animationDelay 설정 값이 잘 못 되었습니다. 숫자 형식만 가능합니다.");
				return;
			}

			this.renderConfig.targetElement.style.animationDelay = t+"s";

			return this;
		});

		_j2eUtil.createFunction("setAnimationDirection", function(s) {

			if("normal" !== s && "reverse" !== s && "alternate" !== s && "alternate-reverse" !== s) {
				console.error("animationDirection 설정값이  잘 못 되었습니다. (normal, reverse, alternate, alternate-reverse) 형식만 가능합니다.");
				return;
			}

			this.renderConfig.targetElement.style.animationDirection = s;

			return this;
		});

		_j2eUtil.createFunction("setAnimationDuration", function(t) {

			if(isNaN(t)) {
				console.error("animationDuration 설정값이 잘 못 되었습니다. 숫자 형식만 가능합니다.");
				return;
			}

			this.renderConfig.targetElement.style.animationDuration = t+"s";

			return this;
		});

		_j2eUtil.createFunction("setAnimationFillMode", function(s) {

			if("none" !== s && "forwards" !== s && "backwards" !== s && "both" !== s) {
				console.error("animationFillMode 설정값이  잘 못 되었습니다. (none, forwards, backwards, both) 형식만 가능합니다.");
				return;
			}

			this.renderConfig.targetElement.style.animationFillMode = s;

			return this;
		});

		_j2eUtil.createFunction("setAnimationIterationCount", function(s) {

			if(isNaN(s) && s !== "infinite") {
				console.error("animationFillMode 설정값이 잘 못 되었습니다. (숫자, infinite) 형식만 가능합니다.");
				return;
			}
			this.renderConfig.targetElement.style.animationIterationCount = s;

			return this;
		});

		_j2eUtil.createFunction("setAnimationPlayState", function(s) {

			if(s !== "paused" && s !== "running") {
				console.error("animationPlayState 설정값이 잘 못 되었습니다. (paused, running) 형식만 가능합니다.");
				return;
			}
			this.renderConfig.targetElement.style.animationPlayState = s;

			return this;
		});

		_j2eUtil.createFunction("setAnimationTimingFunction", function(s) {

			if(s !== "linear" && s !== "ease" && s !== "ease-in" && s !== "ease-out" && s !== "ease-in-out") {
				console.error("animationTimingFunction 설정값이 잘 못 되었습니다. (linear, ease, ease-in, ease-out, ease-in-out) 형식만 가능합니다.");
				return;
			}
			this.renderConfig.targetElement.style.animationTimingFunction = s;

			return this;
		});


		window.j2e = _j2e.selector;
		window.j2e.addRole = _j2e.addRole;

		_j2eUtil.init();

})(window, document);
