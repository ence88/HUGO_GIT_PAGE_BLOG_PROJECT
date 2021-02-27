---
title: "코틀린 리서치 - Functions and Lambda[5]"
date: 2021-02-25T19:00:00+09:00
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

#thumbnailImage: //example.com/image.jpg코틀코틀코코틀코틀ㄹ
---

코틀린의 패키지, 함수 표현법, Lambda 표현식에 대해 알아보겠습니다.

<!--more-->

  ### Top-Level Functions

코틀린에서 모든것은 패키지의 일부입니다.

package name 형식으로 감싸진 모듈은 다른 파일에서 import하여 사용 할 수 있습니다.

```python
//func.kt
package ExampleModule.Hello

fun HelloModule()
{
    println("called!")
}

//main.kt
package ExampleModule.Hello.*

fun HelloModule()
{
    println("called!")
}
```



### Return Type and Arguments

코틀린의 함수는 다음과 같은 형식으로 반환 형식과 input paramter를 지정 할 수 있습니다.

```python
fun main(args: Array<String>) {
    square(10)
    println(square(10))
    println(triple(3))
}

fun square(x:Int = 5) : Int
{
    return x * x
}

fun triple(x:Int) = x*3 // 이런 방식도 가능하다.
```



### Local (a.k.a Inner) Functions

함수 안에 함수를 선언하여 사용 할 수 있습니다.

```python
fun solve_quadratic_equation(a:Double, b:Double, c:Double) : Pair<Double, Double>
{
    fun calc_discriminant(a:Double, b:Double, c:Double = 5.0): Double
    // fun calc_discriminant(): Double // 인자를 생략해도 내부적으로 캡쳐되어 사용 가능
    {
        return b*b-4*a*c
    }

    var root_disc = Math.sqrt(calc_discriminant(a,b,c))

    return Pair((-b+root_disc)/(2*a),(-b-root_disc)/(2*a))
}
```



### Infix Functions

코틀린에서 infix Function이라 불리는 특정 함수들은 다음과 같은 방법으로 사용이 가능합니다.

```python
fun InfixFunctionExample()
{
    val alphabat = 'z' downTo 'a' // downTo is Infix Function
}
```

downTo 함수의 구현부를 살펴보면 infix 키워드로 구현 되어있음을 알 수 있습니다.

```python
public infix fun Char.downTo(to: Char): CharProgression {
    return CharProgression.fromClosedRange(this, to, -1)
}
```

이러한 방식으로 개발자도 custom infix 함수를 작성 할 수 있습니다.



### Lambda Functions

코틀린의 람다 함수는 다른 언어의 람다 표현식과 같은 개념이며 `{ 파라메터  -> 계산식 }`으로 표현합니다.

```python
fun LambdaExample()
{
    var product:(int, int) -> Int = {x, y -> x*y}

    var result = product(2, 3)

    println(result)
}
```



### Extension method

코틀린에서는 기존에 존재하는 객체에 사용자가 특정 함수를 포함시킬 수 있습니다.

```python
fun <T> ArrayList<T>.swap(index1:Int, index2:Int)
{
    val temp = this[index1]
    this[index1] = this[index2]
    this[index2] = temp
}

fun ExtensionFuncExample()
{
    var MyIntFunc = fun Int.(value:Int) = this + value
    var x = 1

    print(x.MyIntFunc(10)) // Int 객체에 MyIntFunc가 포함된 것처럼 사용 가능하다.

    val myList = arrayListOf(1, 2, 3)
    myList.swap(0, 2) // arrayList에 swap을 추가하여 사용 가능
}
```



[더 많은 코틀린 관련 정보](https://kotlinlang.org/docs/reference/)

