---
title: "C++ Template Programming - Variadic Template[6]"
date: 2021-04-08T18:00:00+09:00
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

이번 포스팅에서는 C++11 에서 추가된 가변인자 템플릿의 기본 문법과 활용에 대해서 알아보겠습니다.

<!--more-->

  

### Variadic template

- 가변 인자 템플릿(클래스, 함수)의 기본 모양

```cpp
// 가변인자 클래스 템플릿
template<typename ... Types> class tuple
{
};

// 가변인자 함수 템플릿
template<typename ... Types> void foo(Types ... args) // args -> Parameter Pack
{
}

int main()
{
	tuple<int>      t1;   // Types : int
	tuple<int, int> t2;   // Types : int, int
	tuple<int, int, char> t3;

	tuple<> t4;

	foo(1);
	foo(1, 3.4); // Types : int, double   args : 1, 3.4  => parameter pack
	foo();
}
```



### Parameter pack

가변인자 템플릿에 전달되는 인자를 Parameter pack이라 함

```cpp
void goo(int n, double d, const char* s)
{

}
// Parameter Pack
template<typename ... Types> void foo(Types ... args)
{
	// args : Parameter Pack
	cout << sizeof...(args) << endl; // 3
	cout << sizeof...(Types) << endl; // 3

									  //goo(args); // error. 
	goo(args...); // args... : pack 안의 요소들을 , 를 사용해서 나열해 달라.
				  // goo( 1, 3.4, "aaa")
				  // args... : Pack Expansion
}

int main()
{
	foo();
	foo(1);
	foo(1, 3.4, "aaa"); // Types : int, double, const char*  
						// args : 1, 3.4, "aaa"
}
```

{{< adsense >}}

### Pack expansion

- Parameter Pack을 사용하는 패턴 -> 패턴1, 패턴2, 패턴3 ...

- Pack Expansion은 함수 호출의 인자 또는 list 초기화를 사용한 표현식에만 사용 할 수 있음

```cpp
#include <iostream>
using namespace std;

void goo(int a, int b, int c)
{
	cout << a << ", " << b << ", " << c << endl;
}

int hoo(int a) { return -a; }

// Pack Expansion
template<typename ... Types> void foo(Types ... args) // args : 1,2,3 
{
	//int ar[] = { args... }; // 1, 2, 3

	//int ar[] = { (++args)... }; // ++E1, ++E2, ++E3, ++1, ++2, ++3
	//int ar[] = { hoo(args...) }; // hoo(1,2,3) error

	int ar[] = { hoo(args)... }; // { hoo(1), hoo(2), hoo(3) }

	goo(args...); // goo( 1, 2, 3)
	goo(hoo(args)...); // goo( hoo(1), hoo(2), hoo(3))
	goo(hoo(args...)); // goo( hoo( 1,2,3)) // error



	for (int n : ar)
		cout << n << endl;
}

int main()
{
	foo(1, 2, 3);
}

```

- pair, tuple 관련 Pack Expansion 활용

```cpp
#include <iostream>
#include <tuple>
using namespace std;

// Type Expansion
template<typename ... Types> void foo()
{
	// Types : int, char
	pair<Types...>  p1; // pair<int, char>   ok
	tuple<Types...> t1; // tuple<int, char>  ok

	tuple<pair<Types...>> t2; // tuple<pair<int, char>>

							  //pair<tuple<Types...>> p2; // pair< tuple<int, char> >  error
	pair<tuple<Types>...> p3; // pair< tuple<int>, tuple<char>> ok

							  //tuple<pair<Types>...> t3; // tuple< pair<int>, pair<char>> error

	tuple<pair<int, Types>...> t4; // tuple< pair<int, int>, pair<int, char>> ok..
}

int main()
{
	foo<int, char>();
}
```



### Paramter pack의 각 요소 접근 방법

- Pack Exapnsion : 배열 또는 Tuple에 담아서 접근

- using recursive : 첫 번째 인자를 이름 있는 변수로 받아 재귀표현으로 처리

```cpp
void foo() {} // 재귀 종료 위해

template<typename T, typename ... Types>
void foo(T value, Types ... args)
{
    count << value << endl;
    
    foo(args...); // foo( 3.4, "AA")
    			  // foo("AA")
    			  // foo()
}

int main()
{
    foo(1, 3.4, "AA"); // value : 1, args : 3.4, "AA"
}
```

