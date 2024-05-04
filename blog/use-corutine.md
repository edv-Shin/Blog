---
title: 나모의 코루틴 사용기
authors: dongwon
date: 2024-04-23
tags: ['namo']
---

[나모의 코루틴 사용기](https://namo-log.vercel.app/android-coroutine)

안녕하세요! 돌아온 **나모**의 안드로이드 개발자 짱구입니다.

오늘은 리팩토링 과정 중, **코루틴**을 활용하여 나모의 데이터 접근 패턴을 어떻게 효율적으로 개선했는지에 대해 공유하고자 합니다.

# **기존의 문제점**

기존에는 api를 호출할 때 **Thread**를 사용하여 데이터베이스 작업을 수행하고, **join()**을 통해 메인 스레드에서 작업의 완료를 기다리는 방식을 사용했습니다.

![](./assets/corutine-01.png)

## 1\. 메인 스레드의 과부하와 성능 저하

기존 방식에서는 Thread와 join()을 사용하여 데이터베이스와 네트워크 작업을 처리했습니다. 이 과정에서 데이터를 요청하고 결과를 기다리는 동안 메인 스레드가 블로킹되어 UI의 응답성이 크게 저하되었습니다. 안드로이드에서 UI 업데이트는 모두 메인 스레드에서 처리되어야 하기 때문에 블로킹은 앱의 반응 속도를 느리게 하고, 사용자 경험을 저해합니다. 최악의 경우, 메인 스레드에서 5초 이상 작업이 지속되어   ANR 오류가 발생할 수 있습니다.

## 2\. 리소스 관리의 비효율성

스레드를 직접 생성하고 관리하는 방식은 리소스 할당과 해제를 개발자가 직접 관리해야 하므로 오류가 발생하기 쉽고, 애플리케이션의 성능을 저하시킬 수 있습니다. 각 스레드는 별도의 메모리 공간과 컨텍스트 스위칭 비용을 필요로 하는데, 리소스가 제한적인 모바일 환경에서 부담이 될 수 있습니다. 결국, 스레드가 과도하게 생성될 경우 시스템 전체의 성능 저하가 될 수 있습니다.

## 3\. 코드의 복잡성과 유지보수 문제

스레드 기반의 비동기 처리는 콜백을 사용하여 결과를 반환하므로, 콜백 지옥에 빠질 위험이 있습니다. 이는 코드의 가독성과 유지보수성을 크게 떨어뜨리며, 에러 처리가 어려워짐에 따라 애플리케이션의 안정성까지 저하시킬 수 있습니다. 각 콜백은 다른 콜백에 의존적이어서 디버깅이 매우 어렵고, 에러가 발생했을 때 추적하기가 까다로워집니다.

# **코루틴 활용**

코루틴을 이용하면 이러한 비동기 작업을 간결하고 효과적으로 처리할 수 있습니다.

## **1\. 메인 스레드 부담 감소**

![](./assets/corutine-02.png)

코루틴을 사용하면 메인 스레드에서 복잡하고 무거운 작업을 분리하여 실행할 수 있습니다. 이로 인해 UI가 부드럽게 작동하고, 사용자 경험이 향상됩니다.

```kotlin
class LocalDiaryDataSource @Inject constructor(private val diaryDao: DiaryDao) {
  suspend fun getDiary(diaryId: Long): Diary {
    var diaryResult = Diary(
      diaryId = 0L,
      scheduleServerId = 0L,
      content = "",
      images = listOf(""),
      state = RoomState.DEFAULT.state,
      isUpload = false,
      isHeader = false
    )
    withContext(Dispatchers.IO) {
      runCatching {
        diaryDao.getDiaryDaily(diaryId)
      }.onSuccess {
        Log.d("LocalDiaryDataSource getDiary Success", "$it")
        diaryResult = it
      }.onFailure {
        Log.d("LocalDiaryDataSource getDiary Fail", it.toString())
      }
    }
    return diaryResult
  }
}
```

**withContext(Dispatchers.IO)**를 사용하여 데이터베이스 접근 코드를 IO 스레드에서 실행합니다. 예시는 RoomDB를 들었지만, Retrofit 작업도 똑같이 IO 스레드에서 실행합니다. 데이터 작업을 적절한 스레드에서 처리하여 메인 스레드의 부담을 줄여 성능을 최적화합니다.

## **2\. 리소스 효율적 관리**

코루틴은 필요할 때만 스레드를 활성화하고, 작업이 완료되면 자원을 자동으로 회수합니다. 이는 애플리케이션의 성능을 최적화하는 데 도움을 줍니다.

```kotlin
fun getExistingPersonalDiary(diaryId: Long) {
  viewModelScope.launch {
    Log.d("PersonalDiaryViewModel getDiary", "$diaryId")
    _diary.postValue(repository.getDiary(diaryId))
  }
}
```

여기서 **viewModelScope.launch**는 ViewModel의 생명주기에 연결된 코루틴 스코프를 생성하며, 이 스코프 내에서 실행되는 코루틴은 ViewModel이 클리어되면 자동으로 취소됩니다. 이를 통해 메모리 누수를 방지하고, UI 관련 작업을 안전하게 수행할 수 있습니다

## **3\. 비동기 코드의 간결성**

코루틴을 사용하면 비동기 코드를 마치 동기 코드처럼 간단하고 명료하게 작성할 수 있습니다. 또한, 코루틴은 콜백 지옥을 해결하고, 에러 처리를 간소화하여 유지보수성을 높이는 데 큰 도움을 주었습니다.

# **마치며**

코루틴을 활용하면 비동기 처리를 훨씬 효율적으로 관리할 수 있습니다. 나모에서는 코루틴을 활용하여 데이터 접근 속도가 향상되었고, 앱의 반응성이 개선되었습니다. 또한, 코루틴은 코드의 가독성을 높이고 에러 핸들링을 간소화하여, 유지보수가 용이해졌습니다.

앞으로도 나모 팀은 좋은 사용자 경험을 제공하는 안드로이드 앱을 개발하기 위해 노력할 것입니다. 감사합니다!