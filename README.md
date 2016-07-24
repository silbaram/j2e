> # **j2e 라이브러리 구문 정의**

-----------------------------------

<br />
<br />
<br />

> ## **개  요**

* CSS 기술인 keyframe와 transition을 Javascript로 제어 하여 element에 애니메이션 효과를 쉽게 줄 수 있도록 하기 위한 라이브러리임

<br />
<br />

> ### **keyFrame Type**

* css3 keyframe 기반으로 동작
* 반복 애니메이션 효과에 적합

<br />

#### 1. **기본 룰 선언 구문**

```
  j2e.addRole({name:”roleName”, role:”모션 규칙 서술”});
```

| 이       름 | 설               명 |
| ---
| name | 룰 고유 이름 |
| role | element에 적용되는 모션 규칙 |

  * 애니메이션 효과를 미리 등록 한 후 사용

<br />

#### 2. **미리 선언된 룰 사용 기분 구문**

```
j2e(element-selecter).setDuration(t).animate({name:”roleName”});
```

| 이       름 | 설               명 |
| ---
| name | 룰 고유 이름 |

<br />

#### 3. **기선언된 룰 사용 없이 바로 애니메이션 사용 기분 구문**

```
  j2e(element-selecter).setDuration(t).animate({name:”roleName”, role:”모션 규칙 서술”});
```

| 이       름 | 설               명 |
| ---
| name | 룰 고유 이름 (룰이 바로 등록됨) |
| role | element에 적용되는 모션 규칙 |

  * 한번 선언되고 난 후 다른 element에서도 사용할 수 있음

<br />

#### 4. **keyFrame Type role 작성 규칙**

##### 4.1 **도착 지점만 지정 하기**

| 규       칙 |
| ---
| [{share: 100, top:”100”, left:”100”}] |

  * 도착 점만 지정 했을 경우엔 현재 위치를 from으로 지정

<br />

##### 4.2 **애니메이션 동작 중 한 가지 이상의 CSS를 지정 하기**

| 규       칙 |
| ---
| [{share: 0, top:”0”, left:”0”}, {share: 100, top:”100”, left:”100”}] |

  * {}로 한번에 움직이는 그룹을 지정함

<br />

##### 4.3 **애니메이션 스텝 별 다른 동작 지정**

| 규       칙 |
| ---
| [{share: 0, top:”0”, left:”0”}, {share: 50, top:”50”, left:”50”}, {share: 100, top:”100”, left:”100”}] |

  * share는 0 ~ 100 까지 이며 모션 동작 시 시간에 대한 %값 (0 : 처음 지점, 100 : 마지막 지점)

  <br />

##### 4.4 **증감 이동**

| 규       칙 |
| ---
| [{share: 0, top:”0”, left:”0”}, {share: 50, top:”50”, left:”50”}, {share: 100, top:”+=100”, left:”-=100”}] |

  * ‘+=’ 지정 수치만큼 더해서 이동, ‘-=’ 지정 수치만큼 빼서 이동(share: 100에서 만 동작), from 생략 시 현재 위치를 from으로 지정

<br />
<br />

> ### **transition Type**
  * css3 transition 기반으로 동작
  * 단일 element에 다이나믹 애니메이션 효과에 적합

<br />

#### 1. **한 element에서만 사용할 수 있는 애니메이션 사용 기분 구문**

```
j2e(element-selecter).setDuration(t).animate({name:”roleName”});
```

| 이       름 | 설               명 |
| ---
| role | element에 적용되는 모션 규칙 |

  * element 각각 개별적으로만 사용 할 수 있음
  * 모션 그룹에 개별로 시간을 설정 할 경우 setDuration() 생략 가능

<br />

#### 2. **transition Type role 작성 규칙**

##### 2.1 **애니메이션 동작 중 한 가지 이상의 CSS를 지정 하기**

| 규       칙 |
| ---
| [{duration: 1, top:”100”, left:”100”}] |

<br />

##### 2.2 **애니메이션 그룹 별로 다른 시간 지정 하기**

| 규       칙 |
| ---
| [{duration: 1, top:”0”}, {duration: 2, left:”100”}] |

<br />

##### 2.3 **증감 이동**

| 규       칙 |
| ---
| [{duration: 1, top:”+=0”}, {duration: 2, left:”-=100”}] |

  * ‘+=’ 지정 수치만큼 더해서 이동, ‘-=’ 지정 수치만큼 빼서 이동

<br />

