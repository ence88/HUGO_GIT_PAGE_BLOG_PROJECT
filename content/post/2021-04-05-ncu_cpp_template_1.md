---
title: "C++ Template Programming - Intro[1]"
date: 2021-04-05T09:00:00+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN
categories:
- Language
- C++
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- C++
- Modern C++
- C++ Template
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

#thumbnailImage: //example.com/image.jpgC스터디 내용작성 ㅇS
---

C++의 Template 기술은 C++ 에서 가장 신기하고, 재미있고, 깊이있는 분야 입니다. C++로 만들어진 다양한 라이브러리 안에는 Template 을 사용한 고급 코드를 많이 볼수 있습니다. 하지만, Template 은 일반 개발자가 아닌 라이브러리 설계자들이 널리 사용하는 기술이기 때문에, 대부분의 C++ 교육에서는 Template 의 개념 정도만 다루고 있습니다. 그래서, 오픈소스에서 볼수 있는 다양한 고급 기법을 정확히 이해하기는 어려움이 있습니다. 또한, C++의 표준 라이브러리인 STL을 깊이 있게 이해 하기 위해서도 Template 기술은 필수입니다. 이 시리즈는 C++언어의 Template 분야에 대한 다양한 문법과 기법을 배우는 과정입니다.
<!--more-->

 본 시리즈에서는 다음과 같은 내용을 배울수 있습니다.

1. C++ Template과 관련된 다양한 기본/고급 문법을 배우게 됩니다.
2. 문법 뿐 아니라 Traits, Lazy Instantiation, Type Selection, declval 등 다양한 기법을 배우게 됩니다.
3. SFINAE, enable_if, IfThenElse, Member Detect 등 Template 관련 다양한 C++ IDioms 을 배우게 됩니다.
4. CRTP, Thin Template, Policy-Base Design, rebind 등 Template 관련 디자인 기법을 배우게 됩니다.
5. C++98/03 뿐 아니라 C++11/14 그리고 C++17/20에서 추가되는 최신 내용도 배우게 됩니다.



### 실습환경

- Visual Studio 2019 Professional ( or Community)

- cI 컴파일러 옵션 : /std:c++latest /nologo /EHsc /Za /MD
  - EHsc : 예외 경고 제거
  - Za : 확장문법 사용하지 않음
  - MD : 표준 라이브러리 DLL 버전 사용
- boost 설치 (www.boost.org) 후 프로젝트 포함 디렉터리에 추가 및 필요한 헤더 Include, boost 로컬 빌드 후 포함 라이브러리 디렉터리 추가



[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)

