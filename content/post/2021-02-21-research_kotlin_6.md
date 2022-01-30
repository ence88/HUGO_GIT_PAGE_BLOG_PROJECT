---
title: "코틀린 리서치 - Classes[6]"
date: 2021-02-26T20:00:00+09:00
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

#thumbnailImage: //example.com/image.jpg코틀코틀코코틀코틀ㄹ코틀
---

코틀린의 클래스에 대해 알아보겠습니다.

<!--more-->

  ### Properties

코틀린의 클래스에서는 getter와 setter가 기본적으로 자동 생성되나, get과 set시 동작을 명시적으로 지정 할 수 있습니다.

```python
class Person
{
    var name:String = ""
    lateinit var age:Int // lateinit을 붙이면 객체 생성후 초기화 가능

    val canVote:Boolean
        get() = age >= 16 // Custom getter

    var ssn = "0000"
        get() = field // field는 해당 멤버 변수를 의미함
        set(value) {
            println("SSN is changed")
            field = value
        }
}

fun main(args: Array<String>) {
    var me = Person()
    me.name = "verking"
    me.age = "20"

    println(me.canVote);

    me.ssn = "11232323"
}
```



### 생성자와 초기화

클래스의멤버 변수 선언과 초기화는 다음과 같은 방법으로도 가능합니다.

```python
class ConstructorAndInitializationExample(var name:String, var age:Int)
{
    init {
        println("this is init")
    }
}

fun main(args: Array<String>) {
    var obj = ConstructorAndInitializationExample("verking", 1010)
    println(obj.name)
    println(obj.age)
}
```

{{< adsense >}}

### by 키워드

클래스의 멤버 변수 생성시 by 키워드를 통해 멤버 변수 set, get시 처리를 담당할 delegate 클래스를 전달 할 수 있으며, 이를 이용해 observable한 멤버 변수를 만들 수 있습니다.

```python
import kotlin.properties.Delegates
import kotlin.reflect.KProperty

class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String{
        return "$thisRef, thank you for delegating, ${property.name} to me"
    }

    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String): String{
        return "$value, has been assigend to ${property.name} in $thisRef"
    }
}

class NicePerson
{
    var name: String by Delegate()

    val lazyValue:String by lazy {
        println("init!!!")
        "this Msg Will Inserted"
    }

    var otherName: String by Delegates.observable("king"){
        prop, old, new -> println("$old -> $new")
    }
}
```



### Data class

코틀린에서는 data를 위한 class 생성을 언어차원에서 지원하며, 컴파일 타임에 다음 함수를 class에 자동으로 추가하여 줍니다.

1. equals / hashCode
2. toString()
3. destructuring
4. copy() // 깊은 복사 수행

```python
data class Human(var name:String, val age:Int) { }

fun main(args: Array<String>) {
    var h = Human("man", 123)
    println(h)

    var h2 = Human("man", 123)
    println(h == h2) // true
    
    var h3 = h.ㅊopy()
    println(h === h3) // false
    
    var (name, age) = h
}
```



### 상속

```python
open class A(var name:String)
{
    open fun hello()
    {
        print("A hello")
    }
}

class B(name:String) : A(name)
{
    override fun hello() {
        super.hello()
        println("B hello")
    }
}

fun main(args: Array<String>) {
    var a = A("A")
    a.hello()
    var b = B("B")
    b.hello()
    a = B("B2")
    a.hello()
}
```

* 인터페이스 또한 지원함



[더 많은 코틀린 관련 정보](https://kotlinlang.org/docs/reference/)

