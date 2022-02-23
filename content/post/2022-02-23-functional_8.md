---
title: "함수형 프로그래밍 in 코틀린 - 애플리케이티브 펑터[8]"
date: 2022-02-23T18:35:00+09:00
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

abstract : 애플리케이티브 펑터의 정의, 사상, 법칙 등

<!--more-->

#### 애플리케이티브 펑터란?

펑터가 가진 한계를 극복하기 위해 등장하였다.
일반 펑터는 매핑시 일반 함수로만(Transform: (A) -> B) 매핑이 가능하기 때문에 펑터를 입력으로 넣을 수 없음

펑터가 함수를 포함 할 때, 다른 펑터 내의 값을 적용하려면 상당히 복잡하며, 함수형에서는 대부분의 연산과정을 펑터와 같은 어떤 컨텍스트 내에서 체이닝하는 것이 일반적임

그러나 함수를 가진 펑터는 또 다른 펑터의 값을 적용해야 할 때, 컨텍스트 안에서 처리하는 것이 불가능하며 이를 극복하기 위해서 필요한 것이 애플리케이티브 펑터

```kotlin
maybeProductTen.fmap { it(Just(5)) }; // 컴파일 불가
```

애플리케이티브 펑터는 첫 번째 상자에 담겨 있는 함수와 두 번째 상자에 담겨 있는 값을 꺼내서 매핑하고, 다시 상자 안에 넣어서 반환한다.

{{< adsense >}}

**애플리케이티브 펑터 타입 클래스**

```kotlin
interface Applicative<out A> : Functor<A> {

    fun <V> pure(value: V): Applicative<V>

    infix fun <B> apply(ff: Applicative<(A) -> B>): Applicative<B>
}
```

pure 함수는 임의 타입값을 받아서 애플리케이티브 안에 그대로 넣고 반환(어떤 값을 받아서 가공 없이 그대로 상자에 포장)
apply 함수는 함수를 갖는 애플리케이티브를 입력으로 받아서 펑터 안의 값을 함수에 적용하고, 적용한 값을 애플리케이티브에 넣어서 반환

{{< adsense >}}

#### 메이비 애플리케이티브 펑터 만들기

apply 및 pure 구현, 사용 예

```kotlin
fun main() {
    // fmap test
    println(Just(10).fmap { it + 10 })   // Just(20)
    println(Nothing.fmap { it: Int -> it + 10 })  // Nothing

    // pure test
    println(Maybe.pure(10))  // Just(10)
    println(Maybe.pure { x: Int -> x * 2 })  // Just((kotlin.Int) -> kotlin.Int)

    // apply test
    println(Maybe.pure { x: Int -> x * 2 } apply Just(10))  // Just(20)
    println(Maybe.pure { x: Int -> x * 2 } apply Nothing)   // Nothing

    // applicative style programming test
//    println(AMaybe.pure({ x: Int, y: Int -> x * y}) apply Just(10) apply Just(20))  // compile error

    println(Maybe.pure({ x: Int, y: Int -> x * y }.curried())
            apply Just(10)
            apply Just(20)
    )   // Just(200)

    println(Maybe.pure({ x: Int, y: Int, z: Int -> x * y + z }.curried())
            apply Just(10)
            apply Just(20)
            apply Just(30)
    )   // Just(230)
}

sealed class Maybe<out A> : Functor<A> {

    abstract override fun toString(): String

    abstract override fun <B> fmap(f: (A) -> B): Maybe<B>

    companion object
}

data class Just<out A>(val value: A) : Maybe<A>() {

    override fun toString(): String = "Just($value)"

    override fun <B> fmap(f: (A) -> B): Maybe<B> = Just(f(value))
}

object Nothing : Maybe<kotlin.Nothing>() {

    override fun toString(): String = "Nothing"

    override fun <B> fmap(f: (kotlin.Nothing) -> B): Maybe<B> = Nothing
}

fun <A> Maybe.Companion.pure(value: A) = Just(value)

infix fun <A, B> Maybe<(A) -> B>.apply(f: Maybe<A>): Maybe<B> = when (this) {
    is Just -> f.fmap(value)
    Nothing -> Nothing
}

private fun <P1, P2, R> ((P1, P2) -> R).curried(): (P1) -> (P2) -> R =
        { p1: P1 -> { p2: P2 -> this(p1, p2) } }

private fun <P1, P2, P3, R> ((P1, P2, P3) -> R).curried(): (P1) -> (P2) -> (P3) -> R =
        { p1: P1 -> { p2: P2 -> { p3: P3 -> this(p1, p2, p3) } } }
```

