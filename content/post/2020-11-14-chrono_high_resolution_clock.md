---
title: "std::chrono::high_resolution_clock"
date: 2020-11-14T22:26:09+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce, Blog
categories:
- Language
- C++
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- C++
- std
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

#thumbnailImage: //example.com/image.jpg
---

5 years a go I’ve showed how to [use `clock_gettime`](https://www.guyrutenberg.com/2007/09/22/profiling-code-using-clock_gettime/) to do basic high_resolution profiling. The approach there is very useful, but unfortunately, not cross-platform. It works only on POSIX compliant systems (especially not windows).

<!--more-->

Luckily, the not-so-new C++11 provides, among other things, interface to high-precision clocks in a portable way. It’s still not a perfect solution, as it only provides wall-time (`clock_gettime` can give per process and per thread actual CPU time as well). However, it’s still nice.

```cpp
#include <iostream>
#include <chrono>
using namespace std;
 
int main()
{
	cout << chrono::high_resolution_clock::period::den << endl;
	auto start_time = chrono::high_resolution_clock::now();
	int temp;
	for (int i = 0; i< 242000000; i++)
		temp+=temp;
	auto end_time = chrono::high_resolution_clock::now();
	cout << chrono::duration_cast<chrono::seconds>(end_time - start_time).count() << ":";
	cout << chrono::duration_cast<chrono::microseconds>(end_time - start_time).count() << ":";
	return 0;
}
```

I’ll explain a bit the code. `chrono` is the new header files that provides various time and clock related functionality of the new standard library. `high_resolution_clock` should be, according to the standard, the clock with the highest precision.

```cpp
cout << chrono::high_resolution_clock::period::den << endl;
```

Note, that there isn’t a guarantee how many the ticks per seconds it has, only that it’s the highest available. Hence, the first thing we do is to get the precision, by printing how many many times a second the clock ticks. My system provides 1000000 ticks per second, which is a microsecond precision.

Getting the current time using `now()` is self-explanatory. The possibly tricky part is

```cpp
cout << chrono::duration_cast<chrono::seconds>(end_time - start_time).count() << ":";
```

`(end_time - start_time)` is a `duration` (newly defined type) and the `count()` method returns the number of ticks it represents. As we said, the number of ticks per second may change from system to system, so in order to get the number of seconds we use `duration_cast`. The same goes in the next line for microseconds.

The standard also provides other useful time units such as nanoseconds, milliseconds, minutes and even hours.