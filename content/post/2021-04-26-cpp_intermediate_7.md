---
title: "C++ 고급 문법/테크닉 - rvalue와 lvalue, move semantics[7]"
date: 2021-04-26T09:30:00+09:00
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


임시 객체,  rvalue, lvalue, 레퍼런스 붕괴 규칙, 우측값 참조, move semantics에 대해 알아 보겠습니다.

<!--more-->

   

### 임시객체의 개념과 수명

- 사용자가 만들지 않아도, 컴파일러가 계산 중간시 임시 변수, 임시 객체를 만들어 사용함

```cpp
int main()
{
	int a = 1, b = 2, c = 3;

	int sum = a + b + c;	// int temp = a + b;
							// int sum  = temp + c;
}
```

- 사용자가 c++ 에서 지원하는 표현법을 통해 "임시 객체" 생성 가능
  - 임시 객체는 이름이 없음

```cpp
#include <iostream>

// 핵심 1. 임시객체를 생성하는 방법 - "클래스이름(생성자인자)"
//      2. 임시객체의 수명 - 문장의 끝.

struct Point
{
	int x, y;
	Point(int a = 0, int b = 0) { std::cout << "Point()"  << std::endl; }
	~Point()					{ std::cout << "~Point()" << std::endl; }
};

int main()
{
	Point p1(1, 2);	//  named object.
	Point(1, 2);	// unamed object. temporary. 임시 객체, 이 문장의 끝에서 파괴됨

	Point(1, 2), std::cout << "X" << std::endl;

	std::cout << "----------" << std::endl;
}
```

  

### 임시객체와 참조

- 임시객체의 특성

```cpp
#include <iostream>
using namespace std;

struct Point
{
	int x, y;
	Point(int a = 0, int b = 0) { cout << "Point()" << endl; }
	~Point()					{ cout << "~Point()" << endl; }
};

int main()
{
	Point p1;	// 임시객체 아님. 이름있는 객체

	// 핵심 1. 임시객체는 등호(=)의 왼쪽에(lvalue) 올 수 없다.
	p1.x = 10;		// ok
	//Point().x = 10;	// error

	// 핵심 2. 임시객체는 주소를 구할수 없다.
	Point* pp1 = &p1;		// ok
	Point* pp2 = &Point();	// error

	// 핵심 3. non-const reference 는 임시객체를 참조할 수 없다.
	//         const     reference 는 임시객체를 참조할 수 있다.
	Point& r1 = p1;			// ok
	Point& r2 = Point();	// error

	const Point& r3 = p1;		// ok
	const Point& r4 = Point();	// ok, 임시 객체의 수명이 r4의 수명으로 연장됨

	r4.x = 10; // error

	// C++11 : rvalue reference는 상수성 없이 rvalue를 가리킬수있다.
	Point&& r5 = p1; // error, rvalue reference 는 rvalue만 가리킬수 있다.
    r5.x = 10; // PK
	Point&& r6 = Point();
}
```

  

### 임시객체와 함수

- 함수 호출을 위한 파라메터 생성시, 임시 객체를 전달 하면 함수가 종료 될 때 인자가 파괴됨

```cpp
#include <iostream>
using namespace std;

struct Point
{
	int x, y;
	Point(int a = 0, int b = 0) { cout << "Point()" << endl; }
	~Point()					{ cout << "~Point()" << endl; }
};

// 임시객체와 함수 인자
void foo(const Point& p) 
{
}

int main()
{
	Point p(1,1);
	foo(p); // 일반 변수를 전달

	foo(Point(1, 1)); // 임시 객체 전달

	// STL에서 임시객체를 전달하는 예
	sort(x, x + 10, less<int>()); // less<int>() 임시객체

	cout << "end" << endl;
}
```

- 함수의 리턴값

