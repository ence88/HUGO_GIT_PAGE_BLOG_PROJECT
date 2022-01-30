---
title: "C# 중급 - 최신 문법[3]"
date: 2021-06-12T09:00:00+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN
categories:
- Language
- C#
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- C#
- CSharp
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

#thumbnailImage: //example.com/image.jpgC스터디 내용작성 ㅇS이번 항이번 이버
---

Index와 Range, 패턴 매칭, switch expression, local function, 신규 C# 문법 등에 대해 살펴보겠습니다.

<!--more-->

  

## Index & Range

#### System.Index

- 배열 첨자 접근시 ^ 연산자

```c#
using System;

class Program
{
    public static void Main()
    { 
		int[] arr = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        
        int a1 = arr[2]; // 3 : 앞에서부터 3번째, 0, 1, 2
        int a2 = arr[^2]; // ^2는 뒤에서부터 2번째고 1부터 시작함
        
        Console.WriteLine($"{a1}, {a2}");
    }
}
```

- Index 객체 개념
  - 시퀀스 접근을 위한 값과 방향을 보관

```c#
using System;

class Program
{
    public static void Main()
    { 
		string s = "ABCDEFGHI";
        
        // 시퀀스 요소에 접근하기 위한 인덱스 객체 생성
        int idx1 = 2;
        Index idx2 = new Index(2);
        Index idx3 = new Index(2, fromEnd:true); // 뒤에서 2번째
        
        char c1 = s[idx1]; // C
        char c2 = s[idx2]; // C
        char c3 = s[idx3]; // H
        
        Console.WriteLine($"{c1}, {c2}, {c3}");
    }
}
```

- Index 객체 생성의 여러 방법

```c#
using System;

class Program
{
    public static void Main()
    { 
        // 1. new 사용
        Index i1 = new Idex(3);
        Index i2 = new Idex(3, fromEnd: true);
        
        // 2. 정적 메소드 사용
        Index i3 = Index.FromStart(3);
        Index i4 = Index.End(3);
        
        // 3. 단축 표기법 사용
        Index i5 = 3;
        Index i5 = ^3;
        
		string s = "ABCDEFGHI";
        char c1 = s[^3];
        char c2 = s[new Index(3, fromEnd: true)];
        
        Console.WriteLine($"{c1}, {c2}, {c3}");
    }
}
```

- Index 객체의 활용 가능 멤버

```c#
using System;

class Program
{
    public static void Main()
    {
        Index idx = ^3; // 값 : 3, 방향 : 뒤에서 부터
        
        int n = idx.Value; // 3
        int b = idx.IsFromEnd; // true
    }
}
```

{{< adsense >}}

#### System.Range

- 배열 첨자에 ..을 사용하여 범위 표현 가능(Range 객체를 리턴)

```c#
using System;

class Program
{
    public static void Main()
    {
		string s = "ABCDEFGHI";
        char c = s1[2]; // C
        
        string s2 = s1[2..7]; // CDEFG
        string s3 = s1[2..^3]; // CDEFG
    }
}
```

- Range 객체

```c#
using System;

class Program
{
    public static void Main()
    {
		int[] arr1 = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        
        // 3~8 Range 생성
        Range r1 = new Range(new Index(2), new Index(2, true));
        
        // 생성자 활용
        Range r2 = new Range(2, ^2);
        
        // 단축 표기법
        Range r3 = 2..^2;
        
        int[] arr2 = arr1[r1];

		foreach (var n in arr2)        
            Console.WriteLine(n);
    }
}
```

  

## Pattern Matching

> 임의의 개체가 특정 패턴(모양, 타입, 값)을 만족하는지 조사 하는 것
>
> ex) r의 타입은 Rect 타입인가, r의 x좌표의 값은 10인가?
>
> type pattern matching : C# 초기부터 지원, C# 7.0 부터 기능 추가
>
> var / const pattern matching : C# 7.0
>
> switch expression : C# 8.0

#### type / var pattern matching 예제(신규 방식 포함)

```c#
using System;

class Shape { }

class Circle : Shape
{
    public double radius = 100;
}
class Program
{
    public static void Draw(Shape s)
    {
        /*
        if ( s is Circle )
        {
            Circle c1 = (Circle)s;
            double d = c1.radius;
        }
        */
        if (s is Circle c1) // s가 Circle이면 c1 객체 생성하여 사용
        {
            double d = c1.radius;
        }

        // var pattern matching -> switch case 문에서 활용 가능
        if (s is var c2) // var c2 = s, 항상 true
        {
            
        }
    }

    static void Main()
    {
        Draw(new Circle());       
    }
}
```



