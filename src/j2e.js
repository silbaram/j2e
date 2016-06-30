(function(window, document){
	"use strict";

	function j2eObject() {}
	var j2eObjectArr = [];

	var
		_commonConfig = {
			defaultFps: 60, //기본 설정 프레임
			cssFix: "",
			cssAnimation: false,
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
		}



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
				keyframes += _j2eUtil.createRole(s.role);
				keyframes += "}";

				document.styleSheets[0].insertRule( keyframes, document.styleSheets[0].cssRules.length );
			}
		}


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
				},
				createRole: function(s) {
					var roleText = "";
					var transformRoleText = " transform: ";
					var transformRoleUse = false;

					for(let key in s) {
						transformRoleText = " transform: ";
						transformRoleUse = false;
						let keyText = s[key].share === "from" ? "0% " : s[key].share === "to" ? "100% " : s[key].share+"% ";
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

									roleText += " " + _j2eUtil.getChangeCssKey(subKey) + ": " + s[key][subKey] + uuit + ";";
								}
							}
						}

						roleText += "} ";
					}

					return roleText;
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
				}
			}


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

				this.renderConfig.targetElement.style.animation = animationName + " " + animationDuration;

//현재위치 부터 시작 일부 로직
				// if(window.getComputedStyle != undefined) {
// console.log( "left : " + getComputedStyle(this.renderConfig.targetElement, null)["left"] );
// console.log( "top : " + getComputedStyle(this.renderConfig.targetElement, null)["top"] );
				// } else {
// console.log( this.renderConfig.targetElement.currentStyle );
				// }

// console.log(this.renderConfig.targetElement.animate);
// 				var stylesheet = document.styleSheets[0],
// 				rules = stylesheet.rules,
// 				keyframes = rules[17],
// 				rules = keyframes.cssRules,
// 				keyframe = rules[0];
// console.log(keyframe.style[0]);
// console.log(keyframe);
				// keyframe.style.left = "0px";
				// keyframe.style.top = "100px";

				return this;
			});

			_j2eUtil.createFunction("animationDelay", function(t) {

				if(isNaN(t)) {
					console.error("animationDelay 설정 값이 잘 못 되었습니다. 숫자 형식만 가능합니다.");
					return;
				}

				this.renderConfig.targetElement.style.animationDelay = t+"s";

				return this;
			});

			_j2eUtil.createFunction("animationDirection", function(s) {

				if("normal" !== s && "reverse" !== s && "alternate" !== s && "alternate-reverse" !== s) {
					console.error("animationDirection 설정값이  잘 못 되었습니다. (normal, reverse, alternate, alternate-reverse) 형식만 가능합니다.");
					return;
				}

				this.renderConfig.targetElement.style.animationDirection = s;

				return this;
			});

			_j2eUtil.createFunction("animationDuration", function(t) {

				if(isNaN(t)) {
					console.error("animationDuration 설정값이 잘 못 되었습니다. 숫자 형식만 가능합니다.");
					return;
				}

				this.renderConfig.targetElement.style.animationDuration = t+"s";

				return this;
			});

			_j2eUtil.createFunction("animationFillMode", function(s) {

				if("none" !== s && "forwards" !== s && "backwards" !== s && "both" !== s) {
					console.error("animationFillMode 설정값이  잘 못 되었습니다. (none, forwards, backwards, both) 형식만 가능합니다.");
					return;
				}

				this.renderConfig.targetElement.style.animationFillMode = s;

				return this;
			});

			_j2eUtil.createFunction("animationIterationCount", function(s) {

				if(isNaN(s) && s !== "infinite") {
					console.error("animationFillMode 설정값이 잘 못 되었습니다. (숫자, infinite) 형식만 가능합니다.");
					return;
				}
				this.renderConfig.targetElement.style.animationIterationCount = s;

				return this;
			});


		window.j2e = _j2e.selector;
		window.j2e.addRole = _j2e.addRole;

		_j2eUtil.init();

})(window, document);
