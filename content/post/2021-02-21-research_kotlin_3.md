---
title: "코틀린 리서치 - Types and Variables[3]"
date: 2021-02-21T16:12:30+09:00
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

#thumbnailImage: //example.com/image.jpg코틀코틀
---

코틀린에서 사용하는 타입들과 변수 선언에 관해 살펴보겠습니다.

<!--more-->

코틀린은 정적 타입언어이며, 변수 타입의 종류는 JAVA와 유사합니다.

  

### 상수/변수 선언

- 변수 선언 형식의 프로토타입은 다음과 같은 형태를 취합니다.

```
var 변수명:타입명 = 대입값 // 변수 타입
val 변수명:타입명 = 대입값 // 상수 타입(불변)
```

- 타입명을 생략 할 경우 컴파일러에서 대입값을 통해 타입을 추론합니다.

```python
var a = 64 // a는 int
var b = 10f // b는 float
```



### Basic Type

- 정수형 (Unsigned는 변수타입명 앞에 U를 붙임, UShort)

| Type  | Size (bits) | Min value                          | Max value                           |
| ----- | ----------- | ---------------------------------- | ----------------------------------- |
| Byte  | 8           | -128                               | 127                                 |
| Short | 16          | -32768                             | 32767                               |
| Int   | 32          | -2,147,483,648 (-2 31)             | 2,147,483,647 (2 31- 1)             |
| Long  | 64          | -9,223,372,036,854,775,808 (-2 63) | 9,223,372,036,854,775,807 (2 63- 1) |

- 실수형

| Type   | Size (bits) | Significant bits | Exponent bits | Decimal digits |
| ------ | ----------- | ---------------- | ------------- | -------------- |
| Float  | 32          | 24               | 8             | 6-7            |
| Double | 64          | 53               | 11            | 15-16          |

- 참/거짓 : Boolean

```python
fun main(args: Array<String>) {
    var_declarations()
}

fun var_declarations()
{
    val a:Int = 64 // val 불변(상수)
    a = 10 // val은 상수 선언으로 변경 불가, error
    var b:Long = 123
    b = 14444 // OK

    var c:Float = 2.3f // var는 변수 선언을 의미
    var d:Double = 12.3e5

    println("$a, $b, $c, $d")

    val f:StringBuffer = StringBuffer("Hello~")
    f.replace(0, 1, "P")

    println(f)
}
```



### Ranges 타입

Ranges는 특수화된 생성을 통해 여러가지 특징을 갖는 특별한 타입입니다.

```python
fun ranges()
{
    val a: IntRange = 1..10 // 1, 2, 3, ..... , 10
    var b = 1.rangeTo(10) // 같은 표현 type deduction
    var c: IntProgression = 1.rangeTo(10).reversed() // sequence로 생성, 지연된 연산을 수행

    for (x in a) println(x)
    for (x in b) println(x)
    for (x in c) println(x) // c의 경우 이 시점에서 실제 IntRange가 생성됨

    var d = 10 downTo 1
    for (x in d) println(x) // 10부터 1까지 출력
    
    var e = 100 downTo 1 step 3
    for (x in e) println(x) // 3씩 건너 출력
}
```





### Arrays Type

```python
fun arrays()
{
    var names: Array<String> = arrayOf("김", "나", "박", "이")
    names[0] = "송"
    println(names.toList())

    var ages = intArrayOf(44, 88, 11)
    println(ages.toList())

    var values = Array<Double>(10, {2.0})
    println(values.toList()) // 2.0을 10개 출력

    var squares = Array(10, {(it*it).toString()})
    println(squares.toList()) // 어떻게 나올까?
}
```



### String Type and String Interpolation

```python
fun character_and_string()
{
    var a:Char = '\u0041'
    if (a.toInt() == 65)
        println("match")

    val b:String = "Hello"
    println(b)
    println(b[0])
    for (letter in b) println(letter)

    var raw = """hello
    "test"
    world~~~""" // """ 내용 """ 형태로 입력 할 경우 있는 그대로 대입 가능
    println(raw)

    var c = 123.0
    var d = "c = $c, price = ${c/10}" // $변수, ${표현식}으로 string formating 가능
    println(d)

    val e = "${(10 downTo 1).toList().map{it.toString().toCharArray()}.joinToString()}"
    println(e) // ?
}
```



[더 많은 코틀린 관련 정보](https://kotlinlang.org/docs/reference/)

