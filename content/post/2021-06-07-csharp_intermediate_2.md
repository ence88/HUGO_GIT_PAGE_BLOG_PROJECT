---
title: "Csharp 씨샵 중급 - Csharp의 원리[2]"
date: 2021-06-07T09:00:00+09:00
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

이번 시간에는 IL과 C#의 원리, Constructor에 대해 알아보겠습니다.

<!--more-->

  

## C#과 IL

#### 컴파일 언어로(C/C++ 등) 작성된 프로그램의 문제점

- 컴파일시 타겟된 특정 환경(Intel, Windows OS)에서만 동작함
- 다른 환경에서 사용하려면 다시 컴파일하거나, 소스 코드 자체를 재작성 해야함

  

#### C# 프로그램의 구조

- C# 코드 -> C# 컴파일러 -> 실행가능한 파일(플랫폼 독립적인 기계어 코드, 중간 언어

  - Intermediate Language or CIL(Common IL)
  - C# -> IL
  - Java -> Byte Code)

- .net C++ 컴파일러를 사용하면 C++ 언어도 IL로 컴파일 가능(additional VB possible)

- C# 코드 예제

  ```c#
  using System;
  
  struct Point
  {
      public int x;
      public int y;
  }
  
  class Program
  {
      public static void Main()
      {
          Point pt1; // 멤버 변수 쓰레기값
          Point pt2 = new Point(); // 디폴트값 초기화 발생
  
          Console.WriteLine($"{pt1.x}");
      }
  }
  ```

  - 위 예제로 생성된 IL 파일

  ```c#
  //  Microsoft (R) .NET Framework IL Disassembler.  Version 4.8.3928.0
  //  Copyright (c) Microsoft Corporation. All rights reserved.
  
  
  
  // Metadata version: v4.0.30319
  .assembly extern mscorlib
  {
    .publickeytoken = (B7 7A 5C 56 19 34 E0 89 )                         // .z\V.4..
    .ver 4:0:0:0
  }
  .assembly sample
  {
    .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilationRelaxationsAttribute::.ctor(int32) = ( 01 00 08 00 00 00 00 00 ) 
    .custom instance void [mscorlib]System.Runtime.CompilerServices.RuntimeCompatibilityAttribute::.ctor() = ( 01 00 01 00 54 02 16 57 72 61 70 4E 6F 6E 45 78   // ....T..WrapNonEx
                                                                                                               63 65 70 74 69 6F 6E 54 68 72 6F 77 73 01 )       // ceptionThrows.
  
    // --- 다음 사용자 지정 특성이 자동으로 추가됩니다. 주석 처리를 제거하지 마십시오. -------
    //  .custom instance void [mscorlib]System.Diagnostics.DebuggableAttribute::.ctor(valuetype [mscorlib]System.Diagnostics.DebuggableAttribute/DebuggingModes) = ( 01 00 07 01 00 00 00 00 ) 
  
    .hash algorithm 0x00008004
    .ver 0:0:0:0
  }
  .module sample.exe
  // MVID: {8C5F9126-C61E-4997-B6E2-AA38E719E29E}
  .imagebase 0x00400000
  .file alignment 0x00000200
  .stackreserve 0x00100000
  .subsystem 0x0003       // WINDOWS_CUI
  .corflags 0x00000001    //  ILONLY
  // Image base: 0x06B60000
  
  
  // =============== CLASS MEMBERS DECLARATION ===================
  
  .class private sequential ansi sealed beforefieldinit Point
         extends [mscorlib]System.ValueType
  {
    .field public int32 x
    .field public int32 y
  } // end of class Point
  
  .class private auto ansi beforefieldinit Program
         extends [mscorlib]System.Object
  {
    .method public hidebysig static void  Main() cil managed
    {
      .entrypoint
      // 코드 크기       10 (0xa)
      .maxstack  1
      .locals init (valuetype Point V_0,
               valuetype Point V_1)
      IL_0000:  nop
      IL_0001:  ldloca.s   V_1
      IL_0003:  initobj    Point
      IL_0009:  ret
    } // end of method Program::Main
  
    .method public hidebysig specialname rtspecialname 
            instance void  .ctor() cil managed
    {
      // 코드 크기       8 (0x8)
      .maxstack  8
      IL_0000:  ldarg.0
      IL_0001:  call       instance void [mscorlib]System.Object::.ctor()
      IL_0006:  nop
      IL_0007:  ret
    } // end of method Program::.ctor
  
  } // end of class Program
  
  
  // =============================================================
  
  // *********** 디스어셈블리 완료 ***********************
  // 경고: Win32 리소스 파일 b.res을(를) 만들었습니다.
  ```

  

