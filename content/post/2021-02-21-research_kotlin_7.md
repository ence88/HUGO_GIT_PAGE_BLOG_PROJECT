---
title: "코틀린 리서치 - Collection Operations[7]"
date: 2021-02-27T23:00:00+09:00
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

코틀린에서는 .NET의 LINQ, Java의 Streams, C++의 ranges와 유사하게 데이터 집합을 다룰 수 있습니다.

<!--more-->

다음과 같은 방법을 통해 컬렉션 처리에 있어 많은 advantages를 제공합니다. 

- Extension fuctions
- Very clean lamdas
- 손쉬운 다양한 API set 제공
- Kotlin's collection APIs are equivalent (near carbon copy) of .NET's LINQ APIs



### Sequence Generators

Collections에 대해 정의된 lambda를 인자로 받는 확장함수들은 `inline` 함수로 정의되어 익명 클래스 객체 생성 측면에 대해서는 퍼포먼스 오버헤드 걱정없이 자유롭게 사용할 수 있습니다.

하지만, Collections 확장함수의 경우 퍼포먼스 측면에서 한가지 문제가 있는데, 각 확장함수를 호출할 때마다 새로운 Collection이 생성되어 반환된다는 점입니다.

Collection을 다룰 때는 1개의 함수로 처리하기 보다는 다양한 확장함수를 이용한 chain calls 패턴이 대부분이기 때문에 이 이슈가 중요할 수 있으며 이 문제를 피하는 한가지 방법이 Sequence입니다.

Collection은 연산에 대해 eager evaluation으로 처리하지만, sequence는 연산에 대해 lazy evaluation으로 처리합니다.

```python
fun ExampleSequence()
{
    var gen = generateSequence(1, {
        println(it)
        it + 1
    })

    var numbers = gen.take(10) // 이 타이밍에서는 실제 값이 생성되지 않음
    numbers.toList() // 이 타이밍에 값 생성
}
```



### Quantifiers (any, all, count, contains) : how many element fit a predicate

- all{P} : 모든 요소가 P를 만족하는가
- any{P} : 적어도 한 요소가 P를 만족하는가
- any() : 요소가 하나라도 존재하는가
- contains(X) : X를 만족하는 요소가 있는가
- count{P} : P를 만족하는 요소의 수
- count() : 요소의 수

```python
fun QuantifiersExample()
{
    val numbers: Sequence<Int> = arrayOf(1, 2, 3, 4, 5).asSequence() // 시퀀스로 생성

    println("Are all numbers > 0 ? ${numbers.all{it > 0}}") // true

    println("Any numbers odd ? ${numbers.any{it and 1 == 0}}") // true

    println("Contains 6 ? ${numbers.contains(6)}") // false

    println("Total number of elements > 3 : ${numbers.count{ it > 3 }}") // 2
}
```



### Projection (map, flatMap, associate) : map each element to something else

- map{} : 각 요소의 열
- flatMap{} : flatten한 각 요소의 열
- associate{} : 값을 pair에 맵핑

```
fun ProjectionExample()
{
    //////////// map 예제
    val seq: Sequence<Int> = generateSequence(1, {it+1})
    val numbers: Sequence<Int> = seq.take(4)

    var squares : Sequence<Int> = numbers.map { it*it }
    println(squares.toList());

    val sentence = "This is a nice sentence"
    val wordLengths = sentence.split(' ').map{ it.length }.asSequence()
    println(wordLengths.toList());
    ///////////////////////////////////////////////////////////////////////////////////

    ////////////////////// associate 예제
    val worldWithLength = sentence.split(' ').map{
        object {
            val length = it.length
            val word = it
        }
    }

    for (wl in worldWithLength)
    {
        println("${wl.word} / ${wl.length}")
    }

    val worldLengthPairs = sentence.split(' ').associate { it.to(it.length) }
    for(wl in worldLengthPairs)
        println(wl)
    ///////////////////////////////////////////////////////////////////////////////////

    ////////////////// flatMap 예제
    val sequence = listOf("red,green,blue", "orange", "white, pink")
    val allWords = sequence.map{ it.split(',')}
    println(allWords.toList()) // output : [[red, green, blue], [orange], [white, pink]]

    val objects = arrayOf("house", "car", "bicycle")
    val colors = arrayOf("red", "green", "blue")

    val pairs = objects.flatMap { o -> colors.map { c -> "$c $o" } }
    println(pairs.toList()) // 카티션 프로덕트
}
```



### Aggregation (fold, reduce, joinToString) : compresses sequence to a single value

- reduce{P} : 요소를 쌍으로 묶어 앞 열에서부터 순차 처리 
- reduceRight{P} : 요소를 쌍으로 묶어 뒤 열에서부터 순차 처리
- fold/foldRight{} : fold + 초기값 부여 가능

