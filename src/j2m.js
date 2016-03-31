(function(window){
	"use strict";

	function j2mObject() {}
	(function (){j2mObject = null;});
	var
		_commonConfig = {
			defaultFps : 60 //기본 설정 프레임
		},
		_constantValue = {
			motionType : "motiontype", //모션 타입
			continuity : "continuity", //모션 명령을 한번에 하나씩 처리 할지 말지 결정 true : 한번에 한 움직임씩, false : 한번에 모든 움직임

			acceleratedMotion : "A",   //모션 타입 가속운동
			uniformMotion : "U",       //모션 타입 등속운동
			x : "X",                   //x축 움직임 (가로)
			y : "Y",                   //y축 움직임 (세로)
			opacity : "OPACITY",       //투명도
			opacityModifyUP : "UP",
			opacityModifyDOWN : "DOWN",
			timeScale : 1
		},
		_j2m = {
			selector : function(e) {

				var renderConfig = {};
				var cloneObject = new j2mObject;

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

				cloneObject.renderConfig = renderConfig;
				return cloneObject;
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
			getMotionOrderYn : function(c) {
				if(_constantValue.x == c || _constantValue.y == c || _constantValue.opacity == c) {
					return true;
				}

				return false;
			},
			getTime : Date.now || function() {return new Date * 1;}
		},
		_j2mEngine = {
			tickerManager : function(renderConfig, direction) {

				if(_constantValue.x == direction || _constantValue.y == direction) {
					_j2mEngine.straightLineTicker(renderConfig, direction);
				} else if(_constantValue.opacity == direction) {
					_j2mEngine.opacityTicker(renderConfig, direction);
				}
			},
			straightLineTicker : function(renderConfig, direction) {

				if(renderConfig.motionType == _constantValue.uniformMotion) {
					renderConfig.arrMoveOrderInfo[direction].nextMoveRate = parseFloat(renderConfig.arrMoveOrderInfo[direction].nextMoveRate) + parseFloat(renderConfig.arrMoveOrderInfo[direction].uniformMotionMoveRate);
				} else if(renderConfig.motionType == _constantValue.acceleratedMotion) {
					//등속 계산식
					var elapsed = _j2mUtil.getTime() - renderConfig.lastUpdate;
					renderConfig.lastUpdate += elapsed;
					renderConfig.time = (renderConfig.lastUpdate - renderConfig.startTime) / 1000;

					//overlap은 나중에

					var p = (renderConfig.time * _constantValue.timeScale) / renderConfig.arrMoveOrderInfo[direction].duration;
					p = 1 - p;
					p *= p;
					renderConfig.arrMoveOrderInfo[direction].ratio = 1 - p;

					renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderConfig.arrMoveOrderInfo[direction].maxMoveRate * renderConfig.arrMoveOrderInfo[direction].ratio;
				}				
			},
			opacityTicker : function(renderConfig, direction) {

				if(renderConfig.arrMoveOrderInfo[direction].opacityModifyType == _constantValue.opacityModifyDOWN) {
					renderConfig.arrMoveOrderInfo[direction].nextMoveRate = parseFloat(renderConfig.arrMoveOrderInfo[direction].nextMoveRate) - parseFloat(renderConfig.arrMoveOrderInfo[direction].opacityRate);
				} else {
					renderConfig.arrMoveOrderInfo[direction].nextMoveRate = parseFloat(renderConfig.arrMoveOrderInfo[direction].nextMoveRate) + parseFloat(renderConfig.arrMoveOrderInfo[direction].opacityRate);
				}			
			}
		};






/*################################################################################################################################################
움직임을 위한 펑션들의 모음
################################################################################################################################################*/

		//사용자가 dom을 움직일때 사용자로부터 명령을 받는 함수
		_j2mUtil.createFunction("move", function(s, t) {
			this.renderConfig.startTime = _j2mUtil.getTime();
			this.renderConfig.lastUpdate = _j2mUtil.getTime();

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

			//이동명령을 한번에 할지 순차적으로 할지 결정
			if(s[_constantValue.continuity] != undefined) {
				this.renderConfig.continuity = s[_constantValue.continuity];
			} else {
				this.renderConfig.continuity = false;
			}
			var orderCount = 0;
			if(this.renderConfig.continuity == true) {
				//모션 명령을 한번에 수행일때 총 모션 수를 구한다.
				for (var key in s) {
					if( _j2mUtil.getMotionOrderYn(key.toUpperCase()) == true ) {
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
				if(_constantValue.x == key.toUpperCase() || _constantValue.y == key.toUpperCase() || _constantValue.opacity == key.toUpperCase()) {
					moveOrderInfo.moveKey = key.toUpperCase();
					moveOrderInfo.maxMoveRate = s[key];
					moveOrderInfo.duration = t; //이동해야할 시간

					//opacity과 나머지 움직임을 분기 처리
					if(_constantValue.opacity == key.toUpperCase()) {
						var style = window.getComputedStyle(this.renderConfig.targetElement, null);
						moveOrderInfo.nextMoveRate = style.opacity; //다음 이동할 거리
						moveOrderInfo.opacityRate = Number( Math.abs(Number(s[key]-style.opacity)) / (t * _commonConfig.defaultFps)); //opacity시에 다음에 적용해야할 변화 비율
						if(Number(s[key]-style.opacity) > 0) {
							moveOrderInfo.opacityModifyType = _constantValue.opacityModifyUP;
						} else {
							moveOrderInfo.opacityModifyType = _constantValue.opacityModifyDOWN;
						}
					} else {
						moveOrderInfo.nextMoveRate = 0; //다음 이동할 거리
					}

					if(motionType == _constantValue.uniformMotion) {
						moveOrderInfo.uniformMotionMoveRate = Number(s[key] / (t * _commonConfig.defaultFps)); //1fps 당 움직여야할 거리 (등속운동에서만 사용함)
					}

					arrMoveOrderInfo.push(key.toUpperCase());
					arrMoveOrderInfo[key.toUpperCase()] = moveOrderInfo;
				}
			}
			this.renderConfig.arrMoveOrderInfo = arrMoveOrderInfo;
			this.renderConfig.loopCnt = Number(t * _commonConfig.defaultFps); //이동시 총 프레임 수
			this.renderConfig.motionType = motionType;                        //움직임 타입

			//다음 프레임으로 바뀔 시간 길이(requestAniFrame를 지원하지 않는 브라우저 일때 사용)
			if(!_j2mUtil.getRequestAnimationFrame()) {
				this.renderConfig.loopTime = Number(1000 / _commonConfig.defaultFps);
			}

			if(this.renderConfig.continuity == false) { //모션 명령을 한번에 수행
				for(var i = 0; i < this.renderConfig.arrMoveOrderInfo.length; i++) {
					if(_constantValue.x == this.renderConfig.arrMoveOrderInfo[i] || _constantValue.y == this.renderConfig.arrMoveOrderInfo[i]) {
						this.straightLineRendering(this.renderConfig.arrMoveOrderInfo[i], 0); //직선운동 런더링(방향, 반복 시작 카운트)
					} else if(_constantValue.opacity == this.renderConfig.arrMoveOrderInfo[i]) {
						this.opacityRendering(this.renderConfig.arrMoveOrderInfo[i], 0); //투명도 조절
					}
				}
			} else if (this.renderConfig.continuity == true) { //모션 명령을 순차적으로 수행
				if(_constantValue.x == this.renderConfig.arrMoveOrderInfo[0] || _constantValue.y == this.renderConfig.arrMoveOrderInfo[0]) {
					this.straightLineRendering(this.renderConfig.arrMoveOrderInfo[0], 0); //직선운동 런더링( )방향, 반복 시작 카운트)
				} else if(_constantValue.opacity == this.renderConfig.arrMoveOrderInfo[0]) {
					this.opacityRendering(this.renderConfig.arrMoveOrderInfo[0], 0); //투명도 조절
				}
			}
			return this;
		});

		function getStraightLineRendering(){
			var returnFunction = "";
			var requestAniFrame = _j2mUtil.getRequestAnimationFrame();

			if(requestAniFrame) {

				returnFunction = function(direction, loopCntTemp){

					_j2mEngine.tickerManager(this.renderConfig, direction);
					var renderCloneObject = this;

					if (loopCntTemp < this.renderConfig.loopCnt) {
						requestAniFrame(function(time){
							var moveX = renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x] != undefined ? renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].nextMoveRate : "0";
							if(moveX == undefined) {
								moveX = "0";
							}
							var moveY = renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.y] != undefined ? renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.y].nextMoveRate : "0";
							if(moveY == undefined) {
								moveY = "0";
							}

							renderCloneObject.renderConfig.targetElement.style.transform  = 'translate3d('+moveX+'px, '+moveY+'px, 0px)';

							renderCloneObject.straightLineRendering(direction, Number(loopCntTemp + 1));
						});
					} else {
						//마지막에 모자라는 px르 마추는 작업
						if(_constantValue.x == direction) {
							var maxMoveX = renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x] != undefined ? renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].maxMoveRate : "0";
						} else if(_constantValue.y == direction) {
							var maxMoveY = renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.y] != undefined ? renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.y].maxMoveRate : "0";
						}

						renderCloneObject.renderConfig.targetElement.style.transform  = 'translate3d('+maxMoveX+'px, '+maxMoveY+'px, 0px)';

						if(renderCloneObject.renderConfig.continuity == true) {
							if(renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction) < renderCloneObject.renderConfig.arrMoveOrderInfo.length-1) {
								renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderCloneObject.renderConfig.arrMoveOrderInfo[direction].maxMoveRate; //최종 목적지로 세팅
								renderCloneObject.renderConfig.startTime = _j2mUtil.getTime();
								renderCloneObject.renderConfig.lastUpdate = _j2mUtil.getTime();

								var nextOrder = renderCloneObject.renderConfig.arrMoveOrderInfo[renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction)+1];
								if(_constantValue.x == nextOrder || _constantValue.y == nextOrder) {
									renderCloneObject.straightLineRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction)+1], 0);
								} else if(_constantValue.opacity == nextOrder) {
									renderCloneObject.opacityRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction)+1], 0);
								}	
							}
						}
					}
				}
			} else {

				returnFunction = function(direction, loopCntTemp){

					_j2mEngine.tickerManager(this.renderConfig, direction);
					var renderCloneObject = this;

					if (loopCntTemp < this.renderConfig.loopCnt) {
						setTimeout(function(){
							if(_constantValue.x == direction) {
								renderCloneObject.renderConfig.targetElement.style.left = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate) +'px'; //IE10 미만
							} else if(_constantValue.y == direction) {
								renderCloneObject.renderConfig.targetElement.style.top = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate) +'px'; //IE10 미만
							}

							renderCloneObject.straightLineRendering(direction, Number(loopCntTemp + 1));
						}, Number(this.renderConfig.loopTime+1));
					} else {
						//마지막에 모자라는 px르 마추는 작업
						if(_constantValue.x == direction) {
							renderCloneObject.renderConfig.targetElement.style.left = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].maxMoveRate) +'px'; //IE10 미만
						} else if(_constantValue.y == direction) {
							renderCloneObject.renderConfig.targetElement.style.top = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].maxMoveRate) +'px'; //IE10 미만
						}

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
								renderCloneObject.renderConfig.startTime = _j2mUtil.getTime();
								renderCloneObject.renderConfig.lastUpdate = _j2mUtil.getTime();

								var nextOrder = renderCloneObject.renderConfig.arrMoveOrderInfo[renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction)+1];
								if(_constantValue.x == nextOrder || _constantValue.y == nextOrder) {
									renderCloneObject.straightLineRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[flgExist+1], 0);
								} else if(_constantValue.opacity == nextOrder) {
									renderCloneObject.opacityRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[flgExist+1], 0);
								}	
							}
						}
					}
				}
			}

			return returnFunction;
		
		}
		_j2mUtil.createFunction("straightLineRendering", getStraightLineRendering());

		function getOpacityRendering(){
			var returnFunction = "";
			var requestAniFrame = _j2mUtil.getRequestAnimationFrame();

			if(requestAniFrame) {

				returnFunction = function(direction, loopCntTemp){

					_j2mEngine.tickerManager(this.renderConfig, direction);
					var renderCloneObject = this;

					if (loopCntTemp < this.renderConfig.loopCnt) {
						requestAniFrame(function(time){
							renderCloneObject.renderConfig.targetElement.style[direction.toLowerCase()] = renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate;

							renderCloneObject.opacityRendering(direction, Number(loopCntTemp + 1));
						});
					} else {
						//마지막에 모자라는 px르 마추는 작업
						renderCloneObject.renderConfig.targetElement.style[direction.toLowerCase()] = renderCloneObject.renderConfig.arrMoveOrderInfo[direction].maxMoveRate;

						if(renderCloneObject.renderConfig.continuity == true) {
							if(renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction) < renderCloneObject.renderConfig.arrMoveOrderInfo.length-1) {
								renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].maxMoveRate; //최종 목적지로 세팅
								renderCloneObject.renderConfig.startTime = _j2mUtil.getTime();
								renderCloneObject.renderConfig.lastUpdate = _j2mUtil.getTime();

								renderCloneObject.opacityRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction)+1], 0);
							}
						}
					}
				}
			} else {

				returnFunction = function(direction, loopCntTemp){

					_j2mEngine.tickerManager(this.renderConfig, direction);
					var renderCloneObject = this;

					if (loopCntTemp < this.renderConfig.loopCnt) {
						setTimeout(function(){
							renderCloneObject.renderConfig.targetElement.style[direction.toLowerCase()] = renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate;

							renderCloneObject.opacityRendering(direction, Number(loopCntTemp + 1));
						}, Number(this.renderConfig.loopTime+1));
					} else {
						//마지막에 모자라는 px르 마추는 작업
						renderCloneObject.renderConfig.targetElement.style[direction.toLowerCase()] = renderCloneObject.renderConfig.arrMoveOrderInfo[direction].maxMoveRate;

						if(renderCloneObject.renderConfig.continuity == true) {
							var flgExist = 0;
							for (var i = 0; i < renderCloneObject.renderConfig.arrMoveOrderInfo.length; i++) {
							    if(renderCloneObject.renderConfig.arrMoveOrderInfo[i] == direction) {
							        flgExist = i;
							        break;
							    }
							}
							if(flgExist < renderCloneObject.renderConfig.arrMoveOrderInfo.length-1) {
								renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextMoveRate = renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].maxMoveRate; //최종 목적지로 세팅
								renderCloneObject.renderConfig.startTime = _j2mUtil.getTime();
								renderCloneObject.renderConfig.lastUpdate = _j2mUtil.getTime();

								renderCloneObject.opacityRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[flgExist+1], 0);
							}
						}
					}
				}
			}

			return returnFunction;
		
		}
		_j2mUtil.createFunction("opacityRendering", getOpacityRendering());

		window.j2m = _j2m.selector;
})(window);
