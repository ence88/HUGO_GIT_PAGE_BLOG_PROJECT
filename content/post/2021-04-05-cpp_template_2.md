---
title: "C++ Template Programming - Template Instantiation[2]"
date: 2021-04-05T16:00:00+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN
categories:
- Language
- C++
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- C++
- Modern C++
- C++ Template
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

#thumbnailImage: //example.com/image.jpgC스터디 내용작성 ㅇS이번 항
---

이번 항목에서는 C++ 템플릿의 기본 개념에 대해서 배우게 됩니다. 비교적 쉬운 내용이지만, 뒷 부분의 다양한 고급 기법을 정확히 이해 하려면 반드시 정확하게 이해 해야 합니다.
<!--more-->

  

### Template의 개념

같은 이름으로 다른 처리를 하는 함수를 만들 때 함수 오버로딩을 사용 할 수 있지만, 함수를 만드는 틀(템플릿)을 이용하면 한번의 표현으로 같은 처리를 할 수 있습니다.

```cpp
int square(int a)
{
    return a * a;
}

double square(double d)
{
    return d * d;
}

int main()
{
    square(3);
    square(3.3);
}
```

```cpp
template<typename T>
T square(T a)
{
    return a * a;
}

int main()
{
    square<int>(3);
    square<double>(3.3);
}
```

  

  

### Template의 필요성

- 라이브러리 설계시 사용자에게 타입 결정권을 줄 수 있다.

```cpp
#include <iostream>
using namespace std;

/*
class complex
{
	int re;
	int im;
public:
	complex(int r, int i) : re(r), im(i) {}
};
*/

template<typename T> class complex
{
	T re;
	T im;
public:
	complex(T r, T i) : re(r), im(i) {}
};

int main()
{
	complex<int> c1(3, 5);
}
```

{{< adsense >}}

### Template이 생성한 코드 확인

Template instantiation은 컴파일러가 함수(클래스) 템플릿으로부터 실제 함수(클래스)를 만들어 내는 과정을 말합니다.

1. 어셈블리 코드 확인 : cl file.cpp /FAs -> file.asm 어셈블리 코드 파일 생성



### Template instantiation

템플릿으로 부터 실제 C++ 코드를 만들어 내는 과정

1. 명시적 인스턴스화 : 템플릿을 사용해서 특정 타입의 함수(또는 클래스)를 생성해 달라고 명시적으로 지시하는 것
2. 암시적 인스턴스화 : 명시적 인스턴스화를 하지 않고 템플릿을 사용하는 경우 type deduction을 통해 추론됨(class template type deduction은 C++17부터 지원)

```cpp
template<typename T> T square(T a)
{
	T ret = a * a;
	return ret;
}

int main()
{
	// 명시적, explicit instantiation
	square<int>(3);
	square<double>(3.4);

	// 암시적, implicit instantiation
	square(3);
	square(3.4);
}
```



### Class template type deduction

```cpp
#include <list>
using namespace std;

// C++17 class template type deduction

template<typename T> class Vector
{
public:
	Vector(int sz, T value) {}

	template<typename C> Vector(const C& c) {}
	template<typename IT> Vector(IT first, IT second) {}
};
template<typename C> Vector(const C& c)->Vector<typename C::value_type>;
template<typename IT> Vector(IT first, IT second)->Vector<typename IT::value_type >;

int main()(
{
	Vector v1(10, 5); // type <int> 를 생략하더라도 컴파일러에서 int 추론(C++17)
	list s = { 1,2,3 }; // stl list도 타입 생략 가능

	Vector v2(s);
	Vector v3(s.begin(), s.end());

	int x[10] = { 1,2,3,4,5,6,7,8,9,10 };
	Vector v4(x, x + 10); // error.
}
```



### Identity

- 함수 템플릿 사용시 사용자가 반드시 타입을 전달하도록 하고 싶을 때

```cpp
template<typename T> struct identity
{
	typedef T type;
};

// implicit, explicit 인스턴스화 모두 가능
// template<typename T> void foo(T a) 

// explicit instantiation 만 가능.
template<typename T> void foo(typename identity<T>::type a)
{
}

int main()
{
	foo(0);		// implicit instantiation - 컴파일 error
	foo<int>(0);// explicit instantiation - ok
}
```



### Lazy instantiation

```cpp
template<typename T> class A
{
	int data;
public:
	void foo() { *data = 10; } // 잘못된 코드지만 사용처가 없을 경우 인스턴스화 되지 않음, static 멤버 변수도 동일 규칙 적용됨
};

int main()
{
	A<int> a;
	a.foo(); // foo를 사용해야만 에러가 발생합니다.
}
```



### if문과 lazy instantiation

```cpp
template<typename T> void foo(T a)
{
	*a = 10;
}

int main()
{
	//foo(0); // error

	if (false)	// if문은 실행시간 조건문이므로
		foo(0);	// 컴파일시에 이 코드는 사용된다고 판단되어 컴파일타임 에러 발생

	if constexpr(false) // C++17 static-if 문법
		foo(0); // false로 접근 할 수 없을 경우 인스턴스화 되지 않아 에러 발생하지 않음

}
```