```cpp
#include <iostream>
using namespace std;

struct Point
{
	int x, y;
	Point(int a = 0, int b = 0) { cout << "Point()" << endl; }
	~Point() { cout << "~Point()" << endl; }
};

Point foo()
{
    // NRVO : 최근 컴파일러들은 이렇게 리턴해도 RVO로 처리함(최적화 옵션 적용시)
	Point pt(1, 1); // 2. 생성자 호출
	return pt;		// return Point(pt) 임시객체 생성 호출, pt는 파괴됨
					// 3. 복사 생성자 호출

	// 임시객체를 사용한 리턴, 불필요한 생성, 복사를 발생시키지 않음
	// RVO ( Return Value Optimization )
	return Point(1, 1);
}					
int main()
{
	Point ret(0, 0); // 1. 생성자 호출
	ret = foo();
	cout << endl;
}
```

  

### 참조 리턴 vs 값 리턴

```cpp
#include <iostream>
using namespace std;

struct Point
{
	int x, y;
	Point(int a = 0, int b = 0) { cout << "Point()" << endl; }
	~Point() { cout << "~Point()" << endl; }
};

Point p; // 전역변수

Point foo() // 값리턴 : 임시객체가 리턴된다.
{
	return p;
}

Point& goo() // 참조리턴 : 임시객체가 생성되지 않는다.
{
	return p;
}
int main()
{
	//Point ret = foo();

	foo().x = 10; // error
	goo().x = 20; // ok
	cout << p.x << endl;
    
    // 함수 호출 표현식이 왼쪽에 오는 경우는 생각보다 많다.
    vector<int> v(10, 2);
    v[0] = 10; // v.operator[](0) = 10;
}
```

  

### 임시객체가 생성되는 다양한 경우

```cpp
#include <iostream>
using namespace std;

struct Base
{
	int v = 10;
};

struct Derived : public Base
{
	int v = 20;
};

/* 재정의 불가능하지만, ++은 이런식으로 구현됨
int operator++(int& n, int ) // 후위형 -> 임시객체 리턴
{
	int temp = n;
	n = n + 1;
	return temp;
}

int& operator++(int& n) // 전위형 -> 참조 리턴
{
	n = n + 1;
	return n;
}
*/

int main()
{
	Derived d;
	cout << d.v << endl; // 20
	cout << d.Base::v << endl; // 10

	// 값캐스팅 : 임시 객체 생성됨
	cout << (static_cast<Base>(d)).v << endl; // 10, base 임시 객체가 생성되고 내부 10 값이 복사됨
	cout << (static_cast<Base&>(d)).v << endl; // 10

	(static_cast<Base>(d)).v = 30; // error
	(static_cast<Base&>(d)).v = 30; // ok	
    
    int n = 3;
	n++; // operator++(n, int)
	++n; // operator++(n)

	++(++n);

	n++ = 10; // error
	++n = 10; // ok
}
```

   

### 임시객체와 멤버함수

```cpp
#include <iostream>
using namespace std;

class Test
{
public:
	int data;

	void foo() &  { cout << "foo &" << endl; } // lvalue 객체에 대해서만 호출 가능한 함수
	void foo() && { cout << "foo &&" << endl; } // rvalue 객체에 대해서만 호출 가능한 함수

	int& goo() & { return data; }
};

int main()
{
	Test t;
	t.foo();
	int& ret = t.goo();

	int& ret2 = Test().goo(); // error

	Test().foo();
}
```

​    

### Lvalue와 Rvalue

- lvalue
  1. 등호(=)의 왼쪽과 오른쪽에 모두 놓일 수 있음
  2. 이름을 갖음
  3. 문장을 벗어나서 사용 될 수 있음
  4. 주소 연산자로 주소를 구할수 있음
  5. 참조를 리턴하는 함수
- rvalue
  1. 등호(=)의 오른쪽에만 놓일 수 있음
  2. 이름이 없음
  3. 단일 문장에서만 사용됨
  4. 주소 연산자로 주소를 구할 수 없음
  5. 값을 리턴하는 함수, 임시객체, 정수/실수형 literal(값 자체)

