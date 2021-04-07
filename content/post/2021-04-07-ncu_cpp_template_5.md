---
title: "C++ Template Programming - Type Traits[5]"
date: 2021-04-07T18:00:00+09:00
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

#thumbnailImage: //example.com/image.jpgC스터디 내용작성 ㅇS이번 항이번 
---

이번 항목에서는 타입의 다양한 속성을 조사하는 traits 개념을 알아 보겠습니다. std 표준의 is_pointer, is_array 등이 내부적으로 traits를 통해 구현 되었습니다.

<!--more-->

  

### Type traits의 개념

- 컴파일 시간에 타입에 대한 정보를 얻거나 변형된 타입을 얻을 때 사용하는 도구(메타 함수)
- 관련 표준 구현들은 <type_traits> 헤더로 제공됨 (C++11)



### 컴파일 타임 Type 질의 구현을 위한 일반적인 방법

1. 메인 템플릿에서 false 리턴
2. 부분 특수화에서 true 리턴
3. C++11 이후 런타임이 아닌 메타 계산(컴파일 타임)을 위해 constexpr 활용



### 포인터 여부 조사하기

```cpp
#include <iostream>
using namespace std;

// type traits : 템플릿 인자 T의 다양한 특성을 조사/변화하는 다양한 메타 함수

// 만드는 방법
// primary template : false 리턴( value = false )라는 의미.
// 부분 전문화 버전  : true 리턴(value = true)라는 의미


// 구조체(클래스)안에서 =로 초기화 가능한 방법

// 1. enum { value = true } : 예전 부터 지원 -> 런타임
// 2. static const bool value = true; 2000년 이후 지원 -> 런타임
// 3. bool value = true;     // C++11은 모든 변수를 = 초기화 가능.

template<typename T> struct IsPointer
{
	//enum { value = false }; // 예전 스타일
	//static const bool value = false;  // 
	static constexpr bool value = false;  // C++11의  constexpr 사용
};

template<typename T> struct IsPointer<T*>
{
	//enum { value = true };
	//static const bool value = false;
	static constexpr bool value = true;  // C++11의  constexpr 사용
};


template<typename T> void foo(const T& a)
{
	if (IsPointer<T>::value)
		cout << "포인터입니다." << endl;
	else
		cout << "포인터가 아닙니다." << endl;
}

int main()
{
	int n = 0;
	foo(n);
	foo(&n);
}
```

  

### 배열 여부 조사하기

배열의 선언 int x[3]에서 변수명을 제외한 나머지 요소가 배열의 타입 -> int[3]

```cpp
#include <iostream>
using namespace std;
//			변수이름    타입

// int a;		a		int
// int* p;		p		int*
// int x[10];	x		int[10]	=> T[N]

// int[] : 크기를 알수 없는 배열 타입

template<typename T> struct IsArray
{
	static const int size = -1;
	static const bool value = false;
};

template<typename T, int N> struct IsArray<T[N]>
{
	static const int size = N;
	static const bool value = true;
};

template<typename T> void foo(const T& a) // int[10]
{
	if (IsArray<T>::value)
		cout << "배열 입니다. 크기는 " << IsArray<T>::size << endl;
	else
		cout << "배열이 아닙니다." << endl;
}

int main()
{
	int x[10] = { 1,2,3 };
	foo(x);
}
```

  

### int2type

일반적인 방법으로는 int의 값으로 함수 오버로딩, 템플릿 인자, 상속 등에서 다른 타입으로 인지 시킬 수 없음

```cpp
#include <iostream>
using namespace std;

void foo(int    a) {}
void foo(double a) {}

int main()
{
	// 타입에 따른 함수 오버로딩
	foo(3);		// foo(int) 
	foo(3.4);	// foo(double)

	// 값에 따른 오버로딩 ?? - 0, 1 은 같은 타입이므로 같은 함수 호출
	foo(0);	// foo(int)
	foo(1);	// foo(int);
}
```

- int2type 함수오버로딩 구현