- fold expression 사용 ( C++ 17 )

  - 이항 연산자를 사용해서 parameter pack 안에 있는 요소에 연산을 수행하는 문법

    ```cpp
    #include <iostream>
    using namespace std;
    
    template<typename ... Types> void foo(Types ... args)
    {
    	int x[] = { args... }; // pack expansion 사용
    
    	int n = (args + ...); // fold expression
    						  // E1 op ( E2 op ( E3 op ( E4 op E5) ) )
    						  // 1 + (2 + (3 + (4 + 5)))
    
    	cout << n << endl;
    }
    int main()
    {
    	foo(1, 2, 3, 4, 5);
    }
    ```

      

  - 4가지 형태 존재 (args와 ... 의 위치에 따라)

    ```cpp
    #include <iostream>
    using namespace std;
    
    template<typename ... Types> void foo(Types ... args)
    {
    	int n1 = (args + ...);  // (1 + (2 + (3 + (4 + 5))))
    	int n2 = (... + args);  // ((((1 + 2) + 3) + 4) + 5)
    
    	int n3 = (args + ... + 10);  // (1 + (2 + (3 + (4 + (5 + 10)))))
    	int n4 = (10 + ... + args);  // (((( 10 + 1) + 2) + 3) + 4) + 5)
    
    	cout << n1 << endl;
    	cout << n2 << endl;
    	cout << n3 << endl;
    	cout << n4 << endl;
    }
    int main()
    {
    	foo(1, 2, 3, 4, 5);
    }
    ```

      

  - 활용 패턴

    ```cpp
    #include <iostream>
    #include <vector>
    using namespace std;
    
    vector<int> v;
    
    template<typename ... Types> void foo(Types ... args)
    {
    	int n1 = (args + ...); // (1 + (2 + 3) )
    
    	(v.push_back(args), ...); // ( v.push_back(1), (v.push_back(2), v.push_back(3)))
    
    	for (auto n : v)
    		cout << n << endl;
    }
    
    int main()
    {
    	foo(1, 2, 3);
    }
    ```

  

### 함수 리턴타입 구하기

```cpp
#include <iostream>
using namespace std;


int f(int a, double b) { return 0; }


// 가변 인자 템플릿 기술을 사용해서 함수의 리턴 타입을 구하는 코드 입니다.
template<typename T> struct result
{
	typedef T type;
};

template<typename R, typename ... Types> struct result<R(Types...)>
{
	typedef R type;
};

template<typename T> void foo(T& a) // 여기서 T는 int(int, double) 타입입니다.
{
	typename result<T>::type n;  

	cout << typeid(n).name() << endl;  // int 가 나와야 합니다.
}

int main()
{
	foo(f);
}
```



### 가변인자 템플릿과 상속을 활용한 Tuple 구현

```cpp
#include <iostream>
using namespace std;

// xtuple 
template<typename ... Types> struct xtuple
{
	static constexpr int N = 0;
};

template<typename T, typename ... Types>
struct xtuple<T, Types...> : public xtuple<Types...>
{
	T value;
	xtuple() = default;
	xtuple(const T& v, const Types& ... args) : value(v), xtuple<Types...>(args...) {}
	static constexpr int N = xtuple<Types...>::N + 1;
};

// xtuple_element_type
template<int N, typename T> struct xtuple_element_type;

template<typename T, typename ... Types>
struct xtuple_element_type<0, xtuple<T, Types...>>
{
	typedef T type;
	typedef xtuple<T, Types...> tupleType;
};

template<int N, typename T, typename ... Types>
struct xtuple_element_type<N, xtuple<T, Types...>>
{
	typedef typename xtuple_element_type<N - 1, xtuple<Types...>>::type      type;
	typedef typename xtuple_element_type<N - 1, xtuple<Types...>>::tupleType tupleType;
};

// get
template<int N, typename T> typename xtuple_element_type<N, T>::type& xget(T& tp)
{
	return static_cast<typename xtuple_element_type<N, T>::tupleType&>(tp).value;
}

int main()
{
	xtuple<int, double, char> t3(1, 3.4, 'A');

	xget<0>(t3) = 10;

	cout << xget<0>(t3) << endl; // 10
	cout << xget<1>(t3) << endl; // 3.4
	cout << xget<2>(t3) << endl; // 'A'
}
```

  

### Tuple의 모든 요소 출력하기

- std tuple의 index 자리에는 변수를 사용 할 수 없으므로 loop 순회가 불가능
- std의 index_squence를 활용하면 모든 요소를 순회 하는 표현이 가능

```cpp
#include <iostream>
#include <tuple>
using namespace std;

// template<size_t ... N> struct index_sequence {};

template<typename TP, size_t ... I > 
void print_tuple_imp(const TP& tp, const index_sequence<I...>& ) // I : 0, 1, 2
{
	int x[] = { get<I>(tp)... }; // get<0>(tp), get<1>(tp), get<2>(tp)

	for (auto& n : x)
		cout << n << ", ";
}

template<typename TP> void print_tuple(const TP& tp)
{
	print_tuple_imp(tp, make_index_sequence<tuple_size<TP>::value>());
}

int main()
{
	tuple<int, int, int> tp(1, 2, 3);

	print_tuple(tp);
}
```





  

[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)
