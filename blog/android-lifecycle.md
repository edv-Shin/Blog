---
title: '[안드로이드] Activity & Fragment Lifecycle'
authors: dongwon
date: 2023-07-10
tags: ['android']
---

## Lifecycle (생명주기)

안드로이드에서 Lifecycle은 Lifecycle을 갖는 컴포넌트(액티비티, 프래그먼트)가 처음으로 생성되고, 사용되고, 소멸되는 과정을 의미한다. Lifecycle은 컴포넌트의 상태 변화를 나타내고, 액티비티와 프래그먼트는 각 단계별로 Lifecycle를 거치면서 관리된다.   

   안드로이드에서는 액티비티와 프래그먼트의 Lifecycle단계들을 콜백 메서드로 정의하고 있다. 우리가 개발을 할 때는 이러한 콜백 메서드들을 재정의하여 사용한다. 음.. 재정의라는 말이 어려워보일 수 있지만 그냥 콜백 메서드안에 코드들을 써서 활용한다는 뜻이다.

## Activity Lifecycle

![](./assets/android-lifecycle-01.png)

액티비티 Lifecycle

#### onCreate

-   Activity가 생성되면 가장 먼저 호출됨
-   생명주기 통틀어서 단 한 번만 수행되는 메서드
-   화면 Layout 정의, View 생성 등은 이곳에 구현함

#### onStart

-   Activity가 화면에 표시되기 직전에 호출됨
-   화면에 진입할 때마다 실행되어야 하는 작업을 이곳에 구현함

#### onResume

-   Activity가 화면에 보여지는 직후에 호출됨
-   현재 Activity가 사용자에게 포커스인 되어있는 상태

#### onPause

-   Activity가 화면에 보여지지 않은 직후에 호출됨
-   현재 Activity가 사용자에게 포커스 아웃 되어있는 상태
-   다른 Activity가 호출되기 전에 실행되기 때문에 무거운 작업을 수행하지 않도록 주의해야함

#### onStop

-   Activity가 다른 Activity에 의해 100% 가려질 때 호출되는 메서드
-   홈 키를 누르는 경우, 다른 Activity로의 이동이 있는 경우가 있음
-   이 상태에서 Activity가 호출되면, onRestart() 메서드가 호출됨

#### onRestart

-   onStop()이 호출된 이후에 다시 기존 Activity로 돌아오는 경우에 호출되는 메서드
-   onRestart()가 호출된 이후 이어서 onStart()가 호출됨

#### onDestroy

-   Activity가 완전히 종료되었을 때 소멸하기 전에 호출되는 메서드
    -   (사용자가 액티비티를 완전히 닫거나 액티비티에서 finish()가 호출되어) 액티비티가 종료되는 경우
    -   구성 변경(예: 기기 회전 또는 멀티 윈도우 모드)으로 인해 시스템이 일시적으로 액티비티를 소멸시키는 경우
-   onDestory() 콜백은 이전의 콜백에서 해제되지 않은 모든 리소스를 해제해야함

## Fragment Lifecycle

프래그먼트의 Lifecycle은 액티비티의 Lifecycle에 의존적이기 때문에 액티비티가 소멸되면 그 안의 프래그먼트들도 함께 소멸된다. 액티비티와 마찬가지로   처음으로 생성되고, 사용되고, 소멸될 때 호출되는 콜백 메서드들도 있고, 추가적인 콜백 메서들도 가지고 있다.   

![](./assets/android-lifecycle-02.png)

프래그먼트 Lifecycle

#### onAttach

-   프래그먼트가 액티비티에 붙을 때 호출
-   인자로 Context가 주어진다.

#### onCreateView

-   레이아웃 inflate 담당
-   savedInstanceState로 이전 상태에 대한 데이터 제공
-   View와 관련된 객체를 초기화 할 수 있음

onViewCreated

-   onCreagteView()를 통해 반환된   View 객체는 onViewCreated()의 파라미터로 전달   된다.
-   이 때 Lifecycle이   INITIALIZED 상태로 업데이트가 됨
-   때문에   View의 초기값 설정, LiveData 옵저빙, RecyclerView, ViewPager2에 사용될 Adapter 세팅은 이 메소드에서 해주는 것이 적절함

#### onDestroyView

-   모든 exit animation, transaction이 완료되고 Fragment가 화면으로부터 벗어났을 경우 호출됨

#### onDetach

-   프래그먼트가 액티비티와 연결이 끊어지는 중일 때 호출됨


> 관련 문서:
>
> [Android developers - activity lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle)
>
> [Android developers - fragment lifecycle](https://developer.android.com/guide/fragments/lifecycle)