**애플리케이티브 스타일**

애플리케이티브 펑터를 사용하면 apply의 체이닝이 가능해지며, 펑터의 값을 꺼내 처리하는 번거로움 없이 연속작인 작업을 수행 할 수 있게 함

```kotlin
Amaybe.pure(10)
	   apply AJust({x: Int -> x * 2})
	   apply AJust({x: Int -> x + 10});
```

**이 때 pure와 apply의 순서를 바 꿀 수 없음(컴파일 오류), 이는 확장 함수 통해 해결이 가능하며,  이전 시간에 살펴본 커링을 통해 이항 함수를 애플리케이티브 스타일로 처리 할 수 있음**

```kotlin
fun main() {
    // fmap test
    println(Just(10).fmap { it + 10 })   // Just(20)
    println(Nothing.fmap { it: Int -> it + 10 })  // Nothing

    // pure test
    println(Maybe.pure(10))  // Just(10)
    println(Maybe.pure { x: Int -> x * 2 })  // Just((kotlin.Int) -> kotlin.Int)

    // apply test
    println(Maybe.pure { x: Int -> x * 2 } apply Just(10))  // Just(20)
    println(Maybe.pure { x: Int -> x * 2 } apply Nothing)   // Nothing

    // applicative style programming test
//    println(AMaybe.pure({ x: Int, y: Int -> x * y}) apply Just(10) apply Just(20))  // compile error

    println(Maybe.pure({ x: Int, y: Int -> x * y }.curried())
            apply Just(10)
            apply Just(20)
    )   // Just(200)

    println(Maybe.pure({ x: Int, y: Int, z: Int -> x * y + z }.curried())
            apply Just(10)
            apply Just(20)
            apply Just(30)
    )   // Just(230)
}

sealed class Maybe<out A> : Functor<A> {

    abstract override fun toString(): String

    abstract override fun <B> fmap(f: (A) -> B): Maybe<B>

    companion object
}

data class Just<out A>(val value: A) : Maybe<A>() {

    override fun toString(): String = "Just($value)"

    override fun <B> fmap(f: (A) -> B): Maybe<B> = Just(f(value))
}

object Nothing : Maybe<kotlin.Nothing>() {

    override fun toString(): String = "Nothing"

    override fun <B> fmap(f: (kotlin.Nothing) -> B): Maybe<B> = Nothing
}

fun <A> Maybe.Companion.pure(value: A) = Just(value)

infix fun <A, B> Maybe<(A) -> B>.apply(f: Maybe<A>): Maybe<B> = when (this) {
    is Just -> f.fmap(value)
    Nothing -> Nothing
}

private fun <P1, P2, R> ((P1, P2) -> R).curried(): (P1) -> (P2) -> R =
        { p1: P1 -> { p2: P2 -> this(p1, p2) } }

private fun <P1, P2, P3, R> ((P1, P2, P3) -> R).curried(): (P1) -> (P2) -> (P3) -> R =
        { p1: P1 -> { p2: P2 -> { p3: P3 -> this(p1, p2, p3) } } }
```

　

#### 애플리케이티브 펑터의 법칙

**1. 항등 법칙**

항등 함수에 값을 적용하는 것 이외에는 아무것도 하지 않음

```kotlin
fun main() {
    val maybeAf = Just(10)
    val leftMaybe = Maybe.pure(identity()) apply maybeAf
    println(leftMaybe.toString() == maybeAf.toString())   // true
}

private fun identity() = { x: Int -> x }
```

**2. 합성(composition) 법칙**

좌변은 pure를 사용하여 애플리케이티브 펑터에 합성함수 compose를 넣고, 애플리케이트 펑터들을 적용 한 걸 의미하며, 우변은 애플리케이티브 펑터 af2에 af3를 적용한 애플리케이티브 펑터를 af1에 적용 한 것을 의미

