(function(window){
	"use strict";

	function j2eObject() {}
	var j2eObjectArr = [];

	var
		_commonConfig = {
			defaultFps: 60 //기본 설정 프레임
		},
		_constantValue = {
			motionType: "motiontype", //모션 타입
			continuity: "continuity", //모션 명령을 한번에 하나씩 처리 할지 말지 결정 true : 한번에 한 움직임씩, false : 한번에 모든 움직임
			animationIterationCount: "animationIterationCount", //모션 반복 횟수 (숫자가 아닌 infinite문자라면 무한반복)

			infinite: "infinite",     //모션 뮤한 반복
			acceleratedMotion: "A",   //모션 타입 가속운동
			uniformMotion: "U",       //모션 타입 등속운동
			tickerStatusS: "S",       //모션 동작 시작 대기 상태
			tickerStatusI: "I",       //모션 진행중
			tickerStatusE: "E",       //모션 완료

			backgroundColor: "backgroundColor",       //배경 색
			backgroundPosition: "backgroundPosition", //배경 위치
			backgroundSize: "backgroundSize",         //배경 크기
			borderWidth: "borderWidth",             //border 4면 넓이 움직임
			borderTopWidth: "borderTopWidth",       //border 윗쪽면 넓이 움직임
			borderRightWidth: "borderRightWidth",   //border 오른쪽면 넓이 움직임
			borderBottomWidth: "borderBottomWidth", //border 아래쪽면 넓이 움직임
			borderLeftWidth: "borderLeftWidth",     //border 왼쪽면 넓이 움직임
			borderTopColor: "borderTopColor",       //border 윗쪽면 컬러 변경
			borderRightColor: "borderRightColor",   //border 오른쪽면 컬러 변경
			borderBottomColor: "borderBottomColor", //border 아래쪽면 컬러 변경
			borderLeftColor: "borderLeftColor",     //border 왼쪽면 컬러 변경
			borderTopLeftRadius: "borderTopLeftRadius",         //border 왼쪽 위 모서리 변경
			borderTopRightRadius: "borderTopRightRadius",       //border 오른쪽면 컬러 변경
			borderBottomRightRadius: "borderBottomRightRadius", //border 아래쪽면 컬러 변경
			borderBottomLeftRadius: "borderBottomLeftRadius",   //border 왼쪽면 컬러 변경
			left: "left",             //x축 움직임 (왼쪽)
			right: "right",           //x축 움직임 (오른쪽)
			top: "top",               //y축 움직임 (아래쪽)
			bottom: "bottom",         //y축 움직임 (위쪽)
			margin: "margin",         //마진
			width: "width",           //넓이
			height: "height",         //높이
			opacity: "opacity",       //투명도
			perspective: "perspective", //깊이
			transformPerspective : "transformPerspective", //깊이
			scale: "scale",
			scaleX: "scaleX",
			scaleY: "scaleY",
			rotate: "rotate",
			rotateX: "rotateX",
			rotateY: "rotateY",
			rotateZ: "rotateZ",
			boxShadow: "boxShadow", //그림자
			textShadow: "textShadow", //그림자
			color: "color",         //객체 색상
			fontSize: "fontSize",   //클자 크기
			clip: "clip",
			perspectiveOrigin: "perspectiveOrigin",
			transformOrigin: "transformOrigin",
			translate: "translate",
			translateX: "translateX",
			translateY: "translateY",
			translateZ: "translateZ",
			translate3d: "translate3d",
			skew: "skew",
			skewX: "skewX",
			skewY: "skewY",
			timeScale: 1
		},
		_j2e = {
			selector : function(e) {
				var renderConfig = {};
				var cloneObject = new j2eObject;

				if(typeof e == "object") {
					renderConfig.targetElement = e;

					if(j2eObjectArr[renderConfig.targetElement] !== renderConfig.targetElement || j2eObjectArr[renderConfig.targetElement] == undefined) {
						cloneObject.renderConfig = renderConfig;
						j2eObjectArr.push(renderConfig.targetElement);
						j2eObjectArr[renderConfig.targetElement] = renderConfig;
					} else {
						cloneObject.renderConfig = j2eObjectArr[renderConfig.targetElement];
					}
				} else {
					var c = "";
					if(e !== null) {
						c = e.substr(0, 1);
					};

					if(c === ".") {
						if (_j2eUtil.getBrowserKind().b == "msie") {
							renderConfig.targetElement = _j2eUtil.getIeElementsByClassName(e.substr(1, e.length))[0];
						} else {
							renderConfig.targetElement = document.getElementsByClassName(e.substr(1, e.length))[0];
						}
					}
					else if(c === "#") {
						renderConfig.targetElement = document.getElementById(e.substr(1, e.length));
					}

					if(j2eObjectArr[renderConfig.targetElement.id] == undefined && j2eObjectArr[renderConfig.targetElement.className] == undefined) {
						cloneObject.renderConfig = renderConfig;

						if(renderConfig.targetElement.id != "" && renderConfig.targetElement.id != undefined) {
							j2eObjectArr.push(renderConfig.targetElement.id);
							j2eObjectArr[renderConfig.targetElement.id] = renderConfig;
						} else if(renderConfig.targetElement.className != "" && renderConfig.targetElement.className != undefined) {
							j2eObjectArr.push(renderConfig.targetElement.className);
							j2eObjectArr[renderConfig.targetElement.className] = renderConfig;
						}
					} else if(j2eObjectArr[renderConfig.targetElement.id] != undefined) {
						cloneObject.renderConfig = j2eObjectArr[renderConfig.targetElement.id];
					} else if(j2eObjectArr[renderConfig.targetElement.className] != undefined) {
						cloneObject.renderConfig = j2eObjectArr[renderConfig.targetElement.className];
					}
				}

				return cloneObject;
			},
			init : function() {
				if(!Array.indexOf){
					Array.prototype.indexOf = function(obj){
						for(var i=0; i<this.length; i++){
							if(this[i]==obj){
								return i;
							}
						}
						return -1;
					}
				}
			}
		},
		_j2eUtil = {
			getBrowserKind : function() {
				var useBrowserInfo = window.navigator.userAgent;
				useBrowserInfo = useBrowserInfo.toUpperCase();
				var b = "";
				var  v = "";
				if(useBrowserInfo.indexOf("SAFARI/") > -1) {
				  	b = "safari";
				  	var s = useBrowserInfo.indexOf("VERSION/");
				  	var l = useBrowserInfo.indexOf(" ", s);
				  	v = useBrowserInfo.substring(s+8, l);
				 }
			 	if(useBrowserInfo.indexOf("CHROME/") > -1) {
					b = "chrome";
			  		var ver = /[ \/]([\w.]+)/.exec(useBrowserInfo)||[];
			  		v = ver[1];
			 	}
				if(useBrowserInfo.indexOf("FIREFOX/") > -1) {
					b = "firefox";
				  	var ver = /(?:.*? rv:([\w.]+)|)/.exec(useBrowserInfo)||[];
				  	v = ver[1];
				}
				if(useBrowserInfo.indexOf("OPERA/") > -1) {
					b = "opera";
				  	var ver = /(?:.*version|)[ \/]([\w.]+)/.exec(useBrowserInfo)||[];
				  	v = ver[1];
				}
				if((useBrowserInfo.indexOf("MSIE") > -1) || (useBrowserInfo.indexOf(".NET") > -1)) {
				  	b = "msie";
				  	var ver = /(?:.*? rv:([\w.]+))?/.exec(useBrowserInfo)||[];
				  	if(ver[1]) {
				   		v = ver[1];
				  	} else{
				   		var s = useBrowserInfo.indexOf("MSIE");
				   		var l = useBrowserInfo.indexOf(".", s);
				   		v = useBrowserInfo.substring(s+4, l);
				  	}
				}

				//브라우저 종류와 버전을 리턴해준다.
				var binfo = {
					v:"",
					b:""
				};
				binfo.v = v;
				binfo.b = b;
				return binfo;
			},
			getIeElementsByClassName : function(classname) {
    			var a = [];
    			var re = new RegExp('(^| )'+classname+'( |$)');
    			var els = document.body.getElementsByTagName("*");
    			for(var i=0,j=els.length; i<j; i++) {
        			if(re.test(els[i].className)) {
        				a.push(els[i]);
        			}
    			}
    			return a;
			},
			getRequestAnimationFrame : function() {
      	return window.requestAnimationFrame ||
        			 window.webkitRequestAnimationFrame ||
        			 window.mozRequestAnimationFrame ||
        			 window.oRequestAnimationFrame ||
					     null;
			},
			createFunction : function(n, c) {
				j2eObject.prototype[n] = c;
			},
			getTime : Date.now || function() {return new Date * 1;}

		},
		_j2eCssUtil = {
			getStartPosition : function(finishPoint, key, t, that, checkTravelRange) {
				var regex = /[^0-9|^.]/g;
				var regexUnity = /[0-9|.|(^\s*)|(\s*$)|' ']/g;
				var regexS = /[' ']/g;
				var moveOrderInfo = {}; //객체에 모션을 주기 위한 옵션들이 있는 객체
				moveOrderInfo.moveKey = key;
				moveOrderInfo.duration = t; //이동해야할 시간

				//모션 별로 초기값 세팅
				if(_j2eType.getLineOrderYn(key)) {
					var lineStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					moveOrderInfo.s = lineStyle[key] == "auto" ? 0 : parseInt(lineStyle[key].replace("px", ""));
					moveOrderInfo.e = parseInt(finishPoint);
					moveOrderInfo.travelRange = moveOrderInfo.e - moveOrderInfo.s;
					moveOrderInfo.nextMoveRate = 0; //처음 위치

					//이동할 거리 없음
					if(moveOrderInfo.travelRange == 0 && checkTravelRange == true) {
						return false;
					}

				} else if(_j2eType.getMarginOrderYn(key)) { //마진 관련 초기값 세팅
					var marginStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					moveOrderInfo.s = {t : parseInt(marginStyle["margin-top"].replace("px", "")),
														 r : parseInt(marginStyle["margin-right"].replace("px", "")),
														 b : parseInt(marginStyle["margin-bottom"].replace("px", "")),
														 l : parseInt(marginStyle["margin-left"].replace("px", ""))}
					var finishMarginPointTemp = finishPoint.split(",");
					if(finishMarginPointTemp.length == 1) {
						moveOrderInfo.e = {t : parseInt(finishMarginPointTemp[0].replace("px", "")), r : parseInt(finishMarginPointTemp[0].replace("px", "")), b : parseInt(finishMarginPointTemp[0].replace("px", "")), l : parseInt(finishMarginPointTemp[0].replace("px", ""))}
						moveOrderInfo.travelRange = {t : parseInt(finishMarginPointTemp[0].replace("px", ""))-parseInt(marginStyle["margin-top"].replace("px", "")),
																				 r : parseInt(finishMarginPointTemp[0].replace("px", ""))-parseInt(marginStyle["margin-right"].replace("px", "")),
																				 b : parseInt(finishMarginPointTemp[0].replace("px", ""))-parseInt(marginStyle["margin-bottom"].replace("px", "")),
																				 l : parseInt(finishMarginPointTemp[0].replace("px", ""))-parseInt(marginStyle["margin-left"].replace("px", ""))}
					} else if(finishMarginPointTemp.length == 2) {
						moveOrderInfo.e = {t : parseInt(finishMarginPointTemp[0].replace("px", "")), r : parseInt(finishMarginPointTemp[1].replace("px", "")), b : parseInt(finishMarginPointTemp[0].replace("px", "")), l : parseInt(finishMarginPointTemp[1].replace("px", ""))}
						moveOrderInfo.travelRange = {t : parseInt(finishMarginPointTemp[0].replace("px", ""))-parseInt(marginStyle["margin-top"].replace("px", "")),
																				 r : parseInt(finishMarginPointTemp[1].replace("px", ""))-parseInt(marginStyle["margin-right"].replace("px", "")),
																				 b : parseInt(finishMarginPointTemp[0].replace("px", ""))-parseInt(marginStyle["margin-bottom"].replace("px", "")),
																				 l : parseInt(finishMarginPointTemp[1].replace("px", ""))-parseInt(marginStyle["margin-left"].replace("px", ""))}
					} else if(finishMarginPointTemp.length == 3) {
						moveOrderInfo.e = {t : parseInt(finishMarginPointTemp[0].replace("px", "")), r : parseInt(finishMarginPointTemp[1].replace("px", "")), b : parseInt(finishMarginPointTemp[2].replace("px", "")), l : parseInt(finishMarginPointTemp[1].replace("px", ""))}
						moveOrderInfo.travelRange = {t : parseInt(finishMarginPointTemp[0].replace("px", ""))-parseInt(marginStyle["margin-top"].replace("px", "")),
																				 r : parseInt(finishMarginPointTemp[1].replace("px", ""))-parseInt(marginStyle["margin-right"].replace("px", "")),
																				 b : parseInt(finishMarginPointTemp[2].replace("px", ""))-parseInt(marginStyle["margin-bottom"].replace("px", "")),
																				 l : parseInt(finishMarginPointTemp[1].replace("px", ""))-parseInt(marginStyle["margin-left"].replace("px", ""))}
					} else if(finishMarginPointTemp.length == 4) {
						moveOrderInfo.e = {t : parseInt(finishMarginPointTemp[0].replace("px", "")), r : parseInt(finishMarginPointTemp[1].replace("px", "")), b : parseInt(finishMarginPointTemp[2].replace("px", "")), l : parseInt(finishMarginPointTemp[3].replace("px", ""))}
						moveOrderInfo.travelRange = {t : parseInt(finishMarginPointTemp[0].replace("px", ""))-parseInt(marginStyle["margin-top"].replace("px", "")),
																				 r : parseInt(finishMarginPointTemp[1].replace("px", ""))-parseInt(marginStyle["margin-right"].replace("px", "")),
																				 b : parseInt(finishMarginPointTemp[2].replace("px", ""))-parseInt(marginStyle["margin-bottom"].replace("px", "")),
																				 l : parseInt(finishMarginPointTemp[3].replace("px", ""))-parseInt(marginStyle["margin-left"].replace("px", ""))}
					}
					//개별로 진행 상태
					moveOrderInfo.subTickerStatus = {t : moveOrderInfo.travelRange.t == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 r : moveOrderInfo.travelRange.r == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 b : moveOrderInfo.travelRange.b == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 l : moveOrderInfo.travelRange.l == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}
					//다음 이동 위치
					moveOrderInfo.nextMoveRate = {t : 0, r : 0, b : 0, l : 0}

					if(moveOrderInfo.subTickerStatus.t == _constantValue.tickerStatusE && moveOrderInfo.subTickerStatus.r == _constantValue.tickerStatusE &&
					   moveOrderInfo.subTickerStatus.b == _constantValue.tickerStatusE && moveOrderInfo.subTickerStatus.l == _constantValue.tickerStatusE &&
						 checkTravelRange == true) {
							 return false;
				  }

				} else if(_j2eType.getBackgorundOrderYn(key)) {
					var backgorundStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);

					var startBackgorundTmep = backgorundStyle[key].split(" ");

					if(_constantValue.backgroundPosition == key) {
						if(startBackgorundTmep.length == 1) {
							moveOrderInfo.s = {x : startBackgorundTmep[0] == "auto" ? 0 : parseFloat(startBackgorundTmep[0].replace(regex, '')), y : "auto"}
						} else if(startBackgorundTmep.length == 2) {
							moveOrderInfo.s = {x : startBackgorundTmep[0] == "auto" ? 0 : parseFloat(startBackgorundTmep[0].replace(regex, '')), y : startBackgorundTmep[1] == "auto" ? 0 : parseFloat(startBackgorundTmep[1].replace(regex, ''))}
						}
					} else if(_constantValue.backgroundSize == key) {
						var backgroundImage = new Image();

						if(startBackgorundTmep.length == 1) {
							if(startBackgorundTmep[0] == "auto") {
								backgroundImage.src = backgorundStyle["backgroundImage"].replace(/url\((['"])?(.*?)\1\)/gi, '$2');
								moveOrderInfo.s = {x : backgroundImage.width, y : backgroundImage.height}
							} else {
								moveOrderInfo.s = {x : parseFloat(startBackgorundTmep[0].replace(regex, '')), y : "auto"}
							}
						} else if(startBackgorundTmep.length == 2) {
							if(startBackgorundTmep[0] == "auto" && startBackgorundTmep[1] == "auto") {
								backgroundImage.src = backgorundStyle["backgroundImage"].replace(/url\((['"])?(.*?)\1\)/gi, '$2');
								moveOrderInfo.s = {x : backgroundImage.width, y : backgroundImage.height}
							} else if(startBackgorundTmep[0] == "auto" || startBackgorundTmep[1] == "auto") {
								moveOrderInfo.s = {x : startBackgorundTmep[0] == "auto" ? "auto" : parseFloat(startBackgorundTmep[0].replace(regex, '')), y : startBackgorundTmep[1] == "auto" ? "auto" : parseFloat(startBackgorundTmep[1].replace(regex, ''))}
							} else {
								moveOrderInfo.s = {x : parseFloat(startBackgorundTmep[0].replace(regex, '')), y : parseFloat(startBackgorundTmep[1].replace(regex, ''))}
							}
						}
					}

					var finishBgPositionTemp = finishPoint.split(",");
					if(finishBgPositionTemp.length == 1) {
						if(_constantValue.backgroundPosition == key) {
							moveOrderInfo.e = {x : parseFloat(finishBgPositionTemp[0].replace(regex, '')), y : parseFloat(finishBgPositionTemp[0].replace(regex, ''))}
						} else {
							moveOrderInfo.e = {x : parseFloat(finishBgPositionTemp[0].replace(regex, '')), y : "auto"}
						}

					} else if(finishBgPositionTemp.length == 2) {
						moveOrderInfo.e = {x : parseFloat(finishBgPositionTemp[0].replace(regex, '')), y : parseFloat(finishBgPositionTemp[1].replace(regex, ''))}
					}

					if(finishBgPositionTemp.length == 1) {
						if(_constantValue.backgroundPosition == key) {
							moveOrderInfo.u = {x : finishBgPositionTemp[0].replace(regexUnity, '') == "" ? "px" : finishBgPositionTemp[0].replace(regexUnity, ''),
							                   y : finishBgPositionTemp[0].replace(regexUnity, '') == "" ? "px" : finishBgPositionTemp[0].replace(regexUnity, '')}
						} else {
							moveOrderInfo.u = {x : finishBgPositionTemp[0].replace(regexUnity, '') == "" ? "px" : finishBgPositionTemp[0].replace(regexUnity, ''), y : ""}
						}

					} else if(finishBgPositionTemp.length == 2) {
						moveOrderInfo.u = {x : finishBgPositionTemp[0].replace(regexUnity, '') == "" ? "px" : finishBgPositionTemp[0].replace(regexUnity, ''),
						                   y : finishBgPositionTemp[1].replace(regexUnity, '') == "" ? "px" : finishBgPositionTemp[1].replace(regexUnity, '')}
					}

					moveOrderInfo.travelRange = {x : moveOrderInfo.s.x == "auto" || moveOrderInfo.e.x == "auto" ? 0 : moveOrderInfo.e.x-moveOrderInfo.s.x,
																	 		 y : moveOrderInfo.s.y == "auto" || moveOrderInfo.e.y == "auto" ? 0 : moveOrderInfo.e.y-moveOrderInfo.s.y}
					//개별로 진행 상태
					moveOrderInfo.subTickerStatus = {x : moveOrderInfo.travelRange.t == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 y : moveOrderInfo.travelRange.r == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}
          moveOrderInfo.nextMoveRate = {x : moveOrderInfo.s.x == "auto" || moveOrderInfo.e.x == "auto" ? "auto" : 0,
					                              y : moveOrderInfo.s.y == "auto" || moveOrderInfo.e.y == "auto" ? "auto" : 0}

					if(moveOrderInfo.subTickerStatus.x == _constantValue.tickerStatusE && moveOrderInfo.subTickerStatus.y == _constantValue.tickerStatusE &&
 					   checkTravelRange == true) {
 							 return false;
 				  }
				} else if(_j2eType.getBorderOrderYn(key)) {
					var borderStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					if(_constantValue.borderWidth == key) {
						var startBorderPointTemp = borderStyle[key].split("px");
						if(startBorderPointTemp.length == 2) {
							moveOrderInfo.s = {t : parseInt(startBorderPointTemp[0]), r : parseInt(startBorderPointTemp[0]), b : parseInt(startBorderPointTemp[0]), l : parseInt(startBorderPointTemp[0])}
						} else if(startBorderPointTemp.length == 3) {
							moveOrderInfo.s = {t : parseInt(startBorderPointTemp[0]), r : parseInt(startBorderPointTemp[1]), b : parseInt(startBorderPointTemp[0]), l : parseInt(startBorderPointTemp[1])}
						} else if(startBorderPointTemp.length == 4) {
							moveOrderInfo.s = {t : parseInt(startBorderPointTemp[0]), r : parseInt(startBorderPointTemp[1]), b : parseInt(startBorderPointTemp[2]), l : parseInt(startBorderPointTemp[1])}
						} else if(startBorderPointTemp.length == 5) {
							moveOrderInfo.s = {t : parseInt(startBorderPointTemp[0]), r : parseInt(startBorderPointTemp[1]), b : parseInt(startBorderPointTemp[2]), l : parseInt(startBorderPointTemp[3])}
						}

						var finishBorderPointTemp = finishPoint.split(",");
						if(finishBorderPointTemp.length == 1) {
							moveOrderInfo.e = {t : parseInt(finishBorderPointTemp[0]), r : parseInt(finishBorderPointTemp[0]), b : parseInt(finishBorderPointTemp[0]), l : parseInt(finishBorderPointTemp[0])}
						} else if(finishBorderPointTemp.length == 2) {
							moveOrderInfo.e = {t : parseInt(finishBorderPointTemp[0]), r : parseInt(finishBorderPointTemp[1]), b : parseInt(finishBorderPointTemp[0]), l : parseInt(finishBorderPointTemp[1])}
						} else if(finishBorderPointTemp.length == 3) {
							moveOrderInfo.e = {t : parseInt(finishBorderPointTemp[0]), r : parseInt(finishBorderPointTemp[1]), b : parseInt(finishBorderPointTemp[2]), l : parseInt(finishBorderPointTemp[1])}
						} else if(finishBorderPointTemp.length == 4) {
							moveOrderInfo.e = {t : parseInt(finishBorderPointTemp[0]), r : parseInt(finishBorderPointTemp[1]), b : parseInt(finishBorderPointTemp[2]), l : parseInt(finishBorderPointTemp[3])}
						}

						moveOrderInfo.travelRange = {t : moveOrderInfo.e.t-moveOrderInfo.s.t,
																		 		 r : moveOrderInfo.e.r-moveOrderInfo.s.r,
																		 	 	 b : moveOrderInfo.e.b-moveOrderInfo.s.b,
																		 	 	 l : moveOrderInfo.e.l-moveOrderInfo.s.l}
						//개별로 진행 상태
						moveOrderInfo.subTickerStatus = {t : moveOrderInfo.travelRange.t == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																						 r : moveOrderInfo.travelRange.r == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																						 b : moveOrderInfo.travelRange.b == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																						 l : moveOrderInfo.travelRange.l == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}
            moveOrderInfo.nextMoveRate = {t : 0, r : 0, b : 0, l : 0}

						//이동할 거리 없음
						if(moveOrderInfo.travelRange.t == 0 && moveOrderInfo.travelRange.r == 0 &&
							 moveOrderInfo.travelRange.b == 0 && moveOrderInfo.travelRange.l == 0 && checkTravelRange == true) {
							return false;
						}
					} else {
						moveOrderInfo.s = parseInt(borderStyle[key].replace(regex, ''));
						moveOrderInfo.e = parseInt(finishPoint);
						moveOrderInfo.travelRange = parseInt(moveOrderInfo.e) - parseInt(moveOrderInfo.s);
						moveOrderInfo.nextMoveRate = 0; //처음 위치

						//이동할 거리 없음
						if(moveOrderInfo.travelRange == 0 && checkTravelRange == true) {
							return false;
						}
					}
				} else if(_j2eType.getBoxShadowOrderYn(key)) {
					var boxShadowStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					if(boxShadowStyle[key] != "none") {
						var boxShadowRgb = boxShadowStyle[key].substring(0, boxShadowStyle[key].indexOf(")")).replace("rgb(", "").split(",");
						var startBoxShadowTemp = boxShadowStyle[key].substring(boxShadowStyle[key].indexOf(")")+1).replace("rgb(", "").split("px");

						moveOrderInfo.s = {ph: parseFloat(startBoxShadowTemp[0].replace(regex, '')),
															 pv: parseFloat(startBoxShadowTemp[1].replace(regex, '')),
															 pb: parseFloat(startBoxShadowTemp[2].replace(regex, '')),
															 ps: parseFloat(startBoxShadowTemp[3].replace(regex, '')),
															 cr: parseInt(boxShadowRgb[0].replace(regex, '')),
															 cg: parseInt(boxShadowRgb[1].replace(regex, '')),
															 cb: parseInt(boxShadowRgb[2].replace(regex, ''))}
					} else {
						moveOrderInfo.s = {ph: 0, pv: 0, pb: 0, ps: 0, cr: 0, cg: 0, cb: 0}
					}

					var finishBoxShadowTemp = finishPoint.split(",");
					if(finishBoxShadowTemp.length == 2) {
						moveOrderInfo.e = {ph: parseFloat(finishBoxShadowTemp[0].replace(regex, '')),
															 pv: parseFloat(finishBoxShadowTemp[1].replace(regex, '')),
															 pb: 0, ps: 0, cr: 0, cg: 0, cb: 0}

					  moveOrderInfo.u = {ph: finishBoxShadowTemp[0].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[0].replace(regexUnity, ''),
 														   pv: finishBoxShadowTemp[1].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[1].replace(regexUnity, ''),
														   pb: "px", ps: "px"}
					} else if(finishBoxShadowTemp.length == 3) {
            if(finishBoxShadowTemp[2].replace(regexS, '').indexOf("#") == 0) {
							var rgbCodeArr = _j2eCssUtil.hexToRgb(finishBoxShadowTemp[2].replace(regexS, ''));
						 	moveOrderInfo.e = {ph: parseFloat(finishBoxShadowTemp[0].replace(regex, '')),
																 pv: parseFloat(finishBoxShadowTemp[1].replace(regex, '')),
															 	 pb: 0,
																 ps: 0,
																 cr: rgbCodeArr.r, cg: rgbCodeArr.g, cb: rgbCodeArr.b}

						  moveOrderInfo.u = {ph: finishBoxShadowTemp[0].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[0].replace(regexUnity, ''),
  														   pv: finishBoxShadowTemp[1].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[1].replace(regexUnity, ''),
 														     pb: "px", ps: "px"}
	 					} else {
							moveOrderInfo.e = {ph: parseFloat(finishBoxShadowTemp[0].replace(regex, '')),
																 pv: parseFloat(finishBoxShadowTemp[1].replace(regex, '')),
																 pb: parseFloat(finishBoxShadowTemp[2].replace(regex, '')),
																 ps: 0, cr: 0, cg: 0, cb: 0}

							moveOrderInfo.u = {ph: finishBoxShadowTemp[0].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[0].replace(regexUnity, ''),
	 														   pv: finishBoxShadowTemp[1].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[1].replace(regexUnity, ''),
															   pb: finishBoxShadowTemp[2].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[2].replace(regexUnity, ''),
																 ps: "px"}
						}
					} else if(finishBoxShadowTemp.length == 4) {
						if(finishBoxShadowTemp[3].replace(regexS, '').indexOf("#") == 0) {
						 var rgbCodeArr = _j2eCssUtil.hexToRgb(finishBoxShadowTemp[3].replace(regexS, ''));
						 moveOrderInfo.e = {ph: parseFloat(finishBoxShadowTemp[0].replace(regex, '')),
																pv: parseFloat(finishBoxShadowTemp[1].replace(regex, '')),
																pb: parseFloat(finishBoxShadowTemp[2].replace(regex, '')),
																ps: 0,
																cr: rgbCodeArr.r, cg: rgbCodeArr.g, cb: rgbCodeArr.b}

						 moveOrderInfo.u = {ph: finishBoxShadowTemp[0].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[0].replace(regexUnity, ''),
																pv: finishBoxShadowTemp[1].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[1].replace(regexUnity, ''),
																pb: finishBoxShadowTemp[2].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[2].replace(regexUnity, ''),
																ps: "px"}
	 				} else {
						 moveOrderInfo.e = {ph: parseFloat(finishBoxShadowTemp[0].replace(regex, '')),
						 									  pv: parseFloat(finishBoxShadowTemp[1].replace(regex, '')),
						 									  pb: parseFloat(finishBoxShadowTemp[2].replace(regex, '')),
						 									  ps: parseFloat(finishBoxShadowTemp[3].replace(regex, '')),
						 									  cr: 0, cg: 0, cb: 0}

						 moveOrderInfo.u = {ph: finishBoxShadowTemp[0].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[0].replace(regexUnity, ''),
						 									  pv: finishBoxShadowTemp[1].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[1].replace(regexUnity, ''),
						 									  pb: finishBoxShadowTemp[2].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[2].replace(regexUnity, ''),
						 								    ps: finishBoxShadowTemp[3].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[3].replace(regexUnity, '')}
						}
					} else if(finishBoxShadowTemp.length == 5) {
						var rgbCodeArr = _j2eCssUtil.hexToRgb(finishBoxShadowTemp[4].replace(regexS, ''));
						moveOrderInfo.e = {ph: parseFloat(finishBoxShadowTemp[0].replace(regex, '')),
															 pv: parseFloat(finishBoxShadowTemp[1].replace(regex, '')),
															 pb: parseFloat(finishBoxShadowTemp[2].replace(regex, '')),
															 ps: parseFloat(finishBoxShadowTemp[3].replace(regex, '')),
															 cr: rgbCodeArr.r, cg: rgbCodeArr.g, cb: rgbCodeArr.b}

						moveOrderInfo.u = {ph: finishBoxShadowTemp[0].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[0].replace(regexUnity, ''),
															 pv: finishBoxShadowTemp[1].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[1].replace(regexUnity, ''),
															 pb: finishBoxShadowTemp[2].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[2].replace(regexUnity, ''),
															 ps: finishBoxShadowTemp[3].replace(regexUnity, '') == "" ? "px" : finishBoxShadowTemp[3].replace(regexUnity, '')}
					}

					moveOrderInfo.travelRange = {ph : moveOrderInfo.e.ph-moveOrderInfo.s.ph,
																			 pv : moveOrderInfo.e.pv-moveOrderInfo.s.pv,
																			 pb : moveOrderInfo.e.pb-moveOrderInfo.s.pb,
																			 ps : moveOrderInfo.e.ps-moveOrderInfo.s.ps,
																			 cr : moveOrderInfo.e.cr-moveOrderInfo.s.cr,
																		 	 cg : moveOrderInfo.e.cg-moveOrderInfo.s.cg,
																	 	   cb : moveOrderInfo.e.cb-moveOrderInfo.s.cb}

          //개별로 진행 상태
					moveOrderInfo.subTickerStatus = {ph : moveOrderInfo.travelRange.ph == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 pv : moveOrderInfo.travelRange.pv == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 pb : moveOrderInfo.travelRange.pb == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 ps : moveOrderInfo.travelRange.ps == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																				 	 cr : moveOrderInfo.travelRange.cr == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																			 	   cg : moveOrderInfo.travelRange.cg == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																		 		 	 cb : moveOrderInfo.travelRange.cb == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}

					moveOrderInfo.nextMoveRate = {ph: 0, pv: 0, pb: 0, ps: 0, cr: 0, cg: 0, cb: 0}

					//이동할 거리 없음
					if(moveOrderInfo.travelRange.ph == 0 && moveOrderInfo.travelRange.pv == 0 &&
						 moveOrderInfo.travelRange.pb == 0 && moveOrderInfo.travelRange.ps == 0 &&
						 moveOrderInfo.travelRange.cr == 0 && moveOrderInfo.travelRange.cg == 0 &&
						 moveOrderInfo.travelRange.cb == 0 && checkTravelRange == true) {
						return false;
					}

				} else if(_j2eType.getTextShadowOrderYn(key)) {
					var textShadowStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					if(textShadowStyle[key] != "none") {
						var textShadowRgb = textShadowStyle[key].substring(0, textShadowStyle[key].indexOf(")")).replace("rgb(", "").split(",");
						var startTextShadowTemp = textShadowStyle[key].substring(textShadowStyle[key].indexOf(")")+1).replace("rgb(", "").split("px");

						moveOrderInfo.s = {ph: parseFloat(startTextShadowTemp[0].replace(regex, '')),
															 pv: parseFloat(startTextShadowTemp[1].replace(regex, '')),
															 pb: parseFloat(startTextShadowTemp[2].replace(regex, '')),
															 cr: parseInt(textShadowRgb[0].replace(regex, '')),
															 cg: parseInt(textShadowRgb[1].replace(regex, '')),
															 cb: parseInt(textShadowRgb[2].replace(regex, ''))}
					} else {
						moveOrderInfo.s = {ph: 0, pv: 0, pb: 0, cr: 0, cg: 0, cb: 0}
					}

					var finishTextShadowTemp = finishPoint.split(",");
					if(finishTextShadowTemp.length == 2) {
						moveOrderInfo.e = {ph: parseFloat(finishTextShadowTemp[0].replace(regex, '')),
															 pv: parseFloat(finishTextShadowTemp[1].replace(regex, '')),
															 pb: 0, cr: 0, cg: 0, cb: 0}
					  moveOrderInfo.u = {ph: finishTextShadowTemp[0].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[0].replace(regexUnity, ''),
 														   pv: finishTextShadowTemp[1].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[1].replace(regexUnity, ''),
														   pb: "px"}
					} else if(finishTextShadowTemp.length == 3) {
            if(finishTextShadowTemp[2].replace(regexS, '').indexOf("#") == 0) {
							var rgbCodeArr = _j2eCssUtil.hexToRgb(finishTextShadowTemp[2].replace(regexS, ''));
						 	moveOrderInfo.e = {ph: parseFloat(finishTextShadowTemp[0].replace(regex, '')),
																 pv: parseFloat(finishTextShadowTemp[1].replace(regex, '')),
															 	 pb: 0,
																 cr: rgbCodeArr.r, cg: rgbCodeArr.g, cb: rgbCodeArr.b}

						  moveOrderInfo.u = {ph: finishTextShadowTemp[0].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[0].replace(regexUnity, ''),
  														   pv: finishTextShadowTemp[1].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[1].replace(regexUnity, ''),
 														     pb: "px"}
	 					} else {
							moveOrderInfo.e = {ph: parseFloat(finishTextShadowTemp[0].replace(regex, '')),
																 pv: parseFloat(finishTextShadowTemp[1].replace(regex, '')),
																 pb: parseFloat(finishTextShadowTemp[2].replace(regex, '')),
																 cr: 0, cg: 0, cb: 0}

							moveOrderInfo.u = {ph: finishTextShadowTemp[0].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[0].replace(regexUnity, ''),
	 														   pv: finishTextShadowTemp[1].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[1].replace(regexUnity, ''),
															   pb: finishTextShadowTemp[2].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[2].replace(regexUnity, '')}
						}
					} else if(finishTextShadowTemp.length == 4) {
						if(finishTextShadowTemp[3].replace(regexS, '').indexOf("#") == 0) {
						 var rgbCodeArr = _j2eCssUtil.hexToRgb(finishTextShadowTemp[3].replace(regexS, ''));
						 moveOrderInfo.e = {ph: parseFloat(finishTextShadowTemp[0].replace(regex, '')),
																pv: parseFloat(finishTextShadowTemp[1].replace(regex, '')),
																pb: parseFloat(finishTextShadowTemp[2].replace(regex, '')),
																cr: rgbCodeArr.r, cg: rgbCodeArr.g, cb: rgbCodeArr.b}

						 moveOrderInfo.u = {ph: finishTextShadowTemp[0].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[0].replace(regexUnity, ''),
																pv: finishTextShadowTemp[1].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[1].replace(regexUnity, ''),
																pb: finishTextShadowTemp[2].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[2].replace(regexUnity, ''),}
	 				} else {
						 moveOrderInfo.e = {ph: parseFloat(finishTextShadowTemp[0].replace(regex, '')),
						 									  pv: parseFloat(finishTextShadowTemp[1].replace(regex, '')),
						 									  pb: parseFloat(finishTextShadowTemp[2].replace(regex, '')),
						 									  cr: 0, cg: 0, cb: 0}

						 moveOrderInfo.u = {ph: finishTextShadowTemp[0].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[0].replace(regexUnity, ''),
						 									  pv: finishTextShadowTemp[1].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[1].replace(regexUnity, ''),
						 									  pb: finishTextShadowTemp[2].replace(regexUnity, '') == "" ? "px" : finishTextShadowTemp[2].replace(regexUnity, '')}
						}
					}

					moveOrderInfo.travelRange = {ph : moveOrderInfo.e.ph-moveOrderInfo.s.ph,
																			 pv : moveOrderInfo.e.pv-moveOrderInfo.s.pv,
																			 pb : moveOrderInfo.e.pb-moveOrderInfo.s.pb,
																			 cr : moveOrderInfo.e.cr-moveOrderInfo.s.cr,
																		 	 cg : moveOrderInfo.e.cg-moveOrderInfo.s.cg,
																	 	   cb : moveOrderInfo.e.cb-moveOrderInfo.s.cb}

          //개별로 진행 상태
					moveOrderInfo.subTickerStatus = {ph : moveOrderInfo.travelRange.ph == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 pv : moveOrderInfo.travelRange.pv == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 pb : moveOrderInfo.travelRange.pb == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																				 	 cr : moveOrderInfo.travelRange.cr == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																			 	   cg : moveOrderInfo.travelRange.cg == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																		 		 	 cb : moveOrderInfo.travelRange.cb == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}

					moveOrderInfo.nextMoveRate = {ph: 0, pv: 0, pb: 0, cr: 0, cg: 0, cb: 0}

					//이동할 거리 없음
					if(moveOrderInfo.travelRange.ph == 0 && moveOrderInfo.travelRange.pv == 0 &&
						 moveOrderInfo.travelRange.pb == 0 && moveOrderInfo.travelRange.cr == 0 &&
						 moveOrderInfo.travelRange.cg == 0 && moveOrderInfo.travelRange.cb == 0 && checkTravelRange == true) {
						return false;
					}

				} else if(_j2eType.getAreaOrderYn(key)) { //넓이 관련 초기값 세팅
					var areaStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					moveOrderInfo.s = parseInt(areaStyle[key].replace("px", ""));
					moveOrderInfo.e = parseInt(finishPoint);
					moveOrderInfo.travelRange = parseInt(moveOrderInfo.e) - parseInt(moveOrderInfo.s);
					moveOrderInfo.nextMoveRate = 0; //처음 위치

					//이동할 거리 없음
					if(moveOrderInfo.travelRange == 0 && checkTravelRange == true) {
						return false;
					}

				} else if(_j2eType.getOpacityOrderYn(key)) { //투명도 초기값 세팅

					var opacityStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					moveOrderInfo.s = parseFloat(opacityStyle.opacity); //처음 위치
					moveOrderInfo.e = parseFloat(finishPoint);
					moveOrderInfo.travelRange = parseFloat(moveOrderInfo.e) - parseFloat(moveOrderInfo.s);
					moveOrderInfo.nextMoveRate = 0; //처음 위치
				} else if(_j2eType.getRgbOrderYn(key)) { //배경색 관련 초기값 세팅

					var startRgbCode = _j2eCssUtil.getStyle(that.renderConfig.targetElement)[moveOrderInfo.moveKey];
					if(startRgbCode.indexOf("#") == 0) {
						var rgbCodeArr = _j2eCssUtil.hexToRgb(startRgbCode);
						moveOrderInfo.s = {r : rgbCodeArr.r, g : rgbCodeArr.g, b : rgbCodeArr.b}
					} else if(startRgbCode.indexOf("rgba") == 0 || startRgbCode == "transparent") {
						moveOrderInfo.s = {r : 255, g : 255, b : 255}
					} else {
						var rgbCodeArr = startRgbCode.substring(4).replace(")", "").split(",");
						moveOrderInfo.s = {r : parseInt(rgbCodeArr[0]), g : parseInt(rgbCodeArr[1]), b : parseInt(rgbCodeArr[2])}
					}

					moveOrderInfo.e = typeof(finishPoint) == "object" ? finishPoint : _j2eCssUtil.hexToRgb(finishPoint); //마지막 위치
					moveOrderInfo.travelRange = {r : parseInt(moveOrderInfo.e.r)-parseInt(moveOrderInfo.s.r),
													 						 g : parseInt(moveOrderInfo.e.g)-parseInt(moveOrderInfo.s.g),
													 					 	 b : parseInt(moveOrderInfo.e.b)-parseInt(moveOrderInfo.s.b)}

				  //개별로 진행 상태
					moveOrderInfo.subTickerStatus = {r : moveOrderInfo.travelRange.r == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 g : moveOrderInfo.travelRange.g == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 b : moveOrderInfo.travelRange.b == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}
				  //다음 이동 위치
					moveOrderInfo.nextMoveRate = {r : 0, g : 0, b : 0}

					if(moveOrderInfo.subTickerStatus.r == _constantValue.tickerStatusE && moveOrderInfo.subTickerStatus.g == _constantValue.tickerStatusE &&
					   moveOrderInfo.subTickerStatus.b == _constantValue.tickerStatusE && checkTravelRange == true) {
							 return false;
				  }
				} else if(_j2eType.getPerspectiveOrderYn(key)) {

					var perspectiveStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					moveOrderInfo.s = perspectiveStyle[key] == "none" ? 0 : parseInt(perspectiveStyle[key].replace(regex, ''));
					moveOrderInfo.e = parseInt(finishPoint);
					moveOrderInfo.travelRange = parseInt(moveOrderInfo.e) - parseInt(moveOrderInfo.s);
					moveOrderInfo.nextMoveRate = 0; //처음 위치

					//이동할 거리 없음
					if(moveOrderInfo.travelRange == 0 && checkTravelRange == true) {
						return false;
					}
				} else if(_j2eType.getScaleOrderYn(key)) { //크기변화 초기값 세팅

					var startScaleCode = _j2eCssUtil.getStyle(that.renderConfig.targetElement).transform;
					if(startScaleCode == "none") {
						moveOrderInfo.s = {x : 1, y : 1}
					} else {

						if(checkTravelRange == true) {
							var values = startScaleCode.split('(')[1].split(')')[0].split(',');
							if(values.length == 16) {
								var scaleX = values[0];
								var scaleY = values[5];
							} else {
								var a = values[0];
								var b = values[1];
								var c = values[2];
								var d = values[3];
								var scaleX = Math.sqrt(a*a + b*b);
								var scaleY = Math.sqrt(c*c + d*d);
							}
							moveOrderInfo.s = {x : parseFloat(scaleX), y :parseFloat(scaleY)}
						} else if(checkTravelRange == false) {
							if(that.renderConfig.moveOrderInfoListMemory == undefined || that.renderConfig.moveOrderInfoListMemory[key] == undefined) {
								var values = startScaleCode.split('(')[1].split(')')[0].split(',');
								if(values.length == 16) {
									var scaleX = values[0];
									var scaleY = values[5];
								} else {
									var a = values[0];
									var b = values[1];
									var c = values[2];
									var d = values[3];
									var scaleX = Math.sqrt(a*a + b*b);
									var scaleY = Math.sqrt(c*c + d*d);
								}
								moveOrderInfo.s = {x : parseFloat(scaleX), y :parseFloat(scaleY)}
							} else if(that.renderConfig.moveOrderInfoListMemory[key] != undefined) {
								moveOrderInfo.s = {x : that.renderConfig.moveOrderInfoListMemory[key].e.x, y : that.renderConfig.moveOrderInfoListMemory[key].e.y}
							}
						}
					}

					if(_constantValue.scale == key) {
						moveOrderInfo.e = typeof(finishPoint) == "object" ? {x : finishPoint.x, y : finishPoint.y} : {x : parseFloat(finishPoint.split(",")[0]), y : parseFloat(finishPoint.split(",")[1])}
					} else if(_constantValue.scaleX == key) {
						moveOrderInfo.e = {x : parseFloat(typeof(finishPoint) == "object" ? finishPoint.x : finishPoint), y : parseFloat(scaleY)}
					} else if(_constantValue.scaleY == key) {
						moveOrderInfo.e = {x : parseFloat(scaleX), y : parseFloat(typeof(finishPoint) == "object" ? finishPoint.y : finishPoint)}
					}

					moveOrderInfo.travelRange = {x : parseFloat(moveOrderInfo.e.x)-parseFloat(moveOrderInfo.s.x),
																			 y : parseFloat(moveOrderInfo.e.y)-parseFloat(moveOrderInfo.s.y)}
				 	//개별로 진행 상태
					moveOrderInfo.subTickerStatus = {x : moveOrderInfo.travelRange.x == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 y : moveOrderInfo.travelRange.y == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}
				  //다음 이동 위치
				  moveOrderInfo.nextMoveRate = {x : 0, y : 0}

					if(moveOrderInfo.subTickerStatus.x == _constantValue.tickerStatusE && moveOrderInfo.subTickerStatus.y == _constantValue.tickerStatusE &&
						 checkTravelRange == true) {
						return false;
				  }
				} else if(_j2eType.getRotateOrderYn(key)) { //기울기변경 초기값 세팅

					key = key == _constantValue.rotate ? _constantValue.rotateZ : key;
					var startRotateCode = _j2eCssUtil.getStyle(that.renderConfig.targetElement).transform;
					if(startRotateCode == "none") {
						moveOrderInfo.s = 0;
					} else {
						var startRotateCodeCheck = that.renderConfig.targetElement.style.transform;

						if(checkTravelRange == true) {
							if(startRotateCodeCheck.indexOf(key) != -1) {
								var tempS = startRotateCodeCheck.substring(startRotateCodeCheck.indexOf(key)).split(")");
								moveOrderInfo.s = tempS[0].replace(regex, '');
							} else {
								var values = startRotateCode.split('(')[1].split(')')[0].split(',');
								var a = values[0];
								var b = values[1];
								var c = values[2];
								var d = values[3];
								var scale = Math.sqrt(a*a + b*b);
								var sin = b/scale;
								var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
								var radians = Math.atan2(b, a);
								if ( radians < 0 ) {
								  radians += (2 * Math.PI);
								}
								moveOrderInfo.s = Math.round( radians * (180/Math.PI));
							}
						} else if(checkTravelRange == false) {
							if(that.renderConfig.moveOrderInfoListMemory == undefined || that.renderConfig.moveOrderInfoListMemory[key] == undefined) {
								//TEST 여기가 정상작동 할까??
								if(startRotateCodeCheck.indexOf(key) != -1) {
									var tempS = startRotateCodeCheck.substring(startRotateCodeCheck.indexOf(key)).split(")");
									moveOrderInfo.s = tempS[0].replace(regex, '');
								} else {
									var values = startRotateCode.split('(')[1].split(')')[0].split(',');
									var a = values[0];
									var b = values[1];
									var c = values[2];
									var d = values[3];
									var scale = Math.sqrt(a*a + b*b);
									var sin = b/scale;
									var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
									var radians = Math.atan2(b, a);
									if ( radians < 0 ) {
									  radians += (2 * Math.PI);
									}
									moveOrderInfo.s = Math.round( radians * (180/Math.PI));
								}
							} else if(that.renderConfig.moveOrderInfoListMemory[key] != undefined) {
								moveOrderInfo.s = that.renderConfig.moveOrderInfoListMemory[key].e;
							}
						}
					}

					moveOrderInfo.e = parseInt(finishPoint);
					moveOrderInfo.travelRange = parseInt(moveOrderInfo.e) - parseInt(moveOrderInfo.s);
					moveOrderInfo.nextMoveRate = 0; //처음 위치

					//이동할 거리 없음
					if(moveOrderInfo.travelRange == 0 && checkTravelRange == true) {
						return false;
					}
				} else if(_j2eType.getTransformPerspectiveOrderYn(key)) { //transform perspective 초기값 세팅

					var startTransformPerspectiveCode = _j2eCssUtil.getStyle(that.renderConfig.targetElement).transform;
					if(startTransformPerspectiveCode == "none") {
						moveOrderInfo.s = 0;
					} else {
						var startTransformPerspectiveCodeCheck = that.renderConfig.targetElement.style.transform;

						if(checkTravelRange == true) {
							if(startTransformPerspectiveCodeCheck.indexOf(_constantValue.perspective) != -1) {
								var tempS = startTransformPerspectiveCodeCheck.substring(startTransformPerspectiveCodeCheck.indexOf(_constantValue.perspective)).split(")");
								moveOrderInfo.s = tempS[0].replace(regex, '');
							} else {
								var values = startTransformPerspectiveCode.split('(')[1].split(')')[0].split(',');
								if(values.length == 16) {
									moveOrderInfo.s = values[11] == 0 ? 0 : Math.abs(1/values[11]);
								} else {
									moveOrderInfo.s = values[5];
								}
							}
						} else if(checkTravelRange == false) {
							if(that.renderConfig.moveOrderInfoListMemory == undefined || that.renderConfig.moveOrderInfoListMemory[key] == undefined) {
								if(startTransformPerspectiveCodeCheck.indexOf(_constantValue.perspective) != -1) {
									var tempS = startTransformPerspectiveCodeCheck.substring(startTransformPerspectiveCodeCheck.indexOf(_constantValue.perspective)).split(")");
									moveOrderInfo.s = tempS[0].replace(regex, '');
								} else {

									var values = startTransformPerspectiveCode.split('(')[1].split(')')[0].split(',');
									if(values.length == 16) {
										moveOrderInfo.s = Math.abs(1/values[11]);
									}
								}
							}
						}
					}

					moveOrderInfo.e = parseInt(finishPoint);
					moveOrderInfo.travelRange = parseInt(moveOrderInfo.e) - parseInt(moveOrderInfo.s);
					moveOrderInfo.nextMoveRate = 0; //처음 위치

					//이동할 거리 없음
					if(moveOrderInfo.travelRange == 0 && checkTravelRange == true) {
						return false;
					}
				} else if(_j2eType.getFontSizeOrderYn(key)) {
					var fontSizeStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					moveOrderInfo.s = parseInt(fontSizeStyle[key].replace(regex, ""));
					moveOrderInfo.e = parseInt(finishPoint);
					if(typeof(finishPoint) == "string") {
						moveOrderInfo.u = finishPoint.replace(regexUnity, "");
					} else if(typeof(finishPoint) == "number") {
						moveOrderInfo.u = "px";
					}

					moveOrderInfo.travelRange = moveOrderInfo.e - moveOrderInfo.s;
					moveOrderInfo.nextMoveRate = 0; //처음 위치

					//이동할 거리 없음
					if(moveOrderInfo.travelRange == 0 && checkTravelRange == true) {
						return false;
					}
				} else if(_j2eType.getClipOrderYn(key)) {
					var clipStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					var startClipPointTemp = clipStyle[key];
					if(startClipPointTemp == "auto") {
						moveOrderInfo.s = {a: 0, b: parseFloat(clipStyle["width"].replace(regex, '')), c: parseFloat(clipStyle["height"].replace(regex, '')), d: 0}
					} else {
						startClipPointTemp = startClipPointTemp.replace("rect(", "");
						startClipPointTemp = startClipPointTemp.split("px");
						moveOrderInfo.s = {a: parseFloat(startClipPointTemp[0].replace(regex, '')), b: parseFloat(startClipPointTemp[1].replace(regex, '')), c: parseFloat(startClipPointTemp[2].replace(regex, '')), d: parseFloat(startClipPointTemp[3].replace(regex, ''))}
					}

					var finishClipPointTemp = finishPoint.split(",");
					moveOrderInfo.e = {a: parseFloat(finishClipPointTemp[0].replace(regex, '')), b: parseFloat(finishClipPointTemp[1].replace(regex, '')), c: parseFloat(finishClipPointTemp[2].replace(regex, '')), d: parseFloat(finishClipPointTemp[3].replace(regex, ''))}
					moveOrderInfo.u = {a: finishClipPointTemp[0].replace(regexUnity, '')==""?"px":finishClipPointTemp[0].replace(regexUnity, ''),
					                   b: finishClipPointTemp[1].replace(regexUnity, '')==""?"px":finishClipPointTemp[1].replace(regexUnity, ''),
														 c: finishClipPointTemp[2].replace(regexUnity, '')==""?"px":finishClipPointTemp[2].replace(regexUnity, ''),
														 d: finishClipPointTemp[3].replace(regexUnity, '')==""?"px":finishClipPointTemp[3].replace(regexUnity, '')}

					moveOrderInfo.travelRange = {a: moveOrderInfo.e.a-moveOrderInfo.s.a,
																			 b: moveOrderInfo.e.b-moveOrderInfo.s.b,
																			 c: moveOrderInfo.e.c-moveOrderInfo.s.c,
																			 d: moveOrderInfo.e.d-moveOrderInfo.s.d}

				  //개별로 진행 상태
					moveOrderInfo.subTickerStatus = {a: moveOrderInfo.travelRange.a == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 b: moveOrderInfo.travelRange.b == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 c: moveOrderInfo.travelRange.c == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 d: moveOrderInfo.travelRange.d == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}

          moveOrderInfo.nextMoveRate = {a: 0, b: 0, c: 0, d: 0}

				  //이동할 거리 없음
					if(moveOrderInfo.travelRange.a == 0 && moveOrderInfo.travelRange.b == 0 &&
						 moveOrderInfo.travelRange.c == 0 && moveOrderInfo.travelRange.d == 0 && checkTravelRange == true) {
						return false;
					}
				} else if(_j2eType.getPerspectiveOriginOrderYn(key)) {
					var perspectiveOriginStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					var startPerspectiveOriginTmep = perspectiveOriginStyle[key].split(" ");
					moveOrderInfo.s = {x: parseFloat(startPerspectiveOriginTmep[0].replace(regex, '')), y: parseFloat(startPerspectiveOriginTmep[1].replace(regex, ''))}

					var finishPerspectiveOriginPositionTemp = finishPoint.split(",");
					if(finishPerspectiveOriginPositionTemp.length == 1) {
						moveOrderInfo.e = {x: parseFloat(finishPerspectiveOriginPositionTemp[0].replace(regex, '')), y : parseFloat(finishPerspectiveOriginPositionTemp[0].replace(regex, ''))}
						moveOrderInfo.u = {x: finishPerspectiveOriginPositionTemp[0].replace(regexUnity, '') == "" ? "px" : finishPerspectiveOriginPositionTemp[0].replace(regexUnity, ''),
						                   y: finishPerspectiveOriginPositionTemp[0].replace(regexUnity, '') == "" ? "px" : finishPerspectiveOriginPositionTemp[0].replace(regexUnity, '')}
					} else {
						moveOrderInfo.e = {x: parseFloat(finishPerspectiveOriginPositionTemp[0].replace(regex, '')), y : parseFloat(finishPerspectiveOriginPositionTemp[1].replace(regex, ''))}
						moveOrderInfo.u = {x: finishPerspectiveOriginPositionTemp[0].replace(regexUnity, '') == "" ? "px" : finishPerspectiveOriginPositionTemp[0].replace(regexUnity, ''),
						                   y: finishPerspectiveOriginPositionTemp[1].replace(regexUnity, '') == "" ? "px" : finishPerspectiveOriginPositionTemp[1].replace(regexUnity, '')}
					}
					moveOrderInfo.travelRange = {x: moveOrderInfo.e.x - moveOrderInfo.s.x,
																	 		 y: moveOrderInfo.e.y - moveOrderInfo.s.y}
					//개별로 진행 상태
 					moveOrderInfo.subTickerStatus = {x: moveOrderInfo.travelRange.t == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
 																					 y: moveOrderInfo.travelRange.r == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}
          moveOrderInfo.nextMoveRate = {x: 0, y: 0}

 					if(moveOrderInfo.subTickerStatus.x == _constantValue.tickerStatusE && moveOrderInfo.subTickerStatus.y == _constantValue.tickerStatusE &&
  				   checkTravelRange == true) {
  				 	return false;
  				}
				} else if(_j2eType.getTransformOriginOrderYn(key)) {
					var transformOriginStyle = _j2eCssUtil.getStyle(that.renderConfig.targetElement);
					var starTtransformOriginTmep = transformOriginStyle[key].split(" ");
					moveOrderInfo.s = {x: parseFloat(starTtransformOriginTmep[0].replace(regex, '')), y: parseFloat(starTtransformOriginTmep[1].replace(regex, ''))}

					var finishTransformOriginPositionTemp = finishPoint.split(",");
					if(finishTransformOriginPositionTemp.length == 1) {
						moveOrderInfo.e = {x: parseFloat(finishTransformOriginPositionTemp[0].replace(regex, '')), y : parseFloat(finishTransformOriginPositionTemp[0].replace(regex, ''))}
						moveOrderInfo.u = {x: finishTransformOriginPositionTemp[0].replace(regexUnity, '') == "" ? "px" : finishTransformOriginPositionTemp[0].replace(regexUnity, ''),
															 y: finishTransformOriginPositionTemp[0].replace(regexUnity, '') == "" ? "px" : finishTransformOriginPositionTemp[0].replace(regexUnity, '')}
					} else {
						moveOrderInfo.e = {x: parseFloat(finishTransformOriginPositionTemp[0].replace(regex, '')), y : parseFloat(finishTransformOriginPositionTemp[1].replace(regex, ''))}
						moveOrderInfo.u = {x: finishTransformOriginPositionTemp[0].replace(regexUnity, '') == "" ? "px" : finishTransformOriginPositionTemp[0].replace(regexUnity, ''),
															 y: finishTransformOriginPositionTemp[1].replace(regexUnity, '') == "" ? "px" : finishTransformOriginPositionTemp[1].replace(regexUnity, '')}
					}
					moveOrderInfo.travelRange = {x: moveOrderInfo.e.x - moveOrderInfo.s.x,
																			 y: moveOrderInfo.e.y - moveOrderInfo.s.y}
					//개별로 진행 상태
					moveOrderInfo.subTickerStatus = {x: moveOrderInfo.travelRange.t == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 y: moveOrderInfo.travelRange.r == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}
					moveOrderInfo.nextMoveRate = {x: 0, y: 0}

					if(moveOrderInfo.subTickerStatus.x == _constantValue.tickerStatusE && moveOrderInfo.subTickerStatus.y == _constantValue.tickerStatusE &&
						 checkTravelRange == true) {
						return false;
					}
				} else if(_j2eType.getTranslateOrderYn(key)) {
					var translateX = 0;
					var translateY = 0;
					var translateZ = 0;

					var starTranslateCode = _j2eCssUtil.getStyle(that.renderConfig.targetElement).transform;
					if(starTranslateCode == "none") {
						moveOrderInfo.s = {x: 0, y: 0, z: 0}
					} else {
						var values = starTranslateCode.split('(')[1].split(')')[0].split(',');
						if(checkTravelRange == true) {
							values = starTranslateCode.split('(')[1].split(')')[0].split(',');
							if(values.length == 16) {
								translateX = Math.abs(values[12]);
								translateY = Math.abs(values[13]);
								translateZ = Math.abs(values[14]);
							} else {
								translateX = Math.abs(values[4]);
								translateY = Math.abs(values[5]);
							}
							moveOrderInfo.s = {x: parseFloat(translateX), y: parseFloat(translateY), z: parseFloat(translateZ)}
						} else if(checkTravelRange == false) {
							if(that.renderConfig.moveOrderInfoListMemory == undefined || that.renderConfig.moveOrderInfoListMemory[key] == undefined) {
								values = starTranslateCode.split('(')[1].split(')')[0].split(',');
								if(values.length == 16) {
									translateX = Math.abs(values[12]);
									translateY = Math.abs(values[13]);
									translateZ = Math.abs(values[14]);
								} else {
									translateX = Math.abs(values[4]);
									translateY = Math.abs(values[5]);
								}
								moveOrderInfo.s = {x: parseFloat(translateX), y: parseFloat(translateY), z: parseFloat(translateZ)}
							} else if(that.renderConfig.moveOrderInfoListMemory[key] != undefined) {
								moveOrderInfo.s = {x: that.renderConfig.moveOrderInfoListMemory[key].s.x, y: that.renderConfig.moveOrderInfoListMemory[key].s.y, z: that.renderConfig.moveOrderInfoListMemory[key].s.z}
							}
						}
					}

					if(_constantValue.translate == key) {
						moveOrderInfo.e = typeof(finishPoint) == "object" ? {x: finishPoint.x, y: finishPoint.y, z: parseFloat(translateZ)} : {x: parseFloat(finishPoint.split(",")[0]), y: parseFloat(finishPoint.split(",")[1]), z: parseFloat(translateZ)}
					} else if(_constantValue.translateX == key) {
						moveOrderInfo.e = {x: parseFloat(typeof(finishPoint) == "object" ? finishPoint.x : finishPoint), y: parseFloat(translateY), z: parseFloat(translateZ)}
					} else if(_constantValue.translateY == key) {
						moveOrderInfo.e = {x: parseFloat(translateX), y: parseFloat(typeof(finishPoint) == "object" ? finishPoint.y : finishPoint), z: parseFloat(translateZ)}
					} else if(_constantValue.translateZ == key) {
						moveOrderInfo.e = {x: parseFloat(translateX), y: parseFloat(translateY), z: parseFloat(typeof(finishPoint) == "object" ? finishPoint.z : finishPoint)}
					} else if(_constantValue.translate3d == key) {
						moveOrderInfo.e = typeof(finishPoint) == "object" ? {x: finishPoint.x, y: finishPoint.y, z: finishPoint.z} : {x: parseFloat(finishPoint.split(",")[0]), y: parseFloat(finishPoint.split(",")[1]), z: parseFloat(finishPoint.split(",")[2])}
					}

					if(typeof(finishPoint) == "object") {
						moveOrderInfo.u = {x: that.renderConfig.stepByStepMoveOrderInfoList[0].u.x, y: that.renderConfig.stepByStepMoveOrderInfoList[0].u.y, z: that.renderConfig.stepByStepMoveOrderInfoList[0].u.z}
					} else {
						if(finishPoint.split(",").length == 1) {
							moveOrderInfo.u = {x: finishPoint.split(",")[0].replace(regexUnity, '') == "" ? "px" : finishPoint.split(",")[0].replace(regexUnity, ''), y: "px", z: "px"}
						} else if (finishPoint.split(",").length == 2) {
							moveOrderInfo.u = {x: finishPoint.split(",")[0].replace(regexUnity, '') == "" ? "px" : finishPoint.split(",")[0].replace(regexUnity, ''), y: finishPoint.split(",")[0].replace(regexUnity, '') == "" ? "px" : finishPoint.split(",")[0].replace(regexUnity, ''), z: "px"}
						} else if (finishPoint.split(",").length == 3) {
							moveOrderInfo.u = {x: finishPoint.split(",")[0].replace(regexUnity, '') == "" ? "px" : finishPoint.split(",")[0].replace(regexUnity, ''), y: finishPoint.split(",")[1].replace(regexUnity, '') == "" ? "px" : finishPoint.split(",")[1].replace(regexUnity, ''), z: finishPoint.split(",")[2].replace(regexUnity, '') == "" ? "px" : finishPoint.split(",")[2].replace(regexUnity, '')}
						}
					}

					moveOrderInfo.travelRange = {x: moveOrderInfo.e.x - moveOrderInfo.s.x,
																			 y: moveOrderInfo.e.y - moveOrderInfo.s.y,
																		   z: moveOrderInfo.e.z - moveOrderInfo.s.z}

				 //개별로 진행 상태
					moveOrderInfo.subTickerStatus = {x: moveOrderInfo.travelRange.x == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 y: moveOrderInfo.travelRange.y == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																				   z: moveOrderInfo.travelRange.z == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}
				  moveOrderInfo.nextMoveRate = {x: 0, y: 0, z: 0}

					if(moveOrderInfo.subTickerStatus.x == _constantValue.tickerStatusE && moveOrderInfo.subTickerStatus.y == _constantValue.tickerStatusE &&
						 moveOrderInfo.subTickerStatus.z == _constantValue.tickerStatusE && checkTravelRange == true) {
						return false;
				  }
				}  else if(_j2eType.getSkewOrderYn(key)) {
					var skewX = 0;
					var skewY = 0;
					var values = "";
					var starSkewCode = _j2eCssUtil.getStyle(that.renderConfig.targetElement).transform;

					if(starSkewCode == "none") {
						moveOrderInfo.s = {x: 0, y: 0}
					} else {
						if(checkTravelRange == true) {
							values = starSkewCode.split('(')[1].split(')')[0].split(',');
							skewX = (180/Math.PI) * Math.atan2( ((1*values[2])+(0*values[3])),((1*values[0])-(0*values[1])));
							skewY = ((180/Math.PI) * Math.atan2( ((0*values[2])+(1*values[3])),((0*values[0])-(1*values[1])))) - 90;
							moveOrderInfo.s = {x: parseFloat(skewX), y: parseFloat(skewY)}
						} else if(checkTravelRange == false) {
							if(that.renderConfig.moveOrderInfoListMemory == undefined || that.renderConfig.moveOrderInfoListMemory[key] == undefined) {
								values = starTranslateCode.split('(')[1].split(')')[0].split(',');
								skewX = (180/Math.PI) * Math.atan2( ((1*values[2])+(0*values[3])),((1*values[0])-(0*values[1])));
								skewY = ((180/Math.PI) * Math.atan2( ((0*values[2])+(1*values[3])),((0*values[0])-(1*values[1])))) - 90;
								moveOrderInfo.s = {x: parseFloat(skewX), y: parseFloat(skewY)}
							} else if(that.renderConfig.moveOrderInfoListMemory[key] != undefined) {
								moveOrderInfo.s = {x: that.renderConfig.moveOrderInfoListMemory[key].e.x, y: that.renderConfig.moveOrderInfoListMemory[key].e.y}
							}
						}
					}

					if(_constantValue.skew == key) {
						moveOrderInfo.e = typeof(finishPoint) == "object" ? {x: finishPoint.x, y: finishPoint.y} : {x: parseFloat(finishPoint.split(",")[0]), y: parseFloat(finishPoint.split(",")[1])}
					} else if(_constantValue.skewX == key) {
						moveOrderInfo.e = {x: parseFloat(typeof(finishPoint) == "object" ? finishPoint.x : finishPoint), y: parseFloat(skewY)}
					} else if(_constantValue.skewY == key) {
						moveOrderInfo.e = {x: parseFloat(skewX), y: parseFloat(typeof(finishPoint) == "object" ? finishPoint.y : finishPoint)}
					}

					moveOrderInfo.u = {x: "deg", y: "deg"}
					moveOrderInfo.travelRange = {x: moveOrderInfo.e.x - moveOrderInfo.s.x,
																			 y: moveOrderInfo.e.y - moveOrderInfo.s.y}
          //개별로 진행 상태
					moveOrderInfo.subTickerStatus = {x: moveOrderInfo.travelRange.x == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI,
																					 y: moveOrderInfo.travelRange.y == 0 ? _constantValue.tickerStatusE : _constantValue.tickerStatusI}
				  moveOrderInfo.nextMoveRate = {x: 0, y: 0}

					if(moveOrderInfo.subTickerStatus.x == _constantValue.tickerStatusE && moveOrderInfo.subTickerStatus.y == _constantValue.tickerStatusE &&
						 checkTravelRange == true) {
						return false;
				  }
				} else {
					moveOrderInfo.nextMoveRate = 0; //다음 이동할 거리
				}

				moveOrderInfo.style = that.renderConfig.targetElement.style;
				return moveOrderInfo;
			},
			hexToRgb : function(hex) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
							r: parseInt(result[1], 16),
							g: parseInt(result[2], 16),
							b: parseInt(result[3], 16)
					} : null;
			},
			getStyle : function (el) {
				if(window.getComputedStyle != undefined) {
					return getComputedStyle(el, null);
				} else {
					return el.currentStyle;
				}
			},
			getUnit : function(v, u, c) {

				if(_j2eType.getLineOrderYn(c) || _j2eType.getAreaOrderYn(c)) {
					return v+"px";
				} else if(_j2eType.getMarginOrderYn(c)) {
					return v.t+"px "+v.r+"px "+v.b+"px "+v.l+"px";
				} else if(_j2eType.getPerspectiveOrderYn(c)) {
					return v+"px";
				} else if(_j2eType.getOpacityOrderYn(c)) {
					return v;
				} else if(_j2eType.getRgbOrderYn(c)) {
					return "rgb(" +v.r+", "+v.g+", "+v.b+")";
				} else if(_j2eType.getBorderOrderYn(c)) {
					if(_constantValue.borderWidth == c) {
						return v.t+"px "+v.r+"px "+v.b+"px "+v.l+"px";
					} else {
						return v+"px";
					}
				} else if(_j2eType.getBackgorundOrderYn(c)) {
					return v.x+u.x+" "+v.y+u.y;
				} else if(_j2eType.getBoxShadowOrderYn(c)) {
					return v.ph+u.ph+" "+v.pv+u.pv+" "+v.pb+u.pb+" "+v.ps+u.ps + " rgb(" +v.cr+", "+v.cg+", "+v.cb+")";
				} else if(_j2eType.getTextShadowOrderYn(c)) {
					return v.ph+u.ph+" "+v.pv+u.pv+" "+v.pb+u.pb+" rgb(" +v.cr+", "+v.cg+", "+v.cb+")";
				} else if(_j2eType.getFontSizeOrderYn(c)) {
					return v+u;
				} else if(_j2eType.getClipOrderYn(c)) {
					return "rect("+v.a+u.a+", "+v.b+u.b+", "+v.c+u.c+", "+v.d+u.d+")";
				} else if(_j2eType.getPerspectiveOriginOrderYn(c)) {
					return v.x+u.x+" "+v.y+u.y;
				} else if(_j2eType.getTransformOriginOrderYn(c)) {
					return v.x+u.x+" "+v.y+u.y;
				}

				return null;
			},
			getTransformUnit : function(o, c) {
				var transformUnit = "";
				var orderInfo = o;

				if(orderInfo.transformPerspective != undefined) {
					transformUnit += " perspective(" + orderInfo.transformPerspective.nextMoveRate + "px)";
				}

				if(orderInfo.scale != undefined) {
					transformUnit += " scale(" +orderInfo.scale.nextMoveRate.x+", "+orderInfo.scale.nextMoveRate.y+")";
				}
				if(orderInfo.scaleX != undefined) {
					transformUnit += " scale(" +orderInfo.scaleX.nextMoveRate.x+", "+orderInfo.scaleX.nextMoveRate.y+")";
				}
				if(orderInfo.scaleY != undefined) {
					transformUnit += " scale(" +orderInfo.scaleY.nextMoveRate.x+", "+orderInfo.scaleY.nextMoveRate.y+")";
				}

				if(orderInfo.rotateX != undefined) {
					transformUnit += " rotateX(" +orderInfo.rotateX.nextMoveRate+"deg)";
				}
				if(orderInfo.rotateY != undefined) {
					transformUnit += " rotateY(" +orderInfo.rotateY.nextMoveRate+"deg)";
				}
				if(orderInfo.rotateZ != undefined) {
					transformUnit += " rotateZ(" +orderInfo.rotateZ.nextMoveRate+"deg)";
				}
				if(orderInfo.rotate != undefined) {
					transformUnit += " rotate(" +orderInfo.rotate.nextMoveRate+"deg)";
				}

				if(orderInfo.translateX != undefined) {
					transformUnit += " translate3d(" +orderInfo.translateX.nextMoveRate.x+orderInfo.translateX.u.x+ ", "+ orderInfo.translateX.nextMoveRate.y+orderInfo.translateX.u.y+ ", "+ orderInfo.translateX.nextMoveRate.z+orderInfo.translateX.u.z+")";
				}
				if(orderInfo.translateY != undefined) {
					transformUnit += " translate3d(" +orderInfo.translateY.nextMoveRate.x+orderInfo.translateY.u.x+ ", "+ orderInfo.translateY.nextMoveRate.y+orderInfo.translateY.u.y+ ", "+ orderInfo.translateY.nextMoveRate.z+orderInfo.translateY.u.z+")";
				}
				if(orderInfo.translateZ != undefined) {
					transformUnit += " translate3d(" +orderInfo.translateZ.nextMoveRate.x+orderInfo.translateZ.u.x+ ", "+ orderInfo.translateZ.nextMoveRate.y+orderInfo.translateZ.u.y+ ", "+ orderInfo.translateZ.nextMoveRate.z+orderInfo.translateZ.u.z+")";
				}
				if(orderInfo.translate != undefined) {
					transformUnit += " translate3d(" +orderInfo.translate.nextMoveRate.x+orderInfo.translate.u.x+ ", "+ orderInfo.translate.nextMoveRate.y+orderInfo.translate.u.y+ ", "+ orderInfo.translate.nextMoveRate.z+orderInfo.translate.u.z+")";
				}
				if(orderInfo.translate3d != undefined) {
					transformUnit += " translate3d(" +orderInfo.translate3d.nextMoveRate.x+orderInfo.translate3d.u.x+ ", "+ orderInfo.translate3d.nextMoveRate.y+orderInfo.translate3d.u.y+ ", "+ orderInfo.translate3d.nextMoveRate.z+orderInfo.translate3d.u.z+")";
				}

				if(orderInfo.skew != undefined) {
					transformUnit += " skew(" +orderInfo.skew.nextMoveRate.x+orderInfo.skew.u.x+", "+orderInfo.skew.nextMoveRate.y+orderInfo.skew.u.y+")";
				}
				if(orderInfo.skewX != undefined) {
					transformUnit += " skew(" +orderInfo.skewX.nextMoveRate.x+orderInfo.skewX.u.x+", "+orderInfo.skewX.nextMoveRate.y+orderInfo.skewX.u.y+")";
				}
				if(orderInfo.skewY != undefined) {
					transformUnit += " skew(" +orderInfo.skewY.nextMoveRate.x+orderInfo.skewY.u.x+", "+orderInfo.skewY.nextMoveRate.y+orderInfo.skewY.u.y+")";
				}

				return transformUnit;
			},
			getStepByStepTransform2DUnit : function(that, o, c) {
				var transformUnit = "";
				var orderInfo = o;

				if(that.renderConfig.moveOrderInfoListMemory != undefined) {
					for(var i = 0; i < that.renderConfig.moveOrderInfoListMemory.length; i++) {
						var moveOrderInfoListMemoryMoveKey = that.renderConfig.moveOrderInfoListMemory[that.renderConfig.moveOrderInfoListMemory[i]].moveKey;
						var moveOrderInfoListMemoryNextMoveRate = that.renderConfig.moveOrderInfoListMemory[that.renderConfig.moveOrderInfoListMemory[i]].nextMoveRate;

						if(_j2eType.getTransformPerspectiveOrderYn(moveOrderInfoListMemoryMoveKey) && !_j2eType.getTransformPerspectiveOrderYn(c)) {
							transformUnit += " perspective(" + orderInfo.transformPerspective.nextMoveRate + "px)";
						}

						if(_j2eType.getScaleOrderYn(moveOrderInfoListMemoryMoveKey) && !_j2eType.getScaleOrderYn(c)) {
							transformUnit += " scale(" +moveOrderInfoListMemoryNextMoveRate.x+", "+moveOrderInfoListMemoryNextMoveRate.y+")";
						}

						if(!_j2eType.getRotateOrderYn(c)) {
							if(_constantValue.rotateX == moveOrderInfoListMemoryMoveKey) {
								transformUnit += " rotateX("+moveOrderInfoListMemoryNextMoveRate+"deg)";
							}
							if(_constantValue.rotateY == moveOrderInfoListMemoryMoveKey) {
								transformUnit += " rotateY("+moveOrderInfoListMemoryNextMoveRate+"deg)";
							}
							if(_constantValue.rotateZ == moveOrderInfoListMemoryMoveKey || _constantValue.rotate == moveOrderInfoListMemoryMoveKey) {
								transformUnit += " rotateZ("+moveOrderInfoListMemoryNextMoveRate+"deg)";
							}
						}

						if(_j2eType.getTranslateOrderYn(moveOrderInfoListMemoryMoveKey) && !_j2eType.getTranslateOrderYn(c)) {
							var moveOrderInfoListMemoryU = that.renderConfig.moveOrderInfoListMemory[that.renderConfig.moveOrderInfoListMemory[i]].u;
							transformUnit += " translate3d(" +moveOrderInfoListMemoryNextMoveRate.x+moveOrderInfoListMemoryU.x+ ", "+ moveOrderInfoListMemoryNextMoveRate.y+moveOrderInfoListMemoryU.y+ ", "+ moveOrderInfoListMemoryNextMoveRate.z+moveOrderInfoListMemoryU.z+")";
						}

						if(_j2eType.getSkewOrderYn(moveOrderInfoListMemoryMoveKey) && !_j2eType.getSkewOrderYn(c)) {
							transformUnit += " skew(" +moveOrderInfoListMemoryNextMoveRate.x+", "+moveOrderInfoListMemoryNextMoveRate.y+")";
						}
					}
				}

				if(_j2eType.getScaleOrderYn(c)) {
					transformUnit += " scale(" +orderInfo.nextMoveRate.x+", "+orderInfo.nextMoveRate.y+")";
				}

				if(_constantValue.rotateX == c) {
					transformUnit += " rotateX(" +orderInfo.nextMoveRate+"deg)";
				}
				if(_constantValue.rotateY == c) {
					transformUnit += " rotateY(" +orderInfo.nextMoveRate+"deg)";
				}
				if(_constantValue.rotateZ == c || _constantValue.rotate == c) {
					transformUnit += " rotateZ(" +orderInfo.nextMoveRate+"deg)";
				}

				if(_j2eType.getTranslateOrderYn(c)) {
					transformUnit += " translate3d(" +orderInfo.nextMoveRate.x+orderInfo.u.x+ ", "+ orderInfo.nextMoveRate.y+orderInfo.u.y+ ", "+ orderInfo.nextMoveRate.z+orderInfo.u.z+")";
				}

				if(_j2eType.getSkewOrderYn(c)) {
					transformUnit += " skew(" +orderInfo.nextMoveRate.x+orderInfo.u.x+ ", "+ orderInfo.nextMoveRate.y+orderInfo.u.y+ ", "+ orderInfo.nextMoveRate.z+orderInfo.u.z+")";
				}

				return transformUnit;
			}
		},
		_j2eType = {
			getMotionOrderYn: function(c) {
				if(_constantValue.left == c || _constantValue.right == c || _constantValue.top == c || _constantValue.bottom == c ||
				   _constantValue.width == c || _constantValue.height == c || _constantValue.opacity == c || _constantValue.backgroundColor == c ||
				   _constantValue.scale == c || _constantValue.scaleX == c || _constantValue.scaleY == c || _constantValue.margin == c ||
					 _constantValue.rotateX == c || _constantValue.rotateY == c || _constantValue.rotateZ == c || _constantValue.rotate == c ||
					 _constantValue.perspective == c || _constantValue.transformPerspective == c || _constantValue.borderWidth == c ||
				   _constantValue.borderTopWidth == c || _constantValue.borderRightWidth == c || _constantValue.borderBottomWidth == c ||
				   _constantValue.borderLeftWidth == c || _constantValue.borderTopColor == c || _constantValue.borderRightColor == c ||
					 _constantValue.borderBottomColor == c || _constantValue.borderLeftColor == c || _constantValue.borderTopLeftRadius == c ||
				   _constantValue.borderTopRightRadius == c || _constantValue.borderBottomRightRadius == c || _constantValue.borderBottomLeftRadius == c ||
				   _constantValue.backgroundPosition == c || _constantValue.backgroundSize == c || _constantValue.boxShadow == c ||
					 _constantValue.color == c || _constantValue.fontSize == c || _constantValue.clip == c ||
				   _constantValue.textShadow == c || _constantValue.perspectiveOrigin == c || _constantValue.transformOrigin == c ||
				   _constantValue.translate == c || _constantValue.translateX == c || _constantValue.translateY == c ||
				   _constantValue.translateZ == c || _constantValue.translate3d == c || _constantValue.skew == c ||
					 _constantValue.skewX == c || _constantValue.skewY == c) {
					return true;
				}
				return false;
			},
			getAreaOrderYn: function(c) {
				if(_constantValue.width == c || _constantValue.height == c) {
					return true;
				}
				return false;
			},
			getBackgorundOrderYn: function(c) {
				if(_constantValue.backgroundPosition == c || _constantValue.backgroundSize == c) {
					return true;
				}
				return false;
			},
			getBorderOrderYn: function(c) {
				if(_constantValue.borderWidth == c || _constantValue.borderTopWidth == c || _constantValue.borderRightWidth == c ||
					 _constantValue.borderBottomWidth == c || _constantValue.borderLeftWidth == c || _constantValue.borderTopLeftRadius == c ||
				   _constantValue.borderTopRightRadius == c || _constantValue.borderBottomRightRadius == c || _constantValue.borderBottomLeftRadius == c) {
					return true;
				}
				return false;
			},
			getBoxShadowOrderYn: function(c) {
				if(_constantValue.boxShadow == c) {
					return true;
				}
				return false;
			},
			getTextShadowOrderYn: function(c) {
				if(_constantValue.textShadow == c) {
					return true;
				}
				return false;
			},
			getLineOrderYn: function(c) {
				if(_constantValue.left == c || _constantValue.top == c || _constantValue.right == c || _constantValue.bottom == c) {
					return true;
				}
				return false;
			},
			getMarginOrderYn: function(c) {
				if(_constantValue.margin == c) {
					return true;
				}
				return false;
			},
			getOpacityOrderYn: function(c) {
				if(_constantValue.opacity == c) {
					return true;
				}
				return false;
			},
			getPerspectiveOrderYn: function(c) {
				if(_constantValue.perspective == c) {
					return true;
				}
				return false;
			},
			getPerspectiveOriginOrderYn: function(c) {
				if(_constantValue.perspectiveOrigin == c) {
					return true;
				}
				return false;
			},
			getTransformOriginOrderYn: function(c) {
				if(_constantValue.transformOrigin == c) {
					return true;
				}
				return false;
			},
			getRgbOrderYn: function(c) {
				if(_constantValue.backgroundColor ==  c || _constantValue.borderTopColor == c || _constantValue.borderRightColor == c ||
					 _constantValue.borderBottomColor == c || _constantValue.borderLeftColor == c || _constantValue.color == c) {
					return true;
				}
				return false;
			},
			getRotateOrderYn: function(c) {
				if(_constantValue.rotate == c || _constantValue.rotateX == c || _constantValue.rotateY == c || _constantValue.rotateZ == c) {
					return true;
				}
				return false;
			},
			getScaleOrderYn: function(c) {
				if(_constantValue.scale == c || _constantValue.scaleX == c || _constantValue.scaleY == c) {
					return true;
				}
				return false;
			},
			getTranslateOrderYn: function(c) {
				if(_constantValue.translate == c || _constantValue.translateX == c || _constantValue.translateY == c ||
				   _constantValue.translateZ == c || _constantValue.translate3d == c) {
						 return true;
	 				}
	 				return false;
			},
			getSkewOrderYn: function(c) {
				if(_constantValue.skew == c || _constantValue.skewX == c || _constantValue.skewY == c) {
						 return true;
	 				}
	 				return false;
			},
			getFontSizeOrderYn: function(c) {
					if(_constantValue.fontSize == c) {
						return true;
					}
					return false;
			},
			getClipOrderYn: function(c) {
				if(_constantValue.clip == c) {
					return true;
				}
				return false;
			},
			getTransformPerspectiveOrderYn: function(c) {
				if(_constantValue.transformPerspective == c) {
					return true;
				}
				return false;
			},
			getTransformOrderYn: function(c) {
				if(_constantValue.scale == c  || _constantValue.scaleX == c || _constantValue.scaleY == c ||
					 _constantValue.rotate == c || _constantValue.rotateX == c || _constantValue.rotateY == c ||
					 _constantValue.rotateZ == c || _constantValue.transformPerspective == c || _constantValue.translate == c |
					 _constantValue.translateX == c || _constantValue.translateY == c || _constantValue.translateZ == c ||
					 _constantValue.translate3d == c || _constantValue.skew == c || _constantValue.skewX == c ||
					 _constantValue.skewY == c) {
					return true;
				}
				return false;
			}
		},
		_j2eEngine = {
			tickerManager: function(renderConfig, e, direction) {
				if(_j2eType.getLineOrderYn(direction)) {
					_j2eEngine.lineTicker(renderConfig, e, direction);
				} else if(_j2eType.getMarginOrderYn(direction)) {
					_j2eEngine.marginTicker(renderConfig, e, direction);
				} else if(_j2eType.getBorderOrderYn(direction)) {
					 _j2eEngine.borderTicker(renderConfig, e, direction);
				} else if(_j2eType.getBackgorundOrderYn(direction)) {
					_j2eEngine.backgroundTicker(renderConfig, e, direction);
				} else if(_j2eType.getAreaOrderYn(direction)) {
					_j2eEngine.areaTicker(renderConfig, e, direction);
				} else if(_j2eType.getOpacityOrderYn(direction)) {
					_j2eEngine.opacityTicker(renderConfig, e, direction);
				} else if(_j2eType.getRgbOrderYn(direction)) {
					_j2eEngine.rgbTicker(renderConfig, e, direction);
				} else if(_j2eType.getPerspectiveOrderYn(direction)) {
					_j2eEngine.perspectiveTicker(renderConfig, e, direction);
				} else if(_j2eType.getScaleOrderYn(direction)) {
					_j2eEngine.scaleTicker(renderConfig, e, direction);
				} else if(_j2eType.getRotateOrderYn(direction)) {
					_j2eEngine.rotateTicker(renderConfig, e, direction);
				} else if(_j2eType.getTransformPerspectiveOrderYn(direction)) {
					_j2eEngine.transformPerspectiveTicker(renderConfig, e, direction);
				} else if(_j2eType.getBoxShadowOrderYn(direction)) {
					_j2eEngine.boxShadowTicker(renderConfig, e, direction);
				} else if(_j2eType.getTextShadowOrderYn(direction)) {
					_j2eEngine.textShadowTicker(renderConfig, e, direction);
				} else if(_j2eType.getFontSizeOrderYn(direction)) {
					_j2eEngine.fontSizeTicker(renderConfig, e, direction);
				} else if(_j2eType.getClipOrderYn(direction)) {
					_j2eEngine.clipTicker(renderConfig, e, direction);
				} else if(_j2eType.getPerspectiveOriginOrderYn(direction)) {
					_j2eEngine.perspectiveOriginTicker(renderConfig, e, direction);
				} else if(_j2eType.getTransformOriginOrderYn(direction)) {
					_j2eEngine.transformOriginTicker(renderConfig, e, direction);
				} else if(_j2eType.getTranslateOrderYn(direction)) {
					_j2eEngine.translateTicker(renderConfig, e, direction);
				} else if(_j2eType.getSkewOrderYn(direction)) {
					_j2eEngine.skewTicker(renderConfig, e, direction);
				}

			},
			getSpace: function(renderConfig, e, direction) {
				var spaceE = e;
				var elapsed = _j2eUtil.getTime() - spaceE.lastUpdate;
				if (elapsed > 500) {
					spaceE.startTime += elapsed - 33;
				}
				spaceE.lastUpdate += elapsed;
				spaceE.time = (spaceE.lastUpdate - spaceE.startTime) / 1000;
				var p = (spaceE.time * _constantValue.timeScale) / spaceE.duration;
				if(p >= 1) {
					return 1;
				}
				if(renderConfig.motionType == _constantValue.uniformMotion) {
					return p;
				}
				p = 1 - p;
				p *= p;
				return 1 - p;
			},
			lineTicker: function(renderConfig, e, direction) {
				var lineE = e;
				if(lineE.tickerStatus != _constantValue.tickerStatusE) {
					var lineSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);

					if(lineSpaceTemp == 1) {
					 	lineE.tickerStatus = _constantValue.tickerStatusE;
						lineE.nextMoveRate = lineE.e;
					} else {
						lineE.nextMoveRate = lineE.s + Math.round(parseFloat(lineE.travelRange) * parseFloat(lineSpaceTemp));
					}
				}
			},
			marginTicker: function(renderConfig, e, direction) {
				var marginE = e;
				var marginSpaceTemp = 0;

				//top 이동
				if(marginE.subTickerStatus.t != _constantValue.tickerStatusE) {
					marginSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(marginSpaceTemp == 1) {
						marginE.subTickerStatus.t = _constantValue.tickerStatusE;
						marginE.nextMoveRate.t = marginE.e.t;
					} else {
						marginE.nextMoveRate.t = marginE.s.t + Math.round(parseFloat(marginE.travelRange.t) * parseFloat(marginSpaceTemp));
					}
				} else {
					marginE.nextMoveRate.t = marginE.e.t;
				}

				//right 이동
				if(marginE.subTickerStatus.r != _constantValue.tickerStatusE) {
					marginSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(marginSpaceTemp == 1) {
						marginE.subTickerStatus.r = _constantValue.tickerStatusE;
						marginE.nextMoveRate.r = marginE.e.r;
					} else {
						marginE.nextMoveRate.r = marginE.s.r + Math.round(parseFloat(marginE.travelRange.r) * parseFloat(marginSpaceTemp));
					}
				} else {
					marginE.nextMoveRate.r = marginE.e.r;
				}

				//bottom 이동
				if(marginE.subTickerStatus.b != _constantValue.tickerStatusE) {
					marginSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(marginSpaceTemp == 1) {
						marginE.subTickerStatus.b = _constantValue.tickerStatusE;
						marginE.nextMoveRate.b = marginE.e.b;
					} else {
						marginE.nextMoveRate.b = marginE.s.b + Math.round(parseFloat(marginE.travelRange.b) * parseFloat(marginSpaceTemp));
					}
				} else {
					marginE.nextMoveRate.b = marginE.e.b;
				}

				//left 이동
				if(marginE.subTickerStatus.l != _constantValue.tickerStatusE) {
					marginSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(marginSpaceTemp == 1) {
						marginE.subTickerStatus.l = _constantValue.tickerStatusE;
						marginE.nextMoveRate.l = marginE.e.l;
					} else {
						marginE.nextMoveRate.l = marginE.s.l + Math.round(parseFloat(marginE.travelRange.l) * parseFloat(marginSpaceTemp));
					}
				} else {
					marginE.nextMoveRate.l = marginE.e.l;
				}

				if(marginE.subTickerStatus.t == _constantValue.tickerStatusE &&
				   marginE.subTickerStatus.r == _constantValue.tickerStatusE &&
				 	 marginE.subTickerStatus.b == _constantValue.tickerStatusE &&
				   marginE.subTickerStatus.l == _constantValue.tickerStatusE) {
					marginE.tickerStatus = _constantValue.tickerStatusE;
				}
			},
			borderTicker: function(renderConfig, e, direction) {
				var borderE = e;
				if(_constantValue.borderWidth == direction) {
					var borderSpaceTemp = 0;

					//top 이동
					if(borderE.subTickerStatus.t != _constantValue.tickerStatusE) {
						borderSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
						if(borderSpaceTemp == 1) {
							borderE.subTickerStatus.t = _constantValue.tickerStatusE;
							borderE.nextMoveRate.t = borderE.e.t;
						} else {
							borderE.nextMoveRate.t = borderE.s.t + Math.round(parseFloat(borderE.travelRange.t) * parseFloat(borderSpaceTemp));
						}
					} else {
						borderE.nextMoveRate.t = borderE.e.t;
					}

					//right 이동
					if(borderE.subTickerStatus.r != _constantValue.tickerStatusE) {
						borderSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
						if(borderSpaceTemp == 1) {
							borderE.subTickerStatus.r = _constantValue.tickerStatusE;
							borderE.nextMoveRate.r = borderE.e.r;
						} else {
							borderE.nextMoveRate.r = borderE.s.r + Math.round(parseFloat(borderE.travelRange.r) * parseFloat(borderSpaceTemp));
						}
					} else {
						borderE.nextMoveRate.r = borderE.e.r;
					}

					//bottom 이동
					if(borderE.subTickerStatus.b != _constantValue.tickerStatusE) {
						borderSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
						if(borderSpaceTemp == 1) {
							borderE.subTickerStatus.b = _constantValue.tickerStatusE;
							borderE.nextMoveRate.b = borderE.e.b;
						} else {
							borderE.nextMoveRate.b = borderE.s.b + Math.round(parseFloat(borderE.travelRange.b) * parseFloat(borderSpaceTemp));
						}
					} else {
						borderE.nextMoveRate.b = borderE.e.b;
					}

					//left 이동
					if(borderE.subTickerStatus.l != _constantValue.tickerStatusE) {
						borderSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
						if(borderSpaceTemp == 1) {
							borderE.subTickerStatus.l = _constantValue.tickerStatusE;
							borderE.nextMoveRate.l = borderE.e.l;
						} else {
							borderE.nextMoveRate.l = borderE.s.l + Math.round(parseFloat(borderE.travelRange.l) * parseFloat(borderSpaceTemp));
						}
					} else {
						borderE.nextMoveRate.l = borderE.e.l;
					}

					if(borderE.subTickerStatus.t == _constantValue.tickerStatusE &&
					   borderE.subTickerStatus.r == _constantValue.tickerStatusE &&
					 	 borderE.subTickerStatus.b == _constantValue.tickerStatusE &&
					   borderE.subTickerStatus.l == _constantValue.tickerStatusE) {
						borderE.tickerStatus = _constantValue.tickerStatusE;
					}
				} else {
					if(borderE.tickerStatus != _constantValue.tickerStatusE) {
						var borderSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);

						if(borderSpaceTemp == 1) {
							borderE.tickerStatus = _constantValue.tickerStatusE;
							borderE.nextMoveRate = borderE.e;
						} else {
							borderE.nextMoveRate = borderE.s + Math.round(parseFloat(borderE.travelRange) * parseFloat(borderSpaceTemp));
						}
					}
				}
			},
			backgroundTicker: function(renderConfig, e, direction) {
				var backgroundE = e;
				var backgroundTemp = 0;
				if(backgroundE.subTickerStatus.x != _constantValue.tickerStatusE) {
					backgroundTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(backgroundTemp == 1) {
						backgroundE.subTickerStatus.x = _constantValue.tickerStatusE;
						backgroundE.nextMoveRate.x = backgroundE.e.x;
					} else {
						backgroundE.nextMoveRate.x = backgroundE.s.x + (parseFloat(backgroundE.travelRange.x) * parseFloat(backgroundTemp));
					}
				} else {
					backgroundE.nextMoveRate.x = backgroundE.e.x;
				}

				if(backgroundE.s.y == "auto" || backgroundE.e.y == "auto") {
					backgroundE.subTickerStatus.y = _constantValue.tickerStatusE;
				} else if(backgroundE.subTickerStatus.y != _constantValue.tickerStatusE) {
					backgroundTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(backgroundTemp == 1) {
						backgroundE.subTickerStatus.y = _constantValue.tickerStatusE;
						backgroundE.nextMoveRate.y = backgroundE.e.y;
					} else {
						backgroundE.nextMoveRate.y = backgroundE.s.y + (parseFloat(backgroundE.travelRange.y) * parseFloat(backgroundTemp));
					}
				} else {
					backgroundE.nextMoveRate.y = backgroundE.e.y;
				}

				if(backgroundE.subTickerStatus.x == _constantValue.tickerStatusE &&
					 backgroundE.subTickerStatus.y == _constantValue.tickerStatusE) {
					backgroundE.tickerStatus = _constantValue.tickerStatusE;
				}
			},
			boxShadowTicker: function(renderConfig, e, direction) {
				var boxShadowE = e;
				var boxShadowSpaceTemp = 0;

				//h-shadow 이동
				if(boxShadowE.subTickerStatus.ph != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.ph = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.ph = boxShadowE.e.ph;
					} else {
						boxShadowE.nextMoveRate.ph = boxShadowE.s.ph + parseFloat(boxShadowE.travelRange.ph) * parseFloat(boxShadowSpaceTemp);
					}
				} else {
					boxShadowE.nextMoveRate.ph = boxShadowE.e.ph;
				}

				//v-shadow 이동
				if(boxShadowE.subTickerStatus.pv != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.pv = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.pv = boxShadowE.e.pv;
					} else {
						boxShadowE.nextMoveRate.pv = boxShadowE.s.pv + parseFloat(boxShadowE.travelRange.pv) * parseFloat(boxShadowSpaceTemp);
					}
				} else {
					boxShadowE.nextMoveRate.pv = boxShadowE.e.pv;
				}

				//blur 이동
				if(boxShadowE.subTickerStatus.pb != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.pb = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.pb = boxShadowE.e.pb;
					} else {
						boxShadowE.nextMoveRate.pb = boxShadowE.s.pb + parseFloat(boxShadowE.travelRange.pb) * parseFloat(boxShadowSpaceTemp);
					}
				} else {
					boxShadowE.nextMoveRate.pb = boxShadowE.e.pb;
				}

				//spread 이동
				if(boxShadowE.subTickerStatus.ps != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.ps = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.ps = boxShadowE.e.ps;
					} else {
						boxShadowE.nextMoveRate.ps = boxShadowE.s.ps + parseFloat(boxShadowE.travelRange.ps) * parseFloat(boxShadowSpaceTemp);
					}
				} else {
					boxShadowE.nextMoveRate.ps = boxShadowE.e.ps;
				}

				//color R 이동
				if(boxShadowE.subTickerStatus.cr != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.cr = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.cr = boxShadowE.e.cr;
					} else {
						boxShadowE.nextMoveRate.cr = boxShadowE.s.cr + Math.round(parseFloat(boxShadowE.travelRange.cr) * parseFloat(boxShadowSpaceTemp));
					}
				} else {
					boxShadowE.nextMoveRate.cr = boxShadowE.e.cr;
				}

				//color G 이동
				if(boxShadowE.subTickerStatus.cg != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.cg = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.cg = boxShadowE.e.cg;
					} else {
						boxShadowE.nextMoveRate.cg = boxShadowE.s.cg + Math.round(parseFloat(boxShadowE.travelRange.cg) * parseFloat(boxShadowSpaceTemp));
					}
				} else {
					boxShadowE.nextMoveRate.cg = boxShadowE.e.cg;
				}

				//color B 이동
				if(boxShadowE.subTickerStatus.cb != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.cb = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.cb = boxShadowE.e.cb;
					} else {
						boxShadowE.nextMoveRate.cb = boxShadowE.s.cb + Math.round(parseFloat(boxShadowE.travelRange.cb) * parseFloat(boxShadowSpaceTemp));
					}
				} else {
					boxShadowE.nextMoveRate.cb = boxShadowE.e.cb;
				}

				if(boxShadowE.subTickerStatus.ph == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.pv == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.pb == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.ps == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.cr == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.cg == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.cb == _constantValue.tickerStatusE) {
					boxShadowE.tickerStatus = _constantValue.tickerStatusE;
				}
			},
			textShadowTicker: function(renderConfig, e, direction) {
				var boxShadowE = e;
				var boxShadowSpaceTemp = 0;

				//h-shadow 이동
				if(boxShadowE.subTickerStatus.ph != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.ph = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.ph = boxShadowE.e.ph;
					} else {
						boxShadowE.nextMoveRate.ph = boxShadowE.s.ph + parseFloat(boxShadowE.travelRange.ph) * parseFloat(boxShadowSpaceTemp);
					}
				} else {
					boxShadowE.nextMoveRate.ph = boxShadowE.e.ph;
				}

				//v-shadow 이동
				if(boxShadowE.subTickerStatus.pv != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.pv = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.pv = boxShadowE.e.pv;
					} else {
						boxShadowE.nextMoveRate.pv = boxShadowE.s.pv + parseFloat(boxShadowE.travelRange.pv) * parseFloat(boxShadowSpaceTemp);
					}
				} else {
					boxShadowE.nextMoveRate.pv = boxShadowE.e.pv;
				}

				//blur 이동
				if(boxShadowE.subTickerStatus.pb != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.pb = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.pb = boxShadowE.e.pb;
					} else {
						boxShadowE.nextMoveRate.pb = boxShadowE.s.pb + parseFloat(boxShadowE.travelRange.pb) * parseFloat(boxShadowSpaceTemp);
					}
				} else {
					boxShadowE.nextMoveRate.pb = boxShadowE.e.pb;
				}

				//spread 이동
				if(boxShadowE.subTickerStatus.ps != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.ps = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.ps = boxShadowE.e.ps;
					} else {
						boxShadowE.nextMoveRate.ps = boxShadowE.s.ps + parseFloat(boxShadowE.travelRange.ps) * parseFloat(boxShadowSpaceTemp);
					}
				} else {
					boxShadowE.nextMoveRate.ps = boxShadowE.e.ps;
				}

				//color R 이동
				if(boxShadowE.subTickerStatus.cr != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.cr = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.cr = boxShadowE.e.cr;
					} else {
						boxShadowE.nextMoveRate.cr = boxShadowE.s.cr + Math.round(parseFloat(boxShadowE.travelRange.cr) * parseFloat(boxShadowSpaceTemp));
					}
				} else {
					boxShadowE.nextMoveRate.cr = boxShadowE.e.cr;
				}

				//color G 이동
				if(boxShadowE.subTickerStatus.cg != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.cg = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.cg = boxShadowE.e.cg;
					} else {
						boxShadowE.nextMoveRate.cg = boxShadowE.s.cg + Math.round(parseFloat(boxShadowE.travelRange.cg) * parseFloat(boxShadowSpaceTemp));
					}
				} else {
					boxShadowE.nextMoveRate.cg = boxShadowE.e.cg;
				}

				//color B 이동
				if(boxShadowE.subTickerStatus.cb != _constantValue.tickerStatusE) {
					boxShadowSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(boxShadowSpaceTemp == 1) {
						boxShadowE.subTickerStatus.cb = _constantValue.tickerStatusE;
						boxShadowE.nextMoveRate.cb = boxShadowE.e.cb;
					} else {
						boxShadowE.nextMoveRate.cb = boxShadowE.s.cb + Math.round(parseFloat(boxShadowE.travelRange.cb) * parseFloat(boxShadowSpaceTemp));
					}
				} else {
					boxShadowE.nextMoveRate.cb = boxShadowE.e.cb;
				}

				if(boxShadowE.subTickerStatus.ph == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.pv == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.pb == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.ps == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.cr == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.cg == _constantValue.tickerStatusE &&
					 boxShadowE.subTickerStatus.cb == _constantValue.tickerStatusE) {
					boxShadowE.tickerStatus = _constantValue.tickerStatusE;
				}
			},
			areaTicker: function(renderConfig, e, direction) {
				var areaE = e;
				if(areaE.tickerStatus != _constantValue.tickerStatusE) {
					var areaSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);

					if(areaSpaceTemp == 1) {
					 	areaE.tickerStatus = _constantValue.tickerStatusE;
						areaE.nextMoveRate = areaE.e;
					} else {
						areaE.nextMoveRate = areaE.s + Math.round(parseFloat(areaE.travelRange) * parseFloat(areaSpaceTemp));
					}
				}
			},
			opacityTicker: function(renderConfig, e, direction) {
				var opacityE = e;
				if(opacityE.tickerStatus != _constantValue.tickerStatusE) {
					var opacitySpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);

					if(opacitySpaceTemp == 1) {
					 	opacityE.tickerStatus = _constantValue.tickerStatusE;
						opacityE.nextMoveRate = opacityE.e;
					} else {
						opacityE.nextMoveRate = opacityE.s + (parseFloat(opacityE.travelRange) * parseFloat(opacitySpaceTemp));
					}
				}
			},
			rgbTicker: function(renderConfig, e, direction) {
				var rgbE = e;
				var rgbSpaceTemp = 0;
				if(rgbE.subTickerStatus.r != _constantValue.tickerStatusE) {
					rgbSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(rgbSpaceTemp == 1) {
						rgbE.subTickerStatus.r = _constantValue.tickerStatusE;
						rgbE.nextMoveRate.r = rgbE.e.r;
					} else {
						rgbE.nextMoveRate.r = rgbE.s.r + Math.round(parseFloat(rgbE.travelRange.r) * parseFloat(rgbSpaceTemp));
					}
				} else {
					rgbE.nextMoveRate.r = rgbE.e.r;
				}

				if(rgbE.subTickerStatus.g != _constantValue.tickerStatusE) {
					rgbSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(rgbSpaceTemp == 1) {
						rgbE.subTickerStatus.g = _constantValue.tickerStatusE;
						rgbE.nextMoveRate.g = rgbE.e.g;
					} else {
						rgbE.nextMoveRate.g = rgbE.s.g + Math.round(parseFloat(rgbE.travelRange.g) * parseFloat(rgbSpaceTemp));
					}
				} else {
					rgbE.nextMoveRate.g = rgbE.e.g;
				}

				if(rgbE.subTickerStatus.b != _constantValue.tickerStatusE) {
					rgbSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);

					if(rgbSpaceTemp == 1) {
						rgbE.subTickerStatus.b = _constantValue.tickerStatusE;
						rgbE.nextMoveRate.b = rgbE.e.b;
					} else {
						rgbE.nextMoveRate.b = rgbE.s.b + Math.round(parseFloat(rgbE.travelRange.b) * parseFloat(rgbSpaceTemp));
					}
				} else {
					rgbE.nextMoveRate.b = rgbE.e.b;
				}

				if(rgbE.subTickerStatus.r == _constantValue.tickerStatusE &&
					 rgbE.subTickerStatus.g == _constantValue.tickerStatusE &&
					 rgbE.subTickerStatus.b == _constantValue.tickerStatusE) {
					rgbE.tickerStatus = _constantValue.tickerStatusE;
				}
			},
			perspectiveTicker: function(renderConfig, e, direction) {
				var perspectiveE = e;
				if(perspectiveE.tickerStatus != _constantValue.tickerStatusE) {
					var perspectiveSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);

					if(perspectiveSpaceTemp == 1) {
					 	perspectiveE.tickerStatus = _constantValue.tickerStatusE;
						perspectiveE.nextMoveRate = perspectiveE.e;
					} else {

						perspectiveE.nextMoveRate = perspectiveE.s + Math.round(parseFloat(perspectiveE.travelRange) * parseFloat(perspectiveSpaceTemp));
					}
				}
			},
			scaleTicker: function(renderConfig, e, direction) {
				var scaleE = e;
				var scaleSpaceTemp = 0;
				if(scaleE.subTickerStatus.x != _constantValue.tickerStatusE) {
					scaleSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(scaleSpaceTemp == 1) {
						scaleE.subTickerStatus.x = _constantValue.tickerStatusE;
						scaleE.nextMoveRate.x = scaleE.e.x;
					} else {
						scaleE.nextMoveRate.x = scaleE.s.x + (parseFloat(scaleE.travelRange.x) * parseFloat(scaleSpaceTemp));
					}
				} else {
					scaleE.nextMoveRate.x = scaleE.e.x;
				}

				if(scaleE.subTickerStatus.y != _constantValue.tickerStatusE) {
					scaleSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(scaleSpaceTemp == 1) {
						scaleE.subTickerStatus.y = _constantValue.tickerStatusE;
						scaleE.nextMoveRate.y = scaleE.e.y;
					} else {
						scaleE.nextMoveRate.y = scaleE.s.y + (parseFloat(scaleE.travelRange.y) * parseFloat(scaleSpaceTemp));
					}
				} else {
					scaleE.nextMoveRate.y = scaleE.e.y;
				}

				if(scaleE.subTickerStatus.x == _constantValue.tickerStatusE &&
					 scaleE.subTickerStatus.y == _constantValue.tickerStatusE) {
					scaleE.tickerStatus = _constantValue.tickerStatusE;
				}
			},
			translateTicker: function(renderConfig, e, direction) {
				var translateE = e;
				var translateSpaceTemp = 0;

				if(translateE.subTickerStatus.x != _constantValue.tickerStatusE) {
					translateSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(translateSpaceTemp == 1) {
						translateE.subTickerStatus.x = _constantValue.tickerStatusE;
						translateE.nextMoveRate.x = translateE.e.x;
					} else {
						translateE.nextMoveRate.x = translateE.s.x + (parseFloat(translateE.travelRange.x) * parseFloat(translateSpaceTemp));
					}
				} else {
					translateE.nextMoveRate.x = translateE.e.x;
				}

				if(translateE.subTickerStatus.y != _constantValue.tickerStatusE) {
					translateSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(translateSpaceTemp == 1) {
						translateE.subTickerStatus.y = _constantValue.tickerStatusE;
						translateE.nextMoveRate.y = translateE.e.y;
					} else {
						translateE.nextMoveRate.y = translateE.s.y + (parseFloat(translateE.travelRange.y) * parseFloat(translateSpaceTemp));
					}
				} else {
					translateE.nextMoveRate.y = translateE.e.y;
				}

				if(translateE.subTickerStatus.z != _constantValue.tickerStatusE) {
					translateSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(translateSpaceTemp == 1) {
						translateE.subTickerStatus.z = _constantValue.tickerStatusE;
						translateE.nextMoveRate.z = translateE.e.z;
					} else {
						translateE.nextMoveRate.z = translateE.s.z + (parseFloat(translateE.travelRange.z) * parseFloat(translateSpaceTemp));
					}
				} else {
					translateE.nextMoveRate.z = translateE.e.z;
				}

				if(translateE.subTickerStatus.x == _constantValue.tickerStatusE &&
					 translateE.subTickerStatus.y == _constantValue.tickerStatusE &&
				   translateE.subTickerStatus.z == _constantValue.tickerStatusE) {
					translateE.tickerStatus = _constantValue.tickerStatusE;
				}
			},
			skewTicker: function(renderConfig, e, direction) {
				var skewE = e;
				var skewSpaceTemp = 0;

				if(skewE.subTickerStatus.x != _constantValue.tickerStatusE) {
					skewSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(skewSpaceTemp == 1) {
						skewE.subTickerStatus.x = _constantValue.tickerStatusE;
						skewE.nextMoveRate.x = skewE.e.x;
					} else {
						skewE.nextMoveRate.x = skewE.s.x + (parseFloat(skewE.travelRange.x) * parseFloat(skewSpaceTemp));
					}
				} else {
					skewE.nextMoveRate.x = skewE.e.x;
				}

				if(skewE.subTickerStatus.y != _constantValue.tickerStatusE) {
					skewSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(skewSpaceTemp == 1) {
						skewE.subTickerStatus.y = _constantValue.tickerStatusE;
						skewE.nextMoveRate.y = skewE.e.y;
					} else {
						skewE.nextMoveRate.y = skewE.s.y + (parseFloat(skewE.travelRange.y) * parseFloat(skewSpaceTemp));
					}
				} else {
					skewE.nextMoveRate.y = skewE.e.y;
				}

				if(skewE.subTickerStatus.x == _constantValue.tickerStatusE &&
					 skewE.subTickerStatus.y == _constantValue.tickerStatusE) {
					skewE.tickerStatus = _constantValue.tickerStatusE;
				}
			},
			rotateTicker: function(renderConfig, e, direction) {
				var rotateE = e;
				if(rotateE.tickerStatus != _constantValue.tickerStatusE) {
					var rotateSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);

					if(rotateSpaceTemp == 1) {
					 	rotateE.tickerStatus = _constantValue.tickerStatusE;
						rotateE.nextMoveRate = rotateE.e;
					} else {
						rotateE.nextMoveRate =+ rotateE.s + Math.round(parseFloat(rotateE.travelRange) * parseFloat(rotateSpaceTemp));
					}
				}
			},
			fontSizeTicker: function(renderConfig, e, direction) {
				var fontSizeE = e;
				if(fontSizeE.tickerStatus != _constantValue.tickerStatusE) {
					var fontSizeSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);

					if(fontSizeSpaceTemp == 1) {
					 	fontSizeE.tickerStatus = _constantValue.tickerStatusE;
						fontSizeE.nextMoveRate = fontSizeSpaceTemp.e;
					} else {
						//fontSizeE.nextMoveRate = fontSizeE.s + Math.round(parseFloat(fontSizeE.travelRange) * parseFloat(fontSizeSpaceTemp));
						fontSizeE.nextMoveRate = fontSizeE.s + parseFloat(fontSizeE.travelRange) * parseFloat(fontSizeSpaceTemp);
					}
				}
			},
			clipTicker: function(renderConfig, e, direction) {
				var clipE = e;
				var clipSpaceTemp = 0;
				if(clipE.subTickerStatus.a != _constantValue.tickerStatusE) {
					clipSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(clipSpaceTemp == 1) {
						clipE.subTickerStatus.a = _constantValue.tickerStatusE;
						clipE.nextMoveRate.a = clipE.e.a;
					} else {
						clipE.nextMoveRate.a = clipE.s.a + (parseFloat(clipE.travelRange.a) * parseFloat(clipSpaceTemp));
					}
				} else {
					clipE.nextMoveRate.a = clipE.e.a;
				}

				if(clipE.subTickerStatus.b != _constantValue.tickerStatusE) {
					clipSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(clipSpaceTemp == 1) {
						clipE.subTickerStatus.b = _constantValue.tickerStatusE;
						clipE.nextMoveRate.b = clipE.e.b;
					} else {
						clipE.nextMoveRate.b = clipE.s.b + (parseFloat(clipE.travelRange.b) * parseFloat(clipSpaceTemp));
					}
				} else {
					clipE.nextMoveRate.b = clipE.e.b;
				}

				if(clipE.subTickerStatus.c != _constantValue.tickerStatusE) {
					clipSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(clipSpaceTemp == 1) {
						clipE.subTickerStatus.c = _constantValue.tickerStatusE;
						clipE.nextMoveRate.c = clipE.e.c;
					} else {
						clipE.nextMoveRate.c = clipE.s.c + (parseFloat(clipE.travelRange.c) * parseFloat(clipSpaceTemp));
					}
				} else {
					clipE.nextMoveRate.c = clipE.e.c;
				}

				if(clipE.subTickerStatus.d != _constantValue.tickerStatusE) {
					clipSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(clipSpaceTemp == 1) {
						clipE.subTickerStatus.d = _constantValue.tickerStatusE;
						clipE.nextMoveRate.d = clipE.e.d;
					} else {
						clipE.nextMoveRate.d = clipE.s.d + (parseFloat(clipE.travelRange.d) * parseFloat(clipSpaceTemp));
					}
				} else {
					clipE.nextMoveRate.d = clipE.e.d;
				}

				if(clipE.subTickerStatus.a == _constantValue.tickerStatusE &&
					 clipE.subTickerStatus.b == _constantValue.tickerStatusE &&
					 clipE.subTickerStatus.c == _constantValue.tickerStatusE &&
					 clipE.subTickerStatus.d == _constantValue.tickerStatusE) {
					clipE.tickerStatus = _constantValue.tickerStatusE;
				}
			},
			perspectiveOriginTicker: function(renderConfig, e, direction) {
				var perspectiveOriginE = e;
				var perspectiveOriginSpaceTemp = 0;
				if(perspectiveOriginE.subTickerStatus.x != _constantValue.tickerStatusE) {
					perspectiveOriginSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(perspectiveOriginSpaceTemp == 1) {
						perspectiveOriginE.subTickerStatus.x = _constantValue.tickerStatusE;
						perspectiveOriginE.nextMoveRate.x = perspectiveOriginE.e.x;
					} else {
						perspectiveOriginE.nextMoveRate.x = perspectiveOriginE.s.x + (parseFloat(perspectiveOriginE.travelRange.x) * parseFloat(perspectiveOriginSpaceTemp));
					}
				} else {
					perspectiveOriginE.nextMoveRate.x = perspectiveOriginE.e.x;
				}

				if(perspectiveOriginE.subTickerStatus.y != _constantValue.tickerStatusE) {
					perspectiveOriginSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(perspectiveOriginSpaceTemp == 1) {
						perspectiveOriginE.subTickerStatus.y = _constantValue.tickerStatusE;
						perspectiveOriginE.nextMoveRate.y = perspectiveOriginE.e.y;
					} else {
						perspectiveOriginE.nextMoveRate.y = perspectiveOriginE.s.y + (parseFloat(perspectiveOriginE.travelRange.y) * parseFloat(perspectiveOriginSpaceTemp));
					}
				} else {
					perspectiveOriginE.nextMoveRate.y = perspectiveOriginE.e.y;
				}

				if(perspectiveOriginE.subTickerStatus.x == _constantValue.tickerStatusE &&
					 perspectiveOriginE.subTickerStatus.y == _constantValue.tickerStatusE) {
					perspectiveOriginE.tickerStatus = _constantValue.tickerStatusE;
				}
			},
			transformOriginTicker: function(renderConfig, e, direction) {
				var transformOriginE = e;
				var transformOriginSpaceTemp = 0;
				if(transformOriginE.subTickerStatus.x != _constantValue.tickerStatusE) {
					transformOriginSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(transformOriginSpaceTemp == 1) {
						transformOriginE.subTickerStatus.x = _constantValue.tickerStatusE;
						transformOriginE.nextMoveRate.x = transformOriginE.e.x;
					} else {
						transformOriginE.nextMoveRate.x = transformOriginE.s.x + (parseFloat(transformOriginE.travelRange.x) * parseFloat(transformOriginSpaceTemp));
					}
				} else {
					transformOriginE.nextMoveRate.x = transformOriginE.e.x;
				}

				if(transformOriginE.subTickerStatus.y != _constantValue.tickerStatusE) {
					transformOriginSpaceTemp = _j2eEngine.getSpace(renderConfig, e, direction);
					if(transformOriginSpaceTemp == 1) {
						transformOriginE.subTickerStatus.y = _constantValue.tickerStatusE;
						transformOriginE.nextMoveRate.y = transformOriginE.e.y;
					} else {
						transformOriginE.nextMoveRate.y = transformOriginE.s.y + (parseFloat(transformOriginE.travelRange.y) * parseFloat(transformOriginSpaceTemp));
					}
				} else {
					transformOriginE.nextMoveRate.y = transformOriginE.e.y;
				}

				if(transformOriginE.subTickerStatus.x == _constantValue.tickerStatusE &&
					 transformOriginE.subTickerStatus.y == _constantValue.tickerStatusE) {
					transformOriginE.tickerStatus = _constantValue.tickerStatusE;
				}
			},
			transformPerspectiveTicker: function(renderConfig, e, direction) {
				var transformPerspectiveE = e;
				if(transformPerspectiveE.tickerStatus != _constantValue.tickerStatusE) {
					var transformPerspectiveTemp = _j2eEngine.getSpace(renderConfig, e, direction);

					if(transformPerspectiveTemp == 1) {
					 	transformPerspectiveE.tickerStatus = _constantValue.tickerStatusE;
						transformPerspectiveE.nextMoveRate = transformPerspectiveE.e;
					} else {
						transformPerspectiveE.nextMoveRate =+ transformPerspectiveE.s + Math.round(parseFloat(transformPerspectiveE.travelRange) * parseFloat(transformPerspectiveTemp));
					}
				}
			}
		}






