---
title: "boost::make_ready_future"
date: 2020-11-09T21:09:42+09:00
#Dev, C++
categories:
- Language
- C++
tags:
- C++
- boost
keywords:
- tech
- developer
- 개발자
- programmer
- programming
- software
- 프로그래머
- coding
- 코딩
- server

#thumbnailImage: //example.com/image.jpg
---

#### Making immediate futures easier

일부 함수는 구성 시점에서 값을 알 수 있습니다. 이 경우 값을 즉시 사용할 수 있지만 future 또는 shared_future로 반환해야합니다. make_ready_future를 사용하면 공유 상태에서 미리 계산 된 결과를 보유하는 future를 만들 수 있습니다.

<!--more-->

  

이러한 기능이 없으면 가치에서 직접 future를 만드는 것은 사소한 일이 아닙니다. 먼저 promise를 생성 한 다음 promise를 설정하고 마지막으로 promise에서 future를 검색합니다. 이제 하나의 작업으로이 작업을 수행 할 수 있습니다.

{{< adsense >}}  

###### make_ready_future

이 함수는 주어진 값에 대한 future를 만듭니다. 값이 제공되지 않으면 future <void>가 반환됩니다. 이 함수는 반환 값을 즉시 사용할 수있는 경우도 있지만 그렇지 않은 경우에 주로 유용합니다. 아래 예제는 오류 경로에서 값이 즉시 알려지지 만 다른 경로에서는 함수가 future로 표시된 최종 값을 반환해야 함을 보여줍니다.

```cpp
boost::future<int> compute(int x)
{
  if (x == 0) return boost::make_ready_future(0);
  if (x < 0) return boost::make_ready_future<int>(std::logic_error("Error"));
  boost::future<int> f1 = boost::async([]() { return x+1; });
  return f1;
}
```

이 기능에는 두 가지 변형이 있습니다. 첫 번째는 모든 유형의 값을 취하고 해당 유형의 future를 반환합니다. 입력 값은 반환 된 future의 공유 상태로 전달됩니다. 두 번째 버전은 입력을받지 않고 future <void>를 반환합니다.