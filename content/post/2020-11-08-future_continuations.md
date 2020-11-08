---
title: "Boost Future의 continuations(연속 연결)"
date: 2020-11-08T23:31:17+09:00
#Dev, C++
categories:
- Dev
- C++
tags:
- C++
- Future
- Boost
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

In asynchronous programming, it is very common for one asynchronous operation, on completion, to invoke a second operation and pass data to it. The current C++ standard does not allow one to register a continuation to a future. With `.then`, instead of waiting for the result, a continuation is "attached" to the asynchronous operation, which is invoked when the result is ready. Continuations registered using the `.then` function will help to avoid blocking waits or wasting threads on polling, greatly improving the responsiveness and scalability of an application.

비동기 프로그래밍에서 하나의 비동기 작업이 완료되면 두 번째 작업을 호출하고 여기에 데이터를 전달하는 것이 매우 일반적입니다. 현재 C ++ 표준은 미래에 대한 연속 등록을 허용하지 않습니다. 를 사용하면 결과를 기다리는 대신 결과가 준비되면 호출되는 비동기 작업에 연속 작업이 "연결"됩니다. 이 함수를 사용하여 등록 된 연속 은 대기를 차단하거나 폴링에 스레드를 낭비하지 않도록하여 애플리케이션의 응답 성과 확장 성을 크게 향상시킵니다

<!--more-->

`future.then()` provides the ability to sequentially compose two futures by declaring one to be the continuation of another. With `.then()` the antecedent future is ready (has a value or exception stored in the shared state) before the continuation starts as instructed by the lambda function.

In the example below the `future<int>` `f2` is registered to be a continuation of `future<int>` `f1` using the `.then()` member function. This operation takes a lambda function which describes how `f2` should proceed after `f1` is ready.

하나를 다른 것의 연속이라고 선언하여 두 개의 미래를 순차적으로 구성하는 기능을 제공합니다. 함께 선행 미래 준비 람다 함수에 의해 지시 된대로 계속 시작되기 전에 (공유 상태로 저장 값 또는 예외를 갖습니다.)

아래 예에서는 멤버 함수 사용의 연속으로 등록됩니다 . 이 작업 은 준비 후 어떻게 진행해야하는지 설명하는 람다 함수를 사용 합니다 .

```
#include <boost/thread/future.hpp>
using namespace boost;
int main()
{
  future<int> f1 = async([]() { return 123; });
  future<string> f2 = f1.then([](future<int> f) { return f.get().to_string(); // here .get() won't block });
}
```

One key feature of this function is the ability to chain multiple asynchronous operations. In asynchronous programming, it's common to define a sequence of operations, in which each continuation executes only when the previous one completes. In some cases, the antecedent future produces a value that the continuation accepts as input. By using `future.then()`, creating a chain of continuations becomes straightforward and intuitive:

이 함수의 핵심 기능 중 하나는 여러 비동기 작업을 연결하는 기능입니다. 비동기 프로그래밍에서는 각 연속 작업이 이전 작업이 완료 될 때만 실행되는 일련의 작업을 정의하는 것이 일반적입니다. 어떤 경우에는 선행 미래가 연속이 입력으로 받아들이는 값을 생성합니다. 를 사용 하면 연속 체인을 만드는 것이 간단하고 직관적이됩니다.

```
myFuture.then(...).then(...).then(...).
```

Some points to note are:

- Each continuation will not begin until the preceding has completed.
- If an exception is thrown, the following continuation can handle it in a try-catch block

Input Parameters:

- Lambda function: One option which can be considered is to take two functions, one for success and one for error handling. However this option has not been retained for the moment. The lambda function takes a future as its input which carries the exception through. This makes propagating exceptions straightforward. This approach also simplifies the chaining of continuations.
- Scheduler: Providing an overload to `.then`, to take a scheduler reference places great flexibility over the execution of the future in the programmer's hand. As described above, often taking a launch policy is not sufficient for powerful asynchronous operations. The lifetime of the scheduler must outlive the continuation.
- Launch policy: if the additional flexibility that the scheduler provides is not required.

입력 매개 변수 :

- Lambda 함수 : 고려할 수있는 한 가지 옵션은 성공을위한 기능과 오류 처리를위한 기능의 두 가지를 취하는 것입니다. 그러나이 옵션은 현재 유지되지 않았습니다. 람다 함수는 예외를 전달하는 입력으로 future를 사용합니다. 이는 예외 전파를 간단하게 만듭니다. 이 접근 방식은 또한 연속 연결을 단순화합니다.
- 스케줄러 : 스케줄러 참조를 가져 오기 위해에 오버로드를 제공 하면 프로그래머의 손에있는 미래의 실행에 대해 큰 유연성을 제공합니다. 위에서 설명한 것처럼 종종 시작 정책을 취하는 것만으로는 강력한 비동기 작업에 충분하지 않습니다. 스케줄러의 수명은 연속보다 길어야합니다. `.then`
- 시작 정책 : 스케줄러가 제공하는 추가 유연성이 필요하지 않은 경우.

Return values: The decision to return a future was based primarily on the ability to chain multiple continuations using `.then()`. This benefit of composability gives the programmer incredible control and flexibility over their code. Returning a `future` object rather than a `shared_future` is also a much cheaper operation thereby improving performance. A `shared_future` object is not necessary to take advantage of the chaining feature. It is also easy to go from a `future` to a `shared_future` when needed using future::share().

반환 값 : 미래를 반환하기로 한 결정은 주로를 사용하여 여러 연속을 연결하는 기능에 기반 합니다. 이러한 구성 가능성의 이점은 프로그래머에게 코드에 대한 놀라운 제어와 유연성을 제공합니다. a 가 아닌 객체를 반환하는 것도 훨씬 저렴한 작업이므로 성능이 향상됩니다. 개체는 체인 기능을 활용할 필요가 없습니다. 또한 future :: share ()를 사용하여 필요할 때 a 에서 a 로 쉽게 이동할 수 있습니다.



### 결론

std::future에는 없는 기능으로 then을 활용 할 경우 블락이 걸리지 않기 때문에 서버 성능에 이점이 있습니다.