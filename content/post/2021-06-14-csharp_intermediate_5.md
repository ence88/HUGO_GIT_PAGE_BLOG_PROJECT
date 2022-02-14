---
title: "Csharp 씨샵 중급 - FRAMEWORK[5]"
date: 2021-06-14T11:00:00+09:00
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

이번 시간에는 Stream / Decorator / Adapter / MISC에 대해 알아보겠습니다.

<!--more-->

  

## Stream Decorator

#### Decorator 디자인 패턴 : "원래 기능에 새로운 기능을 추가"

- 상속 vs 포함을 사용한 기능 추가
  - 상속 : 클래스에 기능 추가 / 정적인 기능 추가
  - 포함 : 인스턴스에 기능 추가 / 동적인 기능 추가

```c#
using System;

interface Base // Decorator(기능 추가 객체)
{
    void Fire();
}

class Fighter : Base
{
    public virtual void Fire()
    {
        Console.WriteLine("Fire Missile");
    }
}

class RightMissile : Base
{
    private Base fighter = null;

    public RightMissile(Base fg) { fighter = fg; }

    public void Fire()
    {
        fighter.Fire(); // 기존 객체의 기능 사용
        Console.WriteLine("Fire Right Missile");
    }
}

class LeftMissile : Base
{
    private Base fighter = null;

    public LeftMissile(Base fg) { fighter = fg; }

    public void Fire()
    {
        fighter.Fire(); 
        Console.WriteLine("Fire Left Missile");
    }
}

class Program
{
    public static void Main()
    {
        Fighter fg = new Fighter();
        fg.Fire();

        // 아이템 획득
        RightMissile fg2 = new RightMissile(fg);
        fg2.Fire();

        LeftMissile fg3 = new LeftMissile(fg2);
        fg3.Fire();
    }
}
```



#### c# stream에서 decorator 패턴 사용 예제

```c#
using System;
using System.IO;
using System.IO.Compression;
using System.Net;

class Program
{
    public static void Main()
    {
        byte[] buff = new byte[1024 * 1024]; // 1M

        FileStream fs = new FileStream("d:\\a.dat", FileMode.Create);

        GZipStream gs = new GZipStream(fs, CompressionLevel.Fastest);

        BufferedStream bs = new BufferedStream(gs);

        //fs.Write(buff, 0, buff.Length);
        bs.Write(buff, 0, buff.Length);
        bs.Close();
        gs.Close();
        fs.Close();
    }
}
```

{{< adsense >}}

## Stream Adapter

#### Adapter 패턴 : 기존 클래스의 인터페이스를 변경(래핑 클래스)

```c#
using System;
using System.Collections.Generic;

class Stack 
{
    public List<int> st = null; 
    public Stack(List<int> s) { st = s; }
    
    public void Push(int a) { st.Add(a);  }
    public int  Pop()
    {
        int n = st.Count - 1;
        int temp = st[n];
        st.RemoveAt(n);
        return temp;
    }
}

class Program
{
    public static void Main()
    {
        List<int> st = new List<int>();

        st.Add(10);
        st.Add(20);

        // st를 stack 처럼 사용하고 싶다.
        Stack s = new Stack(st);

        s.Push(30);
        s.Push(40);

        int n = s.Pop(); // 40
        Console.WriteLine(n);   
    }
}
```

  

#### c# stream에서 adapter 패턴 사용 예제

```c#
using System;
using System.IO;
using System.IO.Compression;
using System.Text;

class Program
{
    public static void Main()
    {
        Console.WriteLine("Hello");

        FileStream fs = new FileStream("D:\\a.txt", FileMode.Create);

        // "Hello" 를 파일에 쓰고 싶다. 아래처럼 하면 불편
        //string s = "hello";
        //byte[] buff = Encoding.ASCII.GetBytes(s);
        //fs.Write(buff, 0, buff.Length);

        // 편안
        StreamWriter sw = new StreamWriter(fs, Encoding.ASCII);
        sw.WriteLine("Hello");

       // GZipStream gz = new GZipStream(fs);
       // gz.Write()

        sw.Close();
        fs.Close();
    }
}
```



## MISC

#### DLR(dynamic language runtime) : 실행시간에 각종 처리 가능

- 잘못된 형 변환 발생시 런타임 예외 발생

```c#
using System;

class Car
{
    public void Go() { Console.WriteLine("Car Go"); }
}
class Program
{    
    public static void Main()
    {
        object o = new Car();
        //o.Go();     //+ compile error
        //o.Stop();   //+ compile error

        dynamic d = new Car();
        d.Go();     //+ ok.
        d.Stop();   //+ 예외 발생

        var v = new Car(); // 컴파일 시간에 v의 타입 결정. Car v = Car()
        v.Go();     //+ ok
        //v.Stop();   //+ compile error
    }
}
```

- 활용 : multiple dispatch 문제 해결

```c#
using System;

abstract class Character
{
    public abstract void Fight(A a);
    public abstract void Fight(B a);
}

class A : Character
{
    public override void Fight(A a) { Console.WriteLine("A Fight With A"); }
    public override void Fight(B b) { Console.WriteLine("A Fight With B"); }
}

class B : Character
{
    public override void Fight(A a) { Console.WriteLine("B Fight With A"); }
    public override void Fight(B b) { Console.WriteLine("B Fight With B"); }
}

class Program
{
    public static void DoFight(Character c1, dynamic c2)
    {
        c1.Fight(c2);
    }
    public static void Main()
    {
        A a = new A();
        B b = new B();
        DoFight(a, a);
        DoFight(a, b);
        DoFight(b, a);
        DoFight(b, b);
    }
}
```