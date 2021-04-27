---
title: "C++ 고급 문법/테크닉 - Lambda expression[10]"
date: 2021-04-28T08:00:00+09:00
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

Lambda expression과 관련한 인라인 함수, function object, 람다 표현, closure object, 캡쳐 변수, 고급 람다 표현, invoke 등에 대해 알아보겠습니다.

<!--more-->

  

 ### 인라인 함수의 개념

컴파일러에 의해 컴파일 타임에 함수 표현식이 해당 함수 구현부로 대체됨

```cpp
	   int Add1(int a, int b) { return a + b; }
inline int Add2(int a, int b) { return a + b; }

int main()
{
	int n1 = Add1(1, 2); // 호출
	int n2 = Add2(1, 2); // 치환
						 // 장점 : 속도가 빠르다
						 // 단점 : 목적 코드가 커질 수도 있음(무조건은 아님)

    // 어셈블리 코드 확인해보기
	// g++ inline1.cpp -S        => inline1.s
	// cl  inline1.cpp /FAs /Ob1 => inline1.asm
}

```

  

### 인라인 함수와 함수 포인터

1. 인라인 함수 문법은 컴파일 시간 동작한다.
2. 인라인 함수라도 함수포인터에 담아서 사용하면 인라인 적용이 되지 않음

```cpp
	   int Add1(int a, int b) { return a + b; }
inline int Add2(int a, int b) { return a + b; }

int main()
{
	int n1 = Add1(1, 2); // 호출
	int n2 = Add2(1, 2); // 치환
	
	int(*f)(int, int);

	f = &Add2;
	//if (사용자입력이 1 이면)
	//	f = &Add1;

	int n3 = f(1, 2); // 호출 ? 치환 ?
}
```

  

### linkage

1. .h와 .cpp로 구현이 나눠져 있을 경우 inline 키워드 사용시 링크 타임에서 오류 발생
2. 헤더에 구현부를 포함하면 해결됨

```cpp
// add.h
	   int Add1(int a, int b);

inline int Add2(int a, int b)
{
	return a + b;
}

// add.cpp
int Add1(int a, int b)
{ 
	return a + b; 
}
inline int Add2(int a, int b)
{
	return a + b;
}

// main.cpp
#include "add.h"

int main()
{
    Add(1, 2);
    Add2(1, 2);
}
```

  

### Functor(function object)의 개념

객체를 함수처럼 사용 하는 것

>	a + b;	-> a.operator+(b)
>	a - b;	-> a.operator-(b)
>	a();    -> a.operator()()
>	a(1,2);	-> a.operator()(1,2)

```cpp
#include <iostream>
using namespace std;

// functor1.cpp
// Function Object(functor)
class Plus
{
public:
	int operator()(int a, int b)
	{
		return a + b;
	}
};

int main()
{
	Plus p; // Plus는 객체

	int n = p(1, 2); // p.operator()(1,2)

	cout << n << endl; // 3
}
```



### Functor의 장점

- 함수포인터를 전달할 경우 cmp 함수를 inline화 하여도 치환 되지 않음(성능향상 X)

```cpp
#include <algorithm>	
#include <iostream>
using namespace std;

// 일반함수는 자신만의 타입이 없다.
// 함수는 리턴값과 파라메터가 동일하면 모두 같은 타입이다.
void Sort(int* x, int n, bool(*cmp)(int, int))
{
	for (int i = 0; i < n - 1; i++)
	{
		for (int j = i + 1; j < n; j++)
		{
			//	if (x[i] > x[j])

			if (cmp(x[i], x[j]))
				swap(x[i], x[j]);
		}
	}
}

inline bool cmp1(int a, int b) { return a > b; }
inline bool cmp2(int a, int b) { return a < b; }

int main()
{
	int x[10] = { 1,3,5,7,9,2,4,6,8,10 };
	Sort(x, 10, cmp2);
}
```

