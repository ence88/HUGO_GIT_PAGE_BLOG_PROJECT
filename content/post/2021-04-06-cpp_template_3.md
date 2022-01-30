---
title: "C++ Template Programming - Template 기본 문법[3]"
date: 2021-04-06T08:00:00+09:00
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

이번 항목에서는 템플릿의 기본 문법에 대해서 살펴 보겠습니다.
<!--more-->

  

### Class template

- 클래스 템플릿의 디폴트 값 표기
  - T a = T(); // C++98/03
  - T a = {}; // C++11

```cpp
#include <iostream>
using namespace std;

template<typename T> class complex
{
	T re;
	T im;
public:
	complex(T r = {}, T i = {}) : re(r), im(i) {}
    
    // 클래스 템플릿의 멤버함수 템플릿
    template<typename U> T func(const U& c);
};

template<typename T> template<typename U>
//template<typename T, typename T> 이렇게 두개 붙혀서 쓰면 오류
T Complex<T>::func(const U& c)
{
}

int main()
{
	complex<int> c1(3, 5);
}
```

{{< adsense >}}

### Generic copy constructor

- 복사 생성자를 따로 구현 하지 않을 경우, 컴파일러에서 생성해주는데 다른 타입의 템플릿 클래스들을 대입 할 경우 오류가 발생함
- 일반화된 복사 생성자를 구현 할 경우 다른 클래스 템플릿 타입간 대입 가능
- Shared_ptr 등 에서 이러한 기법을 사용함

```cpp
#include <iostream>
using namespace std;

template<typename T> class complex
{
	T re;
	T im;
public:
	complex(T a = T(), T b = T()) : re(a), im(b) {}
	
	// 복사 생성자 모양 1.
	//complex(const complex<T>&);		// complex<double> c3 = c1; 일때 c1은 반드시 complex<double> 이어야 한다.

	// 복사 생성자 모양 2.
	//complex(const complex<int>&);		// complex<double> c3 = c1; 일때 c1은 반드시 complex<int> 이어야 한다.


	// 복사 생성자 모양 3. 일반화된 복사 생성자
	// "U가 T로 복사 가능하다면 complex<U> 는 complex<T> 로 복사 가능해야 한다."
	template<typename U> complex(const complex<U>&);		// complex<double> c3 = c1; 일때 c1은 complex<U> 이므로, 임의의 타입의 complex 이다.

	template<typename> friend class complex;
};

template<typename T> template<typename U>
complex<T>::complex(const complex<U>& c) : re(c.re), im(c.im)
{
}

int main()
{
	complex<int> c1(1, 2); // ok
	complex<int> c2 = c1;  // ok. 복사 생성자
	complex<double> c3 = c1; // ok but, 복사 생성자를 생성하지 않을 경우 Error
}
```

  

### Template과 friend 함수

- 같은 이름이 있을 때 함수 템플릿 보다는 일반 함수가 우선해서 선택됩니다.

```cpp
#include <iostream>
using namespace std;

template<typename T> 
void foo(T a) 
{
	cout << "T" << endl;
}

void foo(int a); // { cout << "int" << endl; }

int main()
{
	foo(3); // link error.
}
```

- 아래 코드는 오류가 발생함

```cpp
#include <iostream>
using namespace std;

template<typename T> class Point
{
	T x, y;
public:
	Point()         : x(0), y(0) {}
	Point(T a, T b) : x(a), y(b) {}

    // 아래 표현은 템플릿이 아님
	friend ostream& operator <<(ostream& os, const Point<T>& p);
};

template<typename T>
ostream& operator <<(ostream& os, const Point<T>& p)
{
	return os << p.x << ", " << p.y;
}

int main()
{
	Point<int> p(1, 2);
	cout << p << endl;
}
```

- 위 코드 해결
  - friend 구현을 템플릿으로 구현 -> N : N 관계가 형성되나 많은 내부 구현 코드가 발생
  - friend 함수 구현을 클래스 내부에 구현 1:1 -> 더 나은 방법

```cpp
#include <iostream>
using namespace std;
// 해결책 1.
// 클래스와 friend 함수
// 1 : 1, 
// 1 : N, 
// N : 1, 
// N : N   =>
template<typename T> class Point
{
	T x, y;
public:
	Point() : x(0), y(0) {}
	Point(T a, T b) : x(a), y(b) {}
	
	// 함수 템플릿이 아님..
	//friend ostream& operator <<(ostream& os, const Point<T>& p);

	// 함수 템플릿.
	template<typename U>
	friend ostream& operator <<(ostream& os, const Point<U>& p);
    
   	// 다른 방법 -> friend 함수 구현을 클래스 내부에 구현
	//friend ostream& operator <<(ostream& os, const Point<T>& p)
	//{
	//	return os << p.x << ", " << p.y;
	//}
};

// 함수 템플릿
template<typename T>
ostream& operator <<(ostream& os, const Point<T>& p)
{
	return os << p.x << ", " << p.y;
}

int main()
{
	Point<int> p(1, 2);
	cout << p << endl;
}
```



### Typename

- 클래스 이름:: 으로 접근 가능한 요소들
  - 값 : enum 상수, static 멤버 변수
  - 타입 : typedef, using
