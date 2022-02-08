---
title: "C++ 고급 문법 테크닉 - C++ 11/14 기본 문법[3]"
date: 2021-04-20T09:50:00+09:00
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

C++11/14 에서 추가된 다양한 문법을 빠르게 소개합니다.

<!--more-->

  

  ### Using

- c++11부터 추가됨, C의 typedef와 같은 역할을 함
- using은 template class에도 별칭을 붙일 수 있음 (typedef는 only type 대상)

```cpp
template<typename T> struct Point
{
	T x, y;
};

typedef Point Pixel; // ??? error

template<typename T> 
using Pixel = Point<T>;

//typedef int DWORD;
//typedef void(*FP)(int);

using DWORD = int;
using FP = void(*)(int);

int main()
{
	DWORD n; // int
	FP    p; // void(*p)(int)

	Point<int> p1;
	Pixel<int> p2; // Point<int> p2
}
```

- 활용 예제

  ```cpp
  #include <type_traits>
  #include <set>
  using namespace std;
  
  // 활용 1. type alias
  using DWORD = int;
  
  // 활용 2. template alias
  template<typename T, typename U>
  using Duo = pair<T, U>;
  
  Duo<int, double> d1; // pair<int, double>
  
  template<typename T> 
  using Ptr = T*;
  
  Ptr<int> p2; // int*
  
  // 활용 3. 템플릿의 인자를 고정해서 사용
  template<typename T>
  using Point = pair<T, T>;
  
  Point<int> p;   // pair<int, int>
  
  // 활용 4. 복잡한 표현식을 축약해서 사용
  template<typename T>
  using remove_pointer_t =
  			typename remove_pointer<T>::type;
  
  template<typename T> void foo(T a)
  {
  	// T에서 포인터를 제거한 타입을 구하고 싶다.
  	//typename remove_pointer<T>::type t; // C++11
  
  	remove_pointer_t<T> t; // C++14 style
  }
  ```

    

{{< adsense >}}

### Static_assert

- assert : 실행 시간에 표현식 조사
- static_assert : 컴파일 시간에 표현식 조사 (C++17부터 전달 메세지 생략 가능)

```cpp
#include <iostream>
#include <cassert>
using namespace std;

void foo(int age)
{
	assert(age > 0);
	static_assert(age > 0, "error");
	// ......
}

int main()
{
	static_assert(sizeof(void*) >= 8,"error. 32bit");
	static_assert(sizeof(void*) >= 16); // C++17

	foo(-10);
}
```

- 활용 예제

```cpp
#include <iostream>
#include <mutex>
using namespace std;

//#pragma pack(1) // 주석을 해제 할 경우 컴파일러의 패딩을 막아줌
struct PACKET
{
	char cmd;
	int  data;
};
// 설계된 패킷에 불필요한 패딩이 발생 할 경우 컴파일 시간에 오류 발생 시키기
static_assert(
	sizeof(PACKET) == sizeof(char) + sizeof(int),
	"error, unexpected padding !");


template<typename T> void Swap(T& a, T& b)
{
	// T가 가져야하는 조건을 조사 (T가 복사 생성 불가 할 경우 컴파일 오류 발생 시키기)
	static_assert(is_copy_constructible<T>::value,
		"error. T is not copyable");

	T tmp = a;
	a = b;
	b = tmp;
}

int main()
{
	mutex m1;
	mutex m2;
	Swap(m1, m2);
}
```

  

### Begin / End

배열과 STL 컨테이너 모두를 순회(iteration) 할 수 있는 함수 작성 가능
대부분의 컴파일러가 <iterator> 헤더를 포함하지 않더라도 사용 할 수 있도록 지원하지만, 포함시켜 사용 하는 것이 표준

```cpp
#include <iostream>
#include <list>
#include <vector>
#include <iterator>
using namespace std;

// 컨테이너의 모든 요소를 출력하는 함수.
template<typename T> void show(T& c)
{
//  C++98/03 스타일
//	auto p1 = c.begin();
//	auto p2 = c.end();

	auto p1 = begin(c);
	auto p2 = end(c);

	while (p1 != p2)
	{
		cout << *p1 << endl;
		++p1;
	}
}

int main()
{
	list<int> c = { 1,2,3 };
	//vector<int> c = { 1,2,3 };
	
	show(c);

	int x[3] = { 1,2, 3 };

	show(x);
}
```

- begin, end의 원리 (template)

