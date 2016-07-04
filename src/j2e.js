(function(window, document){
	"use strict";

	function j2eObject() {}
	var j2eObjectArr = [], j2eKeyframeIndex = [];

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
				RELATIVE_POSITION_TYPE: "relative"
			};


	var
		_j2e = {
			selector: function(e) {

				if(e !== document) {
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

					if(j2eObjectArr[renderConfig.targetElement] !== renderConfig.targetElement || j2eObjectArr[renderConfig.targetElement] === undefined) {
						cloneObject.renderConfig = renderConfig;
						j2eObjectArr.push(renderConfig.targetElement);
						j2eObjectArr[renderConfig.targetElement] = renderConfig;
					} else {
						cloneObject.renderConfig = j2eObjectArr[renderConfig.targetElement];
					}

					return cloneObject;
				} else {
					return e;
				}
			},
			addRole: function(s) {
				var keyframes = '@' + _commonConfig.cssFix + "keyframes " + s.name + " { ";
				keyframes += _j2eCssUtil.createRole(s.role);
				keyframes += "}";

				var j2eKeyframeConfig = {};

				if(j2eKeyframeIndex[s.name] === undefined) {
					j2eKeyframeIndex.push(s.name);
					j2eKeyframeIndex[s.name] = j2eKeyframeConfig;
					j2eKeyframeConfig.index = document.styleSheets[_commonConfig.styleSheetsIndex].cssRules.length;
				}
				document.styleSheets[_commonConfig.styleSheetsIndex].insertRule( keyframes, document.styleSheets[_commonConfig.styleSheetsIndex].cssRules.length );

				var stylesheetValue = _j2eCssUtil.getStyleSheet(s.name);
				if(stylesheetValue.keyframes.findRule(J2E_CONSTANT.START_RULE_KEY_NAME) === null) {
					j2eKeyframeConfig.j2ePositionType = J2E_CONSTANT.RELATIVE_POSITION_TYPE;
				} else {
					j2eKeyframeConfig.j2ePositionType = J2E_CONSTANT.ABSOLUTE_POSITION_TYPE;
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
			createRole: function(s) {
				var roleText = "";
				var transformRoleText = " transform: ";
				var transformRoleUse = false;

				for(let key in s) {
					transformRoleText = " transform: ";
					transformRoleUse = false;
					let keyText = s[key].share === "from" ? J2E_CONSTANT.START_RULE_KEY_NAME+" " : s[key].share === "to" ? J2E_CONSTANT.END_RULE_KEY_NAME+" " : s[key].share.replace("%", "")+"% ";
					roleText += keyText	+ "{";
					for(let subKey in s[key]) {
						//transform 조합
						if(transformKey[subKey] !== undefined) {
							transformRoleUse = true;
							let unit = isNaN(s[key][subKey]) === false ? transformKey[subKey] : "";
							transformRoleText += " " + subKey + "(" + s[key][subKey] + unit + ")";
						}
					}

					if(transformRoleUse) {
						roleText += transformRoleText + ";";
					}

					for(let subKey in s[key]) {
						//css 조합
						if(subKey !== "share") {
							if(document.body.style[subKey] !== undefined) {
								let uuit = "";
								if(isNaN(s[key][subKey]) === false) {
									uuit = cssUnitValue[subKey] !== undefined ? cssUnitValue[subKey] : "px";
								}

								roleText += " " + _j2eCssUtil.getChangeCssKey(subKey) + ": " + s[key][subKey] + uuit + ";";
							}
						}
					}

					roleText += "} ";
				}

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
				if(j2eKeyframeIndex[animationName].j2ePositionType === J2E_CONSTANT.RELATIVE_POSITION_TYPE) {
					let endRuleStyle =  stylesheetValue.keyframes.findRule(J2E_CONSTANT.END_RULE_KEY_NAME).style;
					let startRuleStyle =  stylesheetValue.keyframes.findRule(J2E_CONSTANT.START_RULE_KEY_NAME).style;
					if(window.getComputedStyle != undefined) {
						for(let item = 0, itemLenght = stylesheetValue.keyframes.findRule(J2E_CONSTANT.END_RULE_KEY_NAME).style.length; item < itemLenght; item++) {
							startRuleStyle[endRuleStyle[item]] = getComputedStyle(elm, null)[endRuleStyle[item]];
						}
					} else {
						for(let item = 0, itemLenght = stylesheetValue.keyframes.findRule(J2E_CONSTANT.END_RULE_KEY_NAME).style.length; item < itemLenght; item++) {
							//여기로직은 확인 못해봄 TEST요함
							startRuleStyle[endRuleStyle[item]] = elm.currentStyle[endRuleStyle[item]];
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
						keyframes = stylesheet.cssRules[j2eKeyframeIndex[animationName].index];

				return {stylesheet: stylesheet, keyframes: keyframes}
			},
			startAnimate: function(elm, animationName, animationDuration) {
				elm.style.animation = animationName + " " + animationDuration;
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

			if(j2eKeyframeIndex[animationName].j2ePositionType === J2E_CONSTANT.RELATIVE_POSITION_TYPE) {
				_j2eCssUtil.setStartingPositionRule(elm, animationName);
			}

			elm.style.animation = '';
			_j2eCssUtil.startAnimate(elm, animationName, animationDuration);

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

			if(s !== "running" && s !== "running") {
				console.error("animationPlayState 설정값이 잘 못 되었습니다. (running, running) 형식만 가능합니다.");
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
