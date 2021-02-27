---
title: "코틀린 리서치 - Control Flow[4]"
date: 2021-02-21T18:00:00+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN, Book, Study, VOCA, Kotlin
categories:
- Language
- Kotlin
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture, Kotlin, Research
tags:
- Kotlin
- 코틀린
- Research
- Language
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

#thumbnailImage: //example.com/image.jpg코틀코틀코코틀
---

코틀린의 Nullability, If 문, Smart Cast, loop 문, When 문에 대해 알아보겠습니다. 

<!--more-->

### Nullability

코틀린에서 기본 타입은 null 대입이 불가능하나 타입에 Nullable 속성을 부여 할 경우, 기본 타입도 null 관련 처리가 가능합니다.

Nullable 타입 변수의 오버라이딩된 함수를 사용 할 때에는 ?. 와 같은 표현으로 사용해야 합니다.

!!. 표현식은 nullable 타입 관련 컴파일 타임 문법 체크를 통과시킬 수 있습니다.

```c#
fun nullability()
{
    var y:String? = null // nullable string

    // println(y.length) // error
    println(y?.length) // OK

    println(y!!.length) // OK but 런타임 에러
}
```





[더 많은 코틀린 관련 정보](https://kotlinlang.org/docs/reference/)

