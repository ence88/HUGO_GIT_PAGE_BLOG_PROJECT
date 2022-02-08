---
title: "C++ 고급 문법 테크닉 - Perfect forwarding[8]"
date: 2021-04-27T06:00:00+09:00
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


Perfect forwarding 의 개념과 구현 방법을 배웁니다. forwarding reference 를 사용한 perfect forwarding을 알아 보겠습니다.

<!--more-->

   

### perfect forwarding 개념

함수가 인자를 받아서 다른 함수에게 원본 인자를 완벽하게 전달하는 개념

- const &로 인자를 받을 경우 완벽한 전달 불가

```cpp
#include <iostream>
using namespace std;

void goo(int& a) { cout << "goo" << endl; a = 30; }
void foo(int  a) { cout << "foo" << endl; }

// 인자가 훼손됨
template<typename F, typename A> 
void chronometry(F f, const A& arg)
{
	f(arg);
}

int main()
{
	int n = 0;
	chronometry(&goo, n); // goo(n)
	chronometry(&foo, 5); // foo(5) 실행시 수행시간.

	cout << n << endl; // 30
}
```

{{< adsense >}}

### perfect forwarding 구현

1. 함수 인자를 받을 때 참조를 사용해야 함
2. lvalue 참조와 rvalue 참조 2가지 타입에서 모두 작동해야 함
3. rvalue 인자는 전달 순간 이름이 생겨 lvalue로 판단되어 캐스팅이 필요함

```cpp
#include <iostream>
using namespace std;

void foo(int  a)  { cout << "foo" << endl; }
void goo(int& a)  { cout << "goo" << endl; a = 30; }
void hoo(int&& a) { cout << "hoo" << endl; }

// int&  : 정수형 lvalue
// int&& : 정수형 rvalue
// T&    : 모든 타입 lvalue
// T&&   : 모든 타입 lvalue와 rvalue를 받을수 있다. forwarding reference
template<typename F, typename T>
void chronometry(F f, T&& arg)
{
	//f(static_cast<T&&>(arg));
	f(std::forward<T>(arg)); // forward()가 결국
							// 내부적으로 위의 캐스팅
							// 수행.
}

int main()
{
	int n = 0;

	chronometry(&foo, 5);
	chronometry(&goo, n);
	chronometry(&hoo, 10);

	cout << n << endl;
}
```

  

### perfect forwarding 사용시 함수 리턴 주의사항

```cpp
#include <iostream>
using namespace std;

int x = 10;
int& foo(int  a) { return x; }

/*
// 컴파일 ok. 원본 함수가 참조를 리턴하면 버그
// auto 단독은 참조 속성을 제거 해버림 (auto의 규칙)
template<typename F, typename T>
auto chronometry(F f, T&& arg) 
{
	return f(std::forward<T>(arg));
}
*/

// 컴파일 ok. 원본 함수가 참조를 리턴해도 ok
template<typename F, typename T>
decltype(auto) chronometry(F f, T&& arg)
{
	return f(std::forward<T>(arg));
}

int main()
{
	int& ret = chronometry(&foo, 10);
	ret = 20;
	cout << x << endl;
}
```



### parameter pack을 활용한 perfect forwarding

- 아직 위험한 요소가 있지만 어느정도 완성이 된 예제
- 추후에 게시글에서 람다, invoke 등을 학습 후 보완

```cpp
#include <iostream>
using namespace std;

void foo(int a, int& b, double d) { b = 30; }
void goo() {}

template<typename F, typename ... Types>
decltype(auto) chronometry(F f, Types&& ... args)
{
	return f(std::forward<Types>(args)... );
}

int main()
{
	int x = 10;

	chronometry(&foo, 1, x, 3.4);
	chronometry(&goo);

	cout << x << endl; // 30
}
```

​    

### perfect forwarding 활용

- vector의 emplace_back
  - vector에 요소 삽입시 객체 생성 횟수를 줄일 수 있음

