---
title: "C++ Template Programming - Template Design[7]"
date: 2021-04-09T12:00:00+09:00
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

#thumbnailImage: //example.com/image.jpgC스터디 내용작성 ㅇS이번 항이번 이버
---

이번에는 템플릿 코드의 메모리 사용량을 줄이는 방법, CRTP, SFINAE typelinst 등에 대해서 살펴보겠습니다.

<!--more-->

​    

### Thin template

템플릿을 사용하면 소스코드 용량이 늘어나게됩니다.

```cpp
// 멤버 함수 4개 * 3개 타입 => 12개 함수 생성
template<typename T> class Vector
{
	T* buff;
	int sz;
public:
	int size() const;
	bool empty() const;
	void push_front(const T& a);
	T& front();
};

int main()
{
	Vector<int>    v1;
	Vector<short>  v2;
	Vector<double> v3;
}
```

소스코드 용량을 줄이는 방법1

```cpp
// 방법 1. template parameter T를 사용하지 않은 멤버 함수는 기반 클래스로 옮기자
// 멤버 함수 2개 * 3개 타입 + 기반 클래스 멤버 함수 2개 => 8개

class VectorBase
{
protected:
	int sz;
public:
	int size() const;
	bool empty() const;
};
template<typename T> class Vector : public VectorBase
{
	T* buff;
public:
	void push_front(const T& a);
	T& front();
};

int main()
{
	Vector<int>    v1;
	Vector<short>  v2;
	Vector<double> v3;
}
```

소스코드 용량을 줄이는 방법2 -> Thin template

```cpp
// 방법 2. void* 기반 컨테이너 + 캐스팅을 책임지는 파생 클래스
// 멤버 함수 2개 * 3개 타입 + 기반 클래스 멤버 함수 2개 => 8개

class VectorBase
{
protected:
	void* buff;
	int sz;
public:
	int size() const;
	bool empty() const;

	void  push_front(const void* a);
	void* front();
};

// 캐스팅만 책임지는 파생 클래스
template<typename T> class Vector : public VectorBase
{
public:
	inline int size() const   { return VectorBase::size(); }
	inline bool empty() const { return VectorBase::empty(); }
	inline void push_front(const T& a) { VectorBase::push_front(static_cast<void*>(a)); }
	inline T& front() { return static_casst<T&>(VectorBase::front());	}
};

int main()
{
	Vector<int>    v1;
	Vector<short>  v2;
	Vector<double> v3;
}
```

  

### CRTP : Curiously Recurring Template Patten

기반 클래스(부모, 과거)에서  상속된 파생 클래스(자식, 미래)의 이름을 사용 할 수 있는 방법.

파생 클래스를 만들 때 기반 클래스의 템플릿 인자로 자신의 이름을 전달하여 구현

- CRTP 활용 1 : 상속 관계에서 가상함수(virtual)을 사용하지 않고 다형성 구현 가능 -> 장점 : 가상함수가 수백개 일 경우 메모리 사용량이 증가함

```cpp
#include <iostream>
using namespace std;

// CRTP : Curiously Reccuring Template Pattern
template<typename T> class Window
{
public:
	void msgLoop() // void msgLoop(Window* this)
	{
		static_cast<T*>(this)->onKeyDown();  // T를 사용해서 자식의 onKeyDown 호출, virutal 없이 가상함수 처럼 동작
	}
	void onKeyDown() { cout << "Window onKeyDown" << endl; }
};

class MyWindow : public Window<MyWindow> // 상속시 T에 자기 이름 전달
{
public:
	void onKeyDown() { cout << "Window onKeyDown" << endl; }
};

int main()
{
	MyWindow w;
	w.msgLoop();
}
```

- CRTP 활용 2 : Singleton 패턴 구현

```cpp
#include <iostream>
using namespace std;

template<typename T> class Singleton
{
public:
	static T* instance;

	static T& getInstance()
	{
		if (instance == 0)
			instance = new T;
		return *instance;
	}
};

template<typename T> T* Singleton<T>::instance = 0;

class Cursor : public Singleton<Cursor>
{
};

int main()
{
	Cursor& c = Cursor::getInstance();
}
```