- 함수 객체를 사용하면 위의 최적화 이슈 해결 가능

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

// 함수 객체는 자신만의 타입이 있다.
// 함수 객체는 리턴값과 파라메터가 동일 해도 모든 함수객체는 다른 타입이다.
struct Less
{
	inline bool operator()(int a, int b) const  {	return a < b; }
};

struct Greater
{
	inline bool operator()(int a, int b) const { return a > b;	}
};

// 정책 변경가능하고 정책이 인라인 치환되는 함수. ( 템플릿 + 함수 객체)
template<typename T> void Sort(int* x, int n, T cmp)
{
	for (int i = 0; i < n - 1; i++)
	{
		for (int j = i + 1; j < n; j++)
		{
			if (cmp(x[i], x[j]))
				swap(x[i], x[j]);
		}
	}
}

int main()
{
	int x[10] = { 1,3,5,7,9,2,4,6,8,10 };
	Less	f1; // 타입 Less
	Greater f2; // 타입 Greater
	Sort(x, 10, f1); // 
	Sort(x, 10, f2); // 
}
```

  

### function vs functor

```cpp
#include <algorithm>
using namespace std;

// 일반 비교함수
inline bool cmp1(int a, int b) { return a > b; }
inline bool cmp2(int a, int b) { return a < b; }

// 함수 객체 비교함수
struct Less    { inline bool operator()(int a, int b) const { return a < b; }};
struct Greater { inline bool operator()(int a, int b) const { return a > b; }};

int main()
{
	int x[10] = { 1,3,5,7,9,2,4,6,8,10 };

	// STL sort : 모든 인자가 템플릿으로 되어 있다
	// 1. 비교정책으로 일반함수를 전달할때.
	// 장점 : 정책을 교체해도 sort()기계어는 한개이다. - 코드 메모리 절약
	// 단점 : 정책 함수가 인라인 치환될수 없다.
	sort(x, x + 10, cmp1); // sort( int*, int*, bool(*)(int, int))
	sort(x, x + 10, cmp2); // sort( int*, int*, bool(*)(int, int))

	// 2. 비교정책으로 함수객체 전달할때.
	// 장점 : 정책함수가 인라인 치환될수 있다 - 빠르다.!
	// 단점 : 정책을 교체한 횟수 만큼의 sort()기계어 생성.
	Less    f1;
	Greater f2;
	sort(x, x + 10, f1); // sort( int*, int*, Less) 함수 생성.
	sort(x, x + 10, f2); // sort( int*, int*, Greater) 함수 생성.
}
```

- 이미 구현되어 있는 stl 표준의 비교 함수

```cpp
#include <iostream>
#include <algorithm>
#include <functional>  // less<>, greater<>
using namespace std;

int main()
{
	int x[10] = { 1,3,5,7,9,2,4,6,8,10 };

	less<int> f1;
	sort(x, x + 10, f1);

	sort(x, x + 10, less<int>());
}
```

  

### 상태를 가지는 함수

>일반함수 : 동작만 있고 상태가 없다.
>함수객체(fuctor) : 동작과 상태가 있다.

```cpp
#include <iostream>
#include <bitset>
using namespace std;

class Random
{
	bitset<10> bs;
public:
	Random() {	bs.reset(); // 모든 비트를 0으로
	}
	int operator()()
	{
		int v = -1;
		do
		{
			v = rand() % 10;
		} while (bs.test(v));

		bs.set(v);
		return v;
	}
};

int main()
{
	Random random;
	Random random1;
	for (int i = 0; i < 10; i++)
		cout << random() << " ";
	random();
}
```

   

### C++98/03 함수 객체 요점 정리

- 함수 객체
  1. () 연산자를 정의한 클래스
  2. 함수 포인터, 멤버함수 포인터
- 일반 함수와 함수 객체의 차이점
  1. 일반 함수는 자신만의 타입이 없음
  2. 함수 객체는 자신만의 타입이 있음
- 함수 객체의 장점
  - 다른 함수의 인자로 사용 될 때 '인라인 치환' 가능
  - 상태를 갖는 함수

​    

### Closure Object

- 비교 함수 전달시 함수를 만들지 않아도, 람다 표현식을 사용하여 비교 의미 전달 가능

```cpp
#include <iostream>
#include <algorithm>
#include <functional>
using namespace std;