```cpp
int x = 10;
int  f1() { return x; }
int& f2() { return x; }

int main()
{
	int v1 = 10, v2 = 10;
	v1 = 20; // v1 : lvalue  20 : rvalue
	20 = v1; // error
	v2 = v1; //

	int* p1 = &v1; // ok
	int* p2 = &10; // error.

	f1() = 10; // error
	f2() = 20; // ok.

	const int c = 10;
	c = 20; // c는 rvalue 일지 lvalue 일지?
			// c 는 수정 불가능한 lvalue

	// rvalue가 모두 상수인 것은 아니다.
	//Point().x = 10; // error
	//Point().set(10, 20); // ok
}
```



### 연산자와 Lvalue

```cpp
/* 표준에서 구현된 ++ 연산 참조 코드

int operator++(int& a, int)
{
	int temp = a;
	a = a + 1;
	return temp;
}
// 전위형 증가 연산자 - 참조리턴
int& operator++(int& a)
{
	a = a + 1;
	return a;
}
*/

int main()
{
	int n = 0;
	n = 10;

	n++ = 20; // operator++(n, int) error.
	++n = 20; // operator++(n).   ok

	//++(++n);

	int a = 10, int b = 0;

	a + b = 20; // error.

	int x[3] = { 1,2,3 };
	x[0] = 5; // x.operator[](0) = 5;  lvalue
}
```

- decltype에 변수 표현을 넣었을 때 판단 방법
  - 표현식이 등호의 왼쪽에 놓을 수 있는 케이스(lvalue)일 경우 &(참조) 타입으로 결정됨
  - auto일 경우 예전에 공부 했던 규칙 (참조성 제거) 등 고려 해야함

```cpp
int main()
{
	int n = 0;
	int* p = &n;

	decltype(n) n1; // int

	decltype(p) d1; // int*

	decltype(*p) d2; // int일지 int& ?  // *p = 20
					 // int&.   error

	int x[3] = { 1,2,3 };

	decltype(x[0]) d3; // int&. error
	auto a1 = x[0];    // int

	decltype(++n) d4; // int&
	decltype(n++) d5; // int
}
```



### Rvalue reference

1. 일반 참조(&) 타입은 lvalue만 참조 가능
2. const 참조(&) 타입은 lvalue와 rvalue 둘다 참조 가능
3. rvalue reference(&&)는 rvalue만 참조 가능
4. move와 perfect forwarding에서 활용됨

```cpp
int main()
{
	int n = 10;

	// 규칙 1. not const lvalue reference 는 lvalue 만 참조 가능
	int& r1 = n;	// ok
	int& r2 = 10;	// error

	// 규칙 2. const lvalue reference 는 lvalue 와 rvalue를 모두 참조 가능
	const int& r3 = n;	// ok
	const int& r4 = 10;	// ok   

    // 참조는 가능하지만 상수성 때문에 값 변경 불가
	const Point& r = Point(1, 1);
	r.x = 10; // 불가

	// 규칙 3. rvalue reference 는 rvalue 만 가리킬수 있다. C++11 문법.
	int&& r1 = n;	// error
	int&& r2 = 10;	// ok.
}
```

- rvalue reference(&&)와 함수 오버로딩 관련 예제

```cpp
#include <iostream>
using namespace std;

void foo(int& a)       { cout << "int&" << endl; }			// 1
void foo(const int& a) { cout << "const int&" << endl; }	// 2
void foo(int&& a)      { cout << "int&&" << endl; }			// 3

int main()
{
	int n = 10;

	foo(n);	// lvalue -> 1번, 1번이 없으면 2번 호출됨
	foo(10);// rvalue -> 3번, 3번이 없으면 2번 호출됨

	int& r1 = n;
	foo(r1);	// lvalue -> 1번, 없으면 2번

    // 아주 중요
	int&& r2 = 10;	// 10은 rvalue, 10을 가리키는 이름있는 
					//			    r2 참조변수 자체는는 항상 lvalue 이다.
	foo(r2);		// 1번. 

	foo(static_cast<int&&>(r2));  // 3번을 호출하려면 캐스팅이 필요함
    							  // 추후에 forwarding시 매우 중요한 개념
}
```



### reference collapse

