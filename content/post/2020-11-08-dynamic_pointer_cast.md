---
title: "C++ 캐스팅 총정리(스마트포인터 캐스팅 포함)"
date: 2020-11-08T22:31:11+09:00
#Dev, C++
categories:
- Language
- C++
tags:
- C++
- std
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

#thumbnailImage: //example.com/image.jpg
---

캐스트는 자료형간 또는 포인터간 형변환시 사용됩니다. 

캐스트는 크게 묵시적 캐스트(implicit cast)와 명시적 캐스트(explicit cast) 두 가지로 나눌 수 있습니다.

특별히 캐스트 연산자를 사용하지 않고 형변환이 이루어지는 경우를 "묵시적 캐스트" 라고 합니다.

```c++
   int i = 10;
   char c = i;         // 묵시적 캐스트
   char c = (char) i;  // 명시적 캐스트 (c-style)
   char c = static_cast<char>(i) // C++ style
```

<!--more-->

### static_cast

정적 캐스트(static_cast) 의 특성은 이 묵시적 캐스트와 일차적으로 같다고 보면 됩니다.

묵시적 캐스트에는 컴파일 시점에서 무결성을 검사하는데 이때, ‘허용’ 과 ‘컴파일러에 의한 값 변환’ 이라는 두 가지 관점에서 이루어 집니다.

컴파일 타임에서 제약사항은 에러를 발생시킵니다. static_cast는 **형변환에 대한 타입체크를 run-time에 하지않고, compile 타임에 정적으로 수행**합니다.

```c++
float fdd = static_cast(intVal); //컴파일 가능
char dd = static_cast(intVal); //컴파일 가능
char* dd1 = static_cast<char*>(intVal); //컴파일 에러
```

- 제약사항

  struct 타입을 int나 double 타입으로 형변환 할 수 없고, float 타입을 포인터 타입으로 형변환 할 수 없습니다.

  게다가, static_cast는 표현식이 원래 가지고 있는 상수성(const)를 제거 할 수 없습니다.(이를 위해 별도로 const_cast가 존재합니다.)



### const_cast

const_cast는 표현식의 **상수성(const)을 없애는 데 사용**됩니다.

```c++
// 상수성 부여
char chArray[] = "Hello";
const char* chPointer = chArray;
const char* chPointer = const_cast<const char*>(chArray);
// 상수성 제거
const char* target = chArray;
char* removedCastValue = const_cast<char*>(target);
char* cStyle = (char*)target; // 이것도 OK이지만, C 스타일 캐스트는 지양
```



### reinterpret_cast

reinterpret_cast는 어떠한 포인터 타입도 어떠한 포인터 타입으로든 변환이 가능합니다.

- 어떠한 정수 타입도 어떠한 포인터 타입으로 변환이 가능하고, 그 역(포인터 타입->정수 타입)도 가능합니다.
- char* -> int 또는 int* 에서 char* 로 또는 any_class* 에서 another_Class* 로도 가능하다.

얼핏 봤을 때 상당히 자유롭고 강력한 캐스터 같지만, 특수한 케이스가 아니면 사용하지 않는 것을 권합니다.

우선, 전통적인 캐스팅의 개념에서 벗어날 수 있는 포인터 변환 등이 reinterpret_cast를 씀으로써 강제 형변환되기 때문입니다.

변환 관계에 놓인 두 개체의 관계가 명확하거나, 특정 목적을 달성하기 위할 때만 사용하는 것이 바람직합니다.

게다가 이 연산자가 적용된 후의 변환 결과는 거의 항상 컴파일러에 따라 다르게 정의되어 있습니다.

따라서, 이 캐스팅 연산자가 쓰인 소스는 직접 다른 곳에 소스 이식이 불가능할 수 있습니다.