> ### **role css property**

  * background
  * background-color
  * background-position
  * background-size
  * border
  * border-bottom
  * border-bottom-color
  * border-bottom-left-radius
  * border-bottom-right-radius
  * border-bottom-width
  * border-color
  * border-left
  * border-left-color
  * border-left-width
  * border-right
  * border-right-color
  * border-right-width
  * border-spacing
  * border-top
  * border-top-color
  * border-top-left-radius
  * border-top-right-radius
  * border-top-width
  * bottom
  * box-shadow
  * clip
  * color
  * column-count
  * column-gap
  * column-rule
  * column-rule-color
  * column-rule-width
  * column-width
  * columns
  * filter
  * flex
  * flex-basis
  * flex-grow
  * flex-shrink
  * font
  * font-size
  * font-size-adjust
  * font-stretch
  * font-weight
  * height
  * left
  * letter-spacing
  * line-height
  * margin
  * margin-bottom
  * margin-left
  * margin-right
  * margin-top
  * max-height
  * max-width
  * min-height
  * min-width
  * opacity
  * order
  * outline
  * outline-color
  * outline-offset
  * outline-width
  * padding
  * padding-bottom
  * padding-left
  * padding-right
  * padding-top
  * perspective
  * perspective-origin
  * right
  * text-decoration-color
  * text-indent
  * text-shadow
  * top
  * transform
  * transform-origin
  * vertical-align
  * visibility
  * width
  * word-spacing
  * z-index

<br />

> ### **function**

#### 1. **setDelay(t)**
  * 엘리먼트가 로드 되고 나서 언제 애니메이션이 시작될지 지정합니다.

##### 1.1 **매개변수**
  * t (Number) - 초 단위 시간

##### 1.2 **지원 Type**
  * keyFrame. transition

<br />

#### 2 **setDirection(t)**
  * 애니메이션이 종료되고 다시 처음부터 시작할지 역방향으로 진행할지 지정합니다.

##### 2.1 **매개변수**
  * t (String) - 설정 값

##### 2.2 **매개변수 값**
  * normal : 시작점에서 출발하여 끝점에서 끝나면 다시 시작점에서 출발 (기본)
  * reverse : 끝점에서 출발하여 시작점에서 끝나면 다시 끝점에서 출발
  * alternate : 시작점에서 출발하여 끝점에서 끝나면 끝점에서 다시 출발
  * alternate-reverse : 끝점에서 출발하여 시작점에서 끝나면 시작점에서 다시 출발

##### 2.3 **지원 Type**
  * keyFrame

<br />

#### 3 **setDuration(t)**
  * 한 싸이클의 애니메이션이 얼마에 걸쳐 일어날지 지정합니다.

##### 3.1 **매개변수**
  * t (Number) - 초 단위 시간

##### 3.2 **지원 Type**
  * keyFrame. transition

<br />

#### 4 **setFillMode(t)**
  * 애니메이션이 시작되기 전이나 끝나고 난 후 어떤 값이 적용될지 지정합니다.

##### 4.1 **매개변수**
  * t (String) - 설정 값

##### 4.2 **매개변수 값**
  * none: 애니메이션 시작 전까지 원래 위치에 고정, 끝나면 그 위치로 다시 돌아감 (기본)
  * forwards: (애니메이션 반복 카운트에 의해 결정) 애니메이션 시작 전까지는 원래 위치에서 대기. 그리고 요소가 애니메이션 끝나는 위치에서 멈춤
  * backwards: 페이지가 로딩되면 곧장 애니메이션 시작 위치로 이동, 끝나면 원래 위치로 돌아감
  * both : 앞, 뒤로 모두에 대한 규칙을 따릅니다. 즉, 양방향으로 애니메이션 속성을 확장

##### 4.3 **지원 Type**
  * keyFrame

<br />

#### 5 **setIterationCount(s)**
  * 애니메이션이 몇 번 반복될지 지정합니다. infinite로 지정하여 무한히 반복할 수 있습니다.

##### 5.1 **매개변수**
  * s (String), (Number) - 반복 횟수

##### 5.2 **매개변수 값**
  * infinite : 무한 반복 재생되도록 지정
  * number : 재생 횟수 정의 (기본 : 1)

##### 5.3 **지원 Type**
  * keyFrame

<br />

#### 6 **setPlayState(s)**
  * 애니메이션을 멈추거나 다시 시작할 수 있습니다.

##### 6.1 **매개변수**
  * t (String) - 설정 값

##### 6.2 **매개변수 값**
  * paused : 일시 정지되도록 지정
  * number : 실행되도록 지정 (기본)

##### 6.3 **지원 Type**
  * keyFrame. transition(추가 예정)

<br />

#### 7 **setTimingFunction(s)**
  * 중간 상태들의 전환을 어떤 시간간격으로 진행할지 지정합니다.

##### 7.1 **매개변수**
  * t (String) - 설정 값

##### 7.2 **매개변수 값**
  * linear : 처음부터 끝까지 같은 속도 (등속운동)
  * ease : 처음과 끝을 부드럽게 (기본)
  * ease-in : 처음을 느리게
  * ease-out : 마지막을 느리게
  * ease-in-out : 처음과 마지막을 느리게 줌
  * cubic-bezier( x1, y1, x2, y2 )
  * step-start
  * step-end
  * steps(int,start)
  * steps(int,end)

##### 7.3 **지원 Type**
  * keyFrame. transition

<br />

#### 8 **setWillChange(f)**
  * will-change를 사용 유무를 사용자가 정하는 functoin

##### 7.1 **매개변수**
  * f (boolean) - 설정 값

##### 7.2 **매개변수 값**
  * true : will-change를 사용함
  * false : will-change를 사용안함

##### 7.3 **지원 Type**
  * keyFrame. transition
