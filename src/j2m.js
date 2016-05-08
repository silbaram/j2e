(function(window){
	"use strict";

	function j2mObject() {}
	var j2mObjectArr = [];

	var
		_commonConfig = {
			defaultFps : 60 //기본 설정 프레임
		},
		_constantValue = {
			motionType : "motiontype", //모션 타입
			continuity : "continuity", //모션 명령을 한번에 하나씩 처리 할지 말지 결정 true : 한번에 한 움직임씩, false : 한번에 모든 움직임

			acceleratedMotion : "A",   //모션 타입 가속운동
			uniformMotion : "U",       //모션 타입 등속운동
			tickerStatusS : "S",       //모션 동작 시작 대기 상태
			tickerStatusI : "I",       //모션 진행중
			tickerStatusE : "E",       //모션 완료

			left : "left",             //x축 움직임 (왼쪽)
			right : "right",           //x축 움직임 (오른쪽)
			top : "top",               //y축 움직임 (아래쪽)
			bottom : "bottom",         //y축 움직임 (위쪽)
			margin : "margin",         //마진
			width : "width",           //넓이
			height : "height",         //높이
			opacity : "opacity",       //투명도
			backgroundColor : "backgroundColor", //배경색
			perspective : "perspective",
			scale : "scale",
			scaleX : "scaleX",
			scaleY : "scaleY",
			rotate : "rotate",
			rotateX : "rotateX",
			rotateY : "rotateY",
			rotateZ : "rotateZ",
			timeScale : 1
		},
		_j2m = {
			selector : function(e) {
				var renderConfig = {};
				var cloneObject = new j2mObject;

				if(typeof e == "object") {
					renderConfig.targetElement = e;
				} else {
					var c = "";
					if(e !== null) {
						c = e.substr(0, 1);
					};

					if(c === ".") {
						if (_j2mUtil.getBrowserKind().b == "msie") {
							renderConfig.targetElement = _j2mUtil.getIeElementsByClassName(e.substr(1, e.length))[0];
						} else {
							renderConfig.targetElement = document.getElementsByClassName(e.substr(1, e.length))[0];
						}
					}
					else if(c === "#") {
						renderConfig.targetElement = document.getElementById(e.substr(1, e.length));
					}
				}

				if(j2mObjectArr[renderConfig.targetElement.id] == undefined && j2mObjectArr[renderConfig.targetElement.className] == undefined) {
					cloneObject.renderConfig = renderConfig;

					if(renderConfig.targetElement.id != undefined) {
						j2mObjectArr.push(renderConfig.targetElement.id);
						j2mObjectArr[renderConfig.targetElement.id] = renderConfig;
					} else if(renderConfig.targetElement.className != undefined) {
						j2mObjectArr.push(renderConfig.targetElement.className);
						j2mObjectArr[renderConfig.targetElement.className] = renderConfig;
					}

				} else if(j2mObjectArr[renderConfig.targetElement.id] != undefined) {
					cloneObject.renderConfig = j2mObjectArr[renderConfig.targetElement.id];
				} else if(j2mObjectArr[renderConfig.targetElement.className] != undefined) {
					cloneObject.renderConfig = j2mObjectArr[renderConfig.targetElement.className];
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
		_j2mUtil = {
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
				j2mObject.prototype[n] = c;
			},
			getTime : Date.now || function() {return new Date * 1;}

		},
		_j2mCssUtil = {
			getStartPosition : function(finishPoint, key, t, that, checkTravelRange) {

				var moveOrderInfo = {}; //객체에 모션을 주기 위한 옵션들이 있는 객체
				moveOrderInfo.moveKey = key;
				moveOrderInfo.duration = t; //이동해야할 시간

				//모션 별로 초기값 세팅
				if(_j2mType.getLineOrderYn(key)) {
					var lineStyle = _j2mCssUtil.getStyle(that.renderConfig.targetElement);
					moveOrderInfo.s = lineStyle[key] == "auto" ? 0 : parseInt(lineStyle[key].replace("px", ""));
					moveOrderInfo.e = parseInt(finishPoint);
					moveOrderInfo.travelRange = parseInt(moveOrderInfo.e) - parseInt(moveOrderInfo.s);
					moveOrderInfo.nextMoveRate = 0; //처음 위치

					//이동할 거리 없음
					if(moveOrderInfo.travelRange == 0 && checkTravelRange == true) {
						return false;
					}

				} else if(_j2mType.getMarginOrderYn(key)) { //마진 관련 초기값 세팅

					var marginStyle = _j2mCssUtil.getStyle(that.renderConfig.targetElement);
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

				} else if(_j2mType.getAreaOrderYn(key)) { //넓이 관련 초기값 세팅

					var areaStyle = _j2mCssUtil.getStyle(that.renderConfig.targetElement);
					moveOrderInfo.s = parseInt(areaStyle[key].replace("px", ""));
					moveOrderInfo.e = parseInt(finishPoint);
					moveOrderInfo.travelRange = parseInt(moveOrderInfo.e) - parseInt(moveOrderInfo.s);
					moveOrderInfo.nextMoveRate = 0; //처음 위치

					//이동할 거리 없음
					if(moveOrderInfo.travelRange == 0 && checkTravelRange == true) {
						return false;
					}

				} else if(_j2mType.getOpacityYn(key)) { //투명도 초기값 세팅

					var opacityStyle = _j2mCssUtil.getStyle(that.renderConfig.targetElement);
					moveOrderInfo.s = parseFloat(opacityStyle.opacity); //처음 위치
					moveOrderInfo.e = parseFloat(finishPoint);
					moveOrderInfo.travelRange = parseFloat(moveOrderInfo.e) - parseFloat(moveOrderInfo.s);
					moveOrderInfo.nextMoveRate = 0; //처음 위치
				} else if(_j2mType.getRgbYn(key)) { //배경색 관련 초기값 세팅

					var startRgbCode = _j2mCssUtil.getStyle(that.renderConfig.targetElement)[moveOrderInfo.moveKey];
					if(startRgbCode.indexOf("#") == 0) {
						var rgbCodeArr = _j2mCssUtil.hexToRgb(startRgbCode);
						moveOrderInfo.s = {r : rgbCodeArr.r, g : rgbCodeArr.g, b : rgbCodeArr.b}
					} else {
						var rgbCodeArr = startRgbCode.substring(4).replace(")", "").split(",");
						moveOrderInfo.s = {r : parseInt(rgbCodeArr[0]), g : parseInt(rgbCodeArr[1]), b : parseInt(rgbCodeArr[2])}
					}

					moveOrderInfo.e = typeof(finishPoint) == "object" ? finishPoint : _j2mCssUtil.hexToRgb(finishPoint); //마지막 위치
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
				} else if(_j2mType.getPerspective(key)) {

					var perspectiveStyle = _j2mCssUtil.getStyle(that.renderConfig.targetElement);
					var regex = /[^0-9]/g;
					moveOrderInfo.s = perspectiveStyle[key] == "none" ? 0 : parseInt(perspectiveStyle[key].replace(regex, ''));
					moveOrderInfo.e = parseInt(finishPoint);
					moveOrderInfo.travelRange = parseInt(moveOrderInfo.e) - parseInt(moveOrderInfo.s);
					moveOrderInfo.nextMoveRate = 0; //처음 위치

					//이동할 거리 없음
					if(moveOrderInfo.travelRange == 0 && checkTravelRange == true) {
						return false;
					}
				} else if(_j2mType.getScaleYn(key)) { //크기변화 초기값 세팅

					var startScaleCode = _j2mCssUtil.getStyle(that.renderConfig.targetElement).transform;
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
						moveOrderInfo.e = {x : parseFloat(scaleX), y : parseFloat(parseFloat(typeof(finishPoint) == "object" ? finishPoint.y : finishPoint))}
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
				} else if(_j2mType.getRotate(key)) { //기울기변경 초기값 세팅
					key = key == _constantValue.rotate ? _constantValue.rotateZ : key;
					var startrotateCode = _j2mCssUtil.getStyle(that.renderConfig.targetElement).transform;
					if(startrotateCode == "none") {
						moveOrderInfo.s = 0;
					} else {
						var startRotateCodeCheck = that.renderConfig.targetElement.style.transform;

						if(checkTravelRange == true) {
							if(startRotateCodeCheck.indexOf(key) != -1) {
								var tempS = startRotateCodeCheck.substring(startRotateCodeCheck.indexOf(key)).split(")");
								var regex = /[^0-9]/g;
								moveOrderInfo.s = tempS[0].replace(regex, '');
							} else {
								var values = startrotateCode.split('(')[1].split(')')[0].split(',');
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
									var regex = /[^0-9]/g;
									moveOrderInfo.s = tempS[0].replace(regex, '');
								} else {
									var values = startrotateCode.split('(')[1].split(')')[0].split(',');
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
			getUnit : function(v, c) {
				if(_j2mType.getLineOrderYn(c) || _j2mType.getAreaOrderYn(c)) {
					return v+"px";
				} else if(_j2mType.getMarginOrderYn(c)) {
					return v.t+"px "+v.r+"px "+v.b+"px "+v.l+"px";
				}  else if(_j2mType.getPerspective(c)) {
					return v+"px";
				} else if(_j2mType.getOpacityYn(c)) {
					return v;
				} else if(_constantValue.backgroundColor == c) {
					return "rgb(" +v.r+", "+v.g+", "+v.b+")";
				}
				return null;
			},
			getTransform2DUnit : function(o, c) {
				var transformUnit = "";
				var orderInfo = o;
// transformUnit += "perspective( 600px )";
				if(_constantValue.scale == c) {
					transformUnit += " scale(" +orderInfo.scale.nextMoveRate.x+", "+orderInfo.scale.nextMoveRate.y+")";
				} else if(_constantValue.scaleX == c) {
					transformUnit += " scale(" +orderInfo.scaleX.nextMoveRate.x+", "+orderInfo.scaleX.nextMoveRate.y+")";
				} else if(_constantValue.scaleY == c) {
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

				return transformUnit;
			},
			getStepByStepTransform2DUnit : function(that, o, c) {
				var transformUnit = "";
				var orderInfo = o;

				if(that.renderConfig.moveOrderInfoListMemory != undefined) {
					for(var i = 0; i < that.renderConfig.moveOrderInfoListMemory.length; i++) {
						var moveOrderInfoListMemoryMoveKey = that.renderConfig.moveOrderInfoListMemory[that.renderConfig.moveOrderInfoListMemory[i]].moveKey;
						var moveOrderInfoListMemoryNextMoveRate = that.renderConfig.moveOrderInfoListMemory[that.renderConfig.moveOrderInfoListMemory[i]].nextMoveRate;

						if(_j2mType.getScaleYn(moveOrderInfoListMemoryMoveKey) && !_j2mType.getScaleYn(c)) {
							transformUnit += " scale(" +moveOrderInfoListMemoryNextMoveRate.x+", "+moveOrderInfoListMemoryNextMoveRate.y+")";
						}

						if(!_j2mType.getRotate(c)) {
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
					}
				}

				if(_j2mType.getScaleYn(c)) {
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

				return transformUnit;
			}
		},
		_j2mType = {
			getMotionOrderYn : function(c) {
				if(_constantValue.left == c || _constantValue.right == c || _constantValue.top == c || _constantValue.bottom == c ||
				   _constantValue.width == c || _constantValue.height == c || _constantValue.opacity == c || _constantValue.backgroundColor == c ||
				   _constantValue.scale == c || _constantValue.scaleX == c || _constantValue.scaleY == c || _constantValue.margin == c ||
					 _constantValue.rotateX == c || _constantValue.rotateY == c || _constantValue.rotateZ == c || _constantValue.rotate == c ||
					 _constantValue.perspective == c) {
					return true;
				}
				return false;
			},
			getLineOrderYn : function(c) {
				if(_constantValue.left == c || _constantValue.top == c || _constantValue.right == c || _constantValue.bottom == c) {
					return true;
				}
				return false;
			},
			getMarginOrderYn : function(c) {
				if(_constantValue.margin == c) {
					return true;
				}
				return false;
			},
			getAreaOrderYn : function(c) {
				if(_constantValue.width == c || _constantValue.height == c) {
					return true;
				}
				return false;
			},
			getOpacityYn : function(c) {
				if(_constantValue.opacity == c) {
					return true;
				}
				return false;
			},
			getRgbYn : function(c) {
				if(_constantValue.backgroundColor == c) {
					return true;
				}
				return false;
			},
			getPerspective : function(c) {
				if(_constantValue.perspective == c) {
					return true;
				}
				return false;
			},
			getScaleYn : function(c) {
				if(_constantValue.scale == c || _constantValue.scaleX == c || _constantValue.scaleY == c) {
					return true;
				}
				return false;
			},
			getRotate : function(c) {
				if(_constantValue.rotate == c || _constantValue.rotateX == c || _constantValue.rotateY == c || _constantValue.rotateZ == c) {
					return true;
				}
				return false;
			},
			getTransformYn : function(c) {
				if(_constantValue.scale == c  || _constantValue.scaleX == c || _constantValue.scaleY == c ||
					 _constantValue.rotate == c || _constantValue.rotateX == c || _constantValue.rotateY == c ||
					 _constantValue.rotateZ == c) {
					return true;
				}
				return false;
			}
		},
		_j2mEngine = {
			tickerManager : function(renderConfig, e, direction) {

				if(_j2mType.getLineOrderYn(direction)) {
					_j2mEngine.lineMotionTicker(renderConfig, e, direction);
				} else if(_j2mType.getMarginOrderYn(direction)) {
					_j2mEngine.marginTicker(renderConfig, e, direction);
				} else if(_j2mType.getAreaOrderYn(direction)) {
					_j2mEngine.areaMotionTicker(renderConfig, e, direction);
				} else if(_j2mType.getOpacityYn(direction)) {
					_j2mEngine.opacityTicker(renderConfig, e, direction);
				} else if(_j2mType.getRgbYn(direction)) {
					_j2mEngine.rgbTicker(renderConfig, e, direction);
				} else if(_j2mType.getPerspective(direction)) {
					_j2mEngine.perspectiveTicker(renderConfig, e, direction);
				} else if(_j2mType.getScaleYn(direction)) {
					_j2mEngine.scaleMotionTicker(renderConfig, e, direction);
				} else if(_j2mType.getRotate(direction)) {
					_j2mEngine.rotateMotionTicker(renderConfig, e, direction);
				}
			},
			getSpace : function(renderConfig, e, direction) {
				var spaceE = e;
				var elapsed = _j2mUtil.getTime() - spaceE.lastUpdate;
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
			lineMotionTicker : function(renderConfig, e, direction) {
				var lineE = e;
				if(lineE.tickerStatus != _constantValue.tickerStatusE) {
					var lineSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);

					if(lineSpaceTemp == 1) {
					 	lineE.tickerStatus = _constantValue.tickerStatusE;
						lineE.nextMoveRate = lineE.e;
					} else {
						lineE.nextMoveRate = lineE.s + Math.round(parseFloat(lineE.travelRange) * parseFloat(lineSpaceTemp));
					}
				}
			},
			marginTicker : function(renderConfig, e, direction) {
				var marginE = e;
				var marginSpaceTemp = 0;
				if(marginE.subTickerStatus.t != _constantValue.tickerStatusE) {
					marginSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);
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
					marginSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);
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
					marginSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);
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
					marginSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);
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
			areaMotionTicker : function(renderConfig, e, direction) {
				var areaE = e;
				if(areaE.tickerStatus != _constantValue.tickerStatusE) {
					var areaSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);

					if(areaSpaceTemp == 1) {
					 	areaE.tickerStatus = _constantValue.tickerStatusE;
						areaE.nextMoveRate = areaE.e;
					} else {
						areaE.nextMoveRate = areaE.s + Math.round(parseFloat(areaE.travelRange) * parseFloat(areaSpaceTemp));
					}
				}
			},
			opacityTicker : function(renderConfig, e, direction) {
				var opacityE = e;
				if(opacityE.tickerStatus != _constantValue.tickerStatusE) {
					var opacitySpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);

					if(opacitySpaceTemp == 1) {
					 	opacityE.tickerStatus = _constantValue.tickerStatusE;
						opacityE.nextMoveRate = opacityE.e;
					} else {
						opacityE.nextMoveRate = opacityE.s + (parseFloat(opacityE.travelRange) * parseFloat(opacitySpaceTemp));
					}
				}
			},
			rgbTicker : function(renderConfig, e, direction) {
				var rgbE = e;
				var rgbSpaceTemp = 0;
				if(rgbE.subTickerStatus.r != _constantValue.tickerStatusE) {
					rgbSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);
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
					rgbSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);
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
					rgbSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);

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
			perspectiveTicker : function(renderConfig, e, direction) {
				var perspectiveE = e;
				if(perspectiveE.tickerStatus != _constantValue.tickerStatusE) {
					var perspectiveSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);

					if(perspectiveSpaceTemp == 1) {
					 	perspectiveE.tickerStatus = _constantValue.tickerStatusE;
						perspectiveE.nextMoveRate = perspectiveE.e;
					} else {

						perspectiveE.nextMoveRate = perspectiveE.s + Math.round(parseFloat(perspectiveE.travelRange) * parseFloat(perspectiveSpaceTemp));
					}
				}
			},
			scaleMotionTicker : function(renderConfig, e, direction) {
				var scaleE = e;
				var scaleSpaceTemp = 0;
				if(scaleE.subTickerStatus.x != _constantValue.tickerStatusE) {
					scaleSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);
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
					scaleSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);
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
			rotateMotionTicker : function(renderConfig, e, direction) {
				var rotateE = e;
				if(rotateE.tickerStatus != _constantValue.tickerStatusE) {
					var rotateSpaceTemp = _j2mEngine.getSpace(renderConfig, e, direction);

					if(rotateSpaceTemp == 1) {
					 	rotateE.tickerStatus = _constantValue.tickerStatusE;
						rotateE.nextMoveRate = rotateE.e;
					} else {
						rotateE.nextMoveRate =+ rotateE.s + Math.round(parseFloat(rotateE.travelRange) * parseFloat(rotateSpaceTemp));
					}
				}
			}
		}






/*################################################################################################################################################
움직임을 위한 펑션들의 모음
################################################################################################################################################*/

		//사용자가 object를 움직이기 전에 object를 원하는 위치로 셋팅
		_j2mUtil.createFunction("setPosition", function(s, f) {
			s = typeof(s) === "object" ? s : typeof(f) === "object" ? f : null;
			f = typeof(s) === "function" ? s : typeof(f) === "function" ? f : null;

			var initPosition = "";
			for (var key in s) {
				//모션에 대한 명령만 걸러서 저장
				if(_j2mType.getMotionOrderYn(key)) {
					if(_j2mType.getLineOrderYn(key)) {
						initPosition = _j2mCssUtil.getUnit(parseInt(s[key]), key);
					} else if(_j2mType.getMarginOrderYn(key)) { //마진 초기위치 지정
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

						initPosition = _j2mCssUtil.getUnit(finishMarginPointTemp, key);
					} else if(_j2mType.getAreaOrderYn(key)) { //넓이 초기위치 지정
						initPosition = _j2mCssUtil.getUnit(parseInt(s[key]), key);
					} else if(_j2mType.getOpacityYn(key)) { //투명도 초기위치 지정
						initPosition = _j2mCssUtil.getUnit(parseFloat(s[key]), key);
					} else if(_j2mType.getRgbYn(key)) { //배경색 초기위치 지정
						initPosition = _j2mCssUtil.getUnit(_j2mCssUtil.hexToRgb(s[key]), key);
					} else if(_j2mType.getPerspective(key)) { //시점 초기위치 지정
						initPosition = _j2mCssUtil.getUnit(parseFloat(s[key]), key);
					} else if(_constantValue.scale == key) { //크기변화 초기위치 세팅
						initPosition = _j2mCssUtil.getUnit({x : parseFloat(s[key].split(",")[0]), y : parseFloat(s[key].split(",")[1])}, key);
					}

					if(_j2mType.getTransformYn(key)) {
						this.renderConfig.targetElement.style.transform = initPosition; //현제 움직임에 해당하는 단위;
					} else {
						this.renderConfig.targetElement.style[key] = initPosition; //현제 움직임에 해당하는 단위;
					}
				}
			}

			return this;
		});

		//사용자가 object를 움직일때 사용자로부터 명령을 받는 함수
		_j2mUtil.createFunction("move", function(s, t, f) {
			s = typeof(s) === "object" ? s : typeof(t) === "object" ? t : typeof(f) === "object" ? f : null;
			t = typeof(s) === "number" ? s : typeof(t) === "number" ? t : typeof(f) === "number" ? f : null;
			f = typeof(s) === "function" ? s : typeof(t) === "function" ? t : typeof(f) === "function" ? f : null;

			//이동명령을 한번에 할지 순차적으로 할지 결정 기본(한번이 이동)
			if(s[_constantValue.continuity] != undefined) {
				this.renderConfig.continuity = s[_constantValue.continuity];
			} else {
				this.renderConfig.continuity = false;
			}

			if(this.renderConfig.continuity == false) { //모션 명령을 한번에 수행
				this.batchCssRenderingManager(s, t, f);
			} else {
				this.stepByStepCssRenderingManager(s, t, f);
			}

			return this;
		});

		_j2mUtil.createFunction("batchCssRenderingManager", function(s, t, f) {

			for (var key in s) {
				//모션에 대한 명령만 걸러서 저장
				if(_j2mType.getMotionOrderYn(key)) {
					var moveOrderInfo = _j2mCssUtil.getStartPosition(s[key], key, t, this, true);

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
			if(!_j2mUtil.getRequestAnimationFrame()) {
				this.renderConfig.loopTime = Number(1000 / _commonConfig.defaultFps);
			}

			for(var i = 0; i < this.renderConfig.arrMoveOrderInfo.length; i++) {
				if(this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].tickerStatus == _constantValue.tickerStatusS) {
					this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].tickerStatus = _constantValue.tickerStatusI;
					this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].startTime = _j2mUtil.getTime();
					this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].lastUpdate = _j2mUtil.getTime();
					this.cssRendering(this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].moveKey, 0); //2D 런더링(방향, 반복 시작 카운트)
				}
			}

			return this;
		});

		_j2mUtil.createFunction("stepByStepCssRenderingManager", function(s, t, f) {

			var orderCount = 0;
			//모션 명령을 한번에 하나씩 수행일때 총 모션 수를 구한다.
			for (var key in s) {
				if( _j2mType.getMotionOrderYn(key)) {
					orderCount++;
				}
			}
			if(orderCount > 1) {
				t = t / orderCount;
			}

			for (var key in s) {
				//모션에 대한 명령만 걸러서 저장 처음에 한번 진입
				if(_j2mType.getMotionOrderYn(key)) {
					var moveOrderInfo = _j2mCssUtil.getStartPosition(s[key], key, t, this, false);
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
			if(!_j2mUtil.getRequestAnimationFrame()) {
				this.renderConfig.loopTime = Number(1000 / _commonConfig.defaultFps);
			}

			if(this.renderConfig.totalTickerStatus == undefined || this.renderConfig.totalTickerStatus == _constantValue.tickerStatusE) {
				this.renderConfig.totalTickerStatus = _constantValue.tickerStatusI; //전체 진행중
				this.renderConfig.stepByStepMoveOrderInfoList[0].tickerStatus = _constantValue.tickerStatusI;
				this.renderConfig.stepByStepMoveOrderInfoList[0].startTime = _j2mUtil.getTime();
				this.renderConfig.stepByStepMoveOrderInfoList[0].lastUpdate = _j2mUtil.getTime();
				this.stepByStepCssRendering(0); //2D 런더링(명령 순서)
			}

			return this;
		});

		function getCssRendering(){
			var returnFunction = "";
			var requestAniFrame = _j2mUtil.getRequestAnimationFrame();

			if(requestAniFrame) {

				returnFunction = function(direction, loopCntTemp) {

					var e = this.renderConfig.arrMoveOrderInfo[direction];
					var that = this;
					_j2mEngine.tickerManager(this.renderConfig, e, direction);

					if(e.tickerStatus == _constantValue.tickerStatusI) {
						requestAniFrame(function(time){

							if(_j2mType.getTransformYn(direction)) {
								e.style.transform = _j2mCssUtil.getTransform2DUnit(that.renderConfig.arrMoveOrderInfo, direction); //현제 움직임에 해당하는 단위;
							} else {
								e.style[direction] = _j2mCssUtil.getUnit(e.nextMoveRate, direction); //현제 움직임에 해당하는 단위;
							}
							that.cssRendering(direction, Number(loopCntTemp + 1));
						});
					} else if(e.tickerStatus == _constantValue.tickerStatusE) {

						//마지막에 모자라는 px르 마추는 작업
						if(_j2mType.getTransformYn(direction)) {
							e.style.transform = _j2mCssUtil.getTransform2DUnit(this.renderConfig.arrMoveOrderInfo, direction);
						} else {
							e.style[direction] = _j2mCssUtil.getUnit(e.nextMoveRate, direction);
						}
					}
				}
			} else {
				//TEST 여기 작동 유무 확인 필요
				returnFunction = function(direction, loopCntTemp){

					var e = this.renderConfig.arrMoveOrderInfo[direction];
					var that = this;
					_j2mEngine.tickerManager(this.renderConfig, e, direction);

					if(e.tickerStatus == _constantValue.tickerStatusI) {
						setTimeout(function(){

							if(_j2mType.getTransformYn(direction)) {
								e.style.transform = _j2mCssUtil.getTransform2DUnit(that.renderConfig.arrMoveOrderInfo, direction); //현제 움직임에 해당하는 단위;
							} else {
								e.style[direction] = _j2mCssUtil.getUnit(e.nextMoveRate, direction); //현제 움직임에 해당하는 단위;
							}

							that.cssRendering(direction, Number(loopCntTemp + 1));
						}, Number(this.renderConfig.loopTime+1));
					} else if(e.tickerStatus == _constantValue.tickerStatusE) {
						//마지막에 모자라는 px르 마추는 작업
						if(_j2mType.getTransformYn(direction)) {
							e.style.transform = _j2mCssUtil.getTransform2DUnit(this.renderConfig.arrMoveOrderInfo, direction); //현제 움직임에 해당하는 단위;
						} else {
							e.style[direction] = _j2mCssUtil.getUnit(e.nextMoveRate, direction); //현제 움직임에 해당하는 단위;
						}
					}
				}
			}

			return returnFunction;

		}
		_j2mUtil.createFunction("cssRendering", getCssRendering());


		function getStepByStepCssRendering(){
			var returnFunction = "";
			var requestAniFrame = _j2mUtil.getRequestAnimationFrame();

			if(requestAniFrame) {

				returnFunction = function(loopCntTemp) {

					var e = this.renderConfig.stepByStepMoveOrderInfoList[0];
					var that = this;
					_j2mEngine.tickerManager(this.renderConfig, e, e.moveKey);

					if(e.tickerStatus == _constantValue.tickerStatusI) {
						requestAniFrame(function(time){

							if(_j2mType.getTransformYn(e.moveKey)) {
								e.style.transform = _j2mCssUtil.getStepByStepTransform2DUnit(that, e, e.moveKey); //현제 움직임에 해당하는 단위;
							} else {
								e.style[e.moveKey] = _j2mCssUtil.getUnit(e.nextMoveRate, e.moveKey); //현제 움직임에 해당하는 단위;
							}

							that.stepByStepCssRendering(Number(loopCntTemp + 1));
						});

					} else if(e.tickerStatus == _constantValue.tickerStatusE) {

						//마지막에 모자라는 px르 마추는 작업
						if(_j2mType.getTransformYn(e.moveKey)) {
							e.style.transform = _j2mCssUtil.getStepByStepTransform2DUnit(that, e, e.moveKey);
						} else {
							e.style[e.moveKey] = _j2mCssUtil.getUnit(e.nextMoveRate, e.moveKey);
						}

						if(this.renderConfig.stepByStepMoveOrderInfoList != undefined && this.renderConfig.stepByStepMoveOrderInfoList.length > 1) {
								var stepByStepMoveOrderInfoListTemp = this.renderConfig.stepByStepMoveOrderInfoList.shift();

								var moveOrderInfo = _j2mCssUtil.getStartPosition(this.renderConfig.stepByStepMoveOrderInfoList[0].e, this.renderConfig.stepByStepMoveOrderInfoList[0].moveKey, this.renderConfig.stepByStepMoveOrderInfoList[0].duration, this, false);
								if(moveOrderInfo === false) {
									while(this.renderConfig.stepByStepMoveOrderInfoList.length > 1) {
										this.renderConfig.stepByStepMoveOrderInfoList.shift();
										moveOrderInfo = _j2mCssUtil.getStartPosition(this.renderConfig.stepByStepMoveOrderInfoList[0].e, this.renderConfig.stepByStepMoveOrderInfoList[0].moveKey, this.renderConfig.stepByStepMoveOrderInfoList[0].duration, this, false);
										if(moveOrderInfo !== false) {
											break;
										}
									}
								}

								if(moveOrderInfo !== false) {
									this.renderConfig.stepByStepMoveOrderInfoList[0] = moveOrderInfo;
									this.renderConfig.stepByStepMoveOrderInfoList[0].tickerStatus = _constantValue.tickerStatusI;
									this.renderConfig.stepByStepMoveOrderInfoList[0].startTime = _j2mUtil.getTime();
									this.renderConfig.stepByStepMoveOrderInfoList[0].lastUpdate = _j2mUtil.getTime();
									this.stepByStepCssRendering(0);
								}
						} else {
							var stepByStepMoveOrderInfoListTemp = this.renderConfig.stepByStepMoveOrderInfoList[0];
							this.renderConfig.stepByStepMoveOrderInfoList = undefined;
							this.renderConfig.totalTickerStatus = _constantValue.tickerStatusE;
						}

						var moveKeyTemp = stepByStepMoveOrderInfoListTemp.moveKey;
						// scale이면 X, Y도 하나로 통합
						if(_j2mType.getScaleYn(moveKeyTemp)) {
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
			} else {
				//TEST 여기 작동 유무 확인 필요
				returnFunction = function(loopCntTemp){

					var e = this.renderConfig.arrMoveOrderInfo[0];
					var that = this;
					_j2mEngine.tickerManager(this.renderConfig, e, e.moveKey);

					if(e.tickerStatus == _constantValue.tickerStatusI) {
						setTimeout(function(){

							if(_j2mType.getTransformYn(direction)) {
								e.style.transform = _j2mCssUtil.getStepByStepTransform2DUnit(that, e, e.moveKey); //현제 움직임에 해당하는 단위;
							} else {
								e.style[direction] = _j2mCssUtil.getUnit(e.nextMoveRate, e.moveKey); //현제 움직임에 해당하는 단위;
							}

							that.stepByStepCssRendering(Number(loopCntTemp + 1));
						}, Number(this.renderConfig.loopTime+1));
					} else if(e.tickerStatus == _constantValue.tickerStatusE) {
						//마지막에 모자라는 px르 마추는 작업
						if(_j2mType.getTransformYn(e.moveKey)) {
							e.style.transform = _j2mCssUtil.getStepByStepTransform2DUnit(that, e, e.moveKey);
						} else {
							e.style[e.moveKey] = _j2mCssUtil.getUnit(e.nextMoveRate, e.moveKey);
						}

						if(this.renderConfig.stepByStepMoveOrderInfoList != undefined && this.renderConfig.stepByStepMoveOrderInfoList.length > 1) {
								var stepByStepMoveOrderInfoListTemp = this.renderConfig.stepByStepMoveOrderInfoList.shift();

								var moveOrderInfo = _j2mCssUtil.getStartPosition(this.renderConfig.stepByStepMoveOrderInfoList[0].e, this.renderConfig.stepByStepMoveOrderInfoList[0].moveKey, this.renderConfig.stepByStepMoveOrderInfoList[0].duration, this, false);
								if(moveOrderInfo === false) {
									while(this.renderConfig.stepByStepMoveOrderInfoList.length > 1) {
										this.renderConfig.stepByStepMoveOrderInfoList.shift();
										moveOrderInfo = _j2mCssUtil.getStartPosition(this.renderConfig.stepByStepMoveOrderInfoList[0].e, this.renderConfig.stepByStepMoveOrderInfoList[0].moveKey, this.renderConfig.stepByStepMoveOrderInfoList[0].duration, this, false);
										if(moveOrderInfo !== false) {
											break;
										}
									}
								}

								if(moveOrderInfo !== false) {
									this.renderConfig.stepByStepMoveOrderInfoList[0] = moveOrderInfo;
									this.renderConfig.stepByStepMoveOrderInfoList[0].tickerStatus = _constantValue.tickerStatusI;
									this.renderConfig.stepByStepMoveOrderInfoList[0].startTime = _j2mUtil.getTime();
									this.renderConfig.stepByStepMoveOrderInfoList[0].lastUpdate = _j2mUtil.getTime();
									this.stepByStepCssRendering(0);
								}
						} else {
							var stepByStepMoveOrderInfoListTemp = this.renderConfig.stepByStepMoveOrderInfoList[0];
							this.renderConfig.stepByStepMoveOrderInfoList = undefined;
							this.renderConfig.totalTickerStatus = _constantValue.tickerStatusE;
						}

						var moveKeyTemp = stepByStepMoveOrderInfoListTemp.moveKey;
						// scale이면 X, Y도 하나로 통합
						if(_j2mType.getScaleYn(moveKeyTemp)) {
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
		_j2mUtil.createFunction("stepByStepCssRendering", getStepByStepCssRendering());


		//사용자가 object를 움직임을 정지 시킬때 사용
		_j2mUtil.createFunction("kill", function() {

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

		_j2m.init();

		window.j2m = _j2m.selector;
})(window);