```cpp
#include <iostream>
#include <vector>
using namespace std;

class Point
{
	int x, y;
public:
	Point(int a, int b, int& c)  { cout << "Point()" << endl; }
	~Point()             { cout << "~Point()" << endl; }
	Point(const Point&)  
	{
		cout << "Point(const Point&)" << endl; 
	}
};

int main()
{
	vector<Point> v;

    // push_back 소멸자 호출 횟수 : 2
	//	Point p(1, 2);
	//	v.push_back(p);

	// emplace_back 소멸자 호출 횟수 : 1
	int n = 10;
	v.emplace_back(1, 2, n);
}
```

- 스마트포인터 생성시

```cpp
#include <iostream>
#include <memory>
using namespace std;

class Point
{
	int x, y;
public:
	Point(int a, int b) { cout << "Point()" << endl; }
	~Point() { cout << "~Point()" << endl; }
	Point(const Point&)
	{
		cout << "Point(const Point&)" << endl;
	}
};

int main()
{	
    // 메모리 할당 타이밍이 다름(단편화 발생 가능) 객체, 스마트포인터 관리객체
	//shared_ptr<Point> sp( new Point(1,2) );
	
    // 객체 할당시 최적화 가능성 관리 객체 할당과 객체 할당이 같은 타이밍에 발생
	shared_ptr<Point> sp
		= make_shared<Point>(1, 2);	
}
```

  

### std::forward 구현 해보기

lvalue를 인자로 받아서 T의 타입에 따라 lvalue 또는 rvalue로 캐스팅

```cpp
#include <iostream>
using namespace std;

void goo(int& a)  { cout << "goo" << endl; }
void hoo(int&& a) { cout << "hoo" << endl; }


template<typename T> T&& xforward(T& arg)
{
	return static_cast<T&&>(arg);
}

template<typename F, typename T>
void chronometry(F f, T&& arg)
{
	// lvalue T : int& => int&
	// rvalue T : int  => int&&
	f(xforward<T>(arg));
}

int main()
{
	int n = 0;

	chronometry(&goo, n);
	chronometry(&hoo, 10);

	cout << n << endl;
}
```

  

### move와 forward 캐스팅의 차이점

둘 다 비슷한데, 차이점을 명확하게 이해해야 적절한 사용이 가능함

> static_cast<T&&>(arg) -> T의 타입에 따라 rvalue 또는 lvalue 캐스팅

```cpp
// move
// 함수 인자 : lvalue와 rvalue 모두
// 동작 : 무조건 rvalue로 캐스팅되어 리턴
template<typename T> typename remove_reference<T>::type&& move(T&& obj)
{
    return static_cast<typename remove_reference<T>::type&&>(obj);
}

// forward
// 함수 인자 : lvalue로 판단되는 타입을 받아서
// 동작 : T에 따라 lvalue 또는 rvalue로 캐스팅하여 리턴
template<typename T> T&& forward(T& obj)
{
    return static_cast<T&&>(obj);
}
```

​    

### 사실 rvalue를 인자로 받는 forward reference도 필요함

- 표준 forward에서는 lvalue와 rvalue를 모두 인자로 받아서 rvalue를 리턴하는 방식도 구현되어 있음
- wrapper 클래스에서 특정 함수의 리턴값을 forwarding 하는 경우, 특정 함수가 lvalue, rvalue 둘다 리턴 할 수 있기 때문에

```cpp
#include <iostream>
#include <type_traits>
using namespace std;

template<typename T> T&& xforward(typename remove_reference<T>::type& arg)
{
	return static_cast<T&&>(arg);
}

struct Arg
{
	int i = 1;
	int  get() && { cout << "&&" << endl; return i; } // call to this overload is rvalue
	int& get() &  { cout << "&" << endl; return i; }  // call to this overload is lvalue
};
void foo(int&)  { cout << "foo int&" << endl;}
void foo(int&&) { cout << "foo int&&" << endl; }

template<class T>
void wrapper(T&& arg)
{
	using Type = decltype(xforward<T>(arg).get());
	foo(xforward<Type>( xforward<T>(arg).get()) );
}

int main()
{
	wrapper(Arg());

	Arg a;
	wrapper(a);
}
```



