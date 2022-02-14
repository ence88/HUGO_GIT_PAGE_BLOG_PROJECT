---
title: "함수형 프로그래밍 in 코틀린 - 펑터[7]"
date: 2022-02-14T23:35:00+09:00
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

　

#### 펑터의 법칙

펑터가 되기 위해서는 두 가지 법칙을 만족 해야 함

- 제1 법칙 : 항등 함수(identity func)에 펑터를 통해 매핑하면, 반환되는 펑터는 원래의 펑터와 같다.
- 제2 법칙 :두 함수를 합성한 함수의 매핑은 각 함수를 매핑한 결과를 합성한 것과 같다.

**펑터 제1 법칙**

```kotlin
fmap(identity()) == identity();

fun <T> identity(x: T): T = x;
```

항등 함수는 { x -> x }와 같이 입력받은 매개변수를 가공 없이 리턴하는 함수를 말함
앞서 살펴본 maybe, tree, either는 제1 법칙을 만족한다.

**펑터 제2 법칙**

두 함수를 각각 f, g라 함

```kotlin
fmap(f compose g) == fmap(f) compose fmap(g);
```

펑터 제2 법칙 검증 예

```kotlin
fun main() {
    val f = { a: Int -> a + 1 }
    val g = { b: Int -> b * 2 }

    // Maybe 2 laws
    val nothingLeft = Nothing.fmap(f compose g)
    // compile error
    // val nothingRight = Nothing.fmap(f) compose Nothing.fmap(g)
    val nothingRight = Nothing.fmap(g).fmap(f)
    println(nothingLeft == nothingRight)  // true

    val justLeft = Just(5).fmap(f compose g)
    // compile error
    // val justRight = Just(5).fmap(f) compose Just(0).fmap(g)
    val justRight = Just(5).fmap(g).fmap(f)
    println(justLeft == justRight)  // true

    // Tree 2 laws
    val tree = Node(1, Node(2, EmptyTree, EmptyTree), Node(3, EmptyTree, EmptyTree))

    println(EmptyTree.fmap(f compose g) == EmptyTree.fmap(g).fmap(f))  // true
    println(tree.fmap(f compose g) == tree.fmap(g).fmap(f))  // true

    // Either 2 laws
    println(Left("error").fmap(f compose g) == Left("error").fmap(g).fmap(f))  // true
    println(Right(5).fmap(f compose g) == Right(5).fmap(g).fmap(f))  // true
}
```

{{< adsense >}}

**펑터의 법칙을 만족하지 못하는 펑터 인스턴스(상속)의 예**

펑터 타입 클래스가 펑터의 법칙을 만족하더라도, 해당 펑터의 인스턴스가 항상 펑터의 법칙을 만족하는 것은 아님(고로 펑터가 아닐 수 있다.)

```kotlin
fun main() {
    println(JustCounter(10, 3)
            .fmap { it + 10 }
            .fmap { it * 2 }
    )   // JustCounter(40, 5)
    println(NothingCounter.fmap { it: Int -> it + 10 })  // NothingCounter

    // Functor's raws
    println(NothingCounter.fmap { identity(it) } == identity(NothingCounter))   // true
    println(JustCounter(5, 0).fmap { identity(it) } == identity(JustCounter(5, 0))) // false

    val f = { it: Int -> it + 1 }
    val g = { it: Int -> it * 2 }

    val nothingLeft = NothingCounter.fmap { f compose g }
    val nothingRight = NothingCounter.fmap(g).fmap(f)
    println(nothingLeft == nothingRight)    // true

    val justLeft = JustCounter(5, 0).fmap { f compose g }
    val justRight = JustCounter(5, 0).fmap(g).fmap(f)
    println(justLeft == justRight)  // false
}

sealed class MaybeCounter<out A> : Functor<A> {

    abstract override fun toString(): String

    abstract override fun <B> fmap(f: (A) -> B): MaybeCounter<B>
}

data class JustCounter<out A>(val value: A, val count: Int): MaybeCounter<A>() {

    override fun toString(): String = "JustCounter($value, $count)"

    override fun <B> fmap(f: (A) -> B): MaybeCounter<B> = JustCounter(f(value), count + 1)
}

object NothingCounter: MaybeCounter<kotlin.Nothing>() {

    override fun toString(): String = "NothingCounter"

    override fun <B> fmap(f: (kotlin.Nothing) -> B): MaybeCounter<B> = NothingCounter
}
```

위 펑터 인스턴스들은 상태를 fmap 호출 횟수에 관한 상태를 갖도록 변경되었고 이로 인해 펑터의 법칙 1, 2를 모두 만족하지 못함

　

#### 펑터의 법칙을 만족하도록 만들어야 하는 이유?

사용자는 fmap 함수를 호출했을 때, 매핑 동작 이외에 어떤 것도 하지 않는 다는 것을 전제로 사용하며, 이러한 예측 가능성은 함수가 안정적으로 동작할 뿐 아니라 더 추상적인 코드로 확장 할 때에도 필요하다.