- CRTP 활용 3 : static 변수 적용 범위를 파생 클래스의 이름으로 그룹화 해서 관리하기

```cpp
#include <iostream>
using namespace std;

template<typename T> struct Count
{
private:
	static int cnt;
public:
	Count() { ++cnt; }
	~Count() { --cnt; }

	static int count() { return cnt; }
};
template<typename T> int Count<T>::cnt = 0;

class Mouse : public Count<Mouse>
{
};
class Keyboard : public Count<Keyboard>
{
};
int main()
{
	Mouse m1, m2;
	Keyboard k1, k2;

	cout << k1.count() << endl;
}
```

  

### Policy-based design

1. 클래스가 사용하는 정책을 성능저하 없이 교체 할 수 있음, 이 기법을 사용하는 대표적인 라이브러리 -> "STL"

2. 성능 저하 없이 정책을 교체 할 수 있음

- List를 제공 할 때 lock 사용 유/무 버전을 사용자가 선택 할 수 있도록 제공 하도록 구현 예제

```cpp
template<typename T, typename ThreadModel> class List
{
	ThreadModel tm;
public:
	void push_front(const T& a)
	{
		tm.Lock();
		//......
		tm.Unlock();
	}
};

// 동기화 정책을 담은 정책 클래스 : 반드시 Lock()/Unlock() 이 있어야 한다.
struct NoLock
{
	inline void Lock() {}
	inline void Unlock() {}
};

struct Win32Lock
{
	inline void Lock()   { } // implement lock using win32 api
	inline void Unlock() { }
};

struct LinuxLock
{
	inline void Lock() { } // implement lock using linux system call
	inline void Unlock() { }
};


List<int, NoLock> st; // NoLock 버전 제공

int main()
{
	st.push_front(10);
}
```

- 메모리 할당 방식을 사용자가 선택 할 수 있도록 제공하는 예제

```cpp
#include <iostream>
#include <vector>
#include <limits>
using namespace std;

template <class T> class ecAlloc 
{
public:
	typedef T        value_type;
	typedef T*       pointer;
	typedef const T* const_pointer;
	typedef T&       reference;
	typedef const T& const_reference;
	typedef std::size_t    size_type;
	typedef std::ptrdiff_t difference_type;

	// policy clone 을 위한 도구. "rebind" 동영상 참고.
	template <class U> struct rebind 
	{
		typedef ecAlloc<U> other;
	};

	pointer address(reference value) const				{ return &value;	}
	const_pointer address(const_reference value) const 	{ return &value;	}

	ecAlloc() noexcept { }
	ecAlloc(const ecAlloc&) noexcept { }
	~ecAlloc() noexcept { }
	template <class U> ecAlloc(const ecAlloc<U>&) noexcept {}

	size_type max_size() const throw() {
		return numeric_limits<std::size_t>::max() / sizeof(T);
	}

	// 메모리만 할당하는 함수. 초기화(생성자 호출) 하지 않습니다.
	pointer allocate(size_type num, const void* = 0) 
	{
		cerr << "allocate " << num << " element(s)"
			      << " of size " << sizeof(T) << endl;
		pointer ret = (pointer)(::operator new(num * sizeof(T)));
		cerr << " allocated at: " << (void*)ret << endl;
		return ret;
	}

	// 초기화(생성자 호출) 함수. Placement new를 사용합니다.
	void construct(pointer p, const T& value) {		
		new((void*)p)T(value);
	}

	// 객체 파괴(소멸자 호출) 함수
	void destroy(pointer p) {
		p->~T();
	}

	// 메모리 해지
	void deallocate(pointer p, size_type num) {
		cerr << "deallocate " << num << " element(s)"
			<< " of size " << sizeof(T)
			<< " at: " << (void*)p << endl;
		::operator delete((void*)p);
	}
};
// return that all specializations of this allocator are interchangeable
template <class T1, class T2>
bool operator== (const ecAlloc<T1>&, const ecAlloc<T2>&) noexcept
{
	return true;
}
template <class T1, class T2>
bool operator!= (const ecAlloc<T1>&, const ecAlloc<T2>&) noexcept
{
	return false;
}

int main()
{
	vector<int, ecAlloc<int>> v(2, 0);

	v.resize(4);
}
```

  