/*################################################################################################################################################
움직임을 위한 펑션들의 모음
################################################################################################################################################*/

		//사용자가 object를 움직이기 전에 object를 원하는 위치로 셋팅
		_j2eUtil.createFunction("setPosition", function(s, f) {
			s = typeof(s) === "object" ? s : typeof(f) === "object" ? f : null;
			f = typeof(s) === "function" ? s : typeof(f) === "function" ? f : null;

			var initPosition = "";
			var moveOrderInfo = {}; //CSS설정을 위한 임시 객체
			for (var key in s) {
				//모션에 대한 명령만 걸러서 저장
				if(_j2eType.getMotionOrderYn(key)) {
					if(_j2eType.getLineOrderYn(key)) {
						initPosition = _j2eCssUtil.getUnit(parseInt(s[key]), "", key);
					} else if(_j2eType.getMarginOrderYn(key)) { //마진 초기위치 지정
						var finishMarginPointTemp = s[key].split(",");

						if(finishMarginPointTemp.length == 1) {
							finishMarginPointTemp = {t : parseInt(finishMarginPointTemp[0].replace("px", "")),
																			 r : parseInt(finishMarginPointTemp[0].replace("px", "")),
																			 b : parseInt(finishMarginPointTemp[0].replace("px", "")),
																			 l : parseInt(finishMarginPointTemp[0].replace("px", ""))}
						} else if(finishMarginPointTemp.length == 2) {
							finishMarginPointTemp = {t : parseInt(finishMarginPointTemp[0].replace("px", "")),
																			 r : parseInt(finishMarginPointTemp[1].replace("px", "")),
																			 b : parseInt(finishMarginPointTemp[0].replace("px", "")),
																			 l : parseInt(finishMarginPointTemp[1].replace("px", ""))}
						} else if(finishMarginPointTemp.length == 3) {
							finishMarginPointTemp = {t : parseInt(finishMarginPointTemp[0].replace("px", "")),
																			 r : parseInt(finishMarginPointTemp[1].replace("px", "")),
																			 b : parseInt(finishMarginPointTemp[2].replace("px", "")),
																			 l : parseInt(finishMarginPointTemp[1].replace("px", ""))}
						} else if(finishMarginPointTemp.length == 4) {
							finishMarginPointTemp = {t : parseInt(finishMarginPointTemp[0].replace("px", "")),
																			 r : parseInt(finishMarginPointTemp[1].replace("px", "")),
																			 b : parseInt(finishMarginPointTemp[2].replace("px", "")),
																			 l : parseInt(finishMarginPointTemp[3].replace("px", ""))}
						}

						initPosition = _j2eCssUtil.getUnit(finishMarginPointTemp, "", key);
					} else if(_j2eType.getAreaOrderYn(key)) { //넓이 초기위치 지정
						initPosition = _j2eCssUtil.getUnit(parseInt(s[key]), "", key);
					} else if(_j2eType.getOpacityOrderYn(key)) { //투명도 초기위치 지정
						initPosition = _j2eCssUtil.getUnit(parseFloat(s[key]), "", key);
					} else if(_j2eType.getRgbOrderYn(key)) { //배경색 초기위치 지정
						initPosition = _j2eCssUtil.getUnit(_j2eCssUtil.hexToRgb(s[key]), "", key);
					} else if(_j2eType.getPerspectiveOrderYn(key)) { //시점 초기위치 지정
						initPosition = _j2eCssUtil.getUnit(parseFloat(s[key]), "", key);
					} else if(_j2eType.getScaleOrderYn(key)) { //크기변화 초기위치 세팅
						initPosition = _j2eCssUtil.getUnit({x : parseFloat(s[key].split(",")[0]), y : parseFloat(s[key].split(",")[1])}, "", key);
					} else if(_j2eType.getTransformPerspectiveOrderYn(key)) {
						moveOrderInfo.nextMoveRate = parseInt(s[key]);
					}

					if(_j2eType.getTransformOrderYn(key)) {
						var tempOrderInfoArray = this.renderConfig.arrMoveOrderInfo;
						if(tempOrderInfoArray != undefined) { //다시 움직임 명령
							if(tempOrderInfoArray[key] == undefined) { //신규 명령
								tempOrderInfoArray.push(key);
							}
							moveOrderInfo.tickerStatus = _constantValue.tickerStatusE;
							tempOrderInfoArray[key] = moveOrderInfo;
						} else { //처음 움직임 명령
							tempOrderInfoArray = [];
							tempOrderInfoArray.push(key);
							moveOrderInfo.tickerStatus = _constantValue.tickerStatusE;
							tempOrderInfoArray[key] = moveOrderInfo;
						}
						this.renderConfig.arrMoveOrderInfo = tempOrderInfoArray;
					} else {
						this.renderConfig.targetElement.style[key] = initPosition; //현제 움직임에 해당하는 단위;
					}
				}
			}

			return this;
		});

		//사용자가 object를 움직일때 사용자로부터 명령을 받는 함수
		_j2eUtil.createFunction("move", function(s, t, f) {
			s = typeof(s) === "object" ? s : typeof(t) === "object" ? t : typeof(f) === "object" ? f : null;
			t = typeof(s) === "number" ? s : typeof(t) === "number" ? t : typeof(f) === "number" ? f : null;
			f = typeof(s) === "function" ? s : typeof(t) === "function" ? t : typeof(f) === "function" ? f : null;

			//이동명령을 한번에 할지 순차적으로 할지 결정 기본(한번이 이동)
			if(s[_constantValue.continuity] != undefined) {
				this.renderConfig.continuity = s[_constantValue.continuity];
			} else {
				this.renderConfig.continuity = false;
			}

			//모션 반복 횟수 지정
			if(s[_constantValue.animationIterationCount] != undefined) {
				this.renderConfig.animationIterationCount = s[_constantValue.animationIterationCount];
			} else {
				this.renderConfig.animationIterationCount = 1;
			}

			if(this.renderConfig.continuity == false) { //모션 명령을 한번에 수행
				this.batchCssRenderingManager(s, t, f);
			} else {
				this.stepByStepCssRenderingManager(s, t, f);
			}

			return this;
		});

		_j2eUtil.createFunction("batchCssRenderingManager", function(s, t, f) {

			for (var key in s) {
				//모션에 대한 명령만 걸러서 저장 >> 이부분을 수정해야할거 같음
				if(_j2eType.getMotionOrderYn(key)) {
					var moveOrderInfo = _j2eCssUtil.getStartPosition(s[key], key, t, this, true);

					if(moveOrderInfo === false) {
						continue;
					}

					var tempOrderInfoArray = this.renderConfig.arrMoveOrderInfo;

					if(tempOrderInfoArray != undefined) { //다시 움직임 명령
						if(tempOrderInfoArray[key] == undefined) { //신규 명령
							tempOrderInfoArray.push(key);
						}
						moveOrderInfo.tickerStatus = _constantValue.tickerStatusS;
						tempOrderInfoArray[key] = moveOrderInfo;
					} else { //처음 움직임 명령
						tempOrderInfoArray = [];
						tempOrderInfoArray.push(key);
						moveOrderInfo.tickerStatus = _constantValue.tickerStatusS;
						tempOrderInfoArray[key] = moveOrderInfo;
					}
					this.renderConfig.arrMoveOrderInfo = tempOrderInfoArray;
				}
			}

			if( tempOrderInfoArray == undefined) {
				return false;
			}
			this.renderConfig.callBack = f; //콜백 함수

			var motionType = _constantValue.acceleratedMotion; //운동방식 - u : 등속운동, a : 가속운동, default : 가속운동

			if(s[_constantValue.motionType] != undefined) {
				if(s[_constantValue.motionType].toUpperCase() == _constantValue.uniformMotion || s[_constantValue.motionType].toUpperCase() == _constantValue.acceleratedMotion) {
					motionType = s[_constantValue.motionType].toUpperCase();
				}
			}
			this.renderConfig.motionType = motionType; //움직임 타입

			//다음 프레임으로 바뀔 시간 길이(requestAniFrame를 지원하지 않는 브라우저 일때 사용)
			if(!_j2eUtil.getRequestAnimationFrame()) {
				this.renderConfig.loopTime = Number(1000 / _commonConfig.defaultFps);
			}

			for(var i = 0; i < this.renderConfig.arrMoveOrderInfo.length; i++) {
				if(this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].tickerStatus == _constantValue.tickerStatusS) {
					this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].tickerStatus = _constantValue.tickerStatusI;
					this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].startTime = _j2eUtil.getTime();
					this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].lastUpdate = _j2eUtil.getTime();
					this.cssRendering(this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].moveKey, 0); //2D 런더링(방향, 반복 시작 카운트)
				}
			}

			return this;
		});

		_j2eUtil.createFunction("stepByStepCssRenderingManager", function(s, t, f) {

			var orderCount = 0;
			//모션 명령을 한번에 하나씩 수행일때 총 모션 수를 구한다.
			for (var key in s) {
				if( _j2eType.getMotionOrderYn(key)) {
					orderCount++;
				}
			}
			if(orderCount > 1) {
				t = t / orderCount;
			}

			for (var key in s) {
				//모션에 대한 명령만 걸러서 저장 처음에 한번 진입
				if(_j2eType.getMotionOrderYn(key)) {
					var moveOrderInfo = _j2eCssUtil.getStartPosition(s[key], key, t, this, false);
					var tempSbsOrderInfoArray = this.renderConfig.stepByStepMoveOrderInfoList;

					if(tempSbsOrderInfoArray != undefined) { //다시 움직임 명령
						moveOrderInfo.tickerStatus = _constantValue.tickerStatusS;
						moveOrderInfo.continuity = true;
						tempSbsOrderInfoArray.push(moveOrderInfo);
					} else { //처음 움직임 명령
						tempSbsOrderInfoArray = [];
						moveOrderInfo.tickerStatus = _constantValue.tickerStatusS;
						moveOrderInfo.continuity = true;
						tempSbsOrderInfoArray.push(moveOrderInfo);
					}
					this.renderConfig.stepByStepMoveOrderInfoList = tempSbsOrderInfoArray;
				}
			}

			if( tempSbsOrderInfoArray == undefined) {
				return false;
			}
			this.renderConfig.callBack = f; //콜백 함수

			var motionType = _constantValue.acceleratedMotion; //운동방식 - u : 등속운동, a : 가속운동, default : 가속운동

			if(s[_constantValue.motionType] != undefined) {
				if(s[_constantValue.motionType].toUpperCase() == _constantValue.uniformMotion || s[_constantValue.motionType].toUpperCase() == _constantValue.acceleratedMotion) {
					motionType = s[_constantValue.motionType].toUpperCase();
				}
			}
			this.renderConfig.motionType = motionType; //움직임 타입

			//다음 프레임으로 바뀔 시간 길이(requestAniFrame를 지원하지 않는 브라우저 일때 사용)
			if(!_j2eUtil.getRequestAnimationFrame()) {
				this.renderConfig.loopTime = Number(1000 / _commonConfig.defaultFps);
			}

			if(this.renderConfig.totalTickerStatus == undefined || this.renderConfig.totalTickerStatus == _constantValue.tickerStatusE) {
				this.renderConfig.totalTickerStatus = _constantValue.tickerStatusI; //전체 진행중
				this.renderConfig.stepByStepMoveOrderInfoList[0].tickerStatus = _constantValue.tickerStatusI;
				this.renderConfig.stepByStepMoveOrderInfoList[0].startTime = _j2eUtil.getTime();
				this.renderConfig.stepByStepMoveOrderInfoList[0].lastUpdate = _j2eUtil.getTime();
				this.stepByStepCssRendering(0); //2D 런더링(명령 순서)
			}

			return this;
		});

		function getCssRendering(){
			var returnFunction = "";
			var requestAniFrame = _j2eUtil.getRequestAnimationFrame();

			if(requestAniFrame) {

				returnFunction = function(direction, loopCntTemp) {
					var e = this.renderConfig.arrMoveOrderInfo[direction];
					var that = this;
					_j2eEngine.tickerManager(this.renderConfig, e, direction);

					if(e.tickerStatus == _constantValue.tickerStatusI) {
						requestAniFrame(function(time){

							if(_j2eType.getTransformOrderYn(direction)) {
								e.style.transform = _j2eCssUtil.getTransformUnit(that.renderConfig.arrMoveOrderInfo, direction); //현제 움직임에 해당하는 단위;
							} else {
								e.style[direction] = _j2eCssUtil.getUnit(e.nextMoveRate, e.u, direction); //현제 움직임에 해당하는 단위;
							}
							that.cssRendering(direction, Number(loopCntTemp + 1));
						});
					} else if(e.tickerStatus == _constantValue.tickerStatusE) {

						//마지막에 모자라는 px르 마추는 작업
						if(_j2eType.getTransformOrderYn(direction)) {
							e.style.transform = _j2eCssUtil.getTransformUnit(this.renderConfig.arrMoveOrderInfo, direction);
						} else {
							e.style[direction] = _j2eCssUtil.getUnit(e.nextMoveRate, e.u, direction);
						}

						//반복이 있다면 반복
						var totalEickerEnd = true;
						if(that.renderConfig.animationIterationCount !== 1) {
							for (var key in that.renderConfig.arrMoveOrderInfo) {
								if(that.renderConfig.arrMoveOrderInfo[key].tickerStatus === _constantValue.tickerStatusI ||
								   that.renderConfig.arrMoveOrderInfo[key].tickerStatus === _constantValue.tickerStatusS) {
									totalEickerEnd = false;
									break;
								}
							}
							if(totalEickerEnd) {
								if(that.renderConfig.animationIterationCount !== "infinite") {
									that.renderConfig.animationIterationCount = Number(that.renderConfig.animationIterationCount) - 1;
								}

								for(var i = 0, iLength =  that.renderConfig.arrMoveOrderInfo.length; i < iLength; i++) {
									that.renderConfig.arrMoveOrderInfo[that.renderConfig.arrMoveOrderInfo[i]].tickerStatus = _constantValue.tickerStatusI;
									that.renderConfig.arrMoveOrderInfo[that.renderConfig.arrMoveOrderInfo[i]].startTime = _j2eUtil.getTime();
									that.renderConfig.arrMoveOrderInfo[that.renderConfig.arrMoveOrderInfo[i]].lastUpdate = _j2eUtil.getTime();

									if(that.renderConfig.arrMoveOrderInfo[that.renderConfig.arrMoveOrderInfo[i]].subTickerStatus != undefined) {
										for(var subTickerStatusKey in that.renderConfig.arrMoveOrderInfo[that.renderConfig.arrMoveOrderInfo[i]].subTickerStatus) {
											that.renderConfig.arrMoveOrderInfo[that.renderConfig.arrMoveOrderInfo[i]].subTickerStatus[subTickerStatusKey] = _constantValue.tickerStatusI;
										}
									}

									that.cssRendering(that.renderConfig.arrMoveOrderInfo[that.renderConfig.arrMoveOrderInfo[i]].moveKey, 0); //2D 런더링(방향, 반복 시작 카운트)
								}
							}
						}
					}
				}
			} else {
				//TEST 여기 작동 유무 확인 필요
				returnFunction = function(direction, loopCntTemp){

					var e = this.renderConfig.arrMoveOrderInfo[direction];
					var that = this;
					_j2eEngine.tickerManager(this.renderConfig, e, direction);

					if(e.tickerStatus == _constantValue.tickerStatusI) {
						setTimeout(function(){

							if(_j2eType.getTransformOrderYn(direction)) {
								e.style.transform = _j2eCssUtil.getTransformUnit(that.renderConfig.arrMoveOrderInfo, direction); //현제 움직임에 해당하는 단위;
							} else {
								e.style[direction] = _j2eCssUtil.getUnit(e.nextMoveRate, e.u, direction); //현제 움직임에 해당하는 단위;
							}

							that.cssRendering(direction, Number(loopCntTemp + 1));
						}, Number(this.renderConfig.loopTime+1));
					} else if(e.tickerStatus == _constantValue.tickerStatusE) {
						//마지막에 모자라는 px르 마추는 작업
						if(_j2eType.getTransformOrderYn(direction)) {
							e.style.transform = _j2eCssUtil.getTransformUnit(this.renderConfig.arrMoveOrderInfo, direction); //현제 움직임에 해당하는 단위;
						} else {
							e.style[direction] = _j2eCssUtil.getUnit(e.nextMoveRate, e.u, direction); //현제 움직임에 해당하는 단위;
						}
					}
				}
			}

			return returnFunction;

		}
		_j2eUtil.createFunction("cssRendering", getCssRendering());


		function getStepByStepCssRendering(){
			var returnFunction = "";
			var requestAniFrame = _j2eUtil.getRequestAnimationFrame();

			if(requestAniFrame) {

				returnFunction = function(loopCntTemp) {

					var e = this.renderConfig.stepByStepMoveOrderInfoList[0];
					var that = this;
					_j2eEngine.tickerManager(this.renderConfig, e, e.moveKey);

					if(e.tickerStatus == _constantValue.tickerStatusI) {
						requestAniFrame(function(time){

							if(_j2eType.getTransformOrderYn(e.moveKey)) {
								e.style.transform = _j2eCssUtil.getStepByStepTransform2DUnit(that, e, e.moveKey); //현제 움직임에 해당하는 단위;
							} else {
								e.style[e.moveKey] = _j2eCssUtil.getUnit(e.nextMoveRate, e.u, e.moveKey); //현제 움직임에 해당하는 단위;
							}

							that.stepByStepCssRendering(Number(loopCntTemp + 1));
						});

					} else if(e.tickerStatus == _constantValue.tickerStatusE) {

						//마지막에 모자라는 px르 마추는 작업
						if(_j2eType.getTransformOrderYn(e.moveKey)) {
							e.style.transform = _j2eCssUtil.getStepByStepTransform2DUnit(that, e, e.moveKey);
						} else {
							e.style[e.moveKey] = _j2eCssUtil.getUnit(e.nextMoveRate, e.u, e.moveKey);
						}

						if(this.renderConfig.stepByStepMoveOrderInfoList != undefined && this.renderConfig.stepByStepMoveOrderInfoList.length > 1) {
								var stepByStepMoveOrderInfoListTemp = this.renderConfig.stepByStepMoveOrderInfoList.shift();
								var moveOrderInfo = _j2eCssUtil.getStartPosition(this.renderConfig.stepByStepMoveOrderInfoList[0].e, this.renderConfig.stepByStepMoveOrderInfoList[0].moveKey, this.renderConfig.stepByStepMoveOrderInfoList[0].duration, this, false);
								if(moveOrderInfo === false) {
									while(this.renderConfig.stepByStepMoveOrderInfoList.length > 1) {
										this.renderConfig.stepByStepMoveOrderInfoList.shift();
										moveOrderInfo = _j2eCssUtil.getStartPosition(this.renderConfig.stepByStepMoveOrderInfoList[0].e, this.renderConfig.stepByStepMoveOrderInfoList[0].moveKey, this.renderConfig.stepByStepMoveOrderInfoList[0].duration, this, false);
										if(moveOrderInfo !== false) {
											break;
										}
									}
								}

								if(moveOrderInfo !== false) {
									this.renderConfig.stepByStepMoveOrderInfoList[0] = moveOrderInfo;
									this.renderConfig.stepByStepMoveOrderInfoList[0].tickerStatus = _constantValue.tickerStatusI;
									this.renderConfig.stepByStepMoveOrderInfoList[0].startTime = _j2eUtil.getTime();
									this.renderConfig.stepByStepMoveOrderInfoList[0].lastUpdate = _j2eUtil.getTime();
									this.stepByStepCssRendering(0);
								}
						} else {
							var stepByStepMoveOrderInfoListTemp = this.renderConfig.stepByStepMoveOrderInfoList[0];
							this.renderConfig.stepByStepMoveOrderInfoList = undefined;
							this.renderConfig.totalTickerStatus = _constantValue.tickerStatusE;
						}

						var moveKeyTemp = stepByStepMoveOrderInfoListTemp.moveKey;
						// scale이면 X, Y도 하나로 통합
						if(_j2eType.getScaleOrderYn(moveKeyTemp)) {
							moveKeyTemp = _constantValue.scale;
							stepByStepMoveOrderInfoListTemp.moveKey = _constantValue.scale;
						}
						if(_constantValue.rotateZ == moveKeyTemp || _constantValue.rotate == moveKeyTemp) {
							moveKeyTemp = _constantValue.rotateZ;
							stepByStepMoveOrderInfoListTemp.moveKey = _constantValue.rotateZ;
						}
						var tempOrderInfoArray = this.renderConfig.moveOrderInfoListMemory;
						if(tempOrderInfoArray != undefined) { //다시 움직임 명령
							if(tempOrderInfoArray[moveKeyTemp] == undefined) { //신규 명령
								tempOrderInfoArray.push(moveKeyTemp);
							}
							tempOrderInfoArray[moveKeyTemp] = stepByStepMoveOrderInfoListTemp;
						} else { //처음 움직임 명령
							tempOrderInfoArray = [];
							tempOrderInfoArray.push(moveKeyTemp);
							tempOrderInfoArray[moveKeyTemp] = stepByStepMoveOrderInfoListTemp;
						}
						this.renderConfig.moveOrderInfoListMemory = tempOrderInfoArray;

						//반복이 있다면 반복
						if(this.renderConfig.totalTickerStatus === _constantValue.tickerStatusE && that.renderConfig.animationIterationCount !== 1) {
							var stepByStepMoveOrderInfoListArrTemp = [];
							for(var infoListI = 0, infoListE = this.renderConfig.moveOrderInfoListMemory.length; infoListI < infoListE; infoListI++) {
								stepByStepMoveOrderInfoListArrTemp[infoListI] = this.renderConfig.moveOrderInfoListMemory[this.renderConfig.moveOrderInfoListMemory[infoListI]];
							}
							this.renderConfig.stepByStepMoveOrderInfoList = stepByStepMoveOrderInfoListArrTemp;

							if(that.renderConfig.animationIterationCount !== "infinite") {
								that.renderConfig.animationIterationCount = Number(that.renderConfig.animationIterationCount) - 1;
							}

							that.renderConfig.moveOrderInfoListMemory = undefined;
							this.renderConfig.totalTickerStatus = _constantValue.tickerStatusI; //전체 진행중
							this.renderConfig.stepByStepMoveOrderInfoList[0].tickerStatus = _constantValue.tickerStatusI;
							this.renderConfig.stepByStepMoveOrderInfoList[0].startTime = _j2eUtil.getTime();
							this.renderConfig.stepByStepMoveOrderInfoList[0].lastUpdate = _j2eUtil.getTime();
							this.stepByStepCssRendering(0); //2D 런더링(명령 순서)
						}
					}
				}
			} else {
				//TEST 여기 작동 유무 확인 필요
				returnFunction = function(loopCntTemp){

					var e = this.renderConfig.arrMoveOrderInfo[0];
					var that = this;
					_j2eEngine.tickerManager(this.renderConfig, e, e.moveKey);

					if(e.tickerStatus == _constantValue.tickerStatusI) {
						setTimeout(function(){

							if(_j2eType.getTransformOrderYn(direction)) {
								e.style.transform = _j2eCssUtil.getStepByStepTransform2DUnit(that, e, e.moveKey); //현제 움직임에 해당하는 단위;
							} else {
								e.style[direction] = _j2eCssUtil.getUnit(e.nextMoveRate, e.u, e.moveKey); //현제 움직임에 해당하는 단위;
							}

							that.stepByStepCssRendering(Number(loopCntTemp + 1));
						}, Number(this.renderConfig.loopTime+1));
					} else if(e.tickerStatus == _constantValue.tickerStatusE) {
						//마지막에 모자라는 px르 마추는 작업
						if(_j2eType.getTransformOrderYn(e.moveKey)) {
							e.style.transform = _j2eCssUtil.getStepByStepTransform2DUnit(that, e, e.moveKey);
						} else {
							e.style[e.moveKey] = _j2eCssUtil.getUnit(e.nextMoveRate, e.moveKey);
						}

						if(this.renderConfig.stepByStepMoveOrderInfoList != undefined && this.renderConfig.stepByStepMoveOrderInfoList.length > 1) {
								var stepByStepMoveOrderInfoListTemp = this.renderConfig.stepByStepMoveOrderInfoList.shift();

								var moveOrderInfo = _j2eCssUtil.getStartPosition(this.renderConfig.stepByStepMoveOrderInfoList[0].e, this.renderConfig.stepByStepMoveOrderInfoList[0].moveKey, this.renderConfig.stepByStepMoveOrderInfoList[0].duration, this, false);
								if(moveOrderInfo === false) {
									while(this.renderConfig.stepByStepMoveOrderInfoList.length > 1) {
										this.renderConfig.stepByStepMoveOrderInfoList.shift();
										moveOrderInfo = _j2eCssUtil.getStartPosition(this.renderConfig.stepByStepMoveOrderInfoList[0].e, this.renderConfig.stepByStepMoveOrderInfoList[0].moveKey, this.renderConfig.stepByStepMoveOrderInfoList[0].duration, this, false);
										if(moveOrderInfo !== false) {
											break;
										}
									}
								}

								if(moveOrderInfo !== false) {
									this.renderConfig.stepByStepMoveOrderInfoList[0] = moveOrderInfo;
									this.renderConfig.stepByStepMoveOrderInfoList[0].tickerStatus = _constantValue.tickerStatusI;
									this.renderConfig.stepByStepMoveOrderInfoList[0].startTime = _j2eUtil.getTime();
									this.renderConfig.stepByStepMoveOrderInfoList[0].lastUpdate = _j2eUtil.getTime();
									this.stepByStepCssRendering(0);
								}
						} else {
							var stepByStepMoveOrderInfoListTemp = this.renderConfig.stepByStepMoveOrderInfoList[0];
							this.renderConfig.stepByStepMoveOrderInfoList = undefined;
							this.renderConfig.totalTickerStatus = _constantValue.tickerStatusE;
						}

						var moveKeyTemp = stepByStepMoveOrderInfoListTemp.moveKey;
						// scale이면 X, Y도 하나로 통합
						if(_j2eType.getScaleOrderYn(moveKeyTemp)) {
							moveKeyTemp = _constantValue.scale;
							stepByStepMoveOrderInfoListTemp.moveKey = _constantValue.scale;
						}
						if(_constantValue.rotateZ == moveKeyTemp || _constantValue.rotate == moveKeyTemp) {
							moveKeyTemp = _constantValue.rotateZ;
							stepByStepMoveOrderInfoListTemp.moveKey = _constantValue.rotateZ;
						}
						var tempOrderInfoArray = this.renderConfig.moveOrderInfoListMemory;
						if(tempOrderInfoArray != undefined) { //다시 움직임 명령
							if(tempOrderInfoArray[moveKeyTemp] == undefined) { //신규 명령
								tempOrderInfoArray.push(moveKeyTemp);
							}
							tempOrderInfoArray[moveKeyTemp] = stepByStepMoveOrderInfoListTemp;
						} else { //처음 움직임 명령
							tempOrderInfoArray = [];
							tempOrderInfoArray.push(moveKeyTemp);
							tempOrderInfoArray[moveKeyTemp] = stepByStepMoveOrderInfoListTemp;
						}
						this.renderConfig.moveOrderInfoListMemory = tempOrderInfoArray;
					}
				}
			}

			return returnFunction;
		}
		_j2eUtil.createFunction("stepByStepCssRendering", getStepByStepCssRendering());



		//사용자가 object를 움직임을 정지 시킬때 사용
		_j2eUtil.createFunction("kill", function() {

			if(this.renderConfig.continuity === false) {
				for(var i = 0; i < this.renderConfig.arrMoveOrderInfo.length; i++) {
					if(this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].tickerStatus != _constantValue.tickerStatusE) {
						this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].tickerStatus = _constantValue.tickerStatusE;
					}
				}
			}

			//순차적으로 이동시가 빠져 있음

			return this;
		});

		_j2e.init();

		window.j2e = _j2e.selector;
})(window);
