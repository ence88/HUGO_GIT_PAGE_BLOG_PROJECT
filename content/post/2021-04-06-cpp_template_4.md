---
title: "C++ Template Programming - Template 특수화[4]"
date: 2021-04-06T18:00:00+09:00
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

이번 포스팅에서는 template specialization, partial specialization, template meta programming에 대해서 알아보겠습니다. 다양한 템플릿 기술의 근본이 되는 아주 중요한 개념입니다.

<!--more-->

  ### Specialization 개념

template 구현시 특정 타입에 대해서 다르게 처리되도록 특수화를 할 수 있습니다.

```cpp
#include <iostream>
using namespace std;

// template specialization
// primary template
template<typename T> class Stack
{
public:
	void push(T v) { cout << "T" << endl; }
};

// partial specialization
template<typename T> class Stack<T*>
{
public:
	void push(T* v) { cout << "T*" << endl; }
};

// specialization
template<> class Stack<char*>
{
public:
	void push(char* v) { cout << "char*" << endl; }
};

int main()
{
	Stack<int>   s1; s1.push(0);
	Stack<int*>  s2; s2.push(0);
	Stack<char*> s3; s3.push(0);
}
```

  

### 특수화 예제

- 메인 템플릿의 템플릿 인자가 2개라면, 사용자는 반드시 템플릿 인자 2개를 전달 해야 한다. (디폴트 인자가 없을 경우)
- 부분 특수화 버전을 만들 때 템플릿 인자의 개수는 메인 템플릿의 인자 개수와 다를 수 있다.

```cpp
#include <iostream>
using namespace std;

template<typename T, typename U> struct Test
{
	static void foo() { cout << "T, U" << endl; }
};

template<typename T, typename U> struct Test<T*, U>
{
	static void foo() { cout << "T*, U" << endl; }
};

template<typename T, typename U> struct Test<T*, U*>
{
	static void foo() { cout << "T*, U*" << endl; }
};

// 핵심 : 부분 특수화 시에 템플릿 인자의 갯수는 변할수 있다
template<typename T> struct Test<T, T>
{
	static void foo() { cout << "T, T" << endl; }
};

template<typename U> struct Test<int, U>
{
	static void foo() { cout << "int, U" << endl; }
};

// int, int : 특수화
template<> struct Test<int, int>
{
	static void foo() { cout << "int, int" << endl; }
};

template<> struct Test<int, short>
{
	static void foo() { cout << "int, short" << endl; }
};

int main()
{
	Test<int, double>::foo();	// T,  U
	Test<int*, double>::foo();  // T*, U
	Test<int*, double*>::foo(); // T*, U*
	Test<int, int>::foo();     // T, T => int, int
	Test<int, char>::foo();    // int, U
	Test<int, short>::foo();   // int, short
}
```

{{< adsense >}}

### Specialization 주의사항

- 부분 특수화의 디폴트 값은 표기하지 않음

```cpp
// partial specialization 과 default parameter
template<typename T, int N = 10> class Stack
{
	T buf[N];
};

// 부분 특수화 - 디폴값은 표기 하지 않는다. 표기하지 않아도 primary 값이 적용된다.
template<typename T, int N> class Stack<T*, N>
{
	T buf[N];
};

int main()
{
	Stack<int> s1;  // N == 10
	Stack<int*> s2; // N == 10
}
```

- 클래스의 특정 멤버 함수 하나만 특수화 할 수 있지만, 부분 특수화 할 수는 없음

```cpp
#include <iostream>
using namespace std;

// 하나의 멤버 함수만 특수화 하기

// primary template
template<typename T> class Stack
{
public:
	void pop() {}
	void push(T a);
};

template<typename T> void Stack<T>::push(T a)
{
	cout << "T" << endl;
};

// 특정 멤버함수만 특수화 하는 코드
template<> void Stack<char*>::push(char* a)
{
	cout << "char*" << endl;
};

// 특정 멤버함수만 부분 특수화을 할수는 없다. 
// 부분 특수화는 클래스 전체를 변경해야 한다.
template<> void Stack<T*>::push(char* a)
{
	cout << "char*" << endl;
};

int main()
{
	Stack<int>   s1; s1.push(0);
	Stack<int*>  s1; s2.push(0);
	Stack<char*> s1; s3.push(0);
}
```

  

### 특수화 활용

- IfThenElse 기법 (컴파일 타임에 조건에 따라 type 선택 가능)
- C++ 표준 <type_traits>의 conditional을 구현하는 방법