#### IL 직접 작성해보기 

- exe파일 생성 방법 -> ilasm 이름.il

```c#
.assembly ex1 { }

.method static void foo() cil managed
{
    .entrypoint // Main 함수로 인식 처리

    ret
}
```

- 함수 호출 예제

```c#
.assembly ex2 { }

.method static void foo() cil managed
{
    .entrypoint

    call  void goo()

    ldc.i4.1    // stack에 push 1
    ldc.i4.2    // stack에 push 2
    call void hoo(int32 a, int32 b)
    ret
}

.method static void hoo(int32 a, int32 b) cil managed
{
    ret
}

.method static void goo() cil managed
{
    ret
}
```

- 외부 라이브러리 사용(화면 출력) 예제

```c#
.assembly ex3 { }
.assembly extern mscorlib {}

.method static void foo() cil managed
{
    .entrypoint
    
    // C# : System.Console.WriteLine()
    call void [mscorlib]System.Console::WriteLine()

    // C# : System.Console.WriteLine("Hello, IL")
    ldstr "Hello, IL"
    call void [mscorlib]System.Console::WriteLine(class System.String)
    ret
}
```

- 지역변수 할당 및 전달(박싱) 예제

```c#
.assembly ex4 { }
.assembly extern mscorlib {}

//    int x = 2;
//    int y = 20;
//    Console.WriteLine("{0}, {1}", x, y);

.method public static void foo() cil managed
{
    .entrypoint

    .locals init(int32 V_0, int32 V_1)

    ldc.i4.2    // 상수를 스택에 push 2
    stloc.0     // x = 2

    ldc.i4.s 20 // push 20
    stloc.1     // y = 20

    ldstr "{0}, {1}"
    ldloc.0 
    box   int32 // object로 전달하기 위해 박싱

    ldloc.1
    box   int32 // object로 전달하기 위해 박싱

    call void [mscorlib] System.Console::WriteLine(string, object, object)
    ret
}
```

- 클래스 사용(static) 예제

```C#
.assembly ex5 { }
.assembly extern mscorlib {}

.class public Program
{
    .method public static void foo() cil managed
    {
        ldstr "foo"
        call void [mscorlib]System.Console::WriteLine(string)
        ret
    }
    .method public static void Main() cil managed
    {
        .entrypoint

        ldstr "Main"
        call void [mscorlib]System.Console::WriteLine(string)

        call void Program::foo()

        ret
    }
}
```

- 객체 생성(instance) 및 사용 예제

```c#
.assembly ex06 { }
.assembly extern mscorlib {}

.class public Program
{
    .method public instance void foo() cil managed
    {
        ldstr "foo"
        call void [mscorlib]System.Console::WriteLine(string)
        ret
    }

    .method public specialname rtspecialname instance void .ctor() cil managed
    {
        // 기반 클래스 생성자 호출
        ldarg.0
        call       instance void [mscorlib]System.Object::.ctor()
        ret
    }


    .method public static void Main() cil managed
    {
        .entrypoint

        // Program p = new Program()
        .locals init( class Program V_0 )
        
        newobj  instance void Program::.ctor()

        stloc.0 

        // p.foo()
        //call void Program::foo()
        ldloc.0 
        callvirt instance void Program::foo()

        ret
    }
}
```

  

#### 연산자 재정의 함수의 원리

- C# 코드 표현은 함수 재정의 처럼 보여도, IL로 생성된 코드는 단순히 약속된 이름의 메소드를 호출 하는 것에 불과함
- 이러한 특징으로 인해, C# 표현 자체에서 제공하는 기법인지, IL에서 다시 정의되는 기법인지 구분이 필요함

