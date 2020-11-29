---
title: "#define 매크로, const와 차이점, 유의 사항"
date: 2020-11-08T23:10:09+09:00
#Dev, C++
categories:
- Language
- C++
tags:
- C++
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

### #define 상수

```
#define 상수명 값
```



### #define 지시문 (매크로 함수)

```
#define 식별자(인수1, 인수2 ...) 토큰열
```

<!--more-->

### const와 define의 차이점

#define은 선언을 할때에 type형을 기록하지 않고 const는 type 형을 기록합니다. 따라서 const의 변수형을 지정할 수 있다는 점 때문에 #define 보다 더 안전합니다. #define만이 할 수 있는 작업환경이 아니라면 const 사용이 권장됩니다.

 

### 유의 사항

- #define은 끝에 세미콜론(;)을 붙이면 안된다는 점을 유의해야 합니다.
- 여러줄로 코딩하기 위해선 매줄 끝에 \\를 붙혀줘야 합니다.