### SFIAE : Subsitution Failure is Not An Error

- 컴파일러가 이름으로 함수를 찾는 순서 : exactly matching -> template -> variable argument
- 함수 템플릿을 사용시 T의 타입이 결정되고 함수를 생성하려고 할 때 리턴 타입이나 함수 인자 등에서 치환에 실패하면 컴파일 에러가 아니라, 함수 후보군에서 제외
- 동일한 이름의 다른 함수가 있다면 그 함수를 사용하게 됨

```cpp
template<typename T>
typename T::type foo(T t) //int::type foo(int t)
{
    cout << "T" << endl;
    return 0;
}

void foo(...) { cout << "..." << endl; }

int main()
{
    foo(3); // output : ...
}
```

- 특정 타입에만 적용되는 템플릿을 구현하고 싶을 때

  1. static_assert를 활용 하여 구현 : 조건을 만족하지 않으면 컴파일 에러

  2. enable_if 방식으로 구현 : 조건을 만족하지 않으면 함수를 생성하지 않고, 동일 이름의 다른 함수가 있으면 사용

```cpp
#include <type_traits>
using namespace std;

// foo 함수를 정수 계열에 대해서만 코드 생성되게 하고 싶다.
// 방법 1. static_assert 
// 특징 : T가 정수가 아니면 무조건 error 발생.
template<typename T> void foo(T a)
{
	static_assert(is_integral<T>::value, "error");
}

// 방법 2. enable_if
// 특징 : T가 정수가 아니면 error가 아니라 코드 생성을 하지 않음. 호출 가능한 다른 foo()가 있으면 사용됨
// enable_if 위치 1. 함수 리턴 타입에 적용
template<typename T> typename enable_if< is_integral<T>::value,void >::type foo(T a)
{
}

// enable_if 위치 2. 함수 인자 타입에 적용 - 생성자.. 
template<typename T>   
void foo(T a, typename enable_if< is_integral<T>::value, void >::type* p = nullptr )
{
}

// enable_if 위치 3. 템플릿 인자에 적용
// template<typename T, void* = nullptr >
template<typename T, typename enable_if< is_integral<T>::value, void >::type* = nullptr >
void foo(T a)
{
}

void foo(...) {}

int main()
{
	foo(3);
}
```

  

### Member detect idioms

클래스 안에 특정한 멤버함수, 멤버 데이터, 멤버 타입 등이 있는지 조사하는 방법

- 특정 멤버 함수가 있는지 조사 방법

```cpp
#include <iostream>
#include <vector>
#include <array>
#include <type_traits>
using namespace std;

template<typename T> struct has_resize
{
	using YES = char;
	using NO = short;

	template<typename U> static YES check(typename std::add_pointer<decltype(U().resize(0))>::type  a);
	template<typename U> static NO  check(...);
	
	static constexpr bool value = (sizeof(check<T>(0)) == sizeof(YES));
};

int main()
{
	cout << has_resize<vector<int>>::value << endl;     // 1
	cout << has_resize<array<int, 10>>::value << endl;  // 0
}
```

- 멤버 변수가 value 타입을 갖고 있는지 여부 조사 방법

```cpp
#include <iostream>
using namespace std;

struct NoValueType
{
};

struct HasValueType
{
	typedef int value_type;
};

template<typename T> struct has_value_type
{
	using YES = char;
	using NO = short;

	template<typename U> static YES check(typename U::value_type*  a);
	template<typename U> static NO  check(...);

	static constexpr bool value = (sizeof(check<T>(0)) == sizeof(YES));
};

int main()
{
	cout << has_value_type<HasValueType>::value << endl; // 1
	cout << has_value_type<NoValueType>::value << endl;  // 0
}
```

  

### Typelist

loki libaray의 Typelist의 구현 살펴보기

- type을 보관하는 list 형태 템플릿