```c#
using System;

class Point
{
    public int x = 0;
    public int y = 0;

    public Point(int a, int b) { x = a; y = b; }



    public static Point operator+(Point p1, Point p2)
    {
        Point p = new Point(p1.x + p2.x, p1.y + p2.y);
        return p;
    }
    
    /* 이렇게 하면 specialname이 붙지 않아서 불가능한 이름
    public static Point op_Addition(Point p1, Point p2)
    {
        Point p = new Point(p1.x + p2.x, p1.y + p2.y);
        return p;
    }
    */
}

class Program
{
    static void Main(string[] args)
    {
        Point p1 = new Point(1, 1);
        Point p2 = new Point(2, 2);

        Point p3 = p1 + p2;

        Console.WriteLine($"{p3.x}, {p3.y}");
    }
}
```

```c#
//  Microsoft (R) .NET Framework IL Disassembler.  Version 4.8.3928.0
//  Copyright (c) Microsoft Corporation. All rights reserved.



// Metadata version: v4.0.30319
.assembly extern mscorlib
{
  .publickeytoken = (B7 7A 5C 56 19 34 E0 89 )                         // .z\V.4..
  .ver 4:0:0:0
}
.assembly operator
{
  .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilationRelaxationsAttribute::.ctor(int32) = ( 01 00 08 00 00 00 00 00 ) 
  .custom instance void [mscorlib]System.Runtime.CompilerServices.RuntimeCompatibilityAttribute::.ctor() = ( 01 00 01 00 54 02 16 57 72 61 70 4E 6F 6E 45 78   // ....T..WrapNonEx
                                                                                                             63 65 70 74 69 6F 6E 54 68 72 6F 77 73 01 )       // ceptionThrows.

  // --- 다음 사용자 지정 특성이 자동으로 추가됩니다. 주석 처리를 제거하지 마십시오. -------
  //  .custom instance void [mscorlib]System.Diagnostics.DebuggableAttribute::.ctor(valuetype [mscorlib]System.Diagnostics.DebuggableAttribute/DebuggingModes) = ( 01 00 07 01 00 00 00 00 ) 

  .hash algorithm 0x00008004
  .ver 0:0:0:0
}
.module operator.exe
// MVID: {282B947A-9C2B-4F10-82A5-FF8E30CB878D}
.imagebase 0x00400000
.file alignment 0x00000200
.stackreserve 0x00100000
.subsystem 0x0003       // WINDOWS_CUI
.corflags 0x00000001    //  ILONLY
// Image base: 0x06F00000


// =============== CLASS MEMBERS DECLARATION ===================

.class private auto ansi beforefieldinit Point
       extends [mscorlib]System.Object
{
  .field public int32 x
  .field public int32 y
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor(int32 a,
                               int32 b) cil managed
  {
    // 코드 크기       37 (0x25)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  ldc.i4.0
    IL_0002:  stfld      int32 Point::x
    IL_0007:  ldarg.0
    IL_0008:  ldc.i4.0
    IL_0009:  stfld      int32 Point::y
    IL_000e:  ldarg.0
    IL_000f:  call       instance void [mscorlib]System.Object::.ctor()
    IL_0014:  nop
    IL_0015:  nop
    IL_0016:  ldarg.0
    IL_0017:  ldarg.1
    IL_0018:  stfld      int32 Point::x
    IL_001d:  ldarg.0
    IL_001e:  ldarg.2
    IL_001f:  stfld      int32 Point::y
    IL_0024:  ret
  } // end of method Point::.ctor

  .method public hidebysig specialname static 
          class Point  op_Addition(class Point p1,
                                   class Point p2) cil managed
  {
    // 코드 크기       39 (0x27)
    .maxstack  3
    .locals init (class Point V_0,
             class Point V_1)
    IL_0000:  nop
    IL_0001:  ldarg.0
    IL_0002:  ldfld      int32 Point::x
    IL_0007:  ldarg.1
    IL_0008:  ldfld      int32 Point::x
    IL_000d:  add
    IL_000e:  ldarg.0
    IL_000f:  ldfld      int32 Point::y
    IL_0014:  ldarg.1
    IL_0015:  ldfld      int32 Point::y
    IL_001a:  add
    IL_001b:  newobj     instance void Point::.ctor(int32,
                                                    int32)
    IL_0020:  stloc.0
    IL_0021:  ldloc.0
    IL_0022:  stloc.1
    IL_0023:  br.s       IL_0025

    IL_0025:  ldloc.1
    IL_0026:  ret
  } // end of method Point::op_Addition

} // end of class Point

.class private auto ansi beforefieldinit Program
       extends [mscorlib]System.Object
{
  .method private hidebysig static void  Main(string[] args) cil managed
  {
    .entrypoint
    // 코드 크기       64 (0x40)
    .maxstack  3
    .locals init (class Point V_0,
             class Point V_1,
             class Point V_2)
    IL_0000:  nop
    IL_0001:  ldc.i4.1
    IL_0002:  ldc.i4.1
    IL_0003:  newobj     instance void Point::.ctor(int32,
                                                    int32)
    IL_0008:  stloc.0
    IL_0009:  ldc.i4.2
    IL_000a:  ldc.i4.2
    IL_000b:  newobj     instance void Point::.ctor(int32,
                                                    int32)
    IL_0010:  stloc.1
    IL_0011:  ldloc.0
    IL_0012:  ldloc.1
    IL_0013:  call       class Point Point::op_Addition(class Point,
                                                        class Point)
    IL_0018:  stloc.2
    IL_0019:  ldstr      "{0}, {1}"
    IL_001e:  ldloc.2
    IL_001f:  ldfld      int32 Point::x
    IL_0024:  box        [mscorlib]System.Int32
    IL_0029:  ldloc.2
    IL_002a:  ldfld      int32 Point::y
    IL_002f:  box        [mscorlib]System.Int32
    IL_0034:  call       string [mscorlib]System.String::Format(string,
                                                                object,
                                                                object)
    IL_0039:  call       void [mscorlib]System.Console::WriteLine(string)
    IL_003e:  nop
    IL_003f:  ret
  } // end of method Program::Main

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // 코드 크기       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [mscorlib]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Program::.ctor

} // end of class Program


// =============================================================

// *********** 디스어셈블리 완료 ***********************
// 경고: Win32 리소스 파일 operator.res을(를) 만들었습니다.
```