#### const pattern matching (참조 변수의 언박싱을 지원)

```c#
using System;

class Circle { }

class Program
{
    public static void Main()
    {
        int n = 10;
        if ( n is 10 ) // const pattern matching
        {
        }

        if ( n == 10 )
        {
        }

        object obj = 10;

        //if ( obj == 10 ) // error
        //if (obj == (object)10) // ok, but 메모리 주소를 비교함 값 비교가 아님

        if ((int)obj == 10) // ok
        {
            //Console.WriteLine("True");
        }
        //else
            //Console.WriteLine("False");

        if ( obj is 10)
        {
        }
    }
}
```

  

#### switch와 패턴 매칭 활용

```c#
using System;

class Shape { }
class Circle : Shape { }

class Rectangle : Shape
{
    public double width = 100;
    public double height = 100;
}

class Program
{
    public static void Draw(Shape s)
    {
        switch (s)
        {
            // const pattern matching
            case null:
                break;

            // type pattern matching
            case Circle c:
                break;       

            case Rectangle r when r.width == r.height:
                break;
            
            case Rectangle r:
                break;

            default:
                break;
        }
    }

    public static void Main()
    {
        Draw(new Rectangle());

        //# 전통적인 switch 문의 구조
        int n = 1;
        switch (n)
        {
            case 1: 
                break;
            case 2: 
                break;
            default: 
                break;
        }
    }
}
```



#### var pattern matching 활용

```c#
using System;
using System.Collections.Generic;

class Shape { }
class Circle : Shape { }

class Rectangle : Shape
{
    public double width = 100;
    public double height = 100;
}

class Program
{
    public static List<Shape> group = new List<Shape>();

    public static void Draw(Shape s)
    {
        switch (s)
        {
            // var 패턴
            case var r when (group.Contains(r)) :
                break;

            case Rectangle r:
                break;

            default: break;
        }
    }

    public static void Main()
    {
        Draw(new Rectangle());

    }
}
```



#### switch expression (C# 8.0) 예제

```c#
using System;

class Program
{   
    public int square(int n)
    {
        return n * n;
    }
    public int square2(int n) => n * n;

    public static void Main()
    {
        int n = 50;
        
        // switch expression
        int s = n switch { 
            10 => 11, 
            20 => 22, 
            30 => 33, 
            _ => 100 
        };

        Console.WriteLine(s);

        //# 일반적인 switch 문의 구조 ( switch statement )
        switch(n)
        {
            case 10: break;
            case 20: break;
            default: break;
        }
    }
}
```

- switch expression 활용1

```c#
using System;

class Shape { }

class Rectangle : Shape 
{
    public double Width { set; get; } = 10;
    public double Height { set; get; } = 10;
}
class Circle : Shape
{
    public double Radius { set; get; } = 10;
}

class Point : Shape
{
    public double x = 0;
    public double y = 0;

    public void Deconstruct(out double ox, out double oy) => (ox, oy) = (x, y);
}

class Program
{
    public static void Main()
    {
        Shape s = new Circle();

        // type pattern matching
        double area = s switch 
        {
            null => 0,   // const pattern matching
            Point _ => 0,
            Circle c => Math.PI * c.Radius * c.Radius,
            Rectangle r => r.Width * r.Height,
            _ => 0
        };

        // tuple pattern
        int value1 = 0;
        int value2 = 0;

        var ret1 = (value1, value2) switch
        {
            (0, 0) => 0,
            var (a, b) when a > 100 => 100,
            var (a, b) when a <= 100 && b > 100 => 200,
            _ => 300
        };

        // positional pattern : Deconstructor 가 있는 타입
        Point pt = new Point();
        var (x1, y1) = pt;

        var ret2 = pt switch
        {
            (0, 0) => 0,
            var (a, b) when a > 100 => 100,
            var (a, b) when a <= 100 && b > 100 => 200,
            _ => 300
        };
    }
}
```

  

## Local Function

> 메소드 안에 다시 메소드를 만드는 문법
>
> 자신이 포함된 메소드에서만 호출 할 수 있음
>
> 오류 처리(예외 처리)와 함수 구현부를 분리 할 때 주로 사용

#### 예제