```cpp
// 1. 값을 보관하지 않는다.
// 2. N개의 타입을 보관한다.
// 3. NullType 과 매크로 도입

// Typelist : 타입을 여러개 보관하는 type의 list(값이 아님.)
template<typename T, typename U> struct Typelist
{
	typedef T Head;
	typedef U Tail;
};

struct NullType {}; // 모든 typelist의 끝은 NullType으로 표현

// 매크로 도입
#define TYPELIST_1(T1)       Typelist<T1, NullType>
#define TYPELIST_2(T1, T2)   Typelist<T1, Typelist<T2, NullType>>
#define TYPELIST_3(T1, T2, T3)   Typelist<T1, Typelist<T2, Typelist<T3, NullType>>>
#define TYPELIST_4(T1, T2, T3, T4)   Typelist<T1, Typelist<T2, Typelist<T3, Typelist<T4, NullType>>>>


int main()
{
	Typelist<int, NullType> t1;
	Typelist<int, Typelist<double, NullType>> t2;
	//Typelist<int, Typelist<double, Typelist<char, NullType>>> t3;

	TYPELIST_1(int) t4; // 
	TYPELIST_4(int, double, char, short) t4; // 
}
```

- 활용, 가변 인자 템플릿 없이 튜플에 여러 타입을 전달 할 수 있음

```cpp
#include <iostream>
using namespace std;

template<typename T, typename U> struct Typelist
{
	typedef T Head;
	typedef U Tail;
};
struct NullType {};

#define TYPELIST_1(T1)				Typelist<T1, NullType>
#define TYPELIST_2(T1, T2)			Typelist<T1, Typelist<T2, NullType>>
#define TYPELIST_3(T1, T2, T3)		Typelist<T1, Typelist<T2, Typelist<T3, NullType>>>
#define TYPELIST_4(T1, T2, T3, T4)	Typelist<T1, Typelist<T2, Typelist<T3, Typelist<T4, NullType>>>>

//-------------------------------------------
template<typename T> class xtuple {};

int main()
{
	//xtuple<int> t1;

	xtuple< TYPELIST_3(int, double, char) > t1;

}
```

- typelist 요소의 갯수 구하기

```cpp
#include <iostream>
using namespace std;

template<typename T, typename U> struct Typelist
{
	typedef T Head;
	typedef U Tail;
};
struct NullType {};

#define TYPELIST_1(T1)				Typelist<T1, NullType>
#define TYPELIST_2(T1, T2)			Typelist<T1, Typelist<T2, NullType>>
#define TYPELIST_3(T1, T2, T3)		Typelist<T1, Typelist<T2, Typelist<T3, NullType>>>
#define TYPELIST_4(T1, T2, T3, T4)	Typelist<T1, Typelist<T2, Typelist<T3, Typelist<T4, NullType>>>>
//-----------------------------------------------------------------------------------------------------
// Typelist의 요소 갯수 구하기.

// 1. 사용하는 모습을 보고 primary template 작성.
template<typename T> struct Length;
//{
//};

// 2. 갯수를 구할수 있도록 부분 특수화
template<typename T, typename U> struct Length<Typelist<T, U>>
{
	enum { value = Length<U>::value + 1 };
};

// 3. 재귀를 종료 하기 위한 전문화(특수화)
template<> struct Length<NullType>
{
	enum { value = 0 };
};


template<typename T> void test()
{
	cout << Length<T>::value << endl; // 4
}

int main()
{
	test< TYPELIST_4(int, char, short, double) >();
}
```

- typelist의 at 구현 (n번째 요소의 타입)

```cpp
#include <iostream>
using namespace std;

template<typename T, typename U> struct Typelist
{
	typedef T Head;
	typedef U Tail;
};
struct NullType {};

#define TYPELIST_1(T1)				Typelist<T1, NullType>
#define TYPELIST_2(T1, T2)			Typelist<T1, Typelist<T2, NullType>>
#define TYPELIST_3(T1, T2, T3)		Typelist<T1, Typelist<T2, Typelist<T3, NullType>>>
#define TYPELIST_4(T1, T2, T3, T4)	Typelist<T1, Typelist<T2, Typelist<T3, Typelist<T4, NullType>>>>
//-----------------------------------------------------------------------------------------------------
// Typelist의 N 번째 요소의 타입 구하기
// 1. 사용하는 코드를 보고 primary template 작성.
// T : Typelist
template<typename T, int N> struct TypeAt;


// 2. 원하는 타입을 구할수 있도록 부분특수화
//  T : Typelist의 요소 타입
/*
template<typename T, typename U, int N> struct TypeAt<Typelist<T, U>, N>
{
	typedef ? type;
};
*/
// N == 0 일때.
template<typename T, typename U> struct TypeAt<Typelist<T, U>, 0>
{
	typedef T type;
};

// N != 0 일때.
template<typename T, typename U, int N> struct TypeAt<Typelist<T, U>, N>
{
	typedef  typename  TypeAt<U, N-1>::type   type;
};

template<typename T> void test()
{
	typename TypeAt<T, 3>::type n;  // char

	cout << typeid(n).name() << endl;

}

int main()
{
	test<TYPELIST_4(int, char, double, long)>();
}
```