```cpp
template<int N> struct int2type
{
	enum { value = N };
};

void foo(int n) {}

// 0, 1 에 따른 함수 오버로딩.
void foo(int2type<0>) {}
void foo(int2type<1>) {}

int main()
{
	foo(0);	
	foo(1);	// 0, 1은 같은 타입.. foo(0), foo(1)은 같은 함수 호출
	
	int2type<0> t0;
	int2type<1> t1;

	foo(t0);
	foo(t1); // t0, t1 은 다른 타입이므로 foo(t0), foo(t1)은 다른 함수 호출.
}
```

- int2type 활용 : 포인터 여부 조사
  - 동일한 이름을 가지는 함수가 여러 개 있을 때, 어느 함수를 호출 할 지 결정하는 것은 컴파일 시간에 이루어지며, 선택되지 않은 함수가 템플릿일 경우 실체화 되지 않으므로 관련된 문법 오류를 발생시키지 않도록 처리 할 수 있음
  - pointer 일 때와 포인터가 아닐 때를 서로 다른 타입화 하여 함수오버로딩의 인자로 활용
  - c++17 부터는 위의 방법 보다 if constexpr을 활용하면 간결하게 동일한 처리 가능

```cpp
#include <iostream>
#include <type_traits>
using namespace std;

template<typename T> struct IsPointer { static constexpr bool value = false; };
template<typename T> struct IsPointer<T*> { static constexpr bool value = true; };

// if 문을 사용한 함수 분기 : 실행시간 결정..
// 함수 오버로딩을 사용한 분기 : 컴파일 시간에 결정..

// 숫자로 함수 오버로딩하는 도구
template<int N> struct int2type
{
	static const int value = N;
};

template<typename T> void printv_imp(T a, int2type<0>)
{
	cout << a << endl;
}

template<typename T> void printv_imp(T a, int2type<1>)
{
	cout << a << " : " << *a << endl;
}

template<typename T> void printv(T a)
{
    // 하단 방법으로는 int 타입에 대한 *a 표현 발생시 오류 발생
    //if (IsPointer<T>::value )
	//	cout << a << " : " << *a << endl;
	//else
	//	cout << a << endl;
    
	// 함수 오버로딩은 컴파일 시간에 인자에 타입으로 함수 호출이 결정된다
	printv_imp(a, int2type< IsPointer<T>::value >());
    
    // 하단 방법으로 처리하면 함수 오버로딩 없이 간결하게 처리 가능, C++17
	/*
	if constexpr (IsPointer<T>::value)
		cout << a << " : " << *a << endl;
	else
		cout << a << endl;
	*/
}

int main()
{
	int n = 3;

	printv(n);
	printv(&n);
}
```



### Integral_constant

- 컴파일 시간에 결정된 상수 값을 타입화 하여 함수 오버로딩을 할 수 있도록 만드는 기법(C++11)
- int 뿐 아니라 모든 정수 계열(boo, char, short, int, long, long long)의 상수 값을 타입으로 만들 수 있음, but 실수는 템플릿 인자로 사용 불가

```cpp
#include <iostream>
using namespace std;

/*
// C++11에는 int2type을 발전시킨 아래 템플릿을 제공합니다
template<typename T, T N> struct integral_constant
{
	static constexpr T value = N;
};
//integral_constant<int,   0> n0;
//integral_constant<short, 0> s0;
// true/false           : 참거짓을 나타내는 값, 같은 타입
// true_type/false_type : 참거짓을 나타내는 타입, 다른 타입.
typedef integral_constant<bool, true>  true_type;
typedef integral_constant<bool, false> false_type;
// 그리고 is_pointer는 아래 처럼 만들게 됩니다.
template<typename T> struct is_pointer     : false_type { };
template<typename T> struct is_pointer<T*> : true_type {};
*/

#include <type_traits>  // 이 안에 위코드가 있습니다.
//------------------------------

template<typename T> void printv_imp(T a, false_type)
{
	cout << a << endl;
}

template<typename T> void printv_imp(T a, true_type)
{
	cout << a << " : " << *a << endl;
}

template<typename T> void printv(T a)
{
	printv_imp(a, is_pointer<T>()); // is_pointer 임시객체 생성.
}

int main()
{
	int n = 3;

	printv(n);
	printv(&n);
}
```

  

