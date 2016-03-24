(function(window){
	"use strict";

	function j2mObject() {}

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
			xy : "XY",                 //x축, y축 움직임 (대각선)
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
			getBrowserTransformYn : function() {

				if (_j2mUtil.getBrowserKind().b == "msie" && parseInt(_j2mUtil.getBrowserKind().v) < 10) {
					return false;
				} else {
					return true;
				}
			},
			createFunction : function(n, c) {
				j2mObject.prototype[n] = c;
			},
			getTime : Date.now || function() {return new Date * 1;}
		},
		_j2mEngine = {
			getNextMoveSpace : function(renderConfig, direction) {

				//대각선 움직임일 경우
				if(_constantValue.xy == direction) {
					if(renderConfig.motionType == _constantValue.uniformMotion) {
						renderConfig.arrMoveOrderInfo[_constantValue.x].nextStraightMovePx = Number(renderConfig.arrMoveOrderInfo[_constantValue.x].nextStraightMovePx + renderConfig.arrMoveOrderInfo[_constantValue.x].movePx);
						renderConfig.arrMoveOrderInfo[_constantValue.y].nextStraightMovePx = Number(renderConfig.arrMoveOrderInfo[_constantValue.y].nextStraightMovePx + renderConfig.arrMoveOrderInfo[_constantValue.y].movePx);
					} else if(renderConfig.motionType == _constantValue.acceleratedMotion) {
						//등속 계산식
						var elapsed = _j2mUtil.getTime() - renderConfig.lastUpdate;
						renderConfig.lastUpdate += elapsed;
						renderConfig.time = (renderConfig.lastUpdate - renderConfig.startTime) / 1000;

						//overlap은 나중에

						var xp = (renderConfig.time * _constantValue.timeScale) / renderConfig.arrMoveOrderInfo[_constantValue.x].duration;
						xp = 1 - xp;
						xp *= xp;
						renderConfig.arrMoveOrderInfo[_constantValue.x].ratio = 1 - xp;
									
						renderConfig.arrMoveOrderInfo[_constantValue.x].nextStraightMovePx = renderConfig.arrMoveOrderInfo[_constantValue.x].maxMovePx * renderConfig.arrMoveOrderInfo[_constantValue.x].ratio;

						var yp = (renderConfig.time * _constantValue.timeScale) / renderConfig.arrMoveOrderInfo[_constantValue.y].duration;
						yp = 1 - yp;
						yp *= yp;
						renderConfig.arrMoveOrderInfo[_constantValue.y].ratio = 1 - yp;
									
						renderConfig.arrMoveOrderInfo[_constantValue.y].nextStraightMovePx = renderConfig.arrMoveOrderInfo[_constantValue.y].maxMovePx * renderConfig.arrMoveOrderInfo[_constantValue.y].ratio;
					}
				} else {
					if(renderConfig.motionType == _constantValue.uniformMotion) {
						renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx = Number(renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx + renderConfig.arrMoveOrderInfo[direction].movePx);
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
									
						renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx = renderConfig.arrMoveOrderInfo[direction].maxMovePx * renderConfig.arrMoveOrderInfo[direction].ratio;
					}
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
				this.randerFactofyManager(s, t);
			} else if (typeof(s) === "number" && typeof(t) === "object") {
				this.randerFactofyManager(t, s);
			}

			return this;
		});

		_j2mUtil.createFunction("randerFactofyManager", function(s, t) {

			var arrMoveOrderInfo = [];                     //사용자가 움직임을 설정한 내용
			var motionType = _constantValue.uniformMotion; //운동방식 - u : 등속운동, a : 가속운동, default : 등속은동

			if(s[_constantValue.motionType] != undefined) {
				if(s[_constantValue.motionType].toUpperCase() == _constantValue.uniformMotion || s[_constantValue.motionType].toUpperCase() == _constantValue.acceleratedMotion) {
					motionType = s[_constantValue.motionType].toUpperCase();
				}
			}

			for (var key in s) {
				var moveOrderInfo = {};

				//방향에 대한 명령만 걸러서 저장
				if(_constantValue.x == key.toUpperCase() || _constantValue.y == key.toUpperCase()) {
					moveOrderInfo.moveKey = key.toUpperCase();
					moveOrderInfo.maxMovePx = s[key];
					moveOrderInfo.duration = t;           //이동해야할 시간
					moveOrderInfo.nextStraightMovePx = 0; //직선으로 이동할 거리
					
					if(motionType == _constantValue.uniformMotion) {
						moveOrderInfo.movePx = Number(s[key] / (t * _commonConfig.defaultFps)); //1fps 당 움직여야할 거리 (등속운동에서만 사용함)
					}

					arrMoveOrderInfo.push(key.toUpperCase());
					arrMoveOrderInfo[key.toUpperCase()] = moveOrderInfo;
				}
			};
			this.renderConfig.arrMoveOrderInfo = arrMoveOrderInfo;
			this.renderConfig.loopCnt = Number(t * _commonConfig.defaultFps);  //이동시 총 프레임 수
			this.renderConfig.motionType = motionType;                         //움직임 타입

			//이동명령을 한번에 할지 순차적으로 할지 결정
			if(s[_constantValue.continuity] != undefined) {
				this.renderConfig.continuity = s[_constantValue.continuity];
			} else {
				this.renderConfig.continuity = false;
			}

			if(!_j2mUtil.getRequestAnimationFrame()) {
				this.renderConfig.loopTime = Number(1000 / _commonConfig.defaultFps); //다음 프레임으로 바뀔 시간 길이(requestAniFrame를 지원하지 않는 브라우저 일때 사용)
			}

			//위에 로직을 이용해서 어느 움직임을 이용해야 하는지 분기 처리 해야함
			if(this.renderConfig.arrMoveOrderInfo.length == 2 && this.renderConfig.arrMoveOrderInfo[_constantValue.x] != undefined && this.renderConfig.arrMoveOrderInfo[_constantValue.y] != undefined && this.renderConfig.continuity == false && _j2mUtil.getBrowserTransformYn()) {
				this.animationRendering(_constantValue.xy, 0); //런더링 방향, 반복 시작 카운트 (대각선 움직임)
			} else {
				if(this.renderConfig.continuity == false) {
					for(var i = 0; i < this.renderConfig.arrMoveOrderInfo.length; i++) {
						this.animationRendering(this.renderConfig.arrMoveOrderInfo[i], 0); //런더링 방향, 반복 시작 카운트
					}
				} else if (this.renderConfig.continuity == true) {
					this.animationRendering(this.renderConfig.arrMoveOrderInfo[0], 0); //런더링 방향, 반복 시작 카운트
				}
			}

			return this;
		});

		function getAnimationRendering(){
			var browserKind = _j2mUtil.getBrowserKind();
			var returnFunction = "";
			var requestAniFrame = _j2mUtil.getRequestAnimationFrame();

			if(requestAniFrame) {

				//requestAniFrame 함수가 있고 브라으저가 IE10 미만이다
				if (!_j2mUtil.getBrowserTransformYn()) {

					returnFunction = function(direction, loopCntTemp){

						_j2mEngine.getNextMoveSpace(this.renderConfig, direction);
						var renderCloneObject = this;

						if (loopCntTemp < this.renderConfig.loopCnt) {
							requestAniFrame(function(time){
								if(_constantValue.x == direction) {
									renderCloneObject.renderConfig.targetElement.style.left = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx) +'px'; //IE10 미만
								} else if(_constantValue.y == direction) {
									renderCloneObject.renderConfig.targetElement.style.top = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx) +'px'; //IE10 미만
								}
								renderCloneObject.animationRendering(direction, Number(loopCntTemp + 1));
							});
						} else {
							//마지막에 모자라는 px르 마추는 작업
							if(_constantValue.x == direction) {
								renderCloneObject.renderConfig.targetElement.style.left = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].maxMovePx) +'px'; //IE10 미만
							} else if(_constantValue.y == direction) {
								renderCloneObject.renderConfig.targetElement.style.top = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].maxMovePx) +'px'; //IE10 미만
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
									renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx = renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].maxMovePx; //최종 목적지로 세팅
									renderCloneObject.renderConfig.startTime = _j2mUtil.getTime();
									renderCloneObject.renderConfig.lastUpdate = _j2mUtil.getTime();

									renderCloneObject.animationRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[flgExist+1], 0);
								}
							}
						}
					}
				//requestAniFrame 함수가 있고 브라으저가 IE10 이상이다
				} else {

					returnFunction = function(direction, loopCntTemp){

						_j2mEngine.getNextMoveSpace(this.renderConfig, direction);
						var renderCloneObject = this;

						if (loopCntTemp < this.renderConfig.loopCnt) {
							requestAniFrame(function(time){

								if(_constantValue.x == direction && renderCloneObject.renderConfig.continuity == false) {
									renderCloneObject.renderConfig.targetElement.style.transform  = 'translateX('+renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx+'px)'; //IE10이상
								} else if(_constantValue.y == direction && renderCloneObject.renderConfig.continuity == false) {
									renderCloneObject.renderConfig.targetElement.style.transform  = 'translateY('+renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx+'px)'; //IE10이상
								} else if(_constantValue.xy == direction || renderCloneObject.renderConfig.continuity == true) { // 대각선 움직임
									renderCloneObject.renderConfig.targetElement.style.transform  = 'translate3d('+renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].nextStraightMovePx+'px, '+renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.y].nextStraightMovePx+'px, 0px)'; //IE10이상
								}

								renderCloneObject.animationRendering(direction, Number(loopCntTemp + 1));
							});
						} else {
							//마지막에 모자라는 px르 마추는 작업
							if(_constantValue.x == direction && renderCloneObject.renderConfig.continuity == false) {
								renderCloneObject.renderConfig.targetElement.style.transform  = 'translateX('+this.renderConfig.arrMoveOrderInfo[direction].maxMovePx+'px)'; //IE10이상
							} else if(_constantValue.y == direction && renderCloneObject.renderConfig.continuity == false) {
								renderCloneObject.renderConfig.targetElement.style.transform  = 'translateY('+this.renderConfig.arrMoveOrderInfo[direction].maxMovePx+'px)'; //IE10이상
							} else if(_constantValue.xy == direction) { // 대각선 움직임
								renderCloneObject.renderConfig.targetElement.style.transform  = 'translate3d('+renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].maxMovePx+'px, '+renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.y].maxMovePx+'px, 0px)'; //IE10이상
							}

							if(renderCloneObject.renderConfig.continuity == true) {
								if(renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction) < renderCloneObject.renderConfig.arrMoveOrderInfo.length-1) {
									renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx = renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].maxMovePx; //최종 목적지로 세팅
									renderCloneObject.renderConfig.startTime = _j2mUtil.getTime();
									renderCloneObject.renderConfig.lastUpdate = _j2mUtil.getTime();

									renderCloneObject.animationRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction)+1], 0);
								}
							}
						}
					}
				}

			} else {

				//requestAniFrame 함수가 없고 브라으저가 IE10 미만이다
				if (!_j2mUtil.getBrowserTransformYn()) {

					returnFunction = function(direction, loopCntTemp){

						_j2mEngine.getNextMoveSpace(this.renderConfig, direction);
						var renderCloneObject = this;

						if (loopCntTemp < this.renderConfig.loopCnt) {
							setTimeout(function(){
								if(_constantValue.x == direction) {
									renderCloneObject.renderConfig.targetElement.style.left = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx) +'px'; //IE10 미만
								} else if(_constantValue.y == direction) {
									renderCloneObject.renderConfig.targetElement.style.top = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx) +'px'; //IE10 미만
								}

								renderCloneObject.animationRendering(direction, Number(loopCntTemp + 1));
							}, Number(this.renderConfig.loopTime+1));
						} else {
							//마지막에 모자라는 px르 마추는 작업
							if(_constantValue.x == direction) {
								renderCloneObject.renderConfig.targetElement.style.left = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].maxMovePx) +'px'; //IE10 미만
							} else if(_constantValue.y == direction) {
								renderCloneObject.renderConfig.targetElement.style.top = (renderCloneObject.renderConfig.arrMoveOrderInfo[direction].maxMovePx) +'px'; //IE10 미만
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
									renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx = renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].maxMovePx; //최종 목적지로 세팅
									renderCloneObject.renderConfig.startTime = _j2mUtil.getTime();
									renderCloneObject.renderConfig.lastUpdate = _j2mUtil.getTime();

									renderCloneObject.animationRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[flgExist+1], 0);
								}
							}
						}
					}
				//requestAniFrame 함수가 없고 브라으저가 IE10 이상이다
				} else {

					returnFunction = function(direction, loopCntTemp){

						_j2mEngine.getNextMoveSpace(this.renderConfig, direction);
						var renderCloneObject = this;

						if (loopCntTemp < this.renderConfig.loopCnt) {
							setTimeout(function(){
								if(_constantValue.x == direction && renderCloneObject.renderConfig.continuity == false) {
									renderCloneObject.renderConfig.targetElement.style.transform  = 'translateX('+renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx+'px)'; //IE10이상
								} else if(_constantValue.y == direction && renderCloneObject.renderConfig.continuity == false) {
									renderCloneObject.renderConfig.targetElement.style.transform  = 'translateY('+renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx+'px)'; //IE10이상
								} else if(_constantValue.xy == direction || renderCloneObject.renderConfig.continuity == true) { // 대각선 움직임
									renderCloneObject.renderConfig.targetElement.style.transform  = 'translate3d('+renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].nextStraightMovePx+'px, '+renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.y].nextStraightMovePx+'px, 0px)'; //IE10이상
								}

								renderCloneObject.animationRendering(direction, Number(loopCntTemp + 1));
							}, Number(this.renderConfig.loopTime+1));
						} else {
							//마지막에 모자라는 px르 마추는 작업
							if(_constantValue.x == direction && renderCloneObject.renderConfig.continuity == false) {
								renderCloneObject.renderConfig.targetElement.style.transform  = 'translateX('+this.renderConfig.arrMoveOrderInfo[direction].maxMovePx+'px)'; //IE10이상
							} else if(_constantValue.y == direction && renderCloneObject.renderConfig.continuity == false) {
								renderCloneObject.renderConfig.targetElement.style.transform  = 'translateY('+this.renderConfig.arrMoveOrderInfo[direction].maxMovePx+'px)'; //IE10이상
							} else if(_constantValue.xy == direction) { // 대각선 움직임
								renderCloneObject.renderConfig.targetElement.style.transform  = 'translate3d('+renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].maxMovePx+'px, '+renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.y].maxMovePx+'px, 0px)'; //IE10이상
							}

							if(renderCloneObject.renderConfig.continuity == true) {
								if(renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction) < renderCloneObject.renderConfig.arrMoveOrderInfo.length-1) {
									renderCloneObject.renderConfig.arrMoveOrderInfo[direction].nextStraightMovePx = renderCloneObject.renderConfig.arrMoveOrderInfo[_constantValue.x].maxMovePx; //최종 목적지로 세팅
									renderCloneObject.renderConfig.startTime = _j2mUtil.getTime();
									renderCloneObject.renderConfig.lastUpdate = _j2mUtil.getTime();

									renderCloneObject.animationRendering(renderCloneObject.renderConfig.arrMoveOrderInfo[renderCloneObject.renderConfig.arrMoveOrderInfo.indexOf(direction)+1], 0);
								}
							}
						}
					}
				}
			}

			return returnFunction;
		
		}
		_j2mUtil.createFunction("animationRendering", getAnimationRendering());

		window.j2m = _j2m.selector;
})(window);
