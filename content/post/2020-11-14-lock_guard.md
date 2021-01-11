---
title: "std::lock_guard"
date: 2020-11-14T22:48:24+09:00
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

#### std::lock_guard

std::lock_guard는 객체 생성 시에 lock되며 객체가 소멸시에 unlock 되는 특성을 가지고 있습니다.

<!--more-->

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::mutex m1;
int main() {
   std::thread th([&]() {
   std::lock_guard<std::mutex> lock_guard(m1);
   for (int i = 0; i < 100; i++) {
   std::cout << "th1" << std::endl;
   }
   });
   std::thread th2([&]() {
   std::lock_guard<std::mutex> lock_guard(m1);
   for (int i = 0; i < 100; i++) {
   std::cout << "th2" << std::endl;
   }
   });

   std::cout << "hello" << std::endl;
   th.join();
   th2.join();
}
```

  

  

또한  중간에 리턴되어 unlock이 되지 않는 문제를 해결 할 수 있습니다.

```cpp
...
mutex.lock()

if(n == 10)
   return false;

mutex.unlock()
...
```

