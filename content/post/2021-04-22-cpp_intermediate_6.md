---
title: "C++ 고급 문법/테크닉 - C++ auto / decltype type deduction[6]"
date: 2021-04-22T02:30:00+09:00
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
C++11에서 추가된 auto/decltype 문법은 쉬워 보이지만 컴파일러가 타입을 결정하는 규칙은 쉽지 않습니다. 또한, 배열과 auto 관계를 정확하게 이해 하기 위해서는 배열 이름의 의미를 정확히 파악하는 것이 좋습니다.

<!--more-->

   

### auto

- auto 타입 추론 규칙
  - 값 타입으로 선언 할 때
    - 우변 수식이 가진 reference(&), const, volatile 속성을 제거하고 타입 결정
  - 참조 타입으로 선언 할 때
    - 우편 수식이 가진 reference(&) 속성만 제거 되고 const, volatile 속성은 유지됨
  - 주의사항 : 변수 자체의 const 속성만 제거됨

```cpp
int main()
{
	int n = 10;
	int& r = n;
	const int c = n;
	const int& cr = c;

	// auto : 값 복사 방식
	auto a1 = n;	// int
	auto a2 = r;	// int -> 값을 가지고 타입을 결정하므로 int&이 아님
	auto a3 = c;	// int -> const 속성 무시됨
	auto a4 = cr;	// int -> const, & 속성 무시됨


	auto& a5 = n;	// auto : int   a5 : int&
	auto& a6 = r;	// auto : int   a6 : int&
	auto& a7 = c;   // auto : const int a7 : const int& 
	auto& a8 = cr;	// auto : const int a8 : const int&

	// 주의 사항
	const char* s1 = "hello"; // s1 자체는 const 아님
							  // s1을 따라가면 const
	auto a9 = s1;	// const char*

	const char* const s2 = "hello";
	auto a1ㄴ0 = s2;  // const char*
}
```

- 생각 해보기 : int 일까 int& 일까

```cpp
#include <iostream>
using namespace std;

int main()
{
	int  n = 10;
	int& r = n;

	auto a = r; // a ? int ? int&
	a = 30;

	cout << n << endl; // 30 ? 10
}
```

{{< adsense >}}

### decltype

- decltype 타입 추론 규칙
  - 참조 타입으로 결정되는 경우 : (수식)이 lvalue로 판단 되는 경우

```cpp
int main()
{
	int  n = 0;
	int* p = &n;


	decltype(n) d1;	// int   // n = 10;
	decltype(p) d2;	// int*

					// (수식) : 수식이 lvalue라면 참조, 아니면 값 타입
	decltype(*p)  d3; // *p = 10;   int&
	decltype((n)) d4; // (n) = 10;  int& : 위의 n과 (n)의 추론 결과가 다름

	decltype(n + n) d5; // n+n = 10 가 될수 없다.  int 
	decltype(++n)   d6; // ++n = 10; ok..     int&
	//decltype(n++)   d7; // n++ = 10; error.   int

	int x[3] = { 1,2,3 };

	decltype(x[0]) d8;  // x[0] = 10; ok    int&
	auto a1 = x[0];		// int
}
```

- decltype(auto) 표현법

```cpp
int x = 10;

int& foo(int a, int b) 
{
	return x;
}

int main()
{
	auto ret1 = foo(1, 2); // int 

	// decltype(foo(1, 2))은 평가되지 않은 표현식(unevaluated expression) : 실제 함수 호출이 아닌 리턴 타입 조사 용도
	decltype( foo(1, 2) ) ret2 = foo(1,2);  // int&

	// C++14 : 우변을 보고 추론하되, auto의 규칙(참조성 제거)이 아닌 decltype의 규칙 적용
	decltype(auto) ret3 = foo(1, 2); // int&
}
```

  

### array name

- 배열의 이름은 배열의 주소가 아니다

```cpp
int main()
{
    int n; // 변수 이름 : n, 타입 : int
    int* p1 = &n;
    
    double d; // 변수 이름 : d, 타입 : double
    double* p2 = &d;
    
    int x[3] = { 1, 2, 3 }; // 변수 이름 : x, 타입 : int[3]
    
    // 배열 x의 주소
    int (*p3)[3] p3 = &x; // 배열의 주소
	int *p4 = x; // 배열의 이름은 첫번째 요소의 주소로 암시적 형변환 된 표현
    
    // P3와 P4에 +1 연산을 할 경우 결과가 다름
	printf("%p, %p\n", p3, p3 + 1); // 12 byte 차이
    printf("%p, %p\n", p4, p4 + 1);	// 4 byte 차이
    
    // p3 : 배열의 주소, *p3 : 배열
    (*p1)[0] = 10;
    
    // p4 : 요소의 주소, (int*)
    *p2 = 10;
}
```



### auto 관련 주의 사항

```cpp
#include <iostream>
#include <typeinfo>
#include <vector>
using namespace std;

int main()
{
	// 배열
	int x[3] = { 1,2,3 }; // x : int[3]

	auto  a1 = x;	// 배열을 넣을 경우 규칙에 의해 하단 타입으로 추론됨
					// int* a1 = x; 

	auto& a2 = x;	// int (&a2)[3] = x; // 가능한 표현이므로
					// a2 : int (&)[3]
	
	decltype(x) d;  // int [3]

	cout << typeid(a1).name() << endl; // int*
	cout << typeid(a2).name() << endl; // int(&)[3]
	cout << typeid(d).name() << endl;  // int [3]

	//------------------------

	auto a3 = 1;	// int
	auto a4{ 1 };	// int
	auto a5 = { 1 };// int vs initializer_list => initializer_list로 추론

	cout << typeid(a4).name() << endl;
	cout << typeid(a5).name() << endl;

	//--------------------------

	vector<int> v1(10, 0);
	auto a6 = v1[0];	// int

	vector<bool> v2(10, 0);
	auto a7 = v2[0];	// bool xx

	cout << typeid(a6).name() << endl; // int
	cout << typeid(a7).name() << endl; // bool이 아닌 temporary proxy 뒤에서 다룸
}
```

  

​    

[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)

