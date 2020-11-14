---
title: "스마트한 shared_ptr 스마트하게 지우는 법"
date: 2020-11-14T21:31:48+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce, Blog
categories:
- Dev
- C++
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- C++
- Modern C++
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

#thumbnailImage: //example.com/image.jpg스마트shared_ptr의 경우
---



스마트포인터 shared_ptr의 경우 참조 카운팅이 zero가 되어야 삭제 되는데, 그 시점이 약간 애매 할 수 있어 여러가지 처리를 해 줘야 합니다.

shared_ptr 생성 시점에서 deleter를 전달 할 수 있고 이를 활용하면 스마트 포인터를 더욱 스마트하게 사용 할 수 있습니다.

<!--more-->

shared_ptr의 생성자 함수는 크게 다음 세 가지 형태로 정의되어 있습니다.

```c++
constexpr shared_ptr() noexcept; // (1)

constexpr shared_ptr( std::nullptr_t ) noexcept; // (2)

template< class Y >
explicit shared_ptr( Y* ptr ); // (3)

template< class Y, class Deleter >
shared_ptr( Y* ptr, Deleter d ); // (4)

template< class Deleter >
shared_ptr( std::nullptr_t ptr, Deleter d ); // (5)

template< class Y, class Deleter, class Alloc >
shared_ptr( Y* ptr, Deleter d, Alloc alloc ); // (6)
```

4번째 기본 생성자를 보면 두번째 인자로 Deleter 함수 객체를 받고 있고, 여기에 원하는 Deleter 함수 객체 or 람다를 넣어주면 `std::shared_ptr`가 그것으로 객체를 해제합니다.



사용예

```c++
#include <functional>
#include <memory>

template<typename T>
std::function<void (T*)> array_deleter() {
    return [](T* ptr) { delete[] ptr; };
}

int main()
{
    std::shared_ptr<int> foo(new int[1024], array_deleter<int>());
    
    foo.reset();
    
    return 0;
}
```