- 템플릿 내부에서 T::이름 으로 명시 할 때 컴파일러는 값으로 해석, 타입 일 때 명시가 필요함 -> typename

```cpp
class A
{
public:
	//......
	// static int DWORD;
	 typedef int DWORD;
};
int p = 0;

template<typename T> void foo(T a)  // T 는 A
{
	// 아래 한줄을 해석해 보세요
	T::DWORD * p; // 1. DWORD는 T안에 있는 static 멤버 변수이다. 그런데, 곱하기 p를 하고 있다
				  // 2. DWORD는 T안에 있는 내포 타입이다. 포인터 변수 p를 선언하고 있다.

	// T안에 내포된 타입을 사용하려면 typename이 필요하다.
	typename T::DWORD * p1;
}

int main()
{
	A a;
	foo(a);
}
```

  

### Value_type

- 모든 컨테이너는 자신이 저장하는 타입을 value_type으로 갖고 있음

```cpp
// 모든 컨테이너를 처리하는 함수
template<typename T> void print_first_element(T& c)
{
	// T : list<double>
	// 우리가 필요한것은 double 이 필요하다.
	// ? n = c.front();

	// 모든 컨테이너는 자신이 저장하는 타입을 value_type으로 알려준다.
	typename T::value_type n = c.front();

	// C++11 auto사용가능.
	//auto n = c.front();

	cout << n << endl;
}


int main()
{
	//vector<int>    v = { 1,2,3,4,5 };
	//vector<double> v = { 1,2,3,4,5 };
	list<double> v = { 1,2,3,4,5 };

	print_first_element(v);
}
```

- std vector의 생성자가 다양 할 수 있는 이유 -> value_type

```cpp
#include <iostream>
#include <list>
using namespace std;

// C++17. class template type deduction
template<typename T> class Vector
{
	T* buff;
	int sz;
public:
	Vector() {}
	Vector(int s, T v) {}
	template<typename C> Vector(const C& c) {};
};
// class template type deduction guide
Vector()->Vector<int>;
template<typename C> Vector(const C& c)->Vector< ? >;

int main()
{
	Vector<int> v1(10, 3);
	Vector      v2(10, 3); // C++14 error. C++17 ok
						   
	Vector      v3;

	list<int> s = { 1,2,3 };
}
```

  

### Template 키워드 관련 문법 실수

```cpp
class Test
{
public:
	template<typename T> static void f() {}
	template<typename T> class Complex {};
};

template<typename T> typename T::template Complex<int> foo(T a)  // T 는 Test
{
	Test::f<int>(); // ok

	T::f<int>();    // error. < 를 해석할수 없다.
	T::template f<int>();    // ok

	Test::Complex<int> c1; // ok.. Test의 선언을 조사할수 있다.
	T::Complex<int> c2;    // error.
	T::template Complex<int> c3;    // error. 표준 문법이 아니지만, MS 컴파일러에서는 허용됨
	typename T::template Complex<int> c4;    // ok, 정확한 문법ㅉ

	return c4;
}

int main()
{
	Test t;
	foo(t);
}
```

  

### Template parameter

- 템플릿의 인자로 전달 가능한 것은 3가지가 있습니다.
  - type 인자
  - 값(none type) 인자
  - template 인자
- 값(none type) 인자 예제

```cpp
// 1. 정수형 상수(실수 안됨.)
template<int N> class Test1 {};

// 2. enum 상수
enum Color { red = 1, green = 2};
template<Color> class Test2 {};

// 3. 포인터 : 지역변수 주소안됨, 전역 변수주소는 가능
//			   no linkage 를 가지는 변수 주소는 안됨
template<int*> class Test3 {};

int x = 0;

// 4. 함수 포인터
template<int(*)(void)> class Test4 {};

int main()
{
	int n = 10;

	Test1<10> t1; // ok
	//Test1<n>  t2; // error. 변수 안됨.
	Test2<red> t3; // ok

	//Test3<&n> t4; // error;
	Test3<&x> t5; // ok

	Test4<&main> t6;// ok
}
```

- C++17 auto

```cpp
#include <iostream>
#include <typeinfo>
using namespace std;

// non-type(값) parameter
// 정수형 상수, enum 상수, 포인터, 함수 포인터, 멤버 함수 포인터.
// c++17 : auto

template<auto N> struct Test
{
	Test()
	{
		cout << typeid(N).name() << endl;
	}
};

int x = 0;

int main()
{
	Test<10> t1; // N : int의 값
	Test<&x> t2; // N : int* 의 값.
	Test<&main> t3;  
}
```

- template 인자 예제

```cpp
template<typename T> class list {};

template<typename T, template<typename> class C> class stack
{
	//C c; // error, list c
	C<T> c; // ok.. list<int> c
};

int main()
{
	list      s1; // error. list 는 타입은 아니고 템플릿
	list<int> s2; // ok.    list<int>는 타입.

	stack<int, list > s3; // ok

}
```

- defalue parameter

```cpp
template<typename T = int, int N = 10> struct Stack
{
};

int main()
{
	Stack<int, 10> s1;

	Stack<int> s2; 

	Stack<> s3; // 모든 인자를 디폴트 값 사용.
}
```

- 가변인자 template

```cpp
// C++11 : 가변인자 템플릿
template<typename ... T> class Test {};
template<int ... N> class Test {};
```





[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)

