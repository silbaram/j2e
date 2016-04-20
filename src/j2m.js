(function(window){
	"use strict";

	function j2mObject() {}
	var j2mObjectArr = [];

	var
		_commonConfig = {
			defaultFps : 60, //기본 설정 프레임
			opacity : 45     //opacity 설정 프레임
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

			scale : "scale",

			modifyUP : "UP",
			modifyMIDDLE : "MIDDLE",
			modifyDOWN : "DOWN",
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
				if(_constantValue.left == c || _constantValue.top == c || _constantValue.right == c || _constantValue.bottom == c ||
				   _constantValue.width == c || _constantValue.height == c) {
					return v+"px";
				} else if(_j2mType.getMarginOrderYn(c)) {
					return v.t+"px "+v.r+"px "+v.b+"px "+v.l+"px";
				} else if(_constantValue.opacity == c) {
					return v;
				} else if(_constantValue.backgroundColor == c) {
					return "rgb(" +v.r+", "+v.g+", "+v.b+")";
				} else if(_constantValue.scale == c) {
					return "scale(" +v.x+", "+v.y+")";
				}
				return null;
			},
			getTime : Date.now || function() {return new Date * 1;}

		},
		_j2mType = {
			getMotionOrderYn : function(c) {
				if(_constantValue.left == c || _constantValue.right == c || _constantValue.top == c || _constantValue.bottom == c ||
				   _constantValue.width == c || _constantValue.height == c || _constantValue.opacity == c || _constantValue.backgroundColor == c ||
				   _constantValue.scale == c || _constantValue.margin == c) {
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
			getRgbYn : function(c) {
				if(_constantValue.backgroundColor == c) {
					return true;
				}
				return false;
			},
			getScaleYn : function(c) {
				if(_constantValue.scale == c) {
					return true;
				}
				return false;
			},
			getTransformYn : function(c) {
				if(_constantValue.scale == c) {
					return true;
				}
				return false;
			}
		},
		_j2mEngine = {
			tickerManager : function(renderConfig, direction) {

				if(_j2mType.getLineOrderYn(direction)) {
					if(renderConfig.motionType == _constantValue.uniformMotion) {
						_j2mEngine.lineUniformMotionTicker(renderConfig, direction);
					} else {
						_j2mEngine.lineAcceleratedMotionTicker(renderConfig, direction);
					}
				} else if(_j2mType.getMarginOrderYn(direction)) {
					_j2mEngine.marginTicker(renderConfig, direction);
				} else if(_j2mType.getAreaOrderYn(direction)) {
					if(renderConfig.motionType == _constantValue.uniformMotion) {
						_j2mEngine.areaUniformMotionTicker(renderConfig, direction);
					} else {
						_j2mEngine.areaAcceleratedMotionTicker(renderConfig, direction);
					}
				} else if(_constantValue.opacity == direction) {
					_j2mEngine.opacityTicker(renderConfig, direction);
				} else if(_j2mType.getRgbYn(direction)) {
					_j2mEngine.rgbTicker(renderConfig, direction);
				} else if(_j2mType.getScaleYn(direction)) {
					if(renderConfig.motionType == _constantValue.uniformMotion) {
						_j2mEngine.scaleUniformMotionTicker(renderConfig, direction);
					} else {
						_j2mEngine.scaleAcceleratedMotionTicker(renderConfig, direction);
					}

				}
			},
			getSpace : function(renderConfig, direction) {

				var elapsed = _j2mUtil.getTime() - renderConfig.arrMoveOrderInfo[direction].lastUpdate;

				if (elapsed > 500) {
					renderConfig.arrMoveOrderInfo[direction].startTime += elapsed - 33;
				}

				renderConfig.arrMoveOrderInfo[direction].lastUpdate += elapsed;
				renderConfig.arrMoveOrderInfo[direction].time = (renderConfig.arrMoveOrderInfo[direction].lastUpdate - renderConfig.arrMoveOrderInfo[direction].startTime) / 1000;

				var p = (renderConfig.arrMoveOrderInfo[direction].time * _constantValue.timeScale) / renderConfig.arrMoveOrderInfo[direction].duration;

				if(p >= 1) {
					return 1;
				}

				p = 1 - p;
				p *= p;

				return 1 - p;
			},
			lineUniformMotionTicker : function(renderConfig, direction) {
				//TEST 여기 작동 유무 확인 필요
				// if(renderConfig.arrMoveOrderInfo[direction].lineModifyType == _constantValue.modifyDOWN) {
				// 	if(renderConfig.arrMoveOrderInfo[direction].maxMoveRate >= renderConfig.arrMoveOrderInfo[direction].nextMoveRate) {
				// 		renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderConfig.arrMoveOrderInfo[direction].maxMoveRate;
				// 		renderConfig.arrMoveOrderInfo[direction].tickerStatus = _constantValue.tickerStatusE;
				// 		return;
				// 	}
				//
				// 	renderConfig.arrMoveOrderInfo[direction].nextMoveRate = parseFloat(renderConfig.arrMoveOrderInfo[direction].nextMoveRate) - parseFloat(renderConfig.arrMoveOrderInfo[direction].uniformMotionMoveRate);
				// } else {
				// 	if(renderConfig.arrMoveOrderInfo[direction].maxMoveRate <= renderConfig.arrMoveOrderInfo[direction].nextMoveRate) {
				// 		renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderConfig.arrMoveOrderInfo[direction].maxMoveRate;
				// 		renderConfig.arrMoveOrderInfo[direction].tickerStatus = _constantValue.tickerStatusE;
				// 		return;
				// 	}
				//
				// 	renderConfig.arrMoveOrderInfo[direction].nextMoveRate = parseFloat(renderConfig.arrMoveOrderInfo[direction].nextMoveRate) + parseFloat(renderConfig.arrMoveOrderInfo[direction].uniformMotionMoveRate);
				// }
			},
			lineAcceleratedMotionTicker : function(renderConfig, direction) {

				if(renderConfig.arrMoveOrderInfo[direction].tickerStatus != _constantValue.tickerStatusE) {
					var lineSpaceTemp = _j2mEngine.getSpace(renderConfig, direction);

					if(lineSpaceTemp == 1) {
					 	renderConfig.arrMoveOrderInfo[direction].tickerStatus = _constantValue.tickerStatusE;
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderConfig.arrMoveOrderInfo[direction].e;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderConfig.arrMoveOrderInfo[direction].s + Math.round(parseFloat(renderConfig.arrMoveOrderInfo[direction].travelRange) * parseFloat(lineSpaceTemp));
					}
				}
			},
			marginTicker : function(renderConfig, direction) {
				var spaceTemp = 0;
				if(renderConfig.arrMoveOrderInfo[direction].subTickerStatus.t != _constantValue.tickerStatusE) {
					spaceTemp = _j2mEngine.getSpace(renderConfig, direction);
					if(spaceTemp == 1) {
						renderConfig.arrMoveOrderInfo[direction].subTickerStatus.t = _constantValue.tickerStatusE;
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.t = renderConfig.arrMoveOrderInfo[direction].e.t;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.t = renderConfig.arrMoveOrderInfo[direction].s.t + Math.round(parseFloat(renderConfig.arrMoveOrderInfo[direction].travelRange.t) * parseFloat(spaceTemp));
					}
				} else {
					renderConfig.arrMoveOrderInfo[direction].nextMoveRate.t = renderConfig.arrMoveOrderInfo[direction].e.t;
				}

				//right 이동
				if(renderConfig.arrMoveOrderInfo[direction].subTickerStatus.r != _constantValue.tickerStatusE) {
					spaceTemp = _j2mEngine.getSpace(renderConfig, direction);
					if(spaceTemp == 1) {
						renderConfig.arrMoveOrderInfo[direction].subTickerStatus.r = _constantValue.tickerStatusE;
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.r = renderConfig.arrMoveOrderInfo[direction].e.r;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.r = renderConfig.arrMoveOrderInfo[direction].s.r + Math.round(parseFloat(renderConfig.arrMoveOrderInfo[direction].travelRange.r) * parseFloat(spaceTemp));
					}
				} else {
					renderConfig.arrMoveOrderInfo[direction].nextMoveRate.r = renderConfig.arrMoveOrderInfo[direction].e.r;
				}

				//bottom 이동
				if(renderConfig.arrMoveOrderInfo[direction].subTickerStatus.b != _constantValue.tickerStatusE) {
					spaceTemp = _j2mEngine.getSpace(renderConfig, direction);
					if(spaceTemp == 1) {
						renderConfig.arrMoveOrderInfo[direction].subTickerStatus.b = _constantValue.tickerStatusE;
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.b = renderConfig.arrMoveOrderInfo[direction].e.b;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.b = renderConfig.arrMoveOrderInfo[direction].s.b + Math.round(parseFloat(renderConfig.arrMoveOrderInfo[direction].travelRange.b) * parseFloat(spaceTemp));
					}
				} else {
					renderConfig.arrMoveOrderInfo[direction].nextMoveRate.b = renderConfig.arrMoveOrderInfo[direction].e.b;
				}

				//left 이동
				if(renderConfig.arrMoveOrderInfo[direction].subTickerStatus.l != _constantValue.tickerStatusE) {
					spaceTemp = _j2mEngine.getSpace(renderConfig, direction);
					if(spaceTemp == 1) {
						renderConfig.arrMoveOrderInfo[direction].subTickerStatus.l = _constantValue.tickerStatusE;
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.l = renderConfig.arrMoveOrderInfo[direction].e.l;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.l = renderConfig.arrMoveOrderInfo[direction].s.l + Math.round(parseFloat(renderConfig.arrMoveOrderInfo[direction].travelRange.l) * parseFloat(spaceTemp));
					}
				} else {
					renderConfig.arrMoveOrderInfo[direction].nextMoveRate.l = renderConfig.arrMoveOrderInfo[direction].e.l;
				}

				if(renderConfig.arrMoveOrderInfo[direction].subTickerStatus.t == _constantValue.tickerStatusE &&
				   renderConfig.arrMoveOrderInfo[direction].subTickerStatus.r == _constantValue.tickerStatusE &&
				 	 renderConfig.arrMoveOrderInfo[direction].subTickerStatus.b == _constantValue.tickerStatusE &&
				   renderConfig.arrMoveOrderInfo[direction].subTickerStatus.l == _constantValue.tickerStatusE) {
					renderConfig.arrMoveOrderInfo[direction].tickerStatus = _constantValue.tickerStatusE;
				}
			},
			areaUniformMotionTicker : function(renderConfig, direction) {
				//TEST 여기 작동 유무 확인 필요
				// if(renderConfig.arrMoveOrderInfo[direction].areaModifyType == _constantValue.modifyDOWN) {
				// 	if(renderConfig.arrMoveOrderInfo[direction].maxMoveRate >= renderConfig.arrMoveOrderInfo[direction].nextMoveRate) {
				// 		renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderConfig.arrMoveOrderInfo[direction].maxMoveRate;
				// 		renderConfig.arrMoveOrderInfo[direction].tickerStatus = _constantValue.tickerStatusE;
				// 		return;
				// 	}
				//
				// 	renderConfig.arrMoveOrderInfo[direction].nextMoveRate = parseFloat(renderConfig.arrMoveOrderInfo[direction].nextMoveRate) - parseFloat(renderConfig.arrMoveOrderInfo[direction].uniformMotionMoveRate);
				// } else {
				// 	if(renderConfig.arrMoveOrderInfo[direction].maxMoveRate <= renderConfig.arrMoveOrderInfo[direction].nextMoveRate) {
				// 		renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderConfig.arrMoveOrderInfo[direction].maxMoveRate;
				// 		renderConfig.arrMoveOrderInfo[direction].tickerStatus = _constantValue.tickerStatusE;
				// 		return;
				// 	}
				//
				// 	renderConfig.arrMoveOrderInfo[direction].nextMoveRate = parseFloat(renderConfig.arrMoveOrderInfo[direction].nextMoveRate) + parseFloat(renderConfig.arrMoveOrderInfo[direction].uniformMotionMoveRate);
				// }
			},
			areaAcceleratedMotionTicker : function(renderConfig, direction) {
				if(renderConfig.arrMoveOrderInfo[direction].tickerStatus != _constantValue.tickerStatusE) {
					var lineSpaceTemp = _j2mEngine.getSpace(renderConfig, direction);

					if(lineSpaceTemp == 1) {
					 	renderConfig.arrMoveOrderInfo[direction].tickerStatus = _constantValue.tickerStatusE;
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderConfig.arrMoveOrderInfo[direction].e;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderConfig.arrMoveOrderInfo[direction].s + Math.round(parseFloat(renderConfig.arrMoveOrderInfo[direction].travelRange) * parseFloat(lineSpaceTemp));
					}
				}
			},
			opacityTicker : function(renderConfig, direction) {
				if(renderConfig.arrMoveOrderInfo[direction].opacityModifyType == _constantValue.modifyDOWN) {
					if(renderConfig.arrMoveOrderInfo[direction].maxMoveRate >= renderConfig.arrMoveOrderInfo[direction].nextMoveRate) {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderConfig.arrMoveOrderInfo[direction].maxMoveRate;
						renderConfig.arrMoveOrderInfo[direction].tickerStatus = _constantValue.tickerStatusE;
						return;
					}

					renderConfig.arrMoveOrderInfo[direction].nextMoveRate = parseFloat(renderConfig.arrMoveOrderInfo[direction].nextMoveRate) - parseFloat(renderConfig.arrMoveOrderInfo[direction].opacityRate);
				} else {
					if(renderConfig.arrMoveOrderInfo[direction].maxMoveRate <= renderConfig.arrMoveOrderInfo[direction].nextMoveRate) {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderConfig.arrMoveOrderInfo[direction].maxMoveRate;
						renderConfig.arrMoveOrderInfo[direction].tickerStatus = _constantValue.tickerStatusE;
						return;
					}

					renderConfig.arrMoveOrderInfo[direction].nextMoveRate = parseFloat(renderConfig.arrMoveOrderInfo[direction].nextMoveRate) + parseFloat(renderConfig.arrMoveOrderInfo[direction].opacityRate);
				}
			},
			rgbTicker : function(renderConfig, direction) {

				var tickerFinishCount = 0;
				if(renderConfig.arrMoveOrderInfo[direction].rgbModifyType.r == _constantValue.modifyDOWN) {
					if(renderConfig.arrMoveOrderInfo[direction].maxRRBRate.r >= renderConfig.arrMoveOrderInfo[direction].nextMoveRate.r || renderConfig.arrMoveOrderInfo[direction].rgbRate.r == 0) {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.r = renderConfig.arrMoveOrderInfo[direction].maxRRBRate.r;
						tickerFinishCount++;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.r = renderConfig.arrMoveOrderInfo[direction].nextMoveRate.r - renderConfig.arrMoveOrderInfo[direction].rgbRate.r;
					}
				} else {
					if(renderConfig.arrMoveOrderInfo[direction].maxRRBRate.r <= renderConfig.arrMoveOrderInfo[direction].nextMoveRate.r || renderConfig.arrMoveOrderInfo[direction].rgbRate.r == 0) {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.r = renderConfig.arrMoveOrderInfo[direction].maxRRBRate.r;
						tickerFinishCount++;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.r = renderConfig.arrMoveOrderInfo[direction].nextMoveRate.r + renderConfig.arrMoveOrderInfo[direction].rgbRate.r;
					}
				}
				if(renderConfig.arrMoveOrderInfo[direction].rgbModifyType.g == _constantValue.modifyDOWN) {
					if(renderConfig.arrMoveOrderInfo[direction].maxRRBRate.g >= renderConfig.arrMoveOrderInfo[direction].nextMoveRate.g || renderConfig.arrMoveOrderInfo[direction].rgbRate.g ==0) {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.g = renderConfig.arrMoveOrderInfo[direction].maxRRBRate.g;
						tickerFinishCount++;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.g = renderConfig.arrMoveOrderInfo[direction].nextMoveRate.g - renderConfig.arrMoveOrderInfo[direction].rgbRate.g;
					}
				} else {
					if(renderConfig.arrMoveOrderInfo[direction].maxRRBRate.g <= renderConfig.arrMoveOrderInfo[direction].nextMoveRate.g || renderConfig.arrMoveOrderInfo[direction].rgbRate.g == 0) {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.g = renderConfig.arrMoveOrderInfo[direction].maxRRBRate.g;
						tickerFinishCount++;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.g = renderConfig.arrMoveOrderInfo[direction].nextMoveRate.g + renderConfig.arrMoveOrderInfo[direction].rgbRate.g;
					}
				}
				if(renderConfig.arrMoveOrderInfo[direction].rgbModifyType.b == _constantValue.modifyDOWN) {
					if(renderConfig.arrMoveOrderInfo[direction].maxRRBRate.b >= renderConfig.arrMoveOrderInfo[direction].nextMoveRate.b || renderConfig.arrMoveOrderInfo[direction].rgbRate.b == 0) {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.b = renderConfig.arrMoveOrderInfo[direction].maxRRBRate.b;
						tickerFinishCount++;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.b = renderConfig.arrMoveOrderInfo[direction].nextMoveRate.b - renderConfig.arrMoveOrderInfo[direction].rgbRate.b;
					}
				} else {
					if(renderConfig.arrMoveOrderInfo[direction].maxRRBRate.b <= renderConfig.arrMoveOrderInfo[direction].nextMoveRate.b || renderConfig.arrMoveOrderInfo[direction].rgbRate.b == 0) {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.b = renderConfig.arrMoveOrderInfo[direction].maxRRBRate.b;
						tickerFinishCount++;
					} else {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.b = renderConfig.arrMoveOrderInfo[direction].nextMoveRate.b + renderConfig.arrMoveOrderInfo[direction].rgbRate.b;
					}
				}

				//if(renderConfig.continuity == true && tickerFinishCount == 3) {
				if(tickerFinishCount == 3) {
					renderConfig.arrMoveOrderInfo[direction].tickerStatus = _constantValue.tickerStatusE;
				}
			},
			scaleAcceleratedMotionTicker : function(renderConfig, direction) {

				var scaleIickerFinishCount = 0;
				//X축 이동
				if(renderConfig.arrMoveOrderInfo[direction].scaleModifyType.x == _constantValue.modifyMIDDLE) {
					scaleIickerFinishCount++;
				} else {
					renderConfig.arrMoveOrderInfo[direction].ratio.x = _j2mEngine.getSpace(renderConfig, direction); //다음이동 비율

					if(renderConfig.arrMoveOrderInfo[direction].nextMoveRate.x == renderConfig.arrMoveOrderInfo[direction].maxScaleRate.x) {
						scaleIickerFinishCount++;
					} else if(renderConfig.arrMoveOrderInfo[direction].ratio.bx > renderConfig.arrMoveOrderInfo[direction].ratio.x) {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.x = parseFloat(renderConfig.arrMoveOrderInfo[direction].maxScaleRate.x);
					} else {
						renderConfig.arrMoveOrderInfo[direction].ratio.bx = renderConfig.arrMoveOrderInfo[direction].ratio.x;
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.x = parseFloat(renderConfig.arrMoveOrderInfo[direction].maxScaleRate.x-renderConfig.arrMoveOrderInfo[direction].startScaleRate.x) * parseFloat(renderConfig.arrMoveOrderInfo[direction].ratio.x);
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.x += parseFloat(renderConfig.arrMoveOrderInfo[direction].startScaleRate.x);
					}
				}

				//Y축 이동
				if(renderConfig.arrMoveOrderInfo[direction].scaleModifyType.y == _constantValue.modifyMIDDLE) {
					scaleIickerFinishCount++;
				} else {
					renderConfig.arrMoveOrderInfo[direction].ratio.y = _j2mEngine.getSpace(renderConfig, direction); //다음이동 비율
					if(renderConfig.arrMoveOrderInfo[direction].nextMoveRate.y == renderConfig.arrMoveOrderInfo[direction].maxScaleRate.y) {
						scaleIickerFinishCount++;
					} else if(renderConfig.arrMoveOrderInfo[direction].ratio.by > renderConfig.arrMoveOrderInfo[direction].ratio.y) {
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.y = parseFloat(renderConfig.arrMoveOrderInfo[direction].maxScaleRate.y);
					} else {
						renderConfig.arrMoveOrderInfo[direction].ratio.by = renderConfig.arrMoveOrderInfo[direction].ratio.y;
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.y = parseFloat(renderConfig.arrMoveOrderInfo[direction].maxScaleRate.y-renderConfig.arrMoveOrderInfo[direction].startScaleRate.y) * parseFloat(renderConfig.arrMoveOrderInfo[direction].ratio.y);
						renderConfig.arrMoveOrderInfo[direction].nextMoveRate.y += parseFloat(renderConfig.arrMoveOrderInfo[direction].startScaleRate.y);
					}
				}

				if(scaleIickerFinishCount == 2) {
					renderConfig.arrMoveOrderInfo[direction].tickerStatus = _constantValue.tickerStatusE;
				}
			}
		}






/*################################################################################################################################################
움직임을 위한 펑션들의 모음
################################################################################################################################################*/

		//사용자가 dom을 움직일때 사용자로부터 명령을 받는 함수
		_j2mUtil.createFunction("move", function(s, t) {

			if(typeof(s) === "object" && typeof(t) === "number") {
				this.randerFactoryManager(s, t);
			} else if (typeof(s) === "number" && typeof(t) === "object") {
				this.randerFactoryManager(t, s);
			}

			return this;
		});

		_j2mUtil.createFunction("randerFactoryManager", function(s, t) {
			var arrMoveOrderInfo = [];                         //사용자가 움직임을 설정한 내용
			var motionType = _constantValue.acceleratedMotion; //운동방식 - u : 등속운동, a : 가속운동, default : 가속운동

			if(s[_constantValue.motionType] != undefined) {
				if(s[_constantValue.motionType].toUpperCase() == _constantValue.uniformMotion || s[_constantValue.motionType].toUpperCase() == _constantValue.acceleratedMotion) {
					motionType = s[_constantValue.motionType].toUpperCase();
				}
			}

			//이동명령을 한번에 할지 순차적으로 할지 결정 기본(한번이 이동)
			if(s[_constantValue.continuity] != undefined) {
				this.renderConfig.continuity = s[_constantValue.continuity];
			} else {
				this.renderConfig.continuity = false;
			}
			var orderCount = 0;
			if(this.renderConfig.continuity == true) {
				//모션 명령을 한번에 하나씩 수행일때 총 모션 수를 구한다.
				for (var key in s) {
					if( _j2mType.getMotionOrderYn(key)) {
						orderCount++;
					}
				}
				if(orderCount > 1) {
					t = t / orderCount;
				}
			}

			for (var key in s) {
				var moveOrderInfo = {}; //객체에 모션을 주기 위한 옵션들이 있는 객체

				//모션에 대한 명령만 걸러서 저장
				if(_j2mType.getMotionOrderYn(key)) {
					//TEST 여기 주석한 부분을 삭제할것인가? 다른 오류가 없다면 삭제하는걸로
					if(_constantValue.opacity != key && s[key] == 0) {
						//continue;
					}
					moveOrderInfo.moveKey = key;
					moveOrderInfo.duration = t; //이동해야할 시간

					//모션 별로 초기값 세팅
					if(_j2mType.getLineOrderYn(key)) {

						var lineStyle = _j2mUtil.getStyle(this.renderConfig.targetElement);
						moveOrderInfo.s = lineStyle[key] == "auto" ? 0 : parseInt(lineStyle[key].replace("px", ""));
						moveOrderInfo.e = parseInt(s[key]);
						moveOrderInfo.travelRange = parseInt(moveOrderInfo.e) - parseInt(moveOrderInfo.s);
						moveOrderInfo.nextMoveRate = 0; //처음 위치
						//moveOrderInfo.lineModifyType = moveOrderInfo.s < s[key] ? _constantValue.modifyUP : _constantValue.modifyDOWN;

						//이동할 거리 없음
						if(moveOrderInfo.travelRange == 0) {
							continue;
						}

					} else if(_j2mType.getMarginOrderYn(key)) { //마진 관련 초기값 세팅

						var marginStyle = _j2mUtil.getStyle(this.renderConfig.targetElement);
						moveOrderInfo.s = {t : parseInt(marginStyle["margin-top"].replace("px", "")),
															 r : parseInt(marginStyle["margin-right"].replace("px", "")),
															 b : parseInt(marginStyle["margin-bottom"].replace("px", "")),
															 l : parseInt(marginStyle["margin-left"].replace("px", ""))}

						var finishMarginPointTemp = s[key].split(",");

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
						   moveOrderInfo.subTickerStatus.b == _constantValue.tickerStatusE && moveOrderInfo.subTickerStatus.l == _constantValue.tickerStatusE) {
								 continue;
					  }

					} else if(_j2mType.getAreaOrderYn(key)) { //넓이 관련 초기값 세팅

						var areaStyle = _j2mUtil.getStyle(this.renderConfig.targetElement);
						moveOrderInfo.s = parseInt(areaStyle[key].replace("px", ""));
						moveOrderInfo.e = parseInt(s[key]);
						moveOrderInfo.travelRange = parseInt(moveOrderInfo.e) - parseInt(moveOrderInfo.s);
						moveOrderInfo.nextMoveRate = 0; //처음 위치
						// moveOrderInfo.areaModifyType = moveOrderInfo.startAreaRate < s[key] ? _constantValue.modifyUP : _constantValue.modifyDOWN;

						//이동할 거리 없음
						if(moveOrderInfo.travelRange == 0) {
							continue;
						}

					} else if(_constantValue.opacity == key) { //투명도 초기값 세팅
						var opacityStyle = _j2mUtil.getStyle(this.renderConfig.targetElement);
						moveOrderInfo.nextMoveRate = opacityStyle.opacity; //처음 위치
						moveOrderInfo.maxMoveRate = s[key]; //마지막 위치
						moveOrderInfo.opacityRate = Number( Math.abs(Number(s[key]-opacityStyle.opacity)) / (t * _commonConfig.opacity)); //opacity시에 다음에 적용해야할 변화 비율
						moveOrderInfo.opacityModifyType = Number(s[key]-opacityStyle.opacity) > 0 ? _constantValue.modifyUP : _constantValue.modifyDOWN;

					} else if(_j2mType.getRgbYn(key)) { //배경색 관련 초기값 세팅
						var startRgbCode = _j2mUtil.getStyle(this.renderConfig.targetElement)[moveOrderInfo.moveKey];
						if(startRgbCode.indexOf("#") == 0) {
							var rgbCodeArr = _j2mUtil.hexToRgb(startRgbCode);
							moveOrderInfo.nextMoveRate = {r : rgbCodeArr.r, g : rgbCodeArr.g, b : rgbCodeArr.b}
						} else {
							var rgbCodeArr = startRgbCode.substring(4).replace(")", "").split(",");
							moveOrderInfo.nextMoveRate = {r : parseInt(rgbCodeArr[0]), g : parseInt(rgbCodeArr[1]), b : parseInt(rgbCodeArr[2])}
						}

						moveOrderInfo.maxRRBRate = _j2mUtil.hexToRgb(s[key]); //마지막 위치

						//x, y양쪽다 미들이면 변화가 없으므로 무시
						if(moveOrderInfo.maxRRBRate.r == moveOrderInfo.nextMoveRate.r &&
							 moveOrderInfo.maxRRBRate.g == moveOrderInfo.nextMoveRate.g &&
							 moveOrderInfo.maxRRBRate.b == moveOrderInfo.nextMoveRate.b) {
							continue;
						}

						moveOrderInfo.rgbModifyType = {
							r : moveOrderInfo.nextMoveRate.r > moveOrderInfo.maxRRBRate.r ? _constantValue.modifyDOWN : _constantValue.modifyUP,
							g : moveOrderInfo.nextMoveRate.g > moveOrderInfo.maxRRBRate.g ? _constantValue.modifyDOWN : _constantValue.modifyUP,
							b : moveOrderInfo.nextMoveRate.b > moveOrderInfo.maxRRBRate.b ? _constantValue.modifyDOWN : _constantValue.modifyUP}

						moveOrderInfo.rgbRate = {
							r : Math.round(Math.abs(Number(moveOrderInfo.nextMoveRate.r-moveOrderInfo.maxRRBRate.r)) / (t * _commonConfig.opacity)),
							g : Math.round(Math.abs(Number(moveOrderInfo.nextMoveRate.g-moveOrderInfo.maxRRBRate.g)) / (t * _commonConfig.opacity)),
							b : Math.round(Math.abs(Number(moveOrderInfo.nextMoveRate.b-moveOrderInfo.maxRRBRate.b)) / (t * _commonConfig.opacity))}
					} else if(_constantValue.scale == key) { //크기변화 초기값 세팅
						var startScaleCode = _j2mUtil.getStyle(this.renderConfig.targetElement)["transform"];

						//처음 시작 위치 지정
						if(startScaleCode == "none") {
							moveOrderInfo.startScaleRate = {x : 1, y : 1}
							moveOrderInfo.nextMoveRate = {x : 1, y : 1}
						} else {
							var startScaleCodeArr = startScaleCode.substring(7).replace(")", "").split(",");
							moveOrderInfo.startScaleRate = {x : parseFloat(startScaleCodeArr[0]), y :parseFloat( startScaleCodeArr[3])}
							moveOrderInfo.nextMoveRate = {x : parseFloat(startScaleCodeArr[0]), y :parseFloat( startScaleCodeArr[3])}
						}
						//최종 목적지 지정
						moveOrderInfo.maxScaleRate = {
						 	x : parseFloat(s[key].split(",")[0]),
						 	y : parseFloat(s[key].split(",")[1])
						}

						moveOrderInfo.scaleModifyType = {
							x : moveOrderInfo.maxScaleRate.x == moveOrderInfo.nextMoveRate.x ? _constantValue.modifyMIDDLE : moveOrderInfo.nextMoveRate.x > moveOrderInfo.maxScaleRate.x ? _constantValue.modifyDOWN : _constantValue.modifyUP,
							y : moveOrderInfo.maxScaleRate.y == moveOrderInfo.nextMoveRate.y ? _constantValue.modifyMIDDLE : moveOrderInfo.nextMoveRate.y > moveOrderInfo.maxScaleRate.y ? _constantValue.modifyDOWN : _constantValue.modifyUP}

						//x, y양쪽다 미들이면 변화가 없으므로 무시
						if(moveOrderInfo.scaleModifyType.x == _constantValue.modifyMIDDLE && moveOrderInfo.scaleModifyType.y == _constantValue.modifyMIDDLE) {
							continue;
						}

						moveOrderInfo.ratio = {
						 	x : 0,
						 	y : 0,
							bx : 0,
							by : 0}

					} else {
						moveOrderInfo.nextMoveRate = 0; //다음 이동할 거리
					}

					if(motionType == _constantValue.uniformMotion) {
						moveOrderInfo.uniformMotionMoveRate = Number(s[key] / (t * _commonConfig.defaultFps)); //1fps 당 움직여야할 거리 (등속운동에서만 사용함)
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
			//TEST 삭제해도 될거 같음
			if( tempOrderInfoArray == undefined) {
			 	return false;
			}
			//this.renderConfig.arrMoveOrderInfo = tempOrderInfoArray;
			this.renderConfig.motionType = motionType; //움직임 타입

			//다음 프레임으로 바뀔 시간 길이(requestAniFrame를 지원하지 않는 브라우저 일때 사용)
			if(!_j2mUtil.getRequestAnimationFrame()) {
				this.renderConfig.loopTime = Number(1000 / _commonConfig.defaultFps);
			}

			if(this.renderConfig.continuity == false) { //모션 명령을 한번에 수행
				for(var i = 0; i < this.renderConfig.arrMoveOrderInfo.length; i++) {
					if(this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].tickerStatus == _constantValue.tickerStatusS) {
						this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].tickerStatus = _constantValue.tickerStatusI;
						this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].startTime = _j2mUtil.getTime();
						this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].lastUpdate = _j2mUtil.getTime();
						this.cssRendering(this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[i]].moveKey, 0); //2D 런더링(방향, 반복 시작 카운트)
					}
				}
			} else if (this.renderConfig.continuity == true) { //모션 명령을 순차적으로 수행
				this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[0]].tickerStatus = _constantValue.tickerStatusI;
				this.cssRendering(this.renderConfig.arrMoveOrderInfo[this.renderConfig.arrMoveOrderInfo[0]].moveKey, 0); //2D 런더링(방향, 반복 시작 카운트)
			}

			return this;
		});

		function getCssRendering(){
			var returnFunction = "";
			var requestAniFrame = _j2mUtil.getRequestAnimationFrame();

			if(requestAniFrame) {

				returnFunction = function(direction, loopCntTemp){

					_j2mEngine.tickerManager(this.renderConfig, direction);
					var renderCloneObject = this;

					if(renderCloneObject.renderConfig.arrMoveOrderInfo[direction].tickerStatus == _constantValue.tickerStatusI) {
						requestAniFrame(function(time){

							if(_j2mType.getTransformYn(direction)) {
								renderCloneObject.renderConfig.targetElement.style.transform = _j2mUtil.getUnit(renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate, direction); //현제 움직임에 해당하는 단위;
							} else {
								renderCloneObject.renderConfig.targetElement.style[direction] = _j2mUtil.getUnit(renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate, direction); //현제 움직임에 해당하는 단위;
							}

							renderCloneObject.cssRendering(direction, Number(loopCntTemp + 1));
						});
					} else if(renderCloneObject.renderConfig.arrMoveOrderInfo[direction].tickerStatus == _constantValue.tickerStatusE) {
						//마지막에 모자라는 px르 마추는 작업
						renderCloneObject.renderConfig.targetElement.style[direction] = _j2mUtil.getUnit(renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate, direction);

						//TEST 여기 작동 유무 확인 필요
						if(renderCloneObject.renderConfig.continuity == true) {
							if(renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction) < renderCloneObject.renderConfig.arrMoveOrderInfo.length-1) {
								renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderCloneObject.renderConfig.arrMoveOrderInfo[direction].maxMoveRate; //최종 목적지로 세팅
								renderCloneObject.renderConfig.arrMoveOrderInfo[renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction)+1].startTime = _j2mUtil.getTime();
								renderCloneObject.renderConfig.arrMoveOrderInfo[renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction)+1].lastUpdate = _j2mUtil.getTime();
								//renderCloneObject.renderConfig.tickerFinish = false;

								renderCloneObject.cssRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction)+1], 0);
							}
						}
					}
				}
			} else {
				//TEST 여기 작동 유무 확인 필요
				returnFunction = function(direction, loopCntTemp){

					_j2mEngine.tickerManager(this.renderConfig, direction);
					var renderCloneObject = this;

					if(renderCloneObject.renderConfig.arrMoveOrderInfo[direction].tickerStatus == _constantValue.tickerStatusI) {
						setTimeout(function(){
							renderCloneObject.renderConfig.targetElement.style[direction] = _j2mUtil.getUnit(renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate, direction); //현제 움직임에 해당하는 단위;

							renderCloneObject.cssRendering(direction, Number(loopCntTemp + 1));
						}, Number(this.renderConfig.loopTime+1));
					} else if(renderCloneObject.renderConfig.arrMoveOrderInfo[direction].tickerStatus == _constantValue.tickerStatusE) {
						//마지막에 모자라는 px르 마추는 작업
						renderCloneObject.renderConfig.targetElement.style[direction] = _j2mUtil.getUnit(renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate, direction);

						if(renderCloneObject.renderConfig.continuity == true) {
							var flgExist = 0;
							for (var i = 0; i < renderCloneObject.renderConfig.arrMoveOrderInfo.length; i++) {
							    if(renderCloneObject.renderConfig.arrMoveOrderInfo[i] == direction) {
							        flgExist = i;
							        break;
							    }
							}
							if(flgExist < renderCloneObject.renderConfig.arrMoveOrderInfo.length-1) {
								renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderCloneObject.renderConfig.arrMoveOrderInfo[direction].maxMoveRate; //최종 목적지로 세팅
								renderCloneObject.renderConfig.arrMoveOrderInfo[flgExist+1].startTime = _j2mUtil.getTime();
								renderCloneObject.renderConfig.arrMoveOrderInfo[flgExist+1].lastUpdate = _j2mUtil.getTime();
								//renderCloneObject.renderConfig.tickerFinish = false;

								renderCloneObject.cssRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[flgExist+1], 0);
							}
						}
					}
				}
			}

			return returnFunction;

		}
		_j2mUtil.createFunction("cssRendering", getCssRendering());
		_j2m.init();

		window.j2m = _j2m.selector;
})(window);