- C++에서 참조는 &, && 이것만 허용되는데 이 이상으로 중첩 될 경우 붕괴가 일어남
- 템플릿이나 typedef, using 사용시 발생 가능
- 쉽게 판단하는 규칙으로는 작은 개수(&)로 and 연산 한다고 생각하면 편함
  - ex) &와 &&가 만나면 &가 남음, &&와 &&가 만나면 &&가 남음

```cpp
using LREF = int&;	// typedef int&  LREF;
using RREF = int&&; // typedef int&& RREF;

template<typename T> void foo(T& a) {}

int main()
{
	int n = 10;

	foo<int&>(n ); // foo( int& & a) => foo(int& a)

	LREF r1 = n;
	RREF r2 = 10;

	LREF&  r3 = n; // (int&) + & r3 -> int&
	RREF&  r4 = n; // (int&&) + & -> int&
	LREF&& r5 = n; // (int&) + && -> int&
	RREF&& r6 = 10; // (int&&) + && -> int&&
}
```

  

### forwarding reference

- 함수 인자 전달시 reference collapse 규칙을 고려해야 함

```cpp
void f1(int&  a) {} // lvalue 만 인자로 전달 가능. f1(n) : ok.     f1(10) : error
void f2(int&& a) {} // rvalue 만 인자로 전달 가능. f2(n) : error.  f2(10) : ok

// 모든 타입의 lvalue 만 전달 가능한 f3
template<typename T> void f3(T& a) {} // T : int&   T& : int& &

int main()
{
	int n = 10;

	// T의 타입을 사용자가 지정할 경우
	f3<int>(n);	// f3( int & a)  => lvalue 전달 가능.
	f3<int&>(n);	// f3( int& & a) => f3( int& a) => lvalue 전달 가능.
	f3<int&&>(n);	// f3( int&& & a)=> f3( int& a) => lvalue 전달 가능.

	// 사용자가 T 타입을 지정하지 않은 경우
	f3(10); // f3 구조상 rvalue를 받을 수 없기 때문에 error
	f3(n);  // T : int.  ok.
}
```

- T&& : forwarding reference, T가 lvalue 참조(&) 일 수도, rvalue 참조(&&) 일 수도 있음
  - 코딩시 레퍼런스 붕괴 규칙이 숙달 되야 빠르게 판단 가능

```cpp
// T&& : lvalue 와 rvalue를 모두 전달 가능.
//	    lvalue 전달하면 T는 lvalue reference 로 결정
//      rvalue 전달하면 T는 값 타입으로 결정..

template<typename T> void f4(T&& a) {}

int main()
{
	int n = 10;

	// 사용자가 T의 타입을 명시적으로 전달할때
	f4<int>(10);	// f4(int&& a)   => rvalue로 전달됨
	f4<int&>(n);	// f4(int& && a) => f4(int& a) => lvalue로 전달됨
	f4<int&&>(10); // f4(int&& && a)=> f4(int&& a) => rvalue로 전달됨

	// T의 타입을 명시적으로 전달하지 않을때
	f4(n);	// ok. 컴파일러가 T를 int& 로 결정됨
	f4(10);	// ok. 컴파일러가 T를 int  로 결정됨 f4(T&& ) => f4(int && ) 
}
```

- 포워딩 레퍼런스 정리

```cpp
void f1(int&  a) {} 
void f2(int&& a) {} 
template<typename T> void f3(T&  a) {} 
template<typename T> void f4(T&& a) {}

// f1 : int&  : int 형의 lvalue 전달 가능.
// f2 : int&& : int 형의 rvalue 전달 가능.
// f3 : T&    : 모든 타입의 lvalue 전달 가능.(함수 생성)

// f4 : T&&   : 모든 타입의 lvalue 와 rvalue 모두 전달 가능.(함수 생성)
//		   "universal reference"  => "forwarding reference"
//			lvalue 를 전달하면 foo(n)  => T : int&    T&& : int& && => int&
//          rvalue 를 전달하면 foo(10) => T : int     T&& : int&&    

```

- T&& 관련 햇갈릴 수 있는 부분 (멤버 함수에서 T&&를 사용시)

