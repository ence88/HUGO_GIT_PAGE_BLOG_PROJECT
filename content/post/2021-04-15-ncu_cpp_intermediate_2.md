---
title: "C++ 고급 문법/테크닉 - C++ 중요 기본 문법 다시보기[2]"
date: 2021-04-15T11:00:00+09:00
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

#thumbnailImage: //example.com/image.jpgC스터디 내용작성 ㅇS이번 항이번 이버C++ 
---

C++ 버전과 역사에 대해서 알아보고, 기본 문법의 This call, New, Name mangling, Conversion 등에 대해 알아보겠습니다.

<!--more-->

  

### About C++

- www.isocpp.org : cpp 표준에서 운영하는 사이트
- 표준 cpp 발전 흐름 : C++98/04 -> C++11 -> C++14 -> C++17 -> C++20

![](https://isocpp.org/files/img/wg21-timeline-2019-07.png)

  

### This call

- 멤버함수의 호출원리

  - 멤버 함수는 1번째 인자로 객체의 주소(this) 가 암시적으로 추가된다. ( 개발자는 볼 수 없음 )
  - 전달되는 객체의 주소는 ecx 레지스터로 전달
  - static 멤버 함수는 인자로 객체의 주소(this) 가 추가되지 않는다. 그리하여 static 멤버 함수는 멤버 변수에 접근 할 수 없는 오류가 발생하는 것(this가 없기 때문 but 우회하는 트릭이 있음)
  - 멤버 함수에 this가 암시적으로 전달 되는 것을 this call이라고 함.

  ```cpp
  class Point
  {
  	int x = 0, y = 0;
  public:
  	void set(int a, int b) // void set(Point* const this, int a, int b)
  	{
  		x = a;	// this->x = a;
  		y = b;	// this->y = b;
  	}
  	static void foo(int a) // void foo( int a)
  	{
  		x = a;				// this->x = a;   변경해야 하는데.. this 가 없다. error
  	}
  };
  // cl this1.cpp /FAs  => this1.asm
  // g++ this1.cpp -S   => this1.s
  int main()
  {
  	Point::foo(10); // push 10
  					// call Point::foo
  
  	Point p1;
  	Point p2;
  
  	// this call
  	p1.set(10, 20);	// set(&p1, 10, 20)
  					// push 20
  					// push 10
  					// lea  ecx, &p1    rcx, &p1 // 객체 주소는 레지스터로
  					// call Point::set
  }
  ```

  

- 멤버함수 포인터

  ```cpp
  // 핵심 1. 일반 함수 포인터에 멤버함수의 주소를 담을수 없다.
  // 핵심 2. 일반 함수 포인터에 static 멤버함수의 주소를 담을수 있다.
  // 핵심 3. 멤버 함수 포인터 모양과 사용법.  .*   (p->*f3)()
  
  class Dialog
  {
  public:
  	void Close() {}
  };
  
  void foo() {}
  
  int main()
  {
  	void(*f1)() = &foo;
  	f1();
  
  //	void(*f2)() = &Dialog::Close; // error. this 가 추가되는 함수.
  
  	void(Dialog::*f3)() = &Dialog::Close; // ok.. 멤버 함수 포인터.
  
  	//f3(); // error. 객체(this)가 없다.
  
  	Dialog dlg;
  	//dlg.f3(); // dlg.Close()의 의미.. 하지만..f3이라는 멤버를 찾게된다.- error
  
  	//dlg.*f3(); // ".*" : pointer to member operator
  				// error. 연산자 우선순위 문제..
  
  	(dlg.*f3)(); // ok.. dlg.Close();	
  }
  ```

  

- 예제 1 - Thread 클래스 만들기

  ```cpp
  #include <iostream>
  #include <windows.h>
  using namespace std;
  
  // 라이브러리 내부 클래스
  class Thread
  {
  public:
  
  	void run()
  	{
  		CreateThread(0, 0, threadMain,(void*)this, 0, 0);
  	}
  
  	// 1. 아래 함수는 반드시 static 함수 이어야 합니다.
  	// 2. 아래 함수는 this가 없다. 그래서 함수 인자로
  	//    this를 전달하는 기술.
  
  	static DWORD __stdcall threadMain(void* p)
  	{
  		Thread* const self = static_cast<Thread*>(p);
  
  		self->Main(); // Main( self )
  
  		//Main(); // 가상함수 호출
  				// this->Main() => Main( this) 로 변해야 한다.
  
  		return 0;
  	}
  
  	virtual void Main() // void Main(Thread* const this)
  	{}
  };
  
  // 라이브러리 사용자 코드
  class MyThread : public Thread
  {
  public:
  	virtual void Main() { cout << "스레드 작업" << endl; }
  };
  
  int main()
  {
  	MyThread t;
  	t.run();	// 이순간 스레드가 생성되어서 
  				// 가상함수 Main()을 실행해야 합니다.
  	getchar();
  }
  ```



- 예제 2 - 타이머 개념을 사용해서 Clock 클래스 만들기

  ```cpp
  #include <iostream>
  #include <string>
  #include <map>
  using namespace std;
  
  class Clock
  {
  	static map<int, Clock*> this_map;
  	string name;
  public:
  	Clock(string n) : name(n) {}
  
  	void start(int ms)
  	{
  		int id = set_timer(ms, timerHandler );
  
  		this_map[id] = this;
  	}
  
  	// 핵심 1. 아래 함수는 반드시 static 멤버 이어야 합니다.
      // 인자가 1개 필요한데(id) non static 멤버 함수는 this가 암시적으로 전달 되기 때문
  	static void timerHandler(int id)
  	{
  		Clock* const self = this_map[id];
  
  		//cout << name << endl;	// this->name
  		cout << self->name << endl;
  	}
  };
  
  map<int, Clock*> Clock::this_map;
  
  int main()
  {
  	Clock c1("A");
  	Clock c2("\tB");
  
  	c1.start(1000); // 1000ms 에 한번씩 이름출력
  	c2.start(500);  // 500ms 에 한번씩 이름출력
  
  	process_message();
  }
  ```

  

- 다중 상속과 this

  ```cpp
  #include <iostream>
  using namespace std;
  
  class A
  {
  	int a;
  public:
  	void fa() { cout << this << endl; }
  };
  
  class B
  {
  	int b;
  public:
  	void fb() { cout << this << endl; }
  };
  
  class C : public A, public B
  {
  	int c;
  };
  
  int main()
  {
  	C obj;
  	cout << &obj << endl; // 1000
      
  	A* pA = &obj;
  	B* pB = &obj; // &obj + sizeof(A)
      
      obj.fa(); // fa(&obj)   cout << this => 1000
  	obj.fb(); // fb(&obj + sizeof(A)) cout << this => 1004
  
  	cout << &obj << endl; // 1000 
  	cout << pA   << endl; // 1000
  	cout << pB   << endl; // 1004
      
      void (C::*f)(); // 멤버 함수 포인터 ( 크기가 다중상속 일 때 커질 수 있음 )
  
  	cout << sizeof(f) << endl; // 32bit 환경에서 8
  
  	f = &C::fa; // f = { fa 주소, 0  };
  	f = &C::fb; // f = { fb 주소, sizeof(A)};
  
  	(obj.*f)(); // f.함수주소( &obj + f.this offset )
  }
  ```

  

- 멤버 변수 포인터

  ```cpp
  #include <iostream>
  using namespace std;
  
  class Point
  {
  public:
  	int x, y;
  };
  
  int main()
  {
  	int   n = 10;
  	int* p1 = &n;
  
  	//void(Point::*f)() = &Point::print; // 멤버 함수 포인터
  	
  	int Point::*p2 = &Point::x; // 멤버 변수 포인터
  							    // 0
  	int Point::*p3 = &Point::y; // 4
  								// C의 offset_of
  
  	//cout << p3 << endl;
  	printf("%d, %d\n", p2, p3);
  
  	Point pt;
  
  	pt.y = 10;
  	pt.*p3 = 20;
  
  	cout << pt.y << endl; // 20
  }
  ```

  

### Const Member Function

- 상수 멤버 함수의 필요성 : 변수 값을 변경하지 않는 모든 "멤버 함수"는 "상수 멤버함수"를 권장

  1. const 객체를 사용하는 코드에서 대상의 구현이 .h와 .cpp로 나눠져 있을 때 .h 파일만 include 하여도 상수 멤버 함수 속성을 통해 에러를 발생시킬 지 판단 가능

     ```cpp
     #include <iostream>
     using namespace std;
     
     class Point
     {
     public:
     	int x, y;
     
     	Point(int a = 0, int b = 0) : x(a), y(b) {}
     
     	void set(int a, int b) 
     	{
     		x = a; 
     		y = b; 
     	}
     	void print()  //const	// const를 붙이면 상수 멤버 함수
     	{
     	//	x = 10;	// error. 모든 멤버를 상수 취급한다.
     
     		cout << x << ", " << y << endl;
     	}
     };
     
     int main()
     {
     	const Point p(1, 1);
     
     	p.x = 10;		// error
     	p.set(10, 20);	// error
     	p.print();		// ok or error.
     }
     ```

  2. 상수 객체는 상수 멤버 함수만 호출 가능

     ```cpp
     // 객체의 상태를 변경하지 않은 모든 멤버함수는(getxxx)
     // 반드시 const 멤버 함수가 되어야 한다.
     struct Rect
     {
     	int ox, oy, width, height;
     
     	Rect(int x = 0, int y = 0, int w = 0, int h = 0) 
     		: ox(x), oy(y), width(w), height(h) {}
     
     	int getArea() const {	return width * height; }
     };
     
     void foo(  const Rect& r) // call by value 보다는 const & 가 좋다.
     {
     	int n = r.getArea(); // error.
     }
     
     int main()
     {
     	Rect r(0, 0, 10, 10);
     
     	int n = r.getArea(); // ok.
     
     	foo(r);
     }
     ```

     

- 논리적 상수성 : 상수 멤버 함수에서 변할 수 있는 대상을 지정 할 수 있음

  1. mutable 키워드 사용

  ```cpp
  #include <iostream>
  using namespace std;
  
  class Point
  {
  	int x, y;
  
  	// mutable  멤버 변수 : 상수멤버함수 안에서도 값을 변경가능.
  	mutable char cache[16];
  	mutable bool cache_valid = false;
  public:
  	Point(int a = 0, int b = 0) : x(a), y(b) {}
  	
  	// 캐싱된 값을 사용하는 상수 멤버함수 toString 구현
  	const char* toString() const
  	{
  		if (cache_valid == false)
  		{
  			sprintf(cache, "%d, %d", x, y);
  			cache_valid = true;
  		}
  		return cache;
  	}
  };
  
  int main()
  {
  	Point p1(1, 1);
  
  	cout << p1.toString() << endl;
  	cout << p1.toString() << endl;
  
  }
  ```

  2. 데이터 객체 포인터 사용

  ```cpp
  #include <iostream>
  using namespace std;
  
  struct Cache
  {
  	char cache[16];
  	bool cache_valid = false;
  };
  
  class Point
  {
  	int x, y;
  	Cache* pCache;
  public:
  	Point(int a = 0, int b = 0) : x(a), y(b) 
  	{
  		pCache = new Cache;
  	}
  
  	const char* toString() const
  	{
  		if (pCache->cache_valid == false)
  		{
  			sprintf(pCache->cache, "%d, %d", x, y);
  			pCache->cache_valid = true;
  		}
  		return pCache->cache;
  	}
  	~Point() { delete pCache; }
  };
  
  int main()
  {
  	Point p1(1, 1);
  
  	cout << p1.toString() << endl;
  	cout << p1.toString() << endl;
  }
  ```

  

### New

- new vs operator new

  - new : 메모리 할당 + 생성자 호출
  - operator new : 메모리만 할당
  - delete도 같은 방식으로 동작(소멸자 관련)

  ```cpp
  #include <iostream>
  using namespace std;
  
  class Point
  {
  	int x, y;
  public:
  	Point()  { cout << "Point()"  << endl; }
  	~Point() { cout << "~Point()" << endl; }
  };
  
  int main()
  {
      /*
  	// malloc : 메모리만 할당
  	Point* p1 = (Point*)malloc(sizeof(Point));
  	free(p1);
  	// new : 메모리 할당 + 생성자 호출
  	Point* p2 = new Point;	
  	delete p2;									
  	*/
      
  	Point* p1 = static_cast<Point*>(
  				operator new(sizeof(Point)));
  
  	operator delete(p1);
  }
  ```

  

- placement new : 생성자를 호출하기 위해 표준에서 만든 new

  ```cpp
  #include <iostream>
  using namespace std;
  
  class Point
  {
  	int x, y;
  public:
  	Point()  { cout << "Point()" << endl; }
  	~Point() { cout << "~Point()" << endl; }
  };
  
  /* cpp 표준에서 생성자를 호출하는 표현
  void* operator new(size_t sz, void* p)
  {
  	return p;
  }
  */
  
  int main()
  {
  	Point p;	
  
  	//new Point; // 인자가 1개인 operator new()호출.
  
  	new(&p) Point; // 인자가 2개인 operator new()호출.
  					// 메모리 할당이 아닌 생성자를
  					// 명시적으로 호출하는 코드
  	p.~Point(); 
  }
  ```

  

- 생성자(소멸자)의 명시적 호출이 필요한 이유

  - 객체를 힙에 10개 만들 때 (활용 -> stl의 vector 생성시)

  ```cpp
  #include <iostream>
  using namespace std;
  
  class Point
  {
  	int x, y;
  public:
  	Point(int a, int b) : x(a), y(b) 
  	{
  		cout << "Point(int, int)" << endl;
  	} 
  };
  
  int main()
  {
  	// Point 객체를 힙에 한개 만들고 싶다.
  	Point* p1 = new Point(0, 0); // ok.
  
  
  	// Point 객체를 힙에 10개 만들고 싶다.
  	//Point* p2 = new Point[10]; // error.
  
  	// 1. 메모리만 먼저 힙에 할당
  	Point* p2 = static_cast<Point*>(operator new(sizeof(Point) * 10));
  	
  	// 2. 할당한 메모리에 객체를 생성(생성자 호출)
  	for (int i = 0; i < 10; i++)
  		new(&p2[i]) Point(0,0);
  
  
  	// 3. 소멸자 호출
  	for (int i = 9; i >= 0; i--)
  		p2[i].~Point();
  
  	// 4. 메모리 해지.
  	operator delete(p2);
  	
      // 활용 stl vector
  	vector<Point> v(10, Point(0,0));
  }
  ```

  - stl의 vector 관련 추가 설명 -> 소멸자의 명시적 호출이 필요 한 케이스

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;
  
  int main()
  {
  	vector<int> v(10, 0);
  	v.resize(7);
  	cout << v.size() << endl; // 7
  	cout << v.capacity() << endl; // 10
  
  
  	// DBConnect : 생성자에서 DB 접속을 한다고 가정
  	vector<DBConnect> v2(10);
  
  	v2.resize(7); // 메모리는 제거하지 않지만
  				  // 줄어든 객체의 소멸자는 호출해야한다
  				
  	v2.resize(8); // 새로운 객체에 대한 메모리는 있다
  				  // 하지만 생성자를 호출해서
  				  // 다시 DB 접속을 해야 한다.
  }
  ```

  

### Name mangling 

컴파일러가 심볼의 이름을 변경하는 현상

- name mangling : 함수 오버로딩, namespace, template

  ```cpp
  int square(int n)		// 어셈블리 함수 이름 : squarei()
  {
  	return n * n;
  }
  
  double square(double d)	// squared()
  {
  	return d * d;
  }
  
  int main()
  {
  	square(3);		// squarei(3)
  	square(3.3);	// squared(3.3)
  }
  ```

  

- extern "C" : C 컴파일러에서는 name mangling 규칙이 적용되지 않아 c 파일을 c++ 컴파일러에서 사용시 링킹 오류를 막기 위한 방법

  ```cpp
  // 함수 선언 헤더 파일에서 __cplusplus와 exten "C"를 조합해서 사용
  
  // square.h
  //extern "C" // C++ 컴파일러에게 C 처럼 해석해 달라.
  
  #ifdef __cplusplus
  extern "C" {
  #endif
  
  	int square(int);
  
  #ifdef __cplusplus
  }
  #endif
  ```

  

- 같은 이름의 함수와 함수주소

  ```cpp
  #include <cstdio>
  
  int square(int n)
  {
  	return n * n;
  }
  double square(double d)	
  {
  	return d * d;
  }
  void foo(int a) 
  {
  }
  
  int main()
  {
  	//printf("%p\n", &square); // error
  
  	//printf("%p\n", static_cast<int(*)(int)>(&square)); // ok.
  
  	//auto p = &square; // error
  
  	int(*f)(int) = &square; // ok
      
      void(*f1)(int) = &foo; // ok. 함수 주소 꺼내기
  	void(*f2)(int) = foo;  // 함수 이름은 함수 주소로 암시적 형변환
  
  	typedef void(*PF)(int); // 함수 포인터 타입
  	typedef void F(int);    // 함수 타입..
  
  	cout << typeid(&foo).name() << endl; // void(*)(int)
  	cout << typeid(foo).name() << endl;  // void(int)
  }
  ```

  

### Constructor

- 생성자 호출순서

  1. 자식 클래스 생성시 부모 클래스의 생성자가 먼저 호출된다.
  2. 부모 클래스의 생성자는 항상 디폴트 생성자가 호출된다.
  3. 부모 클래스의 디폴트 생성자가 없는 경우 자식 클래스 객체를 만들 수 없다.
  4. 부모 클래스의 다른 생성자를 호출하려면 자식 클래스 생성자의 초기화 리스트에서 명시해야 한다.

  ```cpp
  #include <iostream>
  using namespace std;
  
  class Base
  {
  public:
  //	Base()      { cout << "B()"    << endl; }
  	Base(int a) { cout << "B(int)" << endl; }
  	~Base()     { cout << "~B()"   << endl; }
  };
  
  class Derived : public Base
  {
  public:
  	Derived()     : Base(0) { cout << "D()" << endl; }
  	Derived(int a): Base(a) { cout << "D(int)" << endl; }
  	~Derived()     { cout << "~D()" << endl; }
  };
  
  int main()
  {
  	//Derived d;
  	Derived d(5);
  }
  ```

  ```cpp
  class Point
  {
  	int x, y;
  public:
  //	Point()             : x(0), y(0) {}
  	Point(int a, int b) : x(a), y(b) {}
  };
  class Rect
  {
  	Point p1;
  	Point p2;
  public:
  	Rect() : p1(0,0), p2(0,0) //: p1(), p2()
  	{
  	}
  };
  
  int main()
  {
  	Rect r; // 순서 p1 생성자 -> p2 생성자 -> Rect 생성자
  }
  ```

  

- 멤버를 가지고 있는 상속관계 생성자 호출 순서

  1. 부모 클래스 멤버의 생성자
  2. 부모 클래스의 생성자
  3. 자식 클래스 멤버의 생성자
  4. 자식 클래스의 생성자

  ```cpp
  #include <iostream>
  using namespace std;
  
  struct BM { BM() { cout << "BM()" << endl; } };
  struct DM { DM() { cout << "DM()" << endl; } };
  
  struct Base
  {
  	BM bm;
  	int x;
  	Base() { cout << "Base()" << endl; }
  };
  
  struct Derived : public Base
  {
  	DM dm;
  	int y;
  	Derived() : dm(), Base()
  	{
  		cout << "Derived()" << endl; 
  	}
  };
  
  int main()
  {
  	Derived d; // BM() -> Base() -> DM() -> Derived()
  }
  ```



- 생성자 호출순서 관련 주의사항

  - `mystream(int sz) : buf(sz), stream(buf) {}`이렇게 buf를 초기화 하는 것으로 표현 해도 절대적 초기화 순서에 의해 버그가 발생함

  ```cpp
  #include <iostream>
  using namespace std;
  
  struct stream_buf
  {
  	stream_buf(size_t sz) 
  	{ 
  		cout << "stream_buf" << endl; 
  	}
  };
  // 생성자로 버퍼를 받는 객체
  struct stream
  {
  	stream(stream_buf& buf) 
  	{
  		cout << "stream : using stream_buf" << endl; 
  	}
  };
  
  // 버퍼를 가지고 있는 객체
  struct mystream : public stream
  {
  	stream_buf buf;
  public:
  	mystream(int sz) : buf(sz), stream(buf) {}
  };
  
  
  int main()
  {
  //	stream_buf buf(1024);
  //	stream st(buf);
  
  	mystream mst(1024);
  }
  ```

  - 해결 방법, 관리 클래스 만들고 다중상속을 이용해서 초기화 순서를 제어 (cpp 표준 스트림에서 사용 방식)

    ```cpp
    #include <iostream>
    using namespace std;
    
    struct stream_buf
    {
    	stream_buf(size_t sz)
    	{
    		cout << "stream_buf" << endl;
    	}
    };
    struct stream
    {
    	stream(stream_buf& buf)
    	{
    		cout << "stream : using stream_buf" << endl;
    	}
    };
    
    struct buf_manager
    {
    protected:
    	stream_buf buf;
    public:
    	buf_manager(size_t sz) : buf(sz) {}
    };
    
    struct mystream : public buf_manager, public stream
    {
    public:
    	mystream(size_t sz) : buf_manager(sz), stream(buf) {}
    };
    
    
    int main()
    {
    	mystream mst(1024);
    }
    ```

- 생성자에서는 가상함수가 동작하지 않음

  ```cpp
  #include <iostream>
  using namespace std;
  
  // 생성자에서는 가상함수가 동작하지 않는다.
  struct Base
  {
  	Base() { goo(); }
  	
  //	void foo() { goo(); }
  	virtual void goo() { cout << "Base::goo" << endl; }
  };
  
  struct Derived : public Base
  {
  	int x;
  
  	Derived() : x(10) {}
  	virtual void goo() { cout << "Derived::goo" << x << endl; }
  };
  
  int main()
  {
  	Derived d; // Base::goo
  }
  ```

  

- 생성자와 예외

  - 생성자에서 예외가 발생 할 경우 소멸자가 호출되지 않음( 문제 : 메모리 누수 발생 가능 )

  ```cpp
  #include <iostream>
  using namespace std;
  
  struct Resource
  {
  	Resource()  { cout << "acquire Resource" << endl; }
  	~Resource() { cout << "release Resource" << endl; }
  };
  
  class Test
  {
  	Resource* p;
  public:
  	Test() : p( new Resource )
  	{
  		cout << "Test()" << endl;
  		throw 1;
  	}
  	~Test()
  	{
  		delete p;
  		cout << "~Test()" << endl;
  	}
  };
  int main()
  {
  	try
  	{
  		Test t;
  	}
  	catch (...)
  	{
  		cout << "예외 발생" << endl;
  	}
  }
  ```

  - 위 문제 해결 방법1 -> 스마트 포인터 사용

  ```cpp
  #include <iostream>
  #include <memory>
  using namespace std;
  
  struct Resource
  {
  	Resource() { cout << "acquire Resource" << endl; }
  	~Resource() { cout << "release Resource" << endl; }
  };
  
  class Test
  {
  //	Resource* p;
  	unique_ptr<Resource> p;
  public:
  	Test() : p(new Resource)
  	{
  		cout << "Test()" << endl;
  		throw 1;
  	}
  	~Test()
  	{
  		//delete p;
  		cout << "~Test()" << endl;
  	}
  };
  
  int main()
  {
  	try
  	{
  		Test t;
  	}
  	catch (...)
  	{
  		cout << "예외 발생" << endl;
  	}
  }
  ```

  - 해결방법 2 -> 예외 가능성이 있는 어떠한 작업도 하지 않음, ex) 자원 할당 전용 함수 구현
    장점 : 가상 함수 사용 가능
    단점 : 초기화 의미의 함수를 두번 작성해야함

  ```cpp
  #include <iostream>
  #include <memory>
  using namespace std;
  
  struct Resource
  {
  	Resource() { cout << "acquire Resource" << endl; }
  	~Resource() { cout << "release Resource" << endl; }
  };
  
  // 해결책 2. two-phase constructor
  
  class Test
  {
  	Resource* p;
  public:
  	Test() : p(0)
  	{
  		// 예외 가능성이 있는 어떠한 작업도 하지 않는다.
  		// 가상함수 호출()
  	}
  
  	// 자원 할당 전용함수
  	void Construct()
  	{
  		p = new Resource;
  		//cout << "Test()" << endl;
  		// 가상함수 호출()
  		throw 1;
  	}
  
  	~Test()
  	{
  		delete p;
  		cout << "~Test()" << endl;
  	}
  };
  
  
  int main()
  {
  	try
  	{
  		Test t;
  		t.Construct(); // 필요한 자원 할당.
  	}
  	catch (...)
  	{
  		cout << "예외 발생" << endl;
  	}
  }
  ```

    

### Trivial

- Trivial 개념

  - 하는 일이 없는 경우

  ```cpp
  #include <iostream>
  #include <type_traits>
  using namespace std;
  
  class A
  {
  public:
  	//virtual void foo() {} virtual 키워드를 붙일 경우 하는 일이 있는 것으로 봄
      virtual void foo() {}
  };
  
  int main()
  {
  	cout << is_trivially_constructible<A>::value << endl;
  }
  ```

  

- Trivial 활용

  - 복사 생성자가 구현되있을 경우와 아닌 경우 처리를 다르게 하고 싶을 때 (객체 생성시 깊은복사, 얕은복사 선택 등)

  ```cpp
  #include <iostream>
  #include <type_traits>
  using namespace std;
  
  template<typename T> void copy_type(T* dst, T* arc, int sz)
  {
  	if (is_trivially_copyable<T>::value)
  	{
  		cout << "복사 생성자가 trivial" << endl;
  		memcpy(dst, src, sizeof(T)*sz);
  	}
  	else
  	{
  		cout << "복사 생성자가 trivial 하지 않은 경우" << endl;
  		while (sz--)
  		{
  			new(dst) T(*src);
  			++dst, ++src;
  		}
  	}
  }
  
  int main()
  {
      char s1[20] = "hello world";
      char s2[20] = { 0 };
      
      copy_type(s1, s2, 20); // 모든 타입의 array를 복사하는 함수
  }
  ```

  

- Trivial로 판단되는 조건 정리

  - virtual 함수가 아니어야 함
  - 생성자가 없거나 구현되 있을 경우 default 키워드를 사용해야 함
  - 객체형 멤버가 없거나, 객체 멤버의 생성자가 trivial 해야 함
  - 상속 관계가 없거나, 부모 클래스의 생성자가 trivial 해야 함
  - 멤버 변수 초기화 문법이 없어야함 ex) int a = 10;

    

### Conversion

변환 연산자, 변환 생성자, explicit, nullptr 만들기 등

- 변환연산자 : 사용자 타입 -> 시스템 타입

  ```cpp
  #include <iostream>
  using namespace std;
  
  class Point
  {
  	int x, y;
  public:
  	Point()             : x(0), y(0) {}
  	Point(int a, int b) : x(a), y(b) {}
  
  	// 변환 연산자 : 객체를 다른 타입으로 변환할때 호출된다.
  	// 특징 : 리턴 타입을 표기하지 않는다.
  	operator int()
  	{
  		return x;
  	}
  };
  
  int main()
  {
  	int    n = 3;
  	double d = n; // 암시적 형변환 발생.
  
  	Point p1(1, 2);
  	n = p1;		// 객체를 int에 대입할 때, 변환 연산자 필요 p1.operator int()
  
  	cout << n << endl; // 1
  }
  ```



- 변환 생성자 : 시스템 타입 -> 사용자 타입

  ```cpp
  #include <iostream>
  using namespace std;
  
  // Point => int : 변환 연산자   p.operator int()
  // int => Point : 변환 생성자   Point(int)
  
  class Point
  {
  	int x, y;
  public:
  	Point()				: x(0), y(0) {}
  	Point(int a, int b) : x(a), y(b) {}
  
  	// 인자가 한개인 생성자 -  변환 생성자
  	//							다른 타입이 Point로 변환 되게 한다.
  	Point(int a) : x(a), y(0) {}
  
  	operator int() 	{ return x; }
  };
  
  int main()
  {
  	Point p1;
  	Point p2(1, 1);
  
  	int n = 3;
  	Point p(1, 2);
  
  	n = p; // Point => int   p.operator int()
  	p = n; // int => Point   n.operator Point() 가 있으면 된다.
  		   //		         하지만, n은 사용자정의 타입이 아니다
  }
  ```

  

- 변환의 장점

  사용자 정의 타입을 기존 라이브러리의 필요 파라메터로 전달 할 수 있음

  ```cpp
  #include <iostream>
  using namespace std;
  // RAII : Resource Acquision Is Initialization
  class OFile
  {
  	FILE* file;
  public:
  	OFile(const char* filename, const char* mode = "wt")
  	{
  		file = fopen(filename, mode);
  	}
  	~OFile() {	fclose(file);	}
  
  	operator FILE*() { return file; }
  };
  int main()
  {
  	OFile f("a.txt");
  
  	// C 함수를 사용해서 파일 작업
  	fputs("hello", f);
  	fprintf(f, "n = %d", 10);	// OFile => FILE* 로 암시적 변환되면 가능.
  							// f.operator FILE*()
  	
  	String s1 = "hello";
  	char s2[10];
  
  	strcpy(s2, s1); // String => const char* 암시적 변환..
  }
  ```



- 변환의 단점

  - 의도하지 않은 변환이 발생되어 버그가 발생 할 수 있음

  ```cpp
  #include <iostream>
  using namespace std;
  
  class OFile
  {
  	FILE* file;
  public:
  	// explicit 생성자 : 인자가 한개인 생성자가 암시적 변환을
  	//					허용하는 것을 막는다.
  
  	explicit OFile(const char* filename, const char* mode = "wt")
  	{
  		file = fopen(filename, mode);
  	}
  	~OFile() { fclose(file); }
  
  	operator FILE*() { return file; }
  };
  
  void foo(OFile f) {}
  
  int main()
  {
  	OFile f("a.txt");
  	foo(f); // ok..
  
  	//foo("hello"); // const char* => OFile 로 암시적 변환 발생.
  				  // 변환 생성자
  	//foo(static_cast<OFile>("hello"));
  
  }
  ```

  

- explicit : 암시적 형변환 관련 처리를 제한 시킬 수 있음

  ```cpp
  class Test
  {
  	int value;
  public:
  	// explicit Test(int n) : value(n) {}
      Test(int n) : value(n) {}
  };
  
  int main()
  {
  	// 아래 2줄의 차이점은 ?
  	
  	Test t1(5);  // 인자가 한개인 생성자 호출
  				 // direct initialization
  
  	Test t2 = 5; // 1. 변환 생성자를 사용해서 5를 가지고 Test의 임시객체 생성
  				 // 2. 임시객체를 복사 생성자를 사용해서 t2에 복사
  				 // copy initialization
  				 // explicit 키워드를 사용하면 막을 수 있음
  }
  ```

  ```cpp
  #include <string>
  #include <memory>
  using namespace std;
  
  class String16
  {
  public:
  	explicit                    String16(const char16_t* o);
  };
  
  void foo(String16 s)  // String16 s = "hello"
  {}
  
  int main()
  {
  	foo("hello"); // error
  	foo(String16("hello")); // ok..
  
  
  	String16 s = "hello"; // error
  
  	// STL 의 string 클래스는 생성자가 explicit 가 아님.
  	string s1("hello");		// ok
  	string s2 = "hello";	// ok
  
  
  	shared_ptr<int> p1 = new int;	// error  생성자가 explicit
  	shared_ptr<int> p2(new int);	// ok..
  }
  ```

  

- nullptr 구현하기

  - 0에 관해 살펴보기

  ```cpp
  int main()
  {
  	int   n1 = 10; // ok
  	void* p1 = 10; // error.
  
  	int   n2 = 0; // ok
  	void* p2 = 0; // ok. 0은 정수지만 포인터로 암시적 형변환된다.
  }
  ```

  - 전통적인 NULL 정의

  ```cpp
  #include <iostream>
  using namespace std;
  
  void foo(int n)   { cout << "int" << endl; }	// 1
  void foo(void* p) { cout << "void*" << endl; }	// 2
  
  void goo(char* p) { cout << "goo" << endl; }	// 3
  
  int main()
  {
  	foo(0);			// 1
  	foo((void*)0);	// 2
  
  #ifdef __cplusplus
  	#define NULL	0
  #else
  	#define NULL (void*)0
  #endif
  
  	foo(NULL);		// 2
  
  	goo(NULL);	// void* => char* 로의 암시적 변환 필요.
  				// C   : ok
  				// C++ : 암시적 변환 안됨.
  }
  ```

  - 전통적인 c++에서의 문제점 : 정수 0은 있으나, 포인터 0이 없음

  ```cpp
  #include <iostream>
  using namespace std;
  
  void foo(int n)   { cout << "int" << endl; }	// 1
  void foo(void* p) { cout << "void*" << endl; }	// 2
  void goo(char* p) { cout << "goo" << endl; }	// 3
  
  
  struct xnullptr_t
  {
  	template<typename T>
  	operator T*() { return 0; }
  };
  xnullptr_t xnullptr; // 포인터 0
  
  // C++ 11: xnullptr == nullptr
  int main()
  {
  	foo(0);			// 1
  	foo(xnullptr);	// 2. xnullptr_t => void* 로의 암시적 변환 필요..
  					//    xnullptr.operator void*()
  	goo(xnullptr);  // 3 goo
  
  	int n = 0;
  	double* p1 = xnullptr;
  
  	double* p2 = nullptr; // C++11 의 포인터 0
  						  
  	nullptr_t a = nullptr;
  
  	int* p = a;
  }
  ```



- Return type resolver
  좌변의 타입을 보고 우변의 리턴값을 결정 하는 방법

  ```cpp
  #include <iostream>
  #include <cstdlib>
  using namespace std;
  
  class memAlloc
  {
  	int size;
  public:
  	inline memAlloc(int sz) : size(sz) {}
  
  	template<typename T> operator T*()
  	{
  		return (T*)malloc(size);
  	}
  };
  
  int main()
  {
  	double* p1 = memAlloc(40); // 클래스이름() : 임시객체, 함수가 아님
  							   // 임시객체.operator double*()
  	int*    p2 = memAlloc(40);
  
  }
  ```

  

- Safe bool : 객체를 조건문에 넣을 때 operator bool()로 암시적 형변환이 시도됨

  방법 1. bool 로 변환 - 단점. shift  연산이 허용된다.

  > operator bool() { return fail() ? false : true; }

  방법 2. void* 로의 변환 - C++ 98/03

  > operator void*() { return fail() ? 0 : this; }

  방법 3. 함수 포인터로의 변환.

  > typedef void(*F)();
  > operator F() { return fail() ? 0 : &true_function; }

  방법 4. 멤버 함수 포인터로의 변환. -> Safe BOOL

  ```cpp
  void true_function() {}
  
  class istream   // basic_istream
  {
  public:
  	bool fail() { return false; }
  
  	// 방법 1. bool 로 변환 - 단점. shift  연산이 허용된다.
  	//operator bool() { return fail() ? false : true; }
  
  	// 방법 2. void* 로의 변환 - C++ 98/03
  	// operator void*() { return fail() ? 0 : this; }
  
  	// 방법 3. 함수 포인터로의 변환.
  	//typedef void(*F)();
  	//operator F() { return fail() ? 0 : &true_function; }
  
  	// 방법 4. 멤버 함수 포인터로의 변환. - Safe BOOL
  	//          if() 문에 넣을수 있는 side effect가 가장 적다..
  	struct Dummy
  	{
  		void true_function() {}
  	};
  	typedef void(Dummy::*F)();
  	operator F() { return fail() ? 0 : &Dummy::true_function; }
  
  };
  istream cin;
  
  int main()
  {
  	int n = 0;
  	if ( cin ) {}
  //	cin << n;
  //	delete cin;
  
  //	void(*f)() = cin;
  }
  ```

  

- Explicit Conversion Operator (safe bool을 간결하게 구현 가능)

  ```cpp
  class istream
  {
  public:
  	bool fail() { return false; }
  
  	// C++11 부터는 변환 연산자 앞에도 explicit를 붙일수 있다.
  	// 암시적 변환은 error. 명시적 허용
  	// if 문안에 객체를 넣을수도 있다.
  	explicit operator bool() { return fail() ? false : true; }
  };
  istream cin;
  
  int main()
  {
  	int n = 0;
  
  	//bool b = cin; //error
  	bool b = static_cast<bool > (cin); // ok
  
  	//cin << n; // error
  
  	if ( cin ) {}  // ok
  	if ( cin == false ) {}// error
  }
  ```

  

- Brace-init(일관된 초기화)과 변환

  ```cpp
  class Point
  {
  	int x, y;
  public:
  	explicit Point(int a, int b) : x(a), y(b) {}
  };
  
  void foo(Point p) {}
  
  int main()
  {
  	foo({ 1,1 }); // error, explicit으로 인해
  
  //	Point p1(1, 1);
  
  //	Point p2{ 1, 1 };	// direct initialize (직접 초기화)
  
  //	Point p3 = { 1, 1 };// copy initialize. error (변환 생성 사용, explicit로 인해 error)
  }
  ```

  

  

[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)