### copy와 move를 지원하는 클래스의 setter 예제

클래스 사용자에게 세팅시 move와 copy 선택권을 제공 할 수 있음

- 방법1 : setting를 복사 버전과 이동 버전 2가지 제공
- 방법2 :  값 전달을 이용(약간의 오버헤드 move 1회 추가 발생, 무시할만 함)
- 방법3 :  forwarding reference 사용(방법2의 오버헤드 없고, 방법 1의 구현을 컴파일러에게 일임)
  - side effect 고려해야 함(템플릿 이기 때문에 타입 검사를 하지 않을 경우 엉뚱한 타입을 대입 할 수 있음)

```cpp
// 선행조건 : Data 객체가 이동 대입 연산을 구현해야 함
class Test
{
    Data data;
public:
    /* 방법1 
    // copy setter
    void setData(const Data& d) { data = d; }
    // move setter
    void setData(Data&& d) { data = move(d); }
    */
    
    /* 방법2
    void setData(Data d) { data = move(d); }
     */
    
    /* 방법3 */
    template<typename T> void Set(T&& a)
    {
        data = std::forward<T>(a);
	}
};

int main()
{
    Test test;
    
    Data d;
    test.setData(d); // copy
    test.setData(move(d)); // move
}
```

  

### std::function, std::bind

일반 함수 포인터의 단점 극복 가능

- std::function
  1. 함수 포인터 역할을 하는 템플릿
  2. 일반 함수 뿐 아니라 함수 객체, 람다 표현식 등도 담을 수 있음
  3. bind와 함께 사용하면 인자의 개수가 다른 함수(함수 객체)도 사용 할 수 있음

```cpp
#include <iostream>
#include <functinoal>

void foo(){}
void goo(int a){}

int main()
{
    void(*f)() = &foo;
    
    function<void()> f2 = &foo;
    
    f2(); // foo
    
    f2 = bind(&goo, 5);
}
```

- std::bind
  1. 함수 또는 함수 객체의 인자를 고정(캡쳐) 할 때 사용함
  2. 인자의 값을 고정(캡쳐) 할 때 값 방식을 사용
  3. 참조로 인자를 고정(캡쳐)하려면 ref() 또는 cref()를 사용

```cpp
void hoo(int& a){ a = 30; }

int main()
{
	int n = 0;
    
    function<void()> f;
    
	f = bind(&hoo, n); // 값으로 고정됨
  //f = bind(&hoo, ref(n); // 참조로 고정하는 방법 -> ref 사용 but 생명주기로 인해 위험 할 수 있음, 나중에 사용 할 때 파괴되었다면?
    
    f(); // hoo(n);
    
	cout << n << endl; // 의도(30)와 다르게 0이 나옴
}
```

- 인자를 값으로 전달 받을 때 forwarding 하는 방법(위의 ref의 원리)
  1. 주소를 전달
  2. 포인터를 참조로 암시적 형변환 시킴

```cpp
void foo(int& a) { a = 30; }

// reference_wrapper
//  - 참조(&)와 유사하게 동작하는 클래스 템플릿
//  - 포인터를 참조로 변환하는 대입연산 가능
//  - ref, cref를 구현 할 때 이 방식이 사용됨
//  - 표준에 구현되어 있음
template<typename T> struct reference_wrapper
{
    T* ptr;
public:
    reference_wrapper(T& r) : ptr(&r) {}
	
    operator T&() { return *ptr; }
};

template<typename T>
reference_wrapper<T> ref(T& obj)
{
    return refernece_wrapper<T>(obj);
}

int main()
{
    int n = 0;
	reference_wrapper<int> ref(n);
    
    int& r = ref;
    
    r = 30;
    
    cout << n << endl;
    
    ref(n); // 표준의 ref 구현
}
```

  

​    

[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)