```cpp
#include <iostream>
using namespace std;

// bool 기반의 type selection 기술.
template<bool, typename T, typename U> struct IfThenElse
{
	typedef T type;
};

template<typename T, typename U> struct IfThenElse<false, T, U>
{
	typedef U type;
};

template<int N> struct Bit
{
//	using data_type = unsigned int;

	using data_type = typename IfThenElse< (N <= 8), char, unsigned int>::type;

	data_type data;
};

int main()
{
	Bit<8>  b1; // 8bit를 관리하기 위한 객체
	Bit<32> b2; // 32bit를 관리하기 위한 객체

	cout << sizeof(b1) << endl;
	cout << sizeof(b2) << endl;
}
```

  

- couple template (stl pair와 유사)
  - 템플릿의 인자로 자기 자신의 타인을 전달
  - 부분 특수화를 만들 때 템플릿 인자의 개수
  - N을 표현하는 방법

```cpp
#include <iostream>
using namespace std; 

template<typename T> void printN(const T& a) { cout << T::N << endl; }


// 임의의 타입 2개를 보관하는 구조체 
template<typename T, typename U> struct couple
{
	T v1;
	U v2;

	static constexpr int N = 2;
};

// 2번째 인자가 recursive일때를 위한 부분전문화
template<typename A, typename B, typename C> struct couple<A, couple<B, C>>
{
	A         v1;
	couple<B, C> v2;
	static constexpr int N = couple<B, C>::N + 1; // 핵심!
};

template<typename A, typename B, typename C> struct couple<couple<A, B>, C>
{
	couple<A, B>  v1;
	C         v2;
	static constexpr int N = couple<A, B>::N + 1; // 핵심!
};

template<typename A, typename B, typename C, typename D> struct couple<couple<A, B>, couple<C, D>>
{
	couple<A, B>  v1;
	couple<C, D>  v2;
	static constexpr int N = couple<A, B>::N + couple<C, D>::N; // 핵심!
};


int main()
{
	couple<couple<int, int>, couple<int, int>> d4; 

	printN(d4); // 4나와야 합니다.
}
```



- tuple using couple (couple을 활용한 stl 표준의 tuple 구현)
  - 무한하게 타입을 넣을 수 있을까? -> C++11 Variadic template

```cpp
template<typename T, typename U> struct couple
{
	T v1;
	U v2;
	enum { N = 2 };
};

// couple의 선형화 기술
struct Null {}; // empty class(struct), sizeof(Null) : 1  
				// 아무 멤버도 없지만 분명한 타입이다.
				// 1. 함수 오버로딩이나
				// 2. 템플릿 인자로 주로 활용

template<typename P1 = Null,
	typename P2 = Null,
	typename P3 = Null,
	typename P4 = Null,
	typename P5 = Null> class xtuple : public couple<P1, xtuple<P2, P3, P4, P5, Null>>
{
};

// 2개를 저장하는 xtuple을 위한 부분 전문화
template<typename P1, typename P2>
class xtuple<P1, P2, Null, Null, Null> : public couple<P1, P2>
{
};



int main()
{
	//								  couple<short, long>  
	//						couple<char, xxtuple<s, l, Null, Null, Null>>
	//			couple<double, xtuple<c, s, l, Null, Null>>
	// couple<int, xtuple<d, c, s, l, Null>>
	xtuple<int, double, char, short, long> t5; // 상속 받은후 추가한것이 없으므로
											  // 부모와 모양이 같다. 부모만 알면 이 객체의 모양을
											  // 알수 있다.

	xtuple<int, int, int> t3;
}
```

  

### template meta programming

컴파일 타임에 연산을 수행하도록 프로그래밍 하는 방법

- constexpr

```cpp
#include <iostream>
using namespace std;

template<int N> struct check {};

// constexpr 함수 - C++11, 컴파일 타임에 수행이 가능하면 컴파일 타임에 수행, 런타임에 가능하면 런타임에 수행함
constexpr int add(int a, int b)
{
	return a + b;
}

int main()
{
	int n = add(1, 2);

	check< add(1, 2) > c; // ok..


	int n1 = 1, n2 = 2;

	int c = add(n1, n2); // ok

	//check< add(n1, n2) > c; // error
}
```

  

- factorial

```cpp
#include <iostream>
using namespace std;

// template meta programming
template<int N> struct factorial
{
	//int value = 10;
	//enum { value = N * factorial<N-1>::value };
	static constexpr int value = N * factorial<N - 1>::value;
};
// 재귀의 종료를 위해 특수화 문법 사용
template<> struct factorial<1>
{
	//enum { value = 1 };
	static constexpr int value = 1;
};

int main()
{
	int n = factorial<5>::value; // 5 * 4 * 3 * 2 * 1  => 120 
	//			5 * f<4>::v
	//				4 * f<3>::v
	//					3 * f<2>::v
	//						2 * f<1>::v
	//							1	

	cout << n << endl;
}
```

   

  

[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)