## C# 생성자

#### 참조 타입의 생성자

- 참조 타입의 객체를 생성하면 메모리가 먼저 0으로 초기화 되고 생성자가 호출됨
- 사용자가 생성자를 구현하지 않으면
  - 추상 클래스(abstract) : protected 생성자 제공
  - static class : 기본 생성자 제공되지 않음

```cpp
using System;

abstract class AAA { }
static class BBB { }

public class Point
{
    public int x;
    public int y;
        
    /* 생성자를 만들지 않으면 컴파일러가 매개 변수 없는 생성자 제공
    public Point(int x, int y)
    {
    } 
    */
}
class Program
{
    static void Main()
    {
        //Point pt = new Point(1, 2);

        Point pt = new Point();

        Console.WriteLine($"{pt.x}, {pt.y}");
    }
}
```

#### 상속과 생성자

- 파생 클래스의 객체를 생성하면 -> 기반 클래스의 생성자가 먼저 호출
- 기반 클래스의 다른 생성자를 호출되게 하려면 -> 파생 클래스의 생성자에 명시적으로 표현

```c#
using System;
using static System.Console;

class Base
{
   // public Base()      { WriteLine("Base()"); }
    public Base(int n) { WriteLine("Base(int)"); }
}
class Derived : Base
{
    public Derived()     : base(0) { WriteLine("Derived()"); }
    public Derived(int n): base(n) { WriteLine("Derived(int)"); }
}
class Program
{
    public static void Main()
    {
        Derived d = new Derived(1);
    }
}
```