bool cmp(int a, int b) { return a < b; }

int main()
{
	int x[10] = { 1,3,5,7,9,2,4,6,8,10 };

	// 비교정책으로 함수 사용.
	sort(x, x+10, cmp);

	// 비교정책으로 함수객체 사용.
	sort(x, x+10, less<int>());

	// C++11. 람다 표현식(lambda expression)
	sort(x, x + 10, 
		  [](int a, int b) { return a < b; } );
}
```

- 람다 표현식을 사용시 컴파일러에서 함수 객체를 생성하여 치환함,
  람다 표현식을 사용하여 컴파일러에 의해 생성되는 임시객체를 ClosureType이라 함

```cpp
// ClosureType.h
// [](int a, int b) { return a < b; }

class ClosureType
{
public:
	bool operator()(int a, int b) const
	{
		return a < b;
	}
	~ClosureType() = default;
	ClosureType(const ClosureType&) = default;
	ClosureType(ClosureType&&) = default;
	ClosureType& operator=(const ClosureType&) = delete;

	// convert to function pointer
	operator bool(*)(int, int)()  { return &static_method; }

	static bool static_method(int a, int b) 
	{
		return a < b;
	}
};

sort(x, x + 10, ClosureType() );
```

  

### 람다 표현식의 활용

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

int main()
{
	// lambda expression 활용 1. 함수 인자로 사용
	sort(x, x+10, [](int a, int b) { return a < b; });

	// lambda expression 활용 2. auto 변수에 담아서
	//						함수 처럼 사용.
	auto f = [](int a, int b) { return a + b; };

	cout << f(1, 2) << endl; // 3
}
```

  

### 람다 표현식과 타입

- 같은 람다 표현식이어도 타입이 서로 다름(unique)

```cpp
#include <iostream>
#include <typeinfo>
using namespace std;

int main()
{
	auto f1 = [](int a, int b) { return a + b; };
		// class ClosureType{}; ClosureType();

	auto f2 = [](int a, int b) { return a + b; };

	//f2 = [](int a, int b) { return a + b; };
	
	cout << typeid(f1).name() << endl;
	cout << typeid(f2).name() << endl;
}
```

  

### lambda & function agument

- 람다 표현식을 담는 방법

```cpp
#include <iostream>
#include <functional>
using namespace std;

int main()
{
	auto f1 = [](int a, int b) { return a + b; }; // 함수 객체

	int(*f2)(int, int) = 
			  [](int a, int b) { return a + b; }; // 함수 포인터

	//f2 = [](int a, int b) { return a - b; }; // f2에 다른 걸 담을 수 있음

	function<int(int, int)> f3 =
		[](int a, int b) { return a + b; };

	f1(1, 2); // inline 치환 가능.
	f2(1, 2); // inline 치환이 어렵다
	f3(1, 2); // inline 치환이 어렵다
}
```

- 람다 표현식의 함수 인자 전달 받는법
  1. 함수 포인터, function
  2. forwarding reference
  3. const &

``` cpp
#include <iostream>
#include <functional>
using namespace std;


//void foo( int (*f)(int, int) ) // 함수포인터로 받으면 인라인 불가
//void foo(function<int(int, int)> f) // function 으로 받으면 인라인 불가

template<typename T> void foo(const T& f) // 인라인 OK
{
	f(1, 2);
}

int main()
{
	foo( [](int a, int b) { return a + b; } );
	foo( [](int a, int b) { return a - b; });

}
```

  

