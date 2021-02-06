---
title: "Effective Modern C++ 내용 정리"
date: 2021-02-06T16:16:24+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN, Book
categories:
- Common
- Book
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- C++
- Book Summary
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
draft: true
#thumbnailImage: //example.com/image.jpg
---

Effective Modern C++ // Scott Meyers 저

책 내용에서 중요하거나, 잊기 쉬운 내용을 본 포스팅에 정리합니다. (두고 두고 보기 위해, 자꾸 까먹는 허접한 뇌...)

<!--more-->

  

### 용어와 관례

- **버전의 포함 관계**

| 용어  | 의도한 버전   |
| ----- | ------------- |
| C++   | 모든 버전     |
| C++98 | C++98과 C++03 |
| C++11 | C++11과 C++14 |
| C++14 | C++14         |

- **주어진 표현식이 *rvalue*(우측값) 인지 *lvalue*(좌측값) 인지 대승적으로 판단하는 방법 ->  일반적으로 주소를 취할 수 있다면 *lvalue* !**
- **인수(argument)와 매개변수(parameter) 구분**
  - argument는 함수 호출시 전달되는 값의 표현이며, 이 argument는 paramter를 초기화 하는데 쓰인다.
  - argument는 *rvalue*일 수도 *lvalue*일 수도 있고, 일반적으로 *rvalue*일 경우 최적화가 용이해 질 수 있다.
  - parameter는 함수 호출시 전달 될 수 있는 표현식을 의미한다. ex) void f(const T& param1) // parameter는 param1
- **함수 객체**
  - operator() 멤버 함수를 지원하는 형식의 객체 또는, 함수이름(인수들) 형태를 이용해서 실행 할 수 있는 모든 것들 ex 함수 포인터
  - 람다 표현식을 통해 만들어진 함수 객체를 클로저(Closure)라 부름

- **함수 템플릿, 템플릿 함수는 같은 의미로 본다. (마찬가지로 클래스 템플릿, 템플릿 클래스도 같은 의미)**
  - 함수 탬플릿 or 클래스 템플릿은 -> 템플릿으로 부른다.

  

### Type deduction(C++11)

- **관련 키워드**

  - auto, decltype, decltype(auto)

- **auto의 타입 추론 규칙**

  - C++98의 템플릿의 타입 추론 규칙과 동일

  - 당연하게도, 컴파일 타임 처리

  - parameter의 형태에 따라 총 3가지 경우로 나뉨

    1. 포인터(*) 또는 레퍼런스(&) 일 경우

       ```cpp
       
       ```

    2. rvalue 레퍼런스(aka. universal reference) 일 경우(&&)

       ```cpp
       
       ```

    3. 포인터, 레퍼런스도 아닐 경우

       ```cpp
       
       ```

       



p.12, to be continue...