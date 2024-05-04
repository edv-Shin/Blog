---
title: '[안드로이드] Manifest 개념'
authors: dongwon
date: 2022-11-01
tags: ['android']
---

## Manifest란?

안드로이드 프로젝트에 반드시 포함되어야 하는 파일로, 앱의 패키지, 컴포넌트, 권한, 기기호환성 설정을 관리한다.

모든 앱 프로젝트는 프로젝트 Source Set의 루트(디폴트는 src/main)에 `AndroidManifest.xml`파일이 있어야 한다.

## Manifest의 구조

매니페스트 파일은 많은 정보를 담지만 특히 4가지의 정보를 선언한다.

1.  앱의 패키지 이름
2.  앱에서 사용되는 컴포넌트(Activity, Service, Broadcast Receiver, Content Provider)
3.  권한
4.  앱에서 요구하는 하드웨어와 소프트웨어 특징

___

### 1\. 앱의 패키지 이름

매니페스트 파일의 root element(`<manifest></menifest>`)에는 앱의 패키지명이 반드시 있어야 한다.

예를 들어 패키지 이름이`"com.example.myapp"`인 manifest를 보자.

```xml
<?xml version="1.0" encoding="utf-8"?>
  <manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp"
    android:versionCode="1"
    android:versionName="1.0" >
  ...
</manifest>
```

우리가 앱을 apk로 빌드하면서 Android Build Tool이 두 가지 목적으로 패키지 이름이 사용된다.

-   App Resource에 접근하는데 사용되는 R 클래스의 네임스페이스로 적용된다.  
    (위 코드에서는 com.exaple.myapp.R 클래스가 생성된다.)
-   매니페스트 내부의 상대 클래스 이름을 식별한다.  
    예를 들어 manifest 파일 안에서 `<activity android:name=".MainActivity">`라는 코드를 작성했다면,  
    `.MainActivity` → `com.example.myapp.MainActivity`인 것으로 식별한다.

하지만 패키지 값이 안드로이드를 빌드한 이후에도 계속 그대로 사용되지는 않는다.

빌드가 완료되면, 패키지 이름 또한 build.gradle 파일의 apllicationId 속성의 값으로 바뀐다.

### 2\. 앱에서 사용하는 컴포넌트

안드로이드 시스템은 해당 앱이 어떤 컴포넌트를 사용하고 있는지 알아야 한다.

만약 컴포넌트, 예를 들어 액티비티를 만들어놓고 manifest 파일에 선언하지 않으면 시스템에서 해당 객체를 생성하고 실행하는 것이 불가능하기 때문에, 에러가 나게 된다.

따라서 앱에서 생성하는 각각의 컴포넌트에 대해 매니페스트 파일에서 해당하는 XML 요소를 선언해야 한다.

-   `<activity>`   Activity의 각 하위 클래스
-   `<service>`   Service의 각 하위 클래스
-   `<receiver>`   BroadcastReceiver의 각 하위 클래스
-   `<provider>`   ContentProvider의 각 하위 클래스

하위 클래스의 이름은 완전한 패키지 이름을 사용하여 name 특성으로 지정해야 한다. 예를 들면 다음과 같다.

```xml
<manifest>
  <application>
    <activity android:name="com.example.myapp.MainActivity">
    </activity>
  </application>
</manifest>
```

또한 작업할 데이터, 작업을 수행해야 하는 컴포넌트들을 설명하는 `<intent-filter>`도 있지만

인텐트필터는 나중에 따로 정리할 예정이다.

### 3\. 권한

안드로이드 앱은 사용자의 카메라나 연락처, 위치 정보 등에 엑세스 하기 위해서 권한을 요청해야 한다.

이 때 매니페스트의 `<uses-permission>` 태그를 사용한다.

예를 들어, SMS 메시지를 보내야 하는 앱은 매니페스트에 다음과 같은 코드가 있어야 한다.

```kotlin
<manifest ... >
  <uses-permission android:name="android.permission.SEND_SMS"/>
  ...
</manifest>
```

만약 권한을 수락하지 않으면, 앱에서 권한이 없는 기능에 접근할 수 없게 된다.

### 4\. 기기 호환성

매니페스트 파일에서는 앱에 필요한 하드웨어 또는 소프트웨어 기능을 선언할 수 있고, 따라서 앱과 호환되는 기기 유형도 선언할 수 있다.   

어느 기기가 앱과 호환되는지 정의하는 매니페스트 태그는 여러 가지가 있는데,

대표적으로 `<uses-feature>`와 `<uses-sdk>`가 있다.

`<uses-feature>`는 자이로 센서, 나침반 센서와 같은 기능이 필요함을 나타내는 태그다.

따라서 필요한 센서나 기능들이 없는 기기에서는 앱이 설치되지 않도록 막을 수 있다.

```xml
<manifest>
   <uses-feature android:name="android.hardware.sensor.compass"
                 android:required="true" />
</manifest>
```

`<uses-sdk>`는 이전 버전에서는 사용할 수 없는 새로운 API 기능이 있을 수 있다.

앱이 호환되는 최소 버전을 나타내려면 매니페스트의 `minSdkVersion`를 사용해야 한다.

그러나 `<uses-sdk>`의 속성은 `build.gradle` 파일의 해당 속성으로 재정의 되기 때문에,

안드로이드 스튜디오를 사용한다면 `minSdkVersion`과 `targetSdkVersion`을 사용해야 한다고 한다.

```kotlin
android {
    defaultConfig {
        applicationId 'com.example.myapp'

        minSdkVersion 15
       
        targetSdkVersion 28

        ...
    }
}
```