---
title: 네트워크 연결 이슈 대응
authors: dongwon
date: 2023-07-03
tags: ['troubleshooting']
---

[개발을 하면서 있었던](./troubleshooting-app-launching.md) 네트워크 연결 이슈에 대해 기록해두려 한다.

처음 개발을 할 때는 네트워크 환경을 고려하지 않고, 일단 돌아가도록 개발을 했다. 하지만 당연하게도, 네트워크 연결이 끊겼을 때 뷰를 클릭하면 앱이 다운되는 이슈가 있었는데, ConnectivityManager와 MutableLiveData를 사용하여 네트워크 연결을 감지하고, 그에 맞게 네트워크 연결이 끊어졌다는 프래그먼트나, 다이얼로그를 띄워서 해결했다.

먼저 Application 클래스에 네트워크 연결 상태를 저장하고 변경을 감지할 수 있는 MutableLiveData 객체를 생성한다. 처음에는 BaseActivity와 BaseFragment(공통부분을 묶어놓은 클래스)에 생성을 했었다. 그런데 networkValid객체를 여러 곳에 선언하면 보여지고 있는 Activity나 Fragment의 Callback이 각각 실행되는 것으로 보였고, 앱에서 한번만 생성하는게 좋겠다고 생각하여 Application 클래스에 넣었다.

```kotlin

val networkValid : MutableLiveData<Boolean> = MutableLiveData<Boolean>(false)
private val networkCallback = NetworkConnectionCallback()
```

MutableLiveData는 데이터의 변경을 감지할 수 있는 LiveData의 한 형태다.

LiveData는 수명주기를 인식하는 데이터 홀더 클래스로, LiveData에 보관된 데이터는 옵저버가 활성 상태일 때만 업데이트된다. 이런 특성 덕분에 UI 컴포넌트(액티비티, 프래그먼트 등)의 수명 주기에 따라 자동으로 업데이트된다.

그런데 LiveData는 읽기 전용이라서 LiveData에 보관된 값을 변경하려면 MutableLiveData를 사용해야 한다. MutableLiveData 클래스는 LiveData의 값을 변경할 수 있는 메서드를 제공하므로, 데이터의 변경을 감지하고 이에 따라 UI를 업데이트 할 수 있다.

```kotlin
class NetworkConnectionCallback : ConnectivityManager.NetworkCallback() {
  override fun onAvailable(network: Network) {
    super.onAvailable(network)
    networkValid.postValue(true)
}
  override fun onLost(network: Network) {
    super.onLost(network)
    networkValid.postValue(false)
  }
}

private fun registerNetworkCallback(context: Context) {
  val connectivityManager =
    context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
  val networkRequest = NetworkRequest.Builder()
    .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    .build()

  connectivityManager.registerNetworkCallback(networkRequest, networkCallback as ConnectivityManager.NetworkCallback)
}

private fun unregisterNetworkCallback(context: Context) {
  val connectivityManager =
    context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

  connectivityManager.unregisterNetworkCallback(networkCallback as ConnectivityManager.NetworkCallback)
}
```

안드로이드에서 네트워크의 연결을 감지하기 위해서   **ConnectivityManager**를 사용한다.

네트워크 연결 상태의 변화를 감지하기 위한   NetworkCallback   클래스를 정의한다.   onAvailable   메서드는 네트워크가 사용 가능할 때 호출되고,   onLost   메서드는 네트워크 연결이 끊어졌을 때 호출된다.

이때, 각 메서드에서는   networkValid의 값을 postValue를 사용하여 업데이트 해줄 수 있다.

그리고, 콜백을   등록하거나 해제하는   registerNetworkCallback과   unregisterNetworkCallback   메서드를 정의한다. 앱이 처음 실행될 때 register를, 앱을 종료되거나 멈출 때 unregister를 호출하면 된다.

이제 이를 활용하여, Activity나 Fragment에서 networkValid 변수를 불러와서, 네트워크 연결 상태에 따른 UI를 갱신할 수 있다.   네트워크가 끊겼을 때 바로 화면을 전환하여 알려주는 방법도 있고 또는   뷰를 클릭했을 때 다이얼로그를 띄우거나    띄우고 싶다면 클릭 리스너에 넣으면 될 것이다.   

간단하게 예를 들자면, HomeFragment에서는 다음과 같이   networkValid의 값이 변경되었을 때 다이얼로그를 띄워서 사용자에게 네트워크 연결이 끊어졌음을 알리고, 안드로이드 내의 설정화면으로 넘어갈 수 있게 처리를 할 수 있다.

```kotlin
networkValid.observe(this, Observer { isConnected ->
  if(isConnected) {

  } else {
    AlertDialog.Builder(this)
      .setMessage("네트워크 연결이 끊어졌습니다. 설정으로 이동하시겠습니까?")
      .setPositiveButton("네") { _, _ ->
        startActivity(Intent(Settings.ACTION_WIFI_SETTINGS))
      }.setNegativeButton("아니요") { dialog, _ ->
        dialog.dismiss()
      }.show()
}
})
```

내가 맡았던 부분인 MainActivity에서는 네트워크 연결이 끊겼을때(networkValid==false) 바텀네비게이션의 아이템 프래그먼트를 네트워크 연결이 끊겼음을 알려주는 프래그먼트로 변경하게 처리했다.

```kotlin
private fun setBottomNav() {
  networkValid.observe(this, Observer { isConnected ->
  val selectedFragment = when (binding.activityMainBottomNavi.selectedItemId) {
    R.id.activity_main_btm_nav_home -> homeFragment
    R.id.activity_main_btm_nav_gathering -> gatheringFragment
    R.id.activity_main_btm_nav_profile -> myProfileFragment
    else -> null
  }
  updateFragmentsVisibility(isConnected, selectedFragment)
})
}

private fun updateFragmentsVisibility(isConnected: Boolean, targetFragment: Fragment?) {
  supportFragmentManager.beginTransaction().apply {
    if (networkValid) {
      hide(networkDisconnectedFragment)
      hide(homeFragment!!)
      hide(gatheringFragment!!)
      hide(myProfileFragment!!)
      show(targetFragment!!)
    } else {
      hide(homeFragment!!)
      hide(gatheringFragment!!)
      hide(myProfileFragment!!)
      show(networkDisconnectedFragment)
    }
  }.commitAllowingStateLoss()
}
```