- 다음 코드의 출력 결과는?
  1. 필드 초기화
  2. 기반 클래스 생성자
  3. virtual function 동작(C++은 생성자에서 가상함수 동작하지 않으나 C#은 동작)
  4. 파생 클래스 생성자 내부 코드 동작

```c#
using System;
using static System.Console;

class Base
{
    public Base() { Foo(); }

    public virtual void Foo() { WriteLine("Base.Foo"); }    
}
class Derived : Base
{
    public int a = 100;
    public int b;
    
    public Derived()
    {
        b = 100;
    }
    public override void Foo() 
    { WriteLine($"Derived.Foo : {a}, {b}"); }
}

class Program
{
    public static void Main()
    {
        Derived d = new Derived();
    }
}
```

- 가상함수와 선택적 파라메터
  - 아래 코드는 무엇이 출력될 것인가?
    - 컴파일러가 디폴트값을 채우는데 Base로 판단하여 기본값 10을 전달
  - 가상 함수는 디폴트 파라메터를 사용하지 말자(버그 유발)

```cpp
using System;

class Base
{
    public virtual void Foo(int a = 10)
    {
        Console.WriteLine($"Base.Foo( {a} )");
    }
}
class Derived : Base
{
    public override void Foo(int a = 20)
    {
        Console.WriteLine($"Derived.Foo( {a} )");
    }
}
class Program
{
    public static void Main()
    {
        Base b = new Derived();
        b.Foo(); // 컴파일 할때 
                 // 객체(실행시간에조사하는 코드).Foo(10)
    }
}
```

  

#### 값 타입의 생성자

- 참조 타입

  - 컴파일러가 기본 생성자 제공
  - 사용자가 인자 없는 생성자 작성 가능
  - 객체를 만드려면 생성자가 반드시 필요

- 값 타입 

  - 생성자가 없어도 객체를 만들 수 있다. (쓰레기값 초기화)

  - 컴파일러가 기본 생성자 제공하지 않음
  - 사용자는 인자를 갖는 생성자만 만들 수 있음

```c#
using System;

class CPoint
{
    public int x;
    public int y;
    public CPoint(int a, int b) { x = a; y = b; }
}
struct SPoint
{
    public int x;
    public int y;
    //public SPoint() { }
    public SPoint(int a, int b) { x = a; y = b; }
}
class Program
{
    public static void Main()
    {
        CPoint cp1 = new CPoint(1, 2);  // ok
        //CPoint cp2 = new CPoint();     // error
        SPoint sp1 = new SPoint(1, 2);  
        SPoint sp2 = new SPoint();      
    }
}
```

- 생성자 호출과 IL 코드

  | 구 분     | 내 용                                                        |
  | --------- | ------------------------------------------------------------ |
  | 참조 타입 | newobj instance void CPoint::.ctor(int32, int32)             |
  | 값 타입   | call instance void SPoint::.ctor(int32, int32)<br />initobj SPoint |

- 값 타입과 필드 초기화 -> 사용 불가

```c#
using System;

struct SPoint
{
    public int x;// = 0; 사용 불가
    public int y;// = 0; 사용 불가
}
class Program
{
    public static void Main()
    {
        SPoint sp1 = new SPoint();
    }
}
```

- 참조타입과 값타입의 객체 생성 방법과 초기화

```c#
using System;

class CPoint
{
    public int x;
    public int y;
}
struct SPoint
{
    public int x;
    public int y;
}

class Program
{
    public static void Main()
    {
        CPoint cp1;                 //# 객체 생성 아님. 참조 변수 생성
        CPoint cp2 = new CPoint();  //# 객체 생성.

        SPoint sp1;                 //# 객체 생성
        SPoint sp2 = new SPoint();  //# 객체 생성, initobj

        sp1.x = 10;
        sp2.x = 10;

        Console.WriteLine($"{sp1.x}");
        Console.WriteLine($"{sp2.x}");
    }
}

```

```c#
using System;

struct SPoint
{
    public int x;
    public int y;
}
class CCircle
{
    public SPoint center;
}
struct SCircle
{
    public SPoint center;
}

class Program
{
    public static void Main()
    {
        CCircle cc1;                    //# 객체 아님. 참조 변수
        CCircle cc2 = new CCircle();    //# 객체 생성, 모든 멤버가 0으로 초기화
        SCircle sc1;                    //# 객체 생성.
        SCircle sc2 = new SCircle();    //# 

        int n1 = cc1.center.x;  //# error. x가 메모리에 없음.
        int n2 = cc2.center.x;  //# ok. 0
        int n3 = sc1.center.x;  //# error. x가 초기화 안됨.
        int n4 = sc2.center.x;  //# ok.    x가 초기화 됨.
    }
}
```

- 값 타입 생성자 주의사항
  - 참조 타입의 객체 생성시 모든 멤버는 자동으로 0, 또는 null 초기화
    - 생성자 안에서 모든 멤버를 초기화 하지 않아도 됨
  - 값 타입을 new 없이 객체 생성 할 경우 자동으로 초기화 되지 않음
    - 값 타입의 생성자 안에서는 모든 멤버의 초기값을 제공 해야함
  - this 포인터 관련
    - 참조 타입은 "상수"
    - 값 타입은 "비 상수"

```c#
using System;

struct SPoint
{
    public int x;
    public int y;
    public int cnt;

    public SPoint(int a, int b)
    {
        //this = new SPoint();
        x = a;
        y = b;
        cnt = 0;
    }
}
class Program
{
    public static void Main()
    {
        SPoint pt = new SPoint(1, 2);
    }
}
```

```cpp
using System;

class CPoint
{
    public int x;
    public int y;
    public CPoint(int a = 1, int b = 1) { x = a; y = b; }
}
struct SPoint
{
    public int x;
    public int y;
    public SPoint(int a = 1, int b = 1) { x = a; y = b; }
}
class Program
{
    public static void Main()
    {
        CPoint cp1 = new CPoint(5, 5); // newobj
        SPoint sp1 = new SPoint(5, 5); // call 생성자
        CPoint cp2 = new CPoint(2);         
        SPoint sp2 = new SPoint(2);
        CPoint cp3 = new CPoint();
        SPoint sp3 = new SPoint(); // initobj, 디폴트 값 동작 안함!!

        Console.WriteLine($"{cp1.x}, {cp1.y}"); // 5, 5
        Console.WriteLine($"{sp1.x}, {sp1.y}"); // 5, 5       
        Console.WriteLine($"{cp2.x}, {cp2.y}"); // 2, 1
        Console.WriteLine($"{sp2.x}, {sp2.y}"); // 2, 1
        Console.WriteLine($"{cp3.x}, {cp3.y}"); // 1, 1
        Console.WriteLine($"{sp3.x}, {sp3.y}"); // 0, 0 주의!!!!
    }    
}
```

  

#### 타입 생성자

- static 생성자 : static 멤버 변수 초기화시 사용, 여러 객체를 할당해도 단 1회만 호출
  - 인자 없는 생성자만 만들 수 있음
  - 가장 먼저 호출됨
  - thread-safe함
  - A, B 클래스가 static 변수를 상호 참조 할 경우 버그 발생

```c#
using System;

class Point
{
    public int x;
    public int y;
    public static int cnt;

    public Point(int a, int b) { Console.WriteLine("instance ctor"); }
    static Point() { cnt = 0;    Console.WriteLine("static ctor"); }
}

class A
{
    public static int a;

    static A()
    {
        Console.WriteLine($"A : {B.b}");
        a = 10;
    }
}
class B
{
    public static int b;

    static B()
    {        
        Console.WriteLine($"B : {A.a}");
        b = 10;
    }
}

class Program
{
    public static void Main()
    {
        int n = Point.cnt;

        //    Point pt1 = new Point(1, 1);
        //    Point pt2 = new Point(1, 1);
        int n2 = A.a;
    }
}
```

- 필드 초기화와 생성자

```c#
using System;

class Point
{
    public int x = 0;
    public int y = 0;
    public static int cnt = 0;

    public Point()
    {
        x = 100;
        y = 100;
    }
    static Point()
    {
        cnt = 100;
    }

}
class Program
{
    public static void Main()
    {
        Point pt1 = new Point();
    }
}
```

- 값 타입과 static 생성자
  - 값 타입은 인자 없는 생성자 불가, 인자 없는 static 초기화는 가능

```c#
using System;

struct Point
{
    public int x;
    public int y;
    public static int cnt = 0;

 //   public Point() { } // error
 //   static Point() { } // ok
}

class Program
{
    public static void Main()
    {
        
    }
}
```

{{< adsense >}}

#### Deconstructor(C# 7.0)

- 객체에서 값을 꺼낼 때 활용 가능

```c#
using System;

class Point
{
    public int x;
    public int y;
    public Point(int a, int b) { x = a; y = b; }   
    
    public void Deconstruct(out int a, out int b)
    {
        a = x;
        b = y;
    }
}
class Program
{
    public static void Main()
    {
        Point pt = new Point(1, 2);

        int a = pt.x;
        int b = pt.y;

        //pt.Deconstruct(out int a2, out int b2);
        //아래 표현을, 위 표현으로 c# 언어에서 대체 시킴
        var (a1, b1) = pt;

        Console.WriteLine($"{a1}, {b1}");
    }
}
```