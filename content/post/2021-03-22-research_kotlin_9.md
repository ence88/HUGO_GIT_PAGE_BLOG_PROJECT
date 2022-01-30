---
title: "코틀린 리서치 - Odds & Ends[9]"
date: 2021-03-22T18:00:00+09:00
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

#thumbnailImage: //example.com/image.jpg코틀코틀코코틀코틀ㄹ코틀Co코틀리
---

코틀린의 새로운 특징중 하나인 type aliases와 Enum class, 예외처리, 연산자 오버로딩에 대해 살펴보겠습니다.

<!--more-->

​    

### Type Aliases

긴 이름을 축약해서 사용 할 수 있도록 합니다. 신규 키워드 : typealias

```python
typealias FloatSet = Set<Float>

typealias MapWithStringKeys<T> = Map<String, T>

typealias Predicate<T> = (T) -> Boolean

fun <T> where(items:Sequence<T>, p:Predicate<T>) : Sequence<T> { return items.filter { x -> p(x) } }
typealias PropertyChangedHandler = (Object, String) -> Unit
class Bike {
    inner class Wheel {
        
    }
}
typealias BikeWheel = Bike.Wheel

fun main(args: Array<String>)
{
    var f:FloatSet = setOf(1.2f, 2.3f)

    var m:MapWithStringKeys<Double> = mapOf("hello".to(2.3))
    println(m) // -> {hello=2.3}
}
```

{{< adsense >}}

### Enumerations

```python
enum class Direction { North, South, East, West }
enum class Color(val rgb:Int){
    Red(0xff0000) {
        override fun example(): String {
            return "blood"
        }
    },
    Green(0x00ff00) {
        override fun example(): String {
            return "grass"
        }
    },
    Blue(0x00ff00) {
        override fun example(): String {
            return "Sky"
        }
    };

    abstract fun example():String
}

fun main(args: Array<String>)
{
    var dir = Direction.East;
    println(dir)

    var b = Color.Blue
    println("b has the name ${b.name}, value = ${b.rgb}, pos = ${b.ordinal}") // -> b has the name Blue, value = 255, pos = 2

    println("$b is the color of ${b.example()}") // -> Blue is the color of Sky

    for (c in Color.values())
        println(c)

    println("value of red is ${Color.valueOf("Red").rgb}") // -> value of red is 16711680
}
```



### Exceptions

```python
fun main(args: Array<String>)
{
    val v = arrayOf(1, 2, 3)

    try
    {
        println(v[10])
    }
    catch (e:ArrayIndexOutOfBoundsException)
    {
        println(e.toString())
    }
    finally
    {
        println("반드시 실행되는 구간")
    }

    // try 구문을 변수에 담아서 사용 가능하다.
    val text = "123"
    val number:Int? = try {text.toInt()} catch (e:NumberFormatException) { null }
    println(number)
}
```



### Operator Overloads

```python
data class Vector(var x:Int, var y:Int) {
    operator fun plus(other:Vector) : Vector {
        return Vector(x + other.x, y + other.y)
    }
}

fun main(args: Array<String>)
{
    var v1 = Vector(3,4)
    var v2 = Vector(11, 3)
    println(v1 + v2)
}
```





[더 많은 코틀린 관련 정보](https://kotlinlang.org/docs/reference/)

