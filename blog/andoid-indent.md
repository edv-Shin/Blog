---
title: '[안드로이드] Intent와 Bundle'
authors: dongwon
tags: ['android']
date: 2023-06-26
---

안드로이드에서 Activity와 컴포넌트들 간에 데이터를 전달하려면 흔히 Intent 또는 Bundle을 사용한다. 두 기능이 비슷해보일 수 있지만, 용도에 있어서 차이가 있다. 먼저 Intent와 Bundle에 대해서 알아보자.

## 인텐트 ( Intent )

'Intent'는 안드로이드에서 제공하는 중요한 컴포넌트 중 하나로, 다양한 컴포넌트 간에 작업 수행을 위해 정보를 **전달**하는 역할을 한다. 컴포넌트간의 **통신수단**이라고 보면 되겠다. 가장 많이 사용되는 예로는 액티비티간의 화면 전환이 있다.

Intent는 크게 두 가지 유형으로 구분되는데, 명시적 인텐트(Explicit Intents)와 암시적 인텐트(Implicit Intents)이다.

1.  명시적 인텐트 : 명확하게 전달하려는 컴포넌트를 지정할 때 사용한다.
2.  암시적 인텐트 : 특정 작업을 수행할 수 있는 어떤 컴포넌트든 호출할 수 있도록 허용한다.

```kotlin
Intent intent = new Intent(FirstActivity.this, SecondActivity.class);

startActivity(intent);

Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com"));
startActivity(intent);
```

## 번들 ( Bundle )

Bundle은 여러가지 타입의 값을 **저장**하는 Map 클래스다. key-value 형태로 데이터를 저장할 수 있고, value값에는 int, String같이 간단한 타입부터 Parcelable같이 복잡한 타입까지 저장할 수 있다. Bundle 객체를 생성하고 데이터를 넣은 후, 인텐트를 통해 다른 컴포넌트에 전달할 수 있다.

```kotlin
Bundle bundle = new Bundle();
bundle.putString("key", "value");

Intent intent = new Intent(FirstActivity.this, SecondActivity.class);
intent.putExtras(bundle);
startActivity(intent);
```

## \# 차이점

두 기능은 용도에 있어서 명확한 차이점이 있다.

Intent는 <u><b>전달</b></u>하는 용도로 사용되는 객체이고, Bundle은 데이터를 <u><b>저장</b></u>하는 용도로 사용되는 객체이다.

흔히들 드는 예시로 Intent는 택배기사, Bundle은 택배에 비유할 수 있다.

보통 Intent로 데이터를 전달할 때 두 가지 방법을 사용한다.

```kotlin
val intent = Intent()
intent.putExtra("key","value")

val intent = Intent()

val bundle = Bundle()
bundle.putString("key","value")
intent.putExtra("bundle",bundle)
```

두 가지 방법의 결과는 같지만, Bundle을 통해 보내주느냐 아니냐의 차이가 있다. Intent의 내부함수에서 기본적으로 Bundle을 통해서 데이터를 전달하기 때문에, 비용적인 측면에서는 Bundle을 사용하는 것이 좋다. 하지만 코드길이나 가독성측면에서는 Intent만 사용하는 것이 좋을지도