```cpp
// if 문은 실행시간 조건 분기 문이다.
// 함수 오버로딩은 컴파일 시간 분기문이다
// if constexpr 문은 컴파일시간 조건 분기 문이다.

template<typename T> void foo(T a, int n)
{
	*a = 10;
}

template<typename T> void foo(T a, double d)
{
}

int main()
{
	foo(0, 3.4); // 함수 오버로딩의 의한 함수 선택은 컴파일 시간에 결정. foo(T, int)는 사용된적이 없으므로 C++ 코드로 생성안됨.

	// 아래 처럼 사용한 경우. foo( T, int) 는 사용된다고 판단하므로 error.
	if (false)
		foo(0, 1);
	else
		foo(0, 3.4);

	// 하지만 아래 처럼 하면 error. 없음.
	if constexpr(false)
		foo(0, 1);
	else
		foo(0, 3.4);
}
```



### 타입 조사 방법 boost::type_index

- 표준의 typeid() 연산자는 const, volatile, reference 조사 불가, boost의 type_index는 가능

```cpp
#include <iostream>
#include <typeinfo>
#include <boost/type_index.hpp>
using namespace std;
using namespace boost::typeindex;

template<typename T> void foo(const T a)
{
//	cout << "T : " << typeid(T).name() << endl;
//	cout << "T : " << typeid(a).name() << endl;

	cout << "T : " << type_id_with_cvr<T>().pretty_name() << endl;
	cout << "a : " << type_id_with_cvr<decltype(a)>().pretty_name() << endl;
}

int main()
{
	foo(3);		// T : int		a : const int
	foo(3.3);
}
```

   

### template type deduction (템플릿 타입 추론 규칙)

- 규칙1. 템플릿 인자가 값 타입일 때(T a)
  - 함수 인자가 가진 const, volatile, reference 속성을 제거하고 T의 타입 결정(파라메터가 가진 const 속성만 제거됨)

```cpp
#include <iostream>
#include <typeinfo>
#include <boost/type_index.hpp>
using namespace std;
using namespace boost::typeindex;

// 규칙 1. 템플릿 인자를 값 타입으로 받을때
//		   인자의 const, volatile, reference 속성은 모두 제거 된다.
template<typename T> void foo(T a)
{
	--a;

	cout << "T : " << type_id_with_cvr<T>().pretty_name() << endl;
	cout << "a : " << type_id_with_cvr<decltype(a)>().pretty_name() << endl;
}

int main()
{
	int		n = 10;
	int&    r = n;
	const int c = n;
	const int& cr = c;

	foo(n); // int			T : int		a : int
	foo(r); // int&			T : int		a : int
	foo(c); // const int	T : int     a : int
	foo(cr);// const int&   T : int		a : int

	// 주의! 인자가 가진 const 속성만 제거
	const int* p1 = &n; // p1을 따라가면 const, p1은 const 아님.
	int* const p2 = &n; // p2가 const

	foo(p1);	// T : const int*,    여기서의 const는 인자의 const가 아님.
	foo(p2);	// T : int*, 즉, const 속성 제거
}
```

- 규칙2. 템플릿 인자가 참조 타입 일 때 (T& a)
  - 함수 인작 ㅏ가진 reference 속성만 제거 하고 T의 타입 결정
  - const와 volcatile 속성은 유지됨, 단 템플릿 인자가 const T& 일 경우는 함수 인자가 가진 const를 제거하고 T 타입 결정

```cpp
#include <iostream>
#include <typeinfo>
#include <boost/type_index.hpp>
using namespace std;
using namespace boost::typeindex;

// 규칙 2. 템플릿 인자를 참조 타입으로 받을때
//		   인자의 reference 속성을 제거하고 T를 결정, const, volatile 속성은 유지 된다.
template<typename T> void foo(const T& a)
{
	--a;

	cout << "T : " << type_id_with_cvr<T>().pretty_name() << endl;
	cout << "a : " << type_id_with_cvr<decltype(a)>().pretty_name() << endl;
}

int main()
{
	int		n = 10;
	int&    r = n;
	const int c = n;
	const int& cr = c;

	foo(n); // int			T : int		a : const int&
	foo(r); // int&			T : int		a : const int&
	foo(c); // const int	T : int		a : const int&
	foo(cr);// const int&   T : int		a : const int&
}
```

- 규칙 3. 템플릿 인자가 forwarding 레퍼런스 일 때(T&&)
  - lvalue와 rvalue를 모두 전달 받음
- 규칙 4. 배열을 전달 받을 때(argument decay 발생)
  - 배열을 값으로 받으면 T는 요소 타입의 포인터로 결정
  - 배열을 참조로 받으면 T는 배열 타입으로 결정

```cpp
#include <iostream>
#include <type_traits>
using namespace std;

// argument decay
template<typename T> void foo(T arg) // int arg[3] = x;
{
	// T : int*
	cout << typeid(T).name() << endl; // int*
}

template<typename T> void goo(T& arg) // T : int[3]    goo(int (&arg)[3])
{
	// T : int[3]
	cout << typeid(T).name() << endl; // int[3]
}

int main()
{
	int x[3] = { 1,2,3 }; //int[3]

	foo(x); //
	goo(x);


//	int y[3] = x; // error
//	int* p = x;  // 
//	int(&r)[3] = x; // ok..
}
```

- 규칙 4 관련 주의점
  - 문자열을 값으로 받으면 T는 const char*, 참조로 받으면 const char[]
  - 크기가 다른 배열은 다른 타입

```cpp
template<typename T> void foo(T a, T b)
{
}

template<typename T> void goo(T& a, T& b)
{
}

int main()
{
	// "orange" : const char [7] 
	// "apple"  : const char [6] 
	foo("orange", "apple"); // ok    foo( const char*, const char*)
	goo("orange", "apple"); // error goo( const char [7], const char [6])
}
```





[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)