```kotlin
fun main() {
    val maybeAf1 = Just { x: Int -> x * 2 }
    val maybeAf2 = Just { x: Int -> x + 1}
    val maybeAf3 = Just(30)
    val leftMaybe = Maybe.pure(compose<Int, Int, Int>().curried()) apply maybeAf1 apply maybeAf2 apply maybeAf3
    val rightMaybe = maybeAf1 apply (maybeAf2 apply maybeAf3)
    println(leftMaybe.toString() == rightMaybe.toString())  // true
}

private fun <P1, P2, P3> compose() = { f: (P2) -> P3, g: (P1) -> P2, v: P1 -> f(g(v)) }

private fun <P1, P2, P3, R> ((P1, P2, P3) -> R).curried(): (P1) -> (P2) -> (P3) -> R = {
    p1: P1 -> { p2: P2 -> { p3: P3 -> this(p1, p2, p3) } }
}
```

**3. 준동형 사상 법칙(homomorphism)**

좌변은 pure를 사용하여 function과 값 x를 애플리케이트 펑터에 넣는 것
우변은 function에 x 값을 적용한 것을 애플리케이트 펑터에 넣는 것

```kotlin
// Homomorphism
// pure(function) apply pure(x) = pure(function(x))

fun main() {
    val function = { x: Int -> x * 2 }
    val x = 10

    val leftMaybe = Maybe.pure(function) apply Maybe.pure(x)
    val rightMaybe = Maybe.pure(function(x))
    println(leftMaybe.toString() == rightMaybe.toString())  // true
}
```

**4. 교환 법칙**

좌변은 어떤 함수를 포함한 애플리케이티브 펑터 af와 값 x를 넣은 애플리케이티브 펑터를 적용 하는 것

우변은 of(x)를 애플리케이트 펑터에 넣어서 af를 적용하는 것

```kotlin
// Composition
// pure(compose) apply af1 apply af2 apply af3 = af1 apply (af2 apply af3)

fun main() {
    val maybeAf1 = Just { x: Int -> x * 2 }
    val maybeAf2 = Just { x: Int -> x + 1}
    val maybeAf3 = Just(30)
    val leftMaybe = Maybe.pure(compose<Int, Int, Int>().curried()) apply maybeAf1 apply maybeAf2 apply maybeAf3
    val rightMaybe = maybeAf1 apply (maybeAf2 apply maybeAf3)
    println(leftMaybe.toString() == rightMaybe.toString())  // true
}

private fun <P1, P2, P3> compose() = { f: (P2) -> P3, g: (P1) -> P2, v: P1 -> f(g(v)) }

private fun <P1, P2, P3, R> ((P1, P2, P3) -> R).curried(): (P1) -> (P2) -> (P3) -> R = {
    p1: P1 -> { p2: P2 -> { p3: P3 -> this(p1, p2, p3) } }
}
```

**여기서 of는 x를 다른 함수의 매개변수로 제공하는 함수**

```kotlin
fun <T, R> of(value: T) = { f: (T) -> R -> f(value) }
```

of 함수는 value 갑을 입력으로 받아서 다른 함수의 입력 매개변수로 사용하는 람다 함수를 반환, 이 함수를 사용하면 미래에 입력받을 함수에 값을 적용할 함수를 만들 수 있으며 다양한 고차 함수에서 유용하게 활용 될 수 있음

　

#### 펑터와 애플리케이티브 펑터 간 관계

애플리케이티브 펑터의 네 가지 법칙은 결과적으로 다음과 같은 새로운 법칙을 도출함

```kotlin
pure(function) apply af = af.fmap(function)
```

**어떤 함수의 애플리케이티브 펑터에 값을 포함한 애플리케이티브 펑터를 적용한 결과**와
**함수를 펑터로 매핑한 결과**는 동일하다

```kotlin
fun main() {
    val function = { x: Int -> x * 2 }

    val maybeAf = Just(10)
    val leftMaybe = Maybe.pure(function) apply maybeAf
    val rightMaybe = maybeAf.fmap(function)
    println(leftMaybe.toString() == rightMaybe.toString())
}
```

apply 함수가 이 법칙에 근거해서 구현되었고 애플리케이티브 펑터의 법칙들은 모두 카테고리 이론이라는 수학을 기반으로 함, 새로운 펑터들을 구현 할 경우 이 법칙들을 만족하는지 확인 후에 사용 할 것
