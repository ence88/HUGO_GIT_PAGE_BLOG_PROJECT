---
title: "함수처럼 매개변수를 갖는 매크로, #, ## 연산자"
date: 2020-11-29T21:29:12+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce, Blog
categories:
- Language
- C++
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- None
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

#define 매크로 정의시 단순 상수 정의는 다음과 같습니다.

**#define PI   (3.141592)**

매크로를 활용 하여 인라인 함수 형태로 작성 할 때 매개변수를 전달 할 수 있습니다.

**\#define CIRCLE(x) ((x)*(x)*(PI))**

<!--more-->

#### #연산자

**# 연산자는 매개변수를 문자화 하는 연산자 입니다.**

```c++
#define STRING(x) #x
std::string test = STRING(123456);
printf(test.c_str());
```



#### ##연산자

**##은 두 개의 토큰을 이어준다. 혹은 붙여준다.** 의 의미로 생각하시면 됩니다. 

```c++
#define INT_name_num(num)    int name##num;
```

위와 같은 매크로가 있고, 함수내에서 INT_i(0) 이라는 매크로를 사용했다고 가정합시다.

그렇다면 위의 매크로는 받아온 num이라는 변수를 name##num 와 같이 붙여준 int형 변수를 선언하게 됩니다. 

즉 위의 매크로와 같은 표현은 

int name0; 로 컴파일 타임에 치환됩니다.