---
title: "C# 중급 - Concurrency[4]"
date: 2021-06-12T11:00:00+09:00
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

C#의 Thread, Task, Async에 대해 알아보겠습니다.

<!--more-->

## Thread

#### Background vs Foreground

> 프로세스(메인 프로그램)의 종료 조건 : 모든 foreground 스레드가 작업을 마칠 때

```c#
using System;
using System.Threading;

class Program
{
    public static void Foo(string s, int ms)
    {
        Console.WriteLine($"{s} Start");
        Thread.Sleep(ms);
        Console.WriteLine($"{s} Finish");
    }

    public static void Main()
    {
        Thread t1 = new Thread(() => Foo("A", 3000));
        t1.IsBackground = false; // foreground
        t1.Start();

        Thread t2 = new Thread(() => Foo("B", 9000));
        t2.IsBackground = true; // background
        t2.Start();

        Thread t3 = new Thread(() => Foo("C", 7000));
        t3.IsBackground = false; // foreground
        t3.Start();

        Thread t4 = new Thread(() => Foo("D", 5000));
        t4.IsBackground = true; // background
        t4.Start();
        // 주 스레드가 종료!!
    }
}
```

#### 스레드의 cooperative cancel

> 진행중인 스레드 우아하게 종료

```c#
using System;
using System.Threading;

class Program
{
    public static void Count(CancellationToken token, int cnt)
    {
        for (int i = 0; i < cnt; i++)
        {
            if (token.IsCancellationRequested)
            {
                Console.WriteLine("Cancelling");
                break;
            }
            Console.WriteLine(i);
            Thread.Sleep(200);
        }
        if (token.IsCancellationRequested)
        {
            Console.WriteLine("Cancelled");
        }
        else
            Console.WriteLine("Finish Count");
    }

    public static void Main()
    {
        CancellationTokenSource cts = new CancellationTokenSource();

        CancellationTokenRegistration m1 = cts.Token.Register(() => Console.WriteLine("Cancelled 1"));
        cts.Token.Register(() => Console.WriteLine("Cancelled 2"));

        m1.Dispose(); // 등록된 함수 제거.

        Thread t = new Thread(o => Count(cts.Token, 1000));
        t.Start();

        //cts.Cancel();
        cts.CancelAfter(2000);

        Console.ReadLine();
    }
}
```

{{< adsense >}}

## Task

#### Task 간단 예

> Action : 반환값이 없는 메소드
>
> Func : 반환값이 있는 메소드
>
> task 종료 대기 : Wait()
>
> tasj 반환 값 얻기 : t.Result; // task가 실행중인 경우 종료 될 때 까지 블락

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void F1()           { Console.WriteLine("F1"); }
    static void F2(object obj) { Console.WriteLine("F2"); }
    static int  F3()           { Console.WriteLine("F3"); return 100; }
    static int  F4(object obj) { Console.WriteLine("F4"); Thread.Sleep(3000); return 200; }

    static void Main()
    {
        Task t1 = new Task(F1);
        t1.Start();

        Task t2 = new Task(F2, "Hello");
        t2.Start();

        Task<int> t3 = new Task<int>(F3);
        t3.Start();

        Task<int> t4 = new Task<int>(F4, "Hello");
        t4.Start();
		
        Console.WriteLine($"{t4.Result}"); // 반환 될 때 까지 block
    }
}
```

  

#### Task 생성시 스레드 풀 사용하지 않는 방법(블락 되거나 무한히 작업되는 task)

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void F1() 
    {
        Console.WriteLine($"{Thread.CurrentThread.IsThreadPoolThread}");
        Console.WriteLine($"{Thread.CurrentThread.IsBackground}");
    }

    static void Main()
    {
        //Task t1 = new Task(F1); 
        Task t1 = new Task(F1, TaskCreationOptions.LongRunning);

        t1.Start();
        t1.Wait();

        Task t2 = Task.Run(F1); // Run은 무조건 Pool 사용
    }
}
```

  

#### Task 연속 실행 (A task 완료 후 B task 실행)