### 람다 표현식과 리턴 타입

- 람다 표현식의 리턴타입을 명시 하고 싶을 경우 후위형 표기 ( -> )
- 컴파일러가 추론 불가능한 상황 일 경우 컴파일 에러 발생

```cpp
#include <iostream>
using namespace std;

int main()
{
	auto f1 = [](int a, int b) { return a + b; };

	auto f2 = [](int a, int b) -> int { return a + b; };

	auto f3 = [](int a, int b){ 
						if (a == 1)
							return a;
						else
							return b;
						};

	auto f4 = [](int a, double b) -> double {
						if (a == 1)
							return a;
						else
							return b;
					};
}
```

​    

### 람다 표현식과 변수 캡쳐

- 람다표현식의 괄호에 캡쳐 하려는 변수 명시 -> [v1, v2]
  - 캡쳐한 지역 변수를 수정 하려면 mutable 키워드 사용
  - 일반 캡쳐시 복사본이 전달됨(copy)
  - 캡쳐된 변수는 임시 객체(closure)의 멤버 변수로 할당됨

```cpp
#include <iostream>
using namespace std;

int main()
{
	int v1 = 0, v2 = 0;

	// capture
	auto f0 = []()       { return 0; };
	auto f1 = [v1, v2]() { return v1 + v2; };
    
    auto f2 = [v1]() { v1 = 10 }; // error
    auto f3 = [v1]() mutable { v1 = 10 }; // ok, but 복사본 수정

	cout << sizeof(f0) << endl; // 1
	cout << sizeof(f1) << endl; // 8
}
```

- 참조 캡쳐
  - 캡쳐시 &(주소연산)으로 전달 할 경우 참조 캡쳐가 가능

```cpp
#include <iostream>
using namespace std;

int main()
{
	int v1 = 0, v2 = 0;

	// capture by value, capture by copy
	//auto f1 = [v1, v2]() mutable { v1 = 10; v2 = 20; };

	// capture by reference
	auto f1 = [&v1, &v2]() { v1 = 10; v2 = 20; };


	f1(); 

	cout << v1 << endl; // 10
	cout << v2 << endl; // 20

}
```

- 캡쳐 규칙 정리
  - [=] 캡쳐를 할 경우 모든 지역변수가 캡쳐되지만 권장하지 않음

```cpp
#include <iostream>
#include <memory>
#include <string>
#include <tuple>
using namespace std;

int main()
{
	int v1 = 0, v2 = 0, v3 = 0;

	// capture by copy, capture by reference
	auto f1 = [v1]() {};
	auto f2 = [&v1]() {};
	auto f3 = [v1, &v2]() {};

	// default capture
	auto f4 = [=]() {};	// capture by copy
	auto f5 = [&]() {}; // capture by reference
	auto f6 = [=, &v1]() {};
	auto f7 = [&, v1]() {};
	//auto f8 = [=, v1]() {}; // error

	auto f9  = [x = v1, v2 = v2, v3]() {};
	auto f10 = [v1, y = v2, &r = v3]() {};

	string s = "hello";
	auto f11 = [s1 = move(s)] ()  { };

	f11();
	cout << s << endl; // empty string

	unique_ptr<int> p(new int);
	auto f12 = [p = move(p)]() {};
}

void foo(int a, int b)
{
	//int a, b;
	auto f = [a, b]() { return a + b; }// ok
	auto f = [=]() { return a + b; } // ok
}

template<typename ... Types> void goo(Types ... args)
{
	int x = 0;
	auto f = [=]() { auto t = make_tuple(args...); };
	auto f = [args...]() { auto t = make_tuple(args...); };
}
```

- 클래스의 멤버 변수 캡쳐

