---
title: "C++ 고급 문법/테크닉 - C++ 객체 초기화[5]"
date: 2021-04-22T00:30:00+09:00
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
C++11의 등장으로 객체를 초기화 하는 방법에는 많은 변화가 생겼습니다. 기존 초기화 방식의 문제점을 살펴 보고, "uniform initialization", "direct vs copy", "defalue vs value" 등 새로운 초기화 방법에 대해 살펴보겠습니다.
<!--more-->

​     

### C++98/03 초기화의 문제점

1. 객체의 종류에 따라 초기화 방법이 다름
2. 클래스의 일반 멤버로 있는 배열을 초기화 할 수 없음
3. 동적 메모리 할당으로 만들어진 배열을 초기화 할 수 없음
4. STL 컨테이너를 초기화 하는 편리한 방법이 없음

```cpp
int main()
{
	// 1. 객체(변수) 마다 초기화 방법이 상이함
	int n1 = 0;
	int n2(0);
	int ar[3] = { 1,2,3 };
	Point p = { 1,2 };		// 구조체
	complex c(1, 2);		// 클래스

	// 2. 내부 배열 초기화 불가
	class Test
	{
		int x[10];
	};

	// 3. 동적 할당 배열 초기화 불가
	int* p = new int[3];

	// 4. STL 컨테이너 간단하게 초기화 불가
	vector<int> v;
	for (int i = 0; i < 10; i++)
		v.push_back(1);
}
```

  

### Member initializer 관련 유의사항

```cpp
#include <iostream>
using namespace std;

int cnt = 0;

class Test
{
public:
//	int data = 0; // member initializer

	int data = ++cnt; // 생성자에서 초기화 할 경우 이 초기화 표현 적용 되지 않음

	Test() {}
	Test(int n) {} : data(n) {} // 생성자에서 멤버 초기화
};

int main()
{
	Test t1;	// data = 1	
	Test t2(3);	// data = 3

	cout << cnt << endl; // 1

	cout << t1.data << endl;
	cout << t2.data << endl;
}
```

  

### Uniform Initialization

일관된 초기화 : 객체의 형태에 상관 없이 중괄호({})를 사용해서 초기화 하는 것

```cpp
struct Point
{
	int x, y;
};

class Complex
{
	int re, im;
public:
	Complex(int r, int i) : re(r), im(i) {}
};

int main()
{
//  예전 초기화 방식
//	int n = 0;
//	int x[2] = { 1,2 };
//	Point p = { 1,2 };
//	Complex c(1, 2);

	int  n = { 0 };
	int  x[2] = { 1,2 };
	Point   p = { 1,2 };
	Complex c = { 1, 2 };
    
    /* 이런 식으로 표현해도 동작은 같음
	int  n{ 0 };
	int  x[2]{ 1,2 };
	Point   p{ 1,2 };
	Complex c{ 1, 2 };
	*/

	int n2 = 3.4; // ok
	//int n3 = { 3.4 }; // error. 데이터 손실은 오류로 처리(prevent narrow)

	//char c1{ 300 }; // error. 1 byte를 초과함으로 오류로 처리
	char c2{ 100 }; // ok

}
```

  

### Direct(직접 초기화) vs Copy(복사 초기화)

- 직접 초기화 : 초기화 시에 =을 사용하지 않는 것
- 복사 초기화 : 초기화시 =을 사용 하는 것

```cpp
int main()
{
	int n1 = 0; // copy initialization
	int n2(0);	// direct initialization

	int n3 = { 0 };
	int n4{ 0 };
}
```

- 둘의 차이점

```cpp
class Point
{
	int x, y;
public:
	// explicit : 변환 생성자로 사용될수 없다.
	//		      또하나의 의미, copy initialization 될수 없다.
	explicit Point()    		 : x(0), y(0) {}
	explicit Point(int a)        : x(a), y(0) {}
	explicit Point(int a, int b) : x(a), y(b) {}
};

int main()
{
	Point p1(5);	// ok.
	//Point p2 = 5;	// ok. 하지만 생성자 explicit 라면 error.

	Point p3(1, 1);		// ok
	//Point p4 = (1, 1);	// error.

	Point p5{ 1,1 };	// ok
	//Point p6 = { 1,1 };	// ok. 하지만 생성자 explicit 라면 error.

	Point p7;
	Point p8{};		// direct
	//Point p9 = {};  // copy. error
}
```

  

### Default(디폴트 초기화) vs Value(기본값 초기화)

- 기본 설명

```cpp
#include <iostream>
using namespace std;

int main()
{
	// direct initialization
	int n1(0);
	int n2{ 0 };    

	// copy initialization
	int n3 = 0;
	int n4 = { 0 }; 

	//---------------------------
	int n5;		// defalut initialization. 쓰레기값	
	int n6{};	// value initialization.   0으로 초기화

	cout << n5 << endl; // 쓰레기값
	cout << n6 << endl; // 0

	int n7(); // 주의. 초기화가 아닌 함수 선언 표현

}
```