```cpp
template<typename T> void foo(T&& a) {}

template<typename T> class Test
{
public:
	void goo(T&& a) {} // forwarding reference가 아님

	template<typename U> void hoo(U&& a) {} // forwarding reference로 처리
};

int main()
{
	int n = 10;
	
	foo(n);	// ok
	foo(10);// ok

	Test<int> t1; // T가 int임 void goo(int&& a)
	t1.goo(n);	// error : 이미 객체 생성시 타입이 결정됨
	t1.goo(10); // ok

	Test<int&> t2; // T int& => void goo( int& && a) => void goo(int& )
	t2.goo(n); // ok
	t2.goo(10); // error
}
```

  

### 복사생성자의 모양

```cpp
class Point
{
	int x, y;
public:
	Point(int a = 0, int b = 0) : x(a), y(b) {}

    // 복사 생성자
	Point(const Point& p) // lvalue객체와 rvalue 객체를 모두 받을수
						  // 있다.
	{
		// 모든 멤버 복사.
	}
};

Point foo()
{
	Point ret(0, 0);
	return ret;
}

int main()
{
	Point p1(1, 1);	// 생성자 호출
	Point p2(p1);	// Point( Point )  복사 생성자.

	Point p3( foo() ); // 임시 객체는 rvalue이므로 복사 생성자의 모양이 const &
}
```

  

### move semantics

- 동적 할당된 메모리를 갖고 있는 객체를 깊은 복사시 크래시 발생 가능성이 생길 수 있음

```cpp

#include <iostream>
#include <cstring>
using namespace std;

class Cat
{
	char* name;
	int   age;
public:
	Cat(const char* n, int a) : age(a)
	{
		name = new char[strlen(n) + 1];
		strcpy(name, n);
	}
	~Cat() { delete[] name; }

	Cat(const Cat& c) : age(c.age)
	{
		name = new char[strlen(c.name) + 1];
		strcpy(name, c.name);
	}
};

int main()
{
	Cat c1("NABI", 2);
	Cat c2 = c1; // deep copy, 이후 소멸자에서 두번 메모리 해제 -> 크래시 발생
}
```

- 이동 생성자 예제(소유권 이전, 자원 전달, 최적화)

```cpp
#include <iostream>
#include <cstring>
using namespace std;

class Cat
{
	char* name;
	int   age;
public:
	Cat(const char* n, int a) : age(a)
	{
		name = new char[strlen(n) + 1];
		strcpy(name, n);
	}
	~Cat() { delete[] name; }

	// 깊은 복사로 구현한 복사 생성자
	Cat(const Cat& c) : age(c.age)
	{
		name = new char[strlen(c.name) + 1];
		strcpy(name, c.name);
	}
	// 소유권 이전(자원전달)의  이동(move) 생성자
	// 
	Cat(Cat&& c) : age(c.age), name(c.name)
	{
		c.name = 0; // 자원 포기
	}
};

Cat foo()	// 값리턴 : 임시객체(rvalue)
{
	Cat cat("NABI", 2);
	return cat;	
}

int main()
{
	Cat c = foo(); // 임시객체.

}
```

- 이동 생성자 정리

```cpp
#include <iostream>
using namespace std;

class Test
{
	int* resource;
public:
	Test()  {}	// 자원할당
	~Test() {}	// 자원해지
	
	// 복사 생성자 : 깊은복사 또는 참조계수
	// 인자로 lvalue 와 rvalue 를 모두 받을수 있다
	Test(const Test& t) { cout << "Copy" << endl; }

	// Move 생성자 : 소유권 이전(자원 전달)
	// rvalue만 전달 받을수 있다.
	Test(Test&& t)      { cout << "Move" << endl; }
};
Test foo()
{
	Test t;
	return t;
}
int main()
{
	Test t1;
	Test t2 = t1;		// 복사 생성자 호출
	Test t3 = Test();	// 이동 생성자 호출, 없으면 복사 생성자
	Test t4 = foo();
}
```

  

### std::move

> 자원을 더 이상 사용하지 않고 전달 할 때

- lvalue 변수를 전달시 이동생성자 호출 방법
  1. static_cast
  2. std::move

