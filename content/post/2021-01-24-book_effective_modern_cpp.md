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

책 내용에서 중요하거나, 잊기 쉬운 내용을 본 포스팅에 정리합니다.

<!--more-->

  

### 용어와 관례

- **버전의 포함 관계**

| 용어  | 의도한 버전   |
| ----- | ------------- |
| C++   | 모든 버전     |
| C++98 | C++98과 C++03 |
| C++11 | C++11과 C++14 |
| C++14 | C++14         |

- **함수 객체**

> operator() 멤버 함수를 지원하는 형식의 객체 또는, 함수이름(인수들) 형태를 이용해서 실행 할 수 있는 모든 것들 ex 함수 포인터
>
> 람다 표현식을 통해 만들어진 함수 객체를 클로저(Closure)라 부름

- **함수 템플릿, 템플릿 함수 / 클래스 템플릿, 템플릿 클래스**
  함수 템플릿과 템플릿 함수는 같은 것으로 보며, 클래스 템플릿과 템플릿 클래스도 마찬가지 이다.
- 