```c++
// 포인터의 주소에 기반하여 해당 값을 해쉬로 정의하여 값을 반환함.
unsigned short Hash( void *p ) 
{
	// reinterpret_cast로 void* -> int 형변환
	// C 스타일 캐스팅 : val = (unsigned int)p;
	unsigned int val = reinterpret_cast<unsigned int>( p ); 
	return ( unsigned short )( val ^ (val >> 16) ); 
}
```



### dynamic_cast

dynamic_cast는 **런타임**에 (동적으로) 상속 계층 관계를 가로지르거나 다운캐스팅시 사용되는 캐스팅 연산자입니다.

기본 클래스 객체에 대한 포인터(*)나 레퍼런스(&)의 타입을 자식 클래스, 혹은 형제 클래스의 타입으로 변환 할 수 있습니다.

캐스팅의 실패는 NULL(포인터)이거나 예외(참조자)를 보고 판별할 수 있습니다.

상속 관계에 있지만 virtual 멤버 함수가 하나도 없다면 다형성을 가진게 아니라 단형성이며,

dynamic_cast는 **다형성을 띄지 않은 객체간 변환은 불가능하며, 시도시 컴파일 에러**가 발생합니다.

또한 RTTI에 의존적이므로 변환 비용이 비쌉니다.

```c++
class BaseClass {...};
class DerivedClass : public BaseClass {...};

BaseClass* pBC = new DerivedClass;

// 정적으로 형변환. 형변환 자체만 수행
DerivedClass* pSDC = static_cast<DerivedClass*>(pBC);
/* Disassembly
	mov		eax, dword ptr [ebp - 14h] 
	mov		dword ptr [ebp - 20h], eax
*/

// 런타임에 동적으로 형변환 및 RTTI 체크
DerivedClass* pSDC = dynamic_cast<DerivedClass*>(pBC);
/* Disassembly
	push 	0
	push 	offset DerivedClass 'RTTI Type Descriptor' (0C7A01Ch)
	push 	offset BaseClass 'RTTI Type Descriptor' (0C7A094h)
	push 	0
	mov		eax, dword ptr [ebp - 14h]
	push		eax
	call		@ILT+715(___RTDynamicCast) (0C712D0h)
	add		esp, 14h
	mov		dword ptr [ebp - 2Ch], eax
*/
```



### static_cast VS. dynamic_cast (어떨때 써야 하나)

<static_cast> 정적으로 형변환을 해도 아무런 문제가 없다는 것은 이미 어떤 녀석인지 알고 있을 경우에 속할 것이고,

<dynamic_cast> 동적으로 형변환을 시도해 본다는 것은 이 녀석의 타입을 반드시 질의해 봐야 된다는 것을 의미합니다.

RTTI를 해야 하는 경우엔 dynamic_cast를 이용해 런타입의 해당 타입을 명확히 질의해야 하고, 그렇지 않은 경우엔 static_cast를 사용하여 변환 비용을 줄이는 것이 좋습니다.

```c++
// 비행기에 여러 직군의 사람들이 탑승했다.
// 한 승객이 갑자기 급성 맹장염에 걸려 의사가 급하게 수술을 해야 한다.
class Passenger {...};
class Student : public Passenger
{
	...
	void Study();
};
class Teacher : public Passenger
{
	...
	void Teach();
};
class Doctor : public Passenger
{
	...
	void Treat();
	void Operate();
};

int main()
{
	typedef vector<Passenger *> PassengerVector;
	PassengerVector passengerVect;

	Passenger* pPS = new Student();
	if ( pPS )
	{
		passengerVect.push_back( pPS );
		// 비행기 타자마자 공부한다고 치고~
		// pPS가 명확하게 어느 클래스의 인스턴스인지 알고 있다.
		// 이 경우엔 굳이 비용이 들어가는 dynamic_cast가 아닌, static_cast를 쓰는게 낫다.
		Student* pS = static_cast<Student *>( pPS );
		pS->Study();
	}

	Passenger* pPT = new Teacher();
	if ( pPT )
	{
		passengerVect.push_back( pPT );
	}
	
	// Doctor 역시 비슷하게 추가.

	...

	// 응급 환자 발생. passengerVect 중 의사가 있다면 수술을 시켜야 한다.
	PassengerVect::iterator bIter(passengerVect .begin());
	PassengerVect::iterator eIter(passengerVect .end());
	for( ; bIter != eIter; ++bIter )
	{
		// Passenger 포인터로 저장된 녀석들 중 누가 의사인지 구분해야 한다.
		// 런타임 다형성 체크에 의해 Doctor가 아닌 녀석들에 대한 형변환 결과는 NULL
		Doctor* pD = dynamic_cast<Doctor *>(*bIter);
		if ( pD )
		{
			pD->Operate();
		}
	}
}
```