```cpp
#include <iostream>
using namespace std;

class Test
{
public:
	Test() {}	
	~Test() {}	
	Test(const Test& t) { cout << "Copy" << endl; }
	Test(Test&& t)      { cout << "Move" << endl; }
};

int main()
{
	Test t1;
	Test t2 = t1;		// Copy 	
	Test t3 = Test();	// Move
	Test t4 = static_cast<Test&&>(t1);	// Move
									// 복사가 아닌 move 생성자를 호출해 달라.
    
	Test t5 = move(t2); // move가 내부적으로 위처럼 캐스팅한다.
}
```

- 이동 대입 연산자

```cpp
#include <iostream>
using namespace std;

class Test
{
public:
	Test() {}
	~Test() {}
	Test(const Test& t) { cout << "Copy" << endl; }
	Test(Test&& t)      { cout << "Move" << endl; }

	Test& operator=(const Test& t) { return *this; } // 복사 대입연산자
	Test& operator=(Test&& t)      { return *this; } // move 대입연산자
};

int main()
{
	Test t1;
	Test t2 = t1;	// 초기화. 복사 생성자
	t2 = t1;		// 대입.   대입 연산자

	t2 = move(t1);
}
```

  

### move 활용

- 이동 swap 구현

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

class Test
{
public:
	Test() {}
	~Test() {}
	Test(const Test& t) { cout << "Copy" << endl; }
	Test(Test&& t)      { cout << "Move" << endl; }

	Test& operator=(const Test& t) 
	{
		cout << "Copy=" << endl; 
		return *this; 
	} 
	
	Test& operator=(Test&& t) 
	{
		cout << "Move=" << endl; 
		return *this; 
	} 
};

template<typename T> void Swap(T& x, T& y)
{
	Test temp = move(x); // static_cast<Test&&>
	x = move(y);
	y = move(temp);
}

int main()
{
	Test t1, t2;
	Swap(t1, t2); // 이미 std::swap이 표준에 구현되어 있음
}
```

- stl 컨테이너 사용시 객체에서 이동 연산을 구현 할 경우 resize등에서 성능 최적화 가능
  - 이동 생성자에 noexcept 키워드를 붙여야 vector에서 이동 연산을 수행함

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
using namespace std;

class Test
{
public:
	Test() {}
	~Test() {}
	Test(const Test& t) { cout << "Copy" << endl; }
	Test(Test&& t) noexcept     { cout << "Move" << endl; }

	Test& operator=(const Test& t)
	{
		cout << "Copy=" << endl;
		return *this;
	}
	Test& operator=(Test&& t) noexcept
	{
		cout << "Move=" << endl;
		return *this;
	}
};

int main()
{
	vector<Test> v(2);
	v.resize(4);
}
```

  

### move와 예외

이동 처리 중간 예외가 발생할 경우 복사 생성보다 리스크가 큼

- move_if_noexcept
  - 이동 관련 예외가 없을 경우에만(noexcept 키워드 여부) move 캐스팅 처리
  - stl의 표준 컨테이너에서 이동 연산 지원시 사용됨

```cpp
#include <iostream>
#include <vector>
#include <type_traits>
#include "Test.h"		// class Test {}
using namespace std;

int main()
{
	Test t1;
	Test t2 = t1; // copy
	Test t3 = move(t2); // move
	 
	bool b = is_nothrow_move_constructible<Test>::value; // 예외 여부 조사
	cout << b << endl;

	Test t4 = move_if_noexcept(t1);
}
```

  

### std::move 구현해보기

- lvalue 참조를 제거 후 캐스팅하는 방식, && 타입으로 리턴하기 위해

```cpp
#include <iostream>
#include "Test.h"		
using namespace std;

// T&  : lvalue 만 받을수 있다.
// T&& : lvalue 와 rvalue를 모두 받을수 있다. 
// 인자로 lvalue 전달 : T => Test&  T&& : Test& && => Test&
//        rvalue 전달 : T => Test   T&& : Test &&  => Test&&
template<typename T> 
typename remove_reference<T>::type &&
xmove(T&& obj)
{
	// 목표 : rvalue로 캐스팅.
	//return static_cast<T&&>(obj);

	return static_cast<typename remove_reference<T>::type &&>(obj);
}

int main()
{
	Test t1;
	Test t2 = t1;		 // copy
	Test t3 = xmove(t1); // move
	Test t4 = xmove( Test() ); // move
}
```



