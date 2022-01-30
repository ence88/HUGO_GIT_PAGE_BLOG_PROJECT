---
title: "코틀린 리서치 - Reflection[8]"
date: 2021-03-22T12:00:00+09:00
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

#thumbnailImage: //example.com/image.jpg코틀코틀코코틀코틀ㄹ코틀Co
---

리플렉션(Reflection)은 런타임 프로그램의 구조(객체, 함수, 프로퍼티, 생성자, Bonud)를 분석해서 활용 할 수 있는 기법입니다.

이를 활용 하면 런타임에 얻을 수 있는 정보를 기반으로 기존 코드 대비, 간결한 구조의 표현이 가능해집니다.

<!--more-->

  

### Class Reflection

코틀린의 class 관련 refection 기능은 kotlin.reflect.KClass에 구현되어 있습니다.

refection 대상 객체를 명시 후 명시된 변수로부터 다양한 정보를 얻을 수 있습니다.

```python
import kotlin.reflect.KClass

data class Person(var name:String, var age:Int)
open class Base(x:Int)
class Derived(x:Int) : Base(x)

fun process(b:Base){
    if (b is Derived) // Smart cast
    {
        println(b::class.qualifiedName)
    }
}

fun main(args: Array<String>)
{
    // kotlin의 refection
    var c: KClass<Person> = Person::class // reflection 대상 객체

    println(c.qualifiedName) // -> kotlinMySample.Person
    println(c.members.map{it.name}) // -> [age, name, component1, component2, copy, equals, hashCode, toString]
    println("Is it a companion? ${c.isCompanion}") // -> false
    var z:Base = Derived(10)
    process(z) // 부모 변수로 자식 객체의 이름을 얻어 올 수 있음 -> kotlinMySample.Person

    // java의 refelction
    var j = c.java
    println(j.simpleName)
}
```

{{< adsense >}}

### Function References

```python
fun isOdd(x:Int) = x and 1 == 1
fun isOdd(s:String) = s == "weird" || s == "strange" || s == "peculiar"

fun main(args: Array<String>)
{
    // function references 예제
    var numbers = generateSequence(1, {it+1}).take(5)
    println(numbers.filter(::isOdd).toList())
    var predicate : (String) -> Boolean = ::isOdd

    // 활용하여 f(g(x)) 합성함수 구현
    fun <A,B,C> compose(f:(B)->C,g:(A)->B) : (A) -> C { return { x -> f(g(x)) } }
    var str = "this is a fun experiment".split(' ')
    var oddLength = compose(::isOdd, String::length)
    println(str.filter(oddLength)) // -> [a, fun]
}
```

  

### Property References

프로퍼티 관련 reflection 처리는 kotlin.reflect.KProperty에 구현되어 있습니다. (var 관련 변수는 import kotlin.reflect.KMutableProperty0 사용)

```python
import kotlin.reflect.KMutableProperty0
import kotlin.reflect.KProperty0
import kotlin.reflect.jvm.javaField
import kotlin.reflect.jvm.javaGetter

var x = 1
val y = 22
class Human(var age:Int)
val String.lastChar : Char
    get() = this[length - 1]
    
fun main(args: Array<String>)
{
    val a: KMutableProperty0<Int> = ::x
    val b: KProperty0<Int> = ::y

    println(a.get()) // -> 1
    a.set(321)
    println(a.get()) // -> 321

    val strA = "this is fun".split(' ')
    println(strA.map(String::length)) // -> [4, 2, 3]

    var human = Human(33)

    var temp = Human::age
    println(human.age)
    temp.get(human)
    println(temp.name) // -> age
    temp.set(human, 58)
    println(human.age) // -> 58

    // 확장 Property
    var ls = String::lastChar
    println(ls.get("Hello World")) // -> d

    // java property reflection
    var javaGetter: Method? = Human::age.javaGetter
    var field: Field? = Person::age.javaField
}
```

  

### Constructor References

```python
class Man // empty class

fun <T> makeAndPrint(generator: () -> T)
{
    val x : T = generator()
    println(x.toString())
}

fun main(args: Array<String>)
{
    makeAndPrint(::Man)
}
```

  

### Bound References

코틀린에서 bound 참조 또한 리플렉션 기반으로 동작합니다. 

```python
fun main(args: Array<String>)
{
    var r: Regex = "\\+".toRegex()
    var isNumber = r::matches
    var general = Regex::matches

    println(isNumber("321")) // -> false
    println(general(r, "321")) // -> false

    val strB = listOf("foo", "123", "1")
    println(strB.filter(isNumber)) // -> []

    val lengthOfABC: KProperty0<Int> = "ABC"::length
    println(lengthOfABC.get()) // -> 3
}

```



  

  

[더 많은 코틀린 관련 정보](https://kotlinlang.org/docs/reference/)

