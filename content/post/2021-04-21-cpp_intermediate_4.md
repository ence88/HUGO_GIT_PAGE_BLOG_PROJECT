---
title: "C++ 고급 문법/테크닉 - C++ 17 기본 문법[4]"
date: 2021-04-21T09:50:00+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN
categories:
- Language
- C++
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- C++
- Modern C++
- C++ Advanced
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

#thumbnailImage: //example.com/image.jpgC스터디 내용작성 ㅇS이번 항이번 이버C++ 
---

C++17 에서 추가된 다양한 문법을 빠르게 소개합니다.

<!--more-->

  

  ### if-init

조건문(if, switch cas)에 변수 선언 표기 가능

```cpp
#include <iostream>
using namespace std;

int foo()
{
	return 0;
}

int main()
{
	// 예전 스타일.
	int ret = foo();

	if (ret == 0)
	{
	}

	// C++17 스타일
	// if ( init 구문; 조건문 )
	if (int ret = foo(); ret == 0)
	{
		cout << "ret is 0" << endl;
	}

	// switch 문에도 초기화 구문을 추가할수 있습니다.
	switch (int n = foo(); n)
	{
	case 0: break;
	case 1: break;
	}
}  
```

{{< adsense >}}

### static if

컴파일 시간에 동작하는 if, 컴파일 시간에 분기처리하여 문법에 맞지 않는 코드를 제외 시킬 수 있음

```cpp
#include <iostream>
#include <type_traits>
using namespace std;

template<typename T> void printv(T v)
{
	if constexpr (is_pointer<T>::value)	
		cout << v << " : " << *v << endl;
	else
		cout << v << endl;
}

int main()
{
	int n = 10;
	printv(n);
	printv(&n);
}
```

  

### structure binding

대상의 요소를 꺼내 올 때 간결하게 접근 가능(객체, pair, tuple 등)

```cpp
#include <iostream>
#include <tuple>
using namespace std;

struct Point
{
	int x;
	int y;
};
int main()
{
	Point pt = { 1,2 };
	//int a = pt.x;
	//int b = pt.y;

	auto  [a,  b] = pt;
	auto& [rx, ry] = pt;


	int x[2] = { 1,2 };
	auto[e1, e2] = x;


	pair<int, double> p(1, 3.4);
	auto[n, d] = p;

	tuple<int, short, double> t3(1, 2, 3.4);
	auto[a1, a2, a3] = t3;
}
```

- 활용 코드

```cpp
#include <iostream>
#include <set>
using namespace std;

int main()
{
	set<int> s;

	s.insert(10);
	//pair<set<int>::iterator, bool> ret = s.insert(10);
	/* c++98 style
	auto ret = s.insert(10);
	if (ret.second == false)
	{
		cout << "실패" << endl;
	}
	*/
	/* c++11 style
	auto [it, success] = s.insert(10);
	if ( success == false)
	{
		cout << "실패" << endl;
	}
	*/
	
    // 위 코드들과 같은 동작을 한줄의 코드로 표현
	if ( auto[it, success] = s.insert(10); success == false)
	{
		cout << "실패" << endl;
	}

}
```

  

  

[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)