```cpp
#include <iostream>
using namespace std;

class Test
{
	int data = 0;
public:
	void foo() // Test* const this
	{
		int v = 0;

		auto f = [this]() { this->data = 10; };

		// 멤버 데이타를 복사본으로 캡쳐 - C++17
        // 멤버에 접근 하는 것을 제한 하고 싶을 때
		// auto f = [*this]() mutable { data = 10; };
		f();
		cout << data << endl; // 10
	}
};

int main()
{
	Test t;
	t.foo();
}
```

- 캡쳐관련 주의사항 -> 람다 표현식을 함수 포인터로 변환 할 때 캡쳐 할 경우 컴파일 에러 발생(함수 포인터 변환시 컴파일러 내부 구현이 static으로 구현 되기 때문)

  - 클래스의 static 멤버 함수는 일반 멤버 변수에 접근이 불가능함

  ```cpp
  int main()
  {
  	int(*f)(int, int) = [](int a, int b) 
  	{
  		return a + b; 
  	};
  
  	int v = 0;
  
  	// capture 구문을 사용하면
  	// 함수포인터로 암시적 변환 될수 없다.
  	int(*f1)(int, int) = [v](int a, int b)
  	{
  		return a + b + v;
  	};
  }
  ```

  

### 람다 더 알아보기

```cpp
#include <iostream>
using namespace std;

int main()
{
	// generic lambda : C++14
	auto f1 = [](auto a, auto b)  { return a + b; };
	cout << f1(1, 2.1) << endl; // 3.1

	// nullary lambda : 괄호 생략 가능
	auto f2 = [] {return 10; }; 

	// C++17 : 컴파일러가 () 오버라이딩시 constexpr 함수로 생성함
	auto f3 = [](int a, int b) constexpr
	{
		return a + b; 
	};

	int y[f3(1, 2)]; // 배열 생성시 컴파일 타임에 이 표현이 가능해짐
}
```



### 람다 표현식 관련 테크닉

- 가변 인자 람다 표현식(c++17 컨퍼런스에서 발표된 코드)

```cpp
#include <iostream>
using namespace std;

template<typename ... Types> class mi : public Types...
{
public:
	mi(Types&& ... args) : Types(args)... {} 

	// 기반 클래스의 특정함수를 사용할수 있게
	using Types::operator()...;
};

int main()
{
    // 클래스를 만들어서 임시객체 생성 : class lambda1{}; lambda1();
	mi f([](int a, int b)        { return a + b; },			
	 	 [](int a, int b, int c) { return a + b + c; });

	cout << f(1, 2) << endl; // 3
	cout << f(1, 2, 3) << endl; // 6
}
```

​    

### invoke

- 인자로 전달 받은 클래스의 멤버함수 호출 가능(C++17)

```cpp
#include <iostream>
#include <functional>
using namespace std;

template<typename F, typename ... Types>
decltype(auto) chronometry(F&& f, Types&& ... args)
{
	return invoke(std::forward<F>(f),
	   	std::forward<Types>(args)...);

}

class Dialog
{
public:
	void Close() {} 
};

int main()
{
	Dialog dlg;
	chronometry(&Dialog::Close, &dlg);
}
```

- invoke는 일반함수, 멤버함수 호출 가능, 또한 클래스의 멤버 변수에도 접근 가능

```cpp
#include <iostream>
#include <functional>
using namespace std;

void foo(int a, int b) {}

class Dialog
{
public:
	int color;

	void setColor(int c) { color = c; }
};

int main()
{
	invoke(&foo, 10, 20); // foo(10,20)
	Dialog dlg;
	invoke(&Dialog::setColor, &dlg, 2); 
						// dlg.setColor(2);

	// 멤버 변수에 접근
	invoke(&Dialog::color, &dlg) = 20;
			// dlg.color = 20

	cout << dlg.color << endl; // 20

}
```

- invoke에 전달 가능한 것들(Callable obejct)
  1. function object
     - 모든 종류의 함수 포인터
     - () 연산자를 재정의한 클래스(함수 객체)
     - 람다 표현식
  2. 클래스의 멤버

  

[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)