### move와 상수객체

- static_cast로 상수객체를 && 캐스팅 할 경우 error가 발생하지만, move 연산은 OK
- 그러나 move를 사용하더라도 상수 객체는 이동 연산이 아닌 복사 연산으로 호출됨

```cpp
#include <iostream>
#include "Test.h"
using namespace std;

// lvalue를 전달하면 T : lvalue 참조 -> const Test&
template<typename T>
typename remove_reference<T>::type &&
xmove(T&& obj)  
{
	return static_cast<const Test&&>(obj);
	return static_cast<typename remove_reference<T>::type &&>(obj);
}

int main()
{
	const Test t1;
    //Test t2 = static_cast<Test&&>(t1); // error
	Test t2 = xmove(t1); // not move, this is copy(const &)
}
```

  

### 이동 생성자 활용 예제

모든 멤버를 move 로 옮기도록 작성한다. 

- int 등 타입도 move로 통일해주는 것이 좋음, 실수 방지
- 이동 생성자를 구현하지 않으면, 복사 생성자를 컴파일러가 만들어 주는 것 처럼
  기본 이동 생성자를 구현해줌
  - 동적할당이 필요한 객체의 멤버를 스마트포인터로 사용하면 동적할당 객체도 안전하게 이동 가능하며, 코드가 간결해짐

```cpp
#include <iostream>
#include <string>
#include "Test.h" // Test 객체는 noexcept 이동생성자를 제공한다고 가정
using namespace std;

class Buffer
{
	size_t sz;
	int*   buf;
	string tag;
	Test   test;
public:
	Buffer(size_t s, string t) 
		: sz(s), tag(t), buf(new int[s] ) {}

	~Buffer() { delete[] buf; }

	// 깊은 복사
	Buffer(const Buffer& b) : sz(b.sz), tag(b.tag), test(b.test)
	{
		buf = new int[sz];
		memcpy(buf, b.buf, sizeof(int)*sz);
	}

	// move 생성자 : 모든 멤버를 move 로 옮기도록 작성한다.
	Buffer(Buffer&& b) noexcept
		: sz(move(b.sz)), tag(move(b.tag)), test(move(b.test))
	{
		buf = move(b.buf);
		b.buf = 0; // 자원 포기.
	}
	
    // TODO:
	// 대입연산자.
	// move 대입연산자.
};

int main()
{
	Buffer b1(1024, "SHARED");
	//Buffer b2 = b1; // copy

	Buffer b2 = move(b1); // copy
}
```



    ### glvalue, rvalue, lvalue

rvalue reference 타입(&&)과 value 타입은 둘다 우측값(rvalue)지만 &&는 다형성의 성질을 포함하고 있어 내부 개념적으로 이 둘을 구분 할 수 있음

- rvalue reference type(&&) : xvalue (파괴되는 rvalue), glvalue
- value : p rvalue(pure)
- lvalue reference(&) : glvalue

```cpp
struct base
{
    virtual void foo() { cout << "B::foo" << endl; }
}

struct derived : public base
{
    virtual void foo() { cout << "D::foo" << endl; }
}

derived d;
Base f1() { return d; }
Base& f2() { return d; }
Bass&& f3() { return std::move(d); }

int main()
{
    base b1 = f1(); // 임시객체를 리턴, 이동 생성자 호출됨
    base b2 = f2(); // 복사 생성자 호출
    base b3 = f3(); // 이동 생성자 호출
    
    // 위와 다르게 &&를 리턴 받은 객체는 다형성이 적용됨
    f1().foo(); // B::foo
    f2().foo(); // D::foo
    f3().foo(); // D::foo
    
    // category
    int n = 10;
    n = 20; // n : lvalue, 20 : prvalue
    int n3 = move(n); // xvalue
}
```

​    

​    

[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)