```c#
using System;

class Program
{
    public static void Foo()
    {
        int n = square(3);

        int square(int a)
        {
            return a * a;
        }
    }

    public static double div_wrapper(double a, double b)
    {
        if (b == 0)
            throw new Exception("divide by zero");

        return div(a, b);

        double div(double a, double b)
        {
            return a / b;
        }
    }

    public static void Main()
    {
        double ret = div_wrapper(10, 0);
        Console.WriteLine(ret);
    }
}
```

#### 활용 예제 1 : 지연된 연산 수행 전, 예외처리가 가능한 구조

```C#
using System;
using System.Collections;

// 1 ~ 5 까지의 숫자를 보관하는 컬렉션
class NumCollections : IEnumerable
{
    private int[] arr = new int[5] { 1, 2, 3, 4, 5 };

    public IEnumerator GetEnumerator()
    {
        // 오류만 확인..
        Console.WriteLine("arr 의 유효성 확인");
        if (arr == null) throw new Exception("null");

        return implementation();

        IEnumerator implementation()
        {
            foreach (int n in arr)
            {
                yield return n;
            }
        }
    }
}
class Program
{
    public static void Main()
    {
        NumCollections nums = new NumCollections();

        IEnumerator it = nums.GetEnumerator();
        Console.WriteLine("After GetEnumerator");

        while( it.MoveNext() )
        {
            Console.WriteLine(it.Current);
        }
    }
}
```

#### static local function (C# 8.0) : 자신을 포함하는 메서드의 지역변수를 사용 할 수 없음(안정성 확보)

```c#
using System;

class Program
{
    public static int Foo(int a, int b)
    {
        int value = 10;

        return goo(10);

        static int goo(int n)
        {
            return value + a + b + n;
        }
    }
    public static void Main()
    {
        Console.WriteLine(Foo(1, 2));
    }
}
```

  

## New Syntax in C# 8.0

#### default interface 멤버

> 인터페이스에 변경이 생길 경우 상속된 파생 클래스에서 오류가 발생하는데,
>
> 인터페이스에 구현부를 포함 할 경우 디폴트 인터페이스 멤버로 사용 가능
>
> 멤버를 인터페이스의 타입으로 캐스팅해야 호출 할 수 있음
>
> 디폴트 인터페이스 멤버함수 또한 파생 클래스에서 재정의 가능

```c#
using System;

interface ICamera
{
    void takePicture();

    void uploadSNS()
    {
        Console.WriteLine("upload SNS");
    }
}

class Camera : ICamera
{
    public void takePicture()
    {
        Console.WriteLine("Take Picture With Camera");
    }
    public void uploadSNS()
    {
        Console.WriteLine("Camera upload SNS");
    }
}

class Program
{
    static void Main()
    {
        Camera c = new Camera();
        c.takePicture();
        c.uploadSNS();

        ICamera ic = c;
        ic.uploadSNS();
    }
}
```

  

#### using 선언 관련 변경

> dispose 목적의 using 활용시 블럭({}) 없이 사용 가능하게 변경됨

```c#
using System;
using System.IO;
using static System.Console; // WriteLine("AA")

class Program
{
    static void Main()
    {
        FileStream f1 = new FileStream("a1.txt", FileMode.CreateNew);
        f1.Dispose();

        using (FileStream f2 = new FileStream("a2.txt", FileMode.CreateNew))
        {

        } // f2.Dispose
    }

    public static void Foo()
    {
        // C# 8.0 방식
        using FileStream f3 = new FileStream("a3.txt", FileMode.CreateNew);
        
    } // f3.Dispose() // 이 타이밍에 dispose 호출 됨
}
```

  

#### nullable reference

> 참조타입에는 null을 넣을 수 있지만, 안전성을 위해 null 대입시 경고를 발생 시킬 수 있음

```c#
using System;

class Program
{
    static void Main()
    {
        //int  n1 = null; // error
        //int? n2 = null;  // ok

#nullable enable       // 참조 타입 변수를 null 을 대입하면 경고..
        string s1 = null; // ok
        string? s2 = null;
#nullable disable 
        //int n = s1.Length;
    }
}
```

  

#### null coalescing assignment(null 병합 대입)

> ?? 연산자 : null일 경우에만 동작

```c#
using System;

class Program
{
    public static void Main()
    {
        string s1 = null;

        //# C# 6.0 NULL 병합 연산자
        string s2 = s1 ?? "hello";

        //# C# 8.0 NULL 병합 대입
        s1 = "hello";

        s1 ??= "world";  // if ( s1 == null ) s1 = "world"

        Console.WriteLine(s1);     
    }
}
```