```cpp
#include <iostream>
#include <list>
#include <vector>
using namespace std;

// container version.
template<typename C> 
constexpr auto begin(C& c) -> decltype(c.begin())
{
	return c.begin();
}
template<typename C>
constexpr auto end(C& c) -> decltype(c.end())
{
	return c.end();
}

// arr version
template<typename T, std::size_t N>
constexpr T* begin(T(&arr)[N])
{
	return arr;
}
template<typename T, std::size_t N>
constexpr T* end(T(&arr)[N])
{
	return arr + N;
}

int main()
{
	list<int> s = { 1,2,3 };
	int x[3]    = { 1,2,3 };

	auto p1 = begin(s);
	auto p2 = begin(x);
}
```

  

### Ranged-for

- c#, java의 foreach
- C++11에서 도입
- STL 컨테이너, raw 배열에 있는 모든 요소에 접근하기 위한 편리한 방법 제공
- 컴파일러가 ranged-for 표현식을 for문 + begin, end를 통해 얻어진 반복자를 통해 요소에 접근하는 구문으로 변경
- begin과 end를 제공하는 모든 객체에 사용 가능

```cpp
#include <iostream>
#include <list>
using namespace std;

struct Point3D
{
	int x = 1;
	int y = 2;
	int z = 3;

};
int* begin(Point3D& p3) { return &(p3.x); }
int* end(Point3D& p3) { return &(p3.z)+1; }

int main()
{
	Point3D p3;

	for (auto& n : p3)  // begin(p3)
		cout << n << endl;
}
```

 

### Delete / Default Function

- delete function : 암시적 형변환으로 인한 함수 호출시 오류 처리 할 때 처리 방법

```cpp
template<typename T> void goo(T a)
{
}

void goo(double) = delete;

class Mutex
{
public:

	Mutex(const Mutex&) = delete;
	void operator=(const Mutex&) = delete;

//private:
//	Mutex(const Mutex&);
};

int main()
{
	goo(3.4); // Error

	Mutex m1;
	Mutex m2 = m1; // mutex 복사 생성시 error
}
```

- default function

```cpp
#include <iostream>
#include <type_traits>
using namespace std;

struct Point
{
	int x, y;

	Point() {} // 사용자가 생성자 제공. trivial 하지 않음

	//Point() = default; // 컴파일러가 제공. trivial 함

	Point(const Point& ) = default; // 복사 생성자 default 컴파일로 구현 요청
	Point(int a, int b) : x(a), y(b) {}
};

int main()
{
	Point p1{};  

	cout << p1.x << endl; // default 생성자는 멤버 변수를 초기화 해줌 - 0
						  // 사용자 초기화에서 아무 일도 하지 않으면 멤버들은 garbage

	cout << is_trivially_constructible<Point>::value
		 << endl;
}
```

  

### noexcept

예외가 없는 function임을 컴파일러에 알림

1. 예외가 없음으로 알리면 보다 최적화된 코드가 생성됨
2. 예외가 있는지 없는지 코드레벨에서 조사 할 수 있음

```cpp
#include <iostream>
using namespace std;
/*
// c++98
int foo()  // 예외가 있을수도 있고, 없을수도 있다.
int foo() throw(int) // 예외가 있다는 의미.
int foo() throw()    // 예외가 없다는 의미.
{
	throw 1;
	return 0;
}
*/
// C++11
//void goo() noexcept(true) // 예외가 없다.
void goo() noexcept // 위와 동일.
{
	throw 1;
}

void goo() 
{
	throw 1;
}

int main()
{
	goo();

	try
	{
		goo();
	}
	catch (...)
	{
		cout << "exception..." << endl;
	}
}
```

- noexcept 여부 조사 방법

```cpp
#include <iostream>
using namespace std;

void algo1()
{
	// 빠르지만 예외 가능성이 있다.
}

void algo2() noexcept  // 지정자
{
	// 느리지만 예외가 나오지 않는다.
}

class Test
{
public:
	Test() noexcept {}
};

int main()
{
	bool b1 = noexcept(algo1()); // 0. 연산자
	bool b2 = noexcept(algo2()); // 1

	cout << b1 << ", " << b2 << endl;

	bool b3 = is_nothrow_constructible<Test>::value; // 생성자의 noexcept 여부
	cout << b3 << endl;

}
```

  

### Scoped enum

enum 상수의 단점을 개선한 새로운 enum 상수 문법

- 기존 enum 상수의 단점
  - 타입의 이름 없이 사용 가능(none namespace)
  - 요소의 타입을 지정 할 수 없음