### Integral_constant관련 Summary

- 템플릿을 만들 때 타입을 조사하는 방법 : <type_traits> 헤더 포함
- ::value 값을 조사하는 방법 (is_pointer<T>::value)
  - if문 사용시에는 *v 등의 표현을 사용 할 수 없음
  - C++17 부터는 if constexpr 를 활용하여 *v 사용 가능
  - C++17 부터는 is_pointer_v<T> 표현식도 제공
- true_type, false_type을 활용한 함수 오버로딩

```cpp
#include <iostream>
using namespace std;

#include <type_traits> // C++11 

template<typename T> void foo(T a)
{
	// 포인터를 제거한 타입 구하기
	typename remove_pointer<T>::type n1;
	remove_pointer_t<T> n2;

	// 포인터 인지 조사
	//if (is_pointer<T>::value)
	if ( is_pointer_v<T> ) // C++17
	{
		//*a = 10; // error
	}

	// 함수 오버로딩 사용
	foo_imp(a, is_pointer<T>());
}

template<typename T> void foo_imp(T a, true_type) {}
template<typename T> void foo_imp(T a, false_type) {}


int main()
{
	int n = 10;
	foo(&n);
}
```

  

### Type modification

traits 기술은 타입을 조사하는 것 뿐 아니라, 변형된 타입을 만들 수도 있습니다.

- remove pointer

```cpp
#include <iostream>
using namespace std;

// T에 변형 타입 구하기
// primary template : typedef 제공
template<typename T> struct xremove_pointer
{
	typedef T type;
};

template<typename T> struct xremove_pointer<T*>
{
	typedef T type;
};

template<typename T> void foo(T a)  // T : int*
{
	// 반드시 typename 있어야 합니다.
	typename  xremove_pointer<T>::type n;  

	// n의 타입 이름 출력
	cout << typeid(n).name() << endl;
}

int main()
{
	int n = 10;
	foo(&n);
}
```

  

- remove all pointer (stl 표준에 없는 기술)

```cpp
#include <iostream>
using namespace std;

template<typename T> struct xremove_all_pointer
{
	typedef T type;
};

template<typename T> struct xremove_all_pointer<T*> // int** *
{
    // 재귀
	typedef typename xremove_all_pointer<T>::type type;
};

int main()
{
	xremove_all_pointer<int***>::type n;

	cout << typeid(n).name() << endl;
}

```



- 함수의 정보 구하기
  - 부분 특수화를 통해 함수 타입 모양인 T를 리턴 타입과 나머지(인자타입)으로 분리

```cpp
#include <iostream>
using namespace std;

int f(int, double, char) { return 0; }

// 함수의 N 번째 인자 타입 구하기.
template<int N, typename T> struct argument
{
	typedef void type;
};

// N == 0 일때
template<typename R, typename A1, typename ... Types> struct argument<0, R(A1, Types...)>
{
	typedef A1 type;
};

// N != 0 일때
template<int N, typename R, typename A1, typename ... Types> struct argument<N, R(A1, Types...)>
{
	typedef typename argument<N-1, R(Types...)>::type type;
};


template<typename T> void foo(T& t)
{
	typename argument<1, T>::type n;

	cout << typeid(n).name() << endl; // double
}

int main()
{
	foo(f);
}
```



  ### C++ 표준 STL <type_traits> 정리

- 더 많은 traits 정보 : https://en.cppreference.com/w/cpp/types#Type_traits

| C++ 표준                                                     | 역할                            |
| ------------------------------------------------------------ | ------------------------------- |
| is_pointer, is_pointer_v<T>                                  | 포인터 여부 조사                |
| is_array                                                     | 배열 여부 조사                  |
| extent                                                       | 배열의 크기                     |
| is_same                                                      | 동일 여부                       |
| decay                                                        | 배열 일 경우 포인터 형태로 변경 |
| remove_pointer, remove_pointer_t<T>, remove_cv, remove_volatile | 속성 제거 관련                  |
| result_of / invoke_result ( 구현 방식이 다름 )               | 결과 타입 조사                  |





[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)