```python
fun AggregationExample()
{
    val numbers = generateSequence(1, { it + 1 })
        .take(10).toList()
    println(numbers)

    println(numbers.joinToString("->"))

    // reduce : x[0] + x[1]
    // reduceRight : x[last] + x[last - 1]
    println("sum (reduce) = ${numbers.reduce{x,y -> x + y}}") // reduce : numbers에서 2개씩 pair 하게 꺼내어 처리
    println("product (reduce) = ${numbers.reduceRight{
            x,y ->
        println("($x * $y)")
        x * y
    }}")

    println("sum = ${numbers.sum()}, average = ${numbers.average()}")

    println("sum of squares = ${numbers.sumBy { it * it }}")
    println("sum of roots = ${numbers.sumByDouble { Math.sqrt(it.toDouble()) }}")

    // fold : seed + x[0]
    println("sum (fold) = ${numbers.fold(0, {x,y  -> x+y})}")
    println("product (fold) = ${numbers.fold(1, {x,y -> x*y})}")
}
```



### Filtering (filter, filterNot)

- filter{P} / filterNot{P} : 만족하거나 만족하지 않는 요소 추출

```python
fun FilteringExample()
{
    val seq = generateSequence(1, {it+1})
    val numbers = seq.take(10).toList()
    println(numbers)

    var evenNumbers = numbers.filter{ it % 2 == 0 }
    println(evenNumbers)

    val notDivBy3 = numbers.filterNot { it % 3 == 0 }
    println(notDivBy3)

    val oddSquares = numbers.map { it*it }.filterNot { it % 2 == 0 }
    println(oddSquares)

    val value = arrayOf<Any>(1, 2.5, 3, 4.56)
    val intNumbers = value.filter{ it is Int }
    println(intNumbers)
}
```



### Partioning (drop & take) :  splitting a sequence based on a criterion

- drop(N) : N만큼 요소 무시
- take(N) : N만큼 요소 획득

```python
fun PartioningExample()
{
    var seq = arrayOf(-2, -1, 0, 1, 2)
    var (neg, others) = seq.partition { it < 0 }
    println(neg)
    println(others)

    var numbers = arrayOf(3,3,2,2,1,1,2,2,3,3)
    println(numbers.drop(2).take(6)) // drop은 skip을 의미

    println(numbers.takeWhile { it > 1 })
    println(numbers.dropWhile { it == 3 }) // 3이 아닌것이 나올 때 까지 무시

    println(numbers.dropLast(4))
}
```



### GroupBy

```python
fun GroupingExample()
{
    val people = listOf(
        Man("Adam", 36),
        Man("Boris", 18),
        Man("Claire", 2),
        Man("Adam", 20),
        Man("Jack", 20)
    )

    val byName: Map<String, List<Man>> = people.groupBy(Man::name)
    println(byName)

    val byAge: Map<Int, List<Man>> = people.groupBy(Man::age)
    println(byAge)
}
```



### Sorting (sortedBy, sortedWith, compareBy, thenBy)

```python
import java.util.*
data class Man(var name:String, var age:Int)

fun SortingExample()
{
    val rand = Random()
    val randomValues = generateSequence { rand.nextInt(10 - 5) }
        .take(10).toList()

    println(randomValues)
    println(randomValues.sorted())

    val people = listOf(
        Man("Adam", 36),
        Man("Boris", 18),
        Man("Claire", 2),
        Man("Adam", 20),
        Man("Jack", 20)
    )

    println(people)
    println(people.sortedBy { it.name })
    println(people.sortedWith(compareBy(Man::age, Man::name)))
    println(people.sortedWith(compareBy({it.name}, {it.age})))
    println(people.sortedWith(compareBy<Man>{it.age}.thenByDescending { it.name }))
}
```



### Element Operation (first, last, single, elementAt)

```python
fun ElementOperationExample()
{
    val numbers = listOf(1, 2, 3)
    println("first element is ${numbers.first()}")
    println("first element >10 ${numbers.first{it>10}}") // 크래시 발생
    println("first element >10 ${numbers.firstOrNull(){it>10}}") // OK

    println(numbers.last())
    println(numbers.last{it<3})

    val x = listOf(1)
    println(x.single())
    println(numbers.single())

    println(numbers.singleOrNull())

    println("element at pos : ${numbers.elementAtOrNull(4)}")
    println("element at pos 100 : ${numbers.elementAtOrElse(100, {-1})}") // 없으면 특정값 전달
}
```



### Set Operation (distinct, intersect, union, subtract)

```python
fun SetOperationExample()
{
    val word1 = "helloooo".toCharArray().toList()
    val word2 = "help!".toCharArray().toList()

    println(word1.distinct()) // 중복값 제거
    println(word1.intersect(word2)) // 교집합
    println(word1.union(word2)) // 합집합
    println(word1.subtract(word2)) // 차집합

    val people = listOf(
        Man("Adam", 36),
        Man("Boris", 18),
        Man("Claire", 2),
        Man("Adam", 20),
        Man("Jack", 20)
    )

    println("distinct by name " + people.distinctBy { it.name })
}
```











[더 많은 코틀린 관련 정보](https://kotlinlang.org/docs/reference/)