- 사용자 정의 타입(클래스 등) 일 경우 주의사항

```cpp
#include <iostream>
using namespace std;

class Point
{
public:
	int x;
	int y;

    Point() {}
	//Point() = default;
};
int main()
{
	Point p1;   // default initialization
	Point p2{}; // value   initialization

	cout << p1.x << endl; // 쓰레기 값
	cout << p2.x << endl; // 쓰레기 값, 값 초기화를 의도 하였을 경우 Point() = default; 초기화를 사용 해야함
}
```

- 디폴트 초기화 관련 규칙 더 알아보기

```cpp
#include <iostream>
using namespace std;

int main()
{
	int n1;		// default. 쓰레기값
	int n2{};	// value.   0
	int n3();   // 함수선언.

	int* p1 = new int;	// default. 쓰레기값.
	int* p2 = new int();// value.   0
	int* p3 = new int{};// value.   0

	cout << *p1 << endl; // 쓰레기 값
	cout << *p2 << endl; // 0
	cout << *p3 << endl; // 0
}
```

  

### initializer_list

중괄호 초기화 표현 사용시 값이 2개 이상 나열 되어 있을 경우

```cpp
#include <iostream>
#include <initializer_list>
using namespace std;

int main()
{
	// brace-init-list
	// VC++ : int* first, *last
	// g++  : int* first, count
	initializer_list<int> s = { 1, 2, 3, 4, 5 };

	auto p = begin(s); // 상수를 가르키는 반복자
	//*p = 20; // 대입은 대상이 상수성을 띄므로 error

	cout << *p << endl; // 꺼내 쓰는 것은 OK
}
```

- 함수 인자로 활용

```cpp
#include <iostream>
#include <initializer_list>
using namespace std;

void foo( initializer_list<int> e )
{
	auto p1 = begin(e);
	auto p2 = end(e);

	for (auto n : e)
		cout << n << " ";
	cout << endl;
}

int main()
{
	initializer_list<int> e1 = { 1,2,3 }; // copy init도 가능
	initializer_list<int> e2{ 1,2,3,4,5 }; // direct init

	foo(e1);
	foo({ 1,2,3,4 });
	foo({ 1,2,3,4,5,6,7 });

}
```

- 클래스 생성자에서의 활용

```cpp
#include <iostream>
#include <initializer_list>
using namespace std;
class Point
{
	int x, y;
public:
    // 1번 생성자
	Point(int a, int b)           { cout << "int, int" << endl; }		
    // 2번 생성자
	Point(initializer_list<int> ) { cout << "initializer_list<int>" << endl; }
};

int main()
{
	Point p1(1, 1);	// 1번, 없다면 error
		
	Point p2( { 1, 1 } );  // 2번. {1,1} 변환생성자를 사용해서 임시객체생성. 복사생성자를 사용해서 p2복사
							// 없으면 error지만, explicit 가 아닐경우. 변환 생성.

	Point p3{ 1,1 }; // 2. 없으면 1번

	Point p4 = { 1,1 }; // 2. 없으면 1번.
	
	Point p5(1, 2, 3); // error
	
	Point p6{ 1,2,3 }; // 2번.
	
	Point p7 = { 1,2,3 };

	vector<int> v = { 1,2,3,4 };
}
```

- STL 컨테이너(vector) 초기화 예제

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main()
{
	vector<int> v = { 1,2,3,4,5 }; // ok. 편리해 졌다

	vector<int> v1(10, 3);  // 1번. 10개를 3으로 초기화
	vector<int> v2{ 10,3 }; // 2번, 2개의 요소를 10, 3으로 초기화

	cout << v1.size() << endl; // 10
	cout << v2.size() << endl; // 2
}
```

  

### aggregate initialization

구조체, 배열을 생성자 없이 중괄호 초기화로 초기화 가능

```cpp
#include <iostream>
using namespace std;

// aggregate type : {} 로 초기화 가능한것. 구조체, 배열.
struct Point
{
	int x, y;

//  만약 가상함수를 포함 할 경우 클래스로 취급되어 aggregate type이 아니게됨
//	virtual void foo() {}
};

int main()
{
	Point p1;			// 1. ok
	Point p2 { 1,2 };	// 2. ok
}
```



### 위의 C++98/03 초기화 문제점 해결

- 중괄호 초기화로 통일성이 생김

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main()
{
	// 1. 
	int n1{ 0 };
	int n2{ 0 };
	int ar[3]{ 1,2,3 };
	Point p = { 1,2 };		// 구조체
	complex c{ 1, 2 };		// 클래스

	// 2.
	class Test
	{
		int x[10]{ 1,2,3,4,5,6,7,8,9,10 };
	};

	// 3. 
	int* p = new int[3]{ 1,2,3 };

	// 4.
	vector<int> v{ 1,2,3 };
}
```

  

  

[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)