- 예제 ( pool의 워커 스레드가 같도록 명시 가능 )

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    public static int Sum(int cnt)
    {
        Console.WriteLine($"Sum : {Thread.CurrentThread.ManagedThreadId}");
        int s = 0;
        for (int i = 0; i <= cnt; i++)
            s += i;
        Console.WriteLine("Finish Sum");
        return s;
    }
    public static void Main()
    {
        Console.WriteLine($"Main : {Thread.CurrentThread.ManagedThreadId}");
        Task<int> t = Task.Run(() => Sum(1000));

        t.ContinueWith(Foo, TaskContinuationOptions.ExecuteSynchronously) ;

        t.ContinueWith(Goo, TaskContinuationOptions.ExecuteSynchronously);

        //t.ContinueWith((task) => Console.WriteLine("lambda"));

        Console.ReadLine();  
    }

    public static void Foo(Task<int> t)
    {
        Console.WriteLine($"Foo : {Thread.CurrentThread.ManagedThreadId}");
        Console.WriteLine($"Foo : {t.Result}");
    }
    public static void Goo(Task<int> t)
    {
        Console.WriteLine($"Goo : {Thread.CurrentThread.ManagedThreadId}");
        Console.WriteLine($"Goo : {t.Result}");
    }
}
```

  

## Async

#### 비동기 함수 : none-block, 동시성

- 예제

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    public static int Sum(int first, int last)
    {
        int s = 0;
        for (int i = first; i <= last; i++)
        {
            s += i;
            Thread.Sleep(10);
        }
        return s;
    }

    public static Task<int> SumAsync(int first, int last)
    {
        Task<int> t = Task.Run(() =>
        {
            int s = 0;
            for (int i = first; i <= last; i++)
            {
                s += i;
                Thread.Sleep(10);
            }
            return s;
        });
        return t;
    }

    public static void Main()
    {
        Task<int> ret = SumAsync(1, 200); // 비동기

        Console.WriteLine("Main");
        Console.WriteLine($"{ret.Result}");


        //int ret = Sum(1, 200); // Blocking
        //Task<int> t = Task.Run(() => Sum(1, 200));
        
        //Console.WriteLine("Main");

        //Console.WriteLine($"{t.Result}");
    }
}
```



#### async / await

- async / await 키워드를 사용하지 않을 경우 비동기 로직 작성시 코드가 복잡해짐

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    public static Task<int> SumAsync(int first, int last)
    {
        return Task.Run(() =>
        {
            int s = 0;
            for (int i = first; i <= last; i++)
            {
                s += i;
                Thread.Sleep(10);
            }
            return s;
        });
    }

    public static void UpdateResult()
    {

        Task<int> t = SumAsync(1, 200);

        //Console.WriteLine($"{t.Result}"); // 여기서 받아오면 block 발생

        var awaiter = t.GetAwaiter();

        awaiter.OnCompleted( () =>
            Console.WriteLine($"{awaiter.GetResult()}")); // 완료 될 경우 처리 할 람다 명시
   }

    public static void Main()
    {
        UpdateResult();

        Console.WriteLine("Main : Run Event Loop");
        Console.ReadLine();
    }
}
```

- async / await 활용 예제 -> 마치 동기 로직 처럼 코딩 가능

  > 반환 타입 앞에 async 명시
  >
  > 함수 내에서 await를 사용하면 수행시 해당 문맥에서 호출된 스레드로 리턴됨
  >
  > 비동기 함수의 반환 타입은 void, task, task<T>

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    public static Task<int> SumAsync(int first, int last)
    {
        return Task.Run(() =>
        {
            int s = 0;
            for (int i = first; i <= last; i++)
            {
                s += i;
                Thread.Sleep(10);
            }
            return s;
        });
    }


    public static async void UpdateResult()
    {
        Console.WriteLine("UpdateResult");

        int ret = await SumAsync(1, 200); // 비동기 함수를 동기 함수 처럼 사용

        Console.WriteLine($"{ret}");
    }

    public static void Main()
    {
        UpdateResult();

        Console.WriteLine("Main : Run Event Loop");
        Console.ReadLine();
    }
}
```