```cpp
// C++98/03
//enum Color { red = 1, green = 2 };

// C++11
enum class Color : char { red = 1, green = 2 };

int main()
{
//	int n1 = Color::red; // error

	Color n1 = Color::red; // ok
	int   n2 = static_cast<int>(Color::red); // ok

	int n3 = red; // error

//	int red = 0;
//	int n3 = red;

	cout << typeid(underlying_type_t<Color>).name() << endl; // enum 요소 타입

}
```

  

### User define literal

코드에서 literal 사용시 int a = 10k (10000) 이런식으로 명시 하는 방법

```cpp
#include <iostream>
using namespace std;

int operator""_k(unsigned long long v)
{
	return 1000 * v;
}

int main()
{
	int n1 = 10; // meter
	int n2 = 10_k;// 10000  operator""k(10)

	cout << n2 << endl; /// 10000
}
```

- 사용 예제

```cpp
#include <iostream>
using namespace std;

class second
{
	int value;
public:
	second(long long s) : value(s) {}
};

class minute
{
	int value;
public:
	minute(long long s) : value(s) {}
};

second operator""_s(unsigned long long v)
{
	return v;
}

minute operator""_m(unsigned long long v)
{
	return v;
}

int main()
{
	second n1 = 10_s; 
	minute n2 = 10_m;
}
```

- 표준 STL iterals 사용 예제

```cpp
#include <iostream>
#include <string>
#include <chrono>
using namespace std;
using namespace std::chrono;
using namespace std::literals;

void foo(string s)      { cout << "string" << endl; }
void foo(const char* s) { cout << "char*" << endl; }

int main()
{
	foo("hello"); // char*
	foo("hello"s); // string operator""s("hello")

	seconds s1 = 10s;
	minutes m1 = 10min;

	seconds s2 = 10min;
	cout << s2.count() << endl; // 600
}
```

​    

### Delegate Constructor

위임 생성자 : 생성자 안에서 다른 생성자를 호출

```cpp
#include <iostream>
using namespace std;

struct Point
{
	int x, y;
	
	//Point()				: x(0), y(0) {}

	Point() : Point(0,0) // 위임 생성자
	{
		// 다른 생성자를 호출할수 없을까 ?
		//Point(0, 0);	// 생성자 호출이 아닌, 임시객체를 생성하는 표현.

		//new(this) Point(0, 0); // 예전 방법으로 다른 생성자를 호출하는 방법

	}
	Point(int a, int b) : x(a), y(b) {}
};

int main()
{
	Point p;

	cout << p.x << endl;
	cout << p.y << endl;
}
```

  

### Inherit Constructor

- 살펴보기 : 상속 관계에서 자식 클래스의 함수 이름과 부모 클래스의 이름이 같을 경우 사용하려면 using 키워드가 필요함

```cpp
class Base
{
public:
	void foo(int a) {}
};

class Derived : public Base
{
public:
	using Base::foo;

	void foo() { }
};

int main()
{
	Derived d;
	d.foo(10); // error, using 처리 필요
	d.foo();
}
```

- 부모의 생성자를 이용 하고 싶을 경우 생성자를 상속받아 사용 가능(C++11 이후)

```cpp
#include <iostream>
#include <string>
using namespace std;

class Base
{
	string name;
public:
	Base(string s) : name(s) {}
};

class Derived : public Base
{
public:
	using Base::Base; // 생성자 상속

	//Derived(string s) : Base(s) {} // 이전 방식
};

int main()
{
	Derived d("aa");
}
```

  

### Override

- override 키워드 : 자식 클래스에서 함수 재정의시 실수를 방지하는 방법

```cpp
class Base
{
public:
	virtual void f1(int) {}
	virtual void f2() const {}
	virtual void f3() {}
			void f4() {}
};
class Derived : public Base
{
public:
	virtual void f1(int) override {}
	virtual void f2() const override {}
	virtual void f3() override {}
	//void f4() override {}
};

int main()
{

}
```

- final 키워드 :  이후 자식 클래스의 함수 재정의 또는 신규 상속을 막음

```cpp
#include <type_traits>
#include <iostream>
using namespace std;
class A
{
public:
	virtual void f1() {}
};

class B final : public A
{
public:
	virtual void f1() override final{}
};

/*
class C : public B
{
public:
	//virtual void f1() override  {}
};
*/
int main()
{
	bool b = is_final<B>::value;
	cout << b << endl;
}
```



​    

[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)