- typelist에 type add하기

```cpp
#include <iostream>
using namespace std;

template<typename T, typename U> struct Typelist
{
	typedef T Head;
	typedef U Tail;
};
struct NullType {};

#define TYPELIST_1(T1)				Typelist<T1, NullType>
#define TYPELIST_2(T1, T2)			Typelist<T1, Typelist<T2, NullType>>
#define TYPELIST_3(T1, T2, T3)		Typelist<T1, Typelist<T2, Typelist<T3, NullType>>>
#define TYPELIST_4(T1, T2, T3, T4)	Typelist<T1, Typelist<T2, Typelist<T3, Typelist<T4, NullType>>>>
//-------------------------------------------------------------------------------------------
// Typelist 끝에 타입 추가하기.

template<typename TL, typename T> struct Append;


//     TL         T
// 1. NullType, NullType   => NullType
template<> struct Append<NullType, NullType>
{
	typedef NullType type;
};

// 2. NullType, 임의의타입   => Typelist<임의의타입, NullType>
template<typename T> struct Append<NullType, T>
{
	typedef Typelist<T, NullType> type;
};

// 3. NullType, Typelist<Head, Tail>  => Typelist<Head, Tail>
template<typename Head, typename Tail> struct Append<NullType, Typelist<Head, Tail> >
{
	typedef Typelist<Head, Tail> type;
};


// 4. Typelist<Head, Tail>, NullType  => Typelist<Head, Tail>
//    이번 단계의 코드는 없어도 됩니다. 5단계의 코드만 있으면 됩니다.
template<typename Head, typename Tail> struct Append<Typelist<Head, Tail>, NullType >
{
	typedef Typelist<Head, Tail> type;
};


// 5. Typelist<Head, Tail>, T =>  Typelist<Head, Append<Tail, T>::type> 
template<typename Head, typename Tail, typename T> struct Append<Typelist<Head, Tail>, T >
{
	typedef Typelist<Head, typename Append<Tail, T>::type> type;
};

template<typename T> void test()
{
	typename Append<T, int>::type t1;

	cout << typeid(t1).name() << endl;  // int, char, double, int, NullType
}

int main()
{
	test<TYPELIST_3(int, char, double)>();
}
```

- typelist 활용, GenScatterHierachy 구현 해보기

```cpp
#include <iostream>
using namespace std;

template<typename T, typename U> struct Typelist
{
	typedef T Head;
	typedef U Tail;
};
struct NullType {};

#define TYPELIST_1(T1)				Typelist<T1, NullType>
#define TYPELIST_2(T1, T2)			Typelist<T1, Typelist<T2, NullType>>
#define TYPELIST_3(T1, T2, T3)		Typelist<T1, Typelist<T2, Typelist<T3, NullType>>>
#define TYPELIST_4(T1, T2, T3, T4)	Typelist<T1, Typelist<T2, Typelist<T3, Typelist<T4, NullType>>>>

//-------------------------------------------------------------------------------------------
// Typelist 활용 

// Holder : 임의 타입의 data 하나 보관..
template<typename T> struct Holder
{
	T value;
};

// loki 라이브러리의 GenScatterHierachy  => MakeCode

template<typename T, template<typename> class Unit> 
class MakeCode : public Unit<T> 
{
};

template<template<typename> class Unit>
class MakeCode<NullType, Unit>
{
};

int main()
{
	MakeCode<int, Holder> mc1; // 기반 클래스 Holder<int> 이므로
	MakeCode<double, Holder>  mc2; // Holder<doulbe>
	MakeCode<NullType, Holder> mc3; // empty
}
```

  

  

[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)