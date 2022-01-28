---
title: "함수형 프로그래밍 in 코틀린 - 코틀린으로 함수형 프로그래밍 시작하기[2]"
date: 2022-01-28T10:35:00+09:00
#Dev, C++
categories:
- Common
- FunctionalProgramming
tags:
- Functional Programming
- Kotlin
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

abstract : 알아두면 좋은 코틀린 문법

<!--more-->

#### Interface

- 추상 프로퍼티(멤버 변수)가 가능함

　

{{< adsense >}}

#### Data Class

- hashCode, equals, toString, copy 멤버 함수 자동적 생성

　

#### Class와 Data Class 공통 특징

- 세터와 게터 자동 생성 기능 존재(코드에 명시하지 않더라도 언어 차원에서 지원)

　

#### Sealed Class

- enum class와 다르게 패턴 매칭 활용 가능
  - 리스트, 함수 타입에 대한 패턴매칭은 지원하지 않음(스칼라, 하스켈에서는 가능)

```kotlin
fun main() {
    println(checkValue("kotlin"))   // kotlin
    println(checkValue(5))      // 1..10
    println(checkValue(15))     // 11 or 15
    println(checkValue(User("Joe", 76)))    // User
    println(checkValue("unknown"))  // SomeValue

    println(checkCondition("kotlin"))   // kotlin
    println(checkCondition(5))   // 1..10
    println(checkCondition(User("Joe", 76)))   // == User(Joe, 76)
    println(checkCondition(User("Sandy", 65)))   // is User
    println(checkCondition("unknown"))   // SomeValue

    println(sum(listOf(1, 3, 4)))   // 8
}

data class User(val name: String, val age: Int)

fun checkValue(value: Any) = when (value) {
    "kotlin" -> "kotlin"
    in 1..10 -> "1..10"
    11, 15 -> "11 or 15"
    is User -> "User"
    else -> "SomeValue"
}

fun checkCondition(value: Any) = when {
    value == "kotlin" -> "kotlin"
    value in 1..10 -> "1..10"
    value === User("Joe", 76) -> "=== User"
    value == User("Joe", 76) -> "== User(Joe, 76)"
    value is User -> "is User"
    else -> "SomeValue"
}

fun sum(numbers: List<Int>): Int = when {
    numbers.isEmpty() -> 0
    else -> numbers.first() + sum(numbers.drop(1))
}
```