만약, 위 코드의 전체 승객 중 의사를 찾아내는 과정에서 dynamic_cast가 아니라, static_cast를 사용하였다면 어떻게 될까?

static_cast는 동적 타입체크를 하지 않고, Student와 Teacher는 Person의 파생 클래스이므로 변환 연산 규정에도 위배되지 않으므로, 그냥 타입 변환이 일어납니다.

하지만, 변환 결과는 애초 기대했던 바와 전혀 다릅니다.

실제 Student 클래스 타입이지만, Doctor 클래스 타입으로 타입 변환이 되면서

- Doctor 클래스 고유 멤버 함수에 대한 접근이 불가능해집니다.
- 포인터가 가리키는 메모리 내용을 Doctor 클래스에 맞춰서 해석하기에 Student의 내용 중 일부가 Doctor 멤버 필드에 엉뚱하게 들어가거나, 슬라이스 문제가 발생할 수 있습니다.

다시 말해, 껍데기만 Doctor 클래스이지 내용은 전혀 Doctor의 것이 아니게 된다는 것입니다.

이때 멤버 필드에 접근시 엉뚱한 값이 들어가 있거나, 런타임 오류가 발생할 수 있게 됩니다.

위 예제를 잘 보고 언제 static_cast와 dynamic_cast를 구분해서 쓰는 게 좋은지 잘 이해해야 합니다.



### 스마트포인터 형변환 static_pointer_cast / dynamic_pointer_cast / const_pointer_cast

포인터를 사용할때는 다른 포인터 타입으로의 캐스팅이 용이했는데, shared_ptr 등의 스마트포인터는 그렇지 않습니다.

이를 위해서 **((AnotherClass\*)(ptr.get()))** 와 같이 강제로 포인터를 얻어서 캐스팅을 해줄 수 있지만 전혀 C++  답지 못한 코드입니다.. 그래서 `static_cast, dynamic_cast, const_cast`에 해당하는 `static_pointer_cast, dynamic_pointer_cast, const_pointer_cast`가 추가되었습니다. 이로써 `dynamic_pointer_cast<AnotherClass>(ptr)`을 호출함으로써 안전하고도 편한 스마트 포인터 캐스팅이 가능해졌습니다.

```cpp
vector<shared_ptr<MediaAsset>> assets;

assets.push_back(shared_ptr<Song>(new Song(L"Himesh Reshammiya", L"Tera Surroor")));
assets.push_back(shared_ptr<Song>(new Song(L"Penaz Masani", L"Tu Dil De De")));
assets.push_back(shared_ptr<Photo>(new Photo(L"2011-04-06", L"Redmond, WA", L"Soccer field at Microsoft.")));

vector<shared_ptr<MediaAsset>> photos;

copy_if(assets.begin(), assets.end(), back_inserter(photos), [] (shared_ptr<MediaAsset> p) -> bool
{
    // Use dynamic_pointer_cast to test whether
    // element is a shared_ptr<Photo>.
    shared_ptr<Photo> temp = dynamic_pointer_cast<Photo>(p);		
    return temp.get() != nullptr;
});

for (const auto&  p : photos)
{
    // We know that the photos vector contains only 
    // shared_ptr<Photo> objects, so use static_cast.
    wcout << "Photo location: " << (static_pointer_cast<Photo>(p))->location_ << endl;
}
```