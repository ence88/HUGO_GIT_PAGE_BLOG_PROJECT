---
title: "std::invoke_result 클래스"
date: 2020-11-10T21:44:03+09:00
#Dev, C++
categories:
- Language
- C++
tags:
- C++
- std
- C++17
- Modern C++
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

컴파일 타임에 지정 된 인수 형식을 사용 하는 호출 가능 형식의 반환 형식을 결정 합니다. C + + 17에 추가 되었습니다.

<!--more-->

  

## 구문

```cpp
template <class Callable, class... Args>
   struct invoke_result<Callable(Args...)>;

// Helper type
template<class Callable, class... Args>
   using invoke_result_t = typename invoke_result<Callable, Args...>::type;
```

  

  

### 매개 변수

*호출*
쿼리할 호출 가능 형식입니다.

*Args*
쿼리할 호출 가능 형식에 대한 인수 목록의 형식입니다.

  

  

## 설명

이 템플릿을 사용 하 여 컴파일 시간 *에 호출할 수 있는 (**args*...)의 결과 형식을 확인할 수 있습니다. 여기에서 *호출 가능* 하 고 *args* 의 모든 형식은 완전 한 형식, 알 수 없는 범위 배열 또는 cv 한정이 될 수 **`void`** 있습니다. `type`클래스 템플릿의 멤버는 인수 인수를 사용 하 여 호출할 때 호출 *가능* 의 반환 형식을 이름으로 사용 *합니다.* `type`인수 인수를 사용 하 여 호출할 때 *호출 될* 수 있는 경우에만 멤버가 정의 됩니다 *.* 확인 되지 않은 컨텍스트에서 그렇지 않은 경우 클래스 템플릿에는 `type` 컴파일 타임에 특정 인수 형식 집합에 대 한 SFINAE 테스트를 허용 하는 멤버가 없습니다.

  

  

## 요구 사항

**헤더:**<type_traits>

**네임스페이스:** std