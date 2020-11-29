---
title: "visual studio 디버깅 팁"
date: 2020-11-16T21:30:53+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce, Blog
categories:
- Common
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- Debugging
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

**디버그 코드 변경 내용 적용 ALT + F10**

편집하며 계속하기를 시작하여 디버그 중인 코드에 변경 내용을 적용합니다.



<!--more-->

**함수의 반환 값 보기**

함수의 반환 값을 보려면 코드를 단계별로 실행하는 동안 **자동** 창에 표시되는 함수를 확인합니다. 함수의 반환 값을 보려면 관심 있는 함수가 이미 실행되었는지 확인합니다(현재 함수 호출에서 중지된 경우 **F10** 키를 누름). 창이 닫히면 **디버그 > Windows > 자동**을 사용하여 **자동** 창을 엽니다.

![자동 창](https://docs.microsoft.com/ko-kr/visualstudio/debugger/media/dbg-tips-autos-window.png?view=vs-2019)

또한 **직접 실행** 창에 함수를 입력하여 반환 값을 볼 수 있습니다. (**디버그 > Windows > 직접 실행**을 사용하여 엽니다.)

![직접 실행 창](https://docs.microsoft.com/ko-kr/visualstudio/debugger/media/dbg-tips-immediate-window.png?view=vs-2019)

**조사식** 및 **즉시 실행** 창에서 `$ReturnValue`와 같은 [의사 변수](https://docs.microsoft.com/ko-kr/visualstudio/debugger/pseudovariables?view=vs-2019)를 사용할 수도 있습니다.



**디버거 내장 함수를 사용하여 상태 유지**

디버거 내장 함수는 애플리케이션의 상태를 변경하지 않고 식에서 특정 C/C++ 함수를 호출하는 방법을 제공합니다.

디버거 내장 함수의 특징은 다음과 같습니다.

- 안전이 보장됩니다. 디버거 내장 함수를 실행하는 경우 디버깅 중인 프로세스가 손상되지 않습니다.

- 모든 식에서 허용됩니다. 파생 작업과 함수 실행이 허용되지 않는 시나리오에서도 허용됩니다.

- 미니덤프 디버깅과 같이 일반 함수 호출이 가능하지 않은 시나리오에서 작동합니다.

  디버거 내장 함수를 사용하면 식 계산도 보다 편리해질 수 있습니다. 예를 들어 `strncmp(str, "asd")` 는 `str[0] == 'a' && str[1] == 's' && str[2] == 'd'`보다 중단점 조건에서 작성하기가 훨씬 쉽습니다. )

| 영역            | 내장 함수                                                    |
| :-------------- | :----------------------------------------------------------- |
| **문자열 길이** | [strlen, wcslen](https://docs.microsoft.com/ko-kr/cpp/c-runtime-library/reference/strlen-wcslen-mbslen-mbslen-l-mbstrlen-mbstrlen-l), [strnlen, wcsnlen](https://docs.microsoft.com/ko-kr/cpp/c-runtime-library/reference/strnlen-strnlen-s) |
| **문자열 비교** | [strcmp, wcscmp](https://docs.microsoft.com/ko-kr/cpp/c-runtime-library/reference/strcmp-wcscmp-mbscmp), [stricmp, wcsicmp](https://docs.microsoft.com/ko-kr/cpp/c-runtime-library/reference/stricmp-wcsicmp), [_stricmp, _strcmpi, _wcsicmp, _wcscmpi](https://docs.microsoft.com/ko-kr/cpp/c-runtime-library/reference/stricmp-wcsicmp-mbsicmp-stricmp-l-wcsicmp-l-mbsicmp-l), [strncmp, wcsncmp](https://docs.microsoft.com/ko-kr/cpp/c-runtime-library/reference/strncmp-wcsncmp-mbsncmp-mbsncmp-l), [strnicmp, wcsnicmp](https://docs.microsoft.com/ko-kr/cpp/c-runtime-library/reference/strnicmp-wcsnicmp), [_strnicmp, _wcsnicmp](https://docs.microsoft.com/ko-kr/cpp/c-runtime-library/reference/strnicmp-wcsnicmp-mbsnicmp-strnicmp-l-wcsnicmp-l-mbsnicmp-l) |
| **문자열 검색** | [strchr, wcschr](https://docs.microsoft.com/ko-kr/cpp/c-runtime-library/reference/strchr-wcschr-mbschr-mbschr-l), [memchr, wmemchr](https://docs.microsoft.com/ko-kr/cpp/c-runtime-library/reference/memchr-wmemchr), [strstr, wcsstr](https://docs.microsoft.com/ko-kr/cpp/c-runtime-library/reference/strstr-wcsstr-mbsstr-mbsstr-l) |
| **Win32**       | [CoDecodeProxy](https://docs.microsoft.com/ko-kr/windows/win32/api/combaseapi/nf-combaseapi-codecodeproxy), [DecodePointer](https://docs.microsoft.com/ko-kr/previous-versions/bb432242(v=vs.85)), [GetLastError](https://docs.microsoft.com/ko-kr/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror), [TlsGetValue](https://docs.microsoft.com/ko-kr/windows/win32/api/processthreadsapi/nf-processthreadsapi-tlsgetvalue) |
| **Windows 8**   | [RoInspectCapturedStackBackTrace](https://docs.microsoft.com/ko-kr/windows/win32/api/roerrorapi/nf-roerrorapi-roinspectcapturedstackbacktrace), [WindowsCompareStringOrdinal](https://docs.microsoft.com/ko-kr/windows/win32/api/winstring/nf-winstring-windowscomparestringordinal), [WindowsGetStringLen](https://docs.microsoft.com/ko-kr/windows/win32/api/winstring/nf-winstring-windowsgetstringlen), [WindowsGetStringRawBuffer](https://docs.microsoft.com/ko-kr/windows/win32/api/winstring/nf-winstring-windowsgetstringrawbuffer)  이러한 함수를 사용하려면 디버깅 중인 프로세스가 Windows 8에서 실행되어야 합니다. Windows 8 디바이스에서 생성된 덤프 파일을 디버깅하려면 Visual Studio 컴퓨터에서 Windows 8이 실행되어야 합니다. 그러나 Windows 8 디바이스를 원격으로 디버그하는 경우에는 Visual Studio 컴퓨터에서 Windows 7이 실행될 수 있습니다. |
| **기타**        | __log2 // 가장 가까운 낮은 정수로 반올림된 밑이 2인 지정된 정수의 로그 값을 반환합니다.  __findNonNull, DecodeHString, DecodeWinRTRestrictedException, DynamicCast, DynamicMemberLookup, GetEnvBlockLength  Stdext_HashMap_Int_OperatorBracket_idx, Std_UnorderedMap_Int_OperatorBracket_idx  ConcurrencyArray_OperatorBracket_idx // Concurrency::array<>::operator[index<>] 및 operator(index<>)  ConcurrencyArray_OperatorBracket_int // Concurrency::array<>::operator(int, int, ...)  ConcurrencyArray_OperatorBracket_tidx // Concurrency::array<>::operator[tiled_index<>] 및 operator(tiled_index<>)  ConcurrencyArrayView_OperatorBracket_idx // Concurrency::array_view<>::operator[index<>] 및 operator(index<>)  ConcurrencyArrayView_OperatorBracket_int // Concurrency::array_view<>::operator(int, int, ...)  ConcurrencyArrayView_OperatorBracket_tidx // Concurrency::array_view<>::operator[tiled_index<>] 및 operator(tiled_index<>)  TreeTraverse_Init // 새 트리 순회를 초기화합니다.  TreeTraverse_Next // 트리의 노드를 반환합니다.  TreeTraverse_Skip // 보류 중인 트리 순회의 노드를 건너뜁니다. |

C++/CLI - 지원되지 않는 식

- 포인터와 관련된 캐스트 또는 사용자 정의 캐스트는 지원되지 않습니다.
- 개체 비교 및 할당은 지원되지 않습니다.
- 오버로드된 연산자 및 오버로드된 함수는 지원되지 않습니다.
- boxing 및 unboxing은 지원되지 않습니다.
- `Sizeof` 연산자는 지원되지 않습니다.



**교착 상태 및 경합 상태 디버그**

다중 스레드 앱에 공통적인 문제 유형을 디버그해야 하는 경우 디버그하는 동안 스레드의 위치를 확인하는 것이 도움이 되는 경우가 많습니다. **소스의 스레드 표시** 단추를 사용하여 이 작업을 쉽게 수행할 수 있습니다.

소스 코드에서 스레드를 표시하려면

1. 디버그하는 동안 **디버그 도구** 모음에서 **소스의 스레드 표시** 단추 ![소스의 스레드 표시](https://docs.microsoft.com/ko-kr/visualstudio/debugger/media/dbg-multithreaded-show-threads.png?view=vs-2019)를 클릭합니다.

2. 창 왼쪽의 여백을 확인합니다. 이 줄에는 실 두 가닥 모양의 스레드 마커 아이콘 ![스레드 마커](https://docs.microsoft.com/ko-kr/visualstudio/debugger/media/dbg-thread-marker.png?view=vs-2019)이 표시됩니다. 스레드 마커는 이 위치에서 스레드가 중지되었음을 나타냅니다.

   스레드 마커는 중단점에 의해 일부가 가려질 수 있습니다.

3. 스레드 마커에 포인터를 올려 놓습니다. DataTips가 나타납니다. DataTip을 통해 중지된 각 스레드의 이름과 스레드 ID 번호를 알 수 있습니다.

   [병렬 스택](https://docs.microsoft.com/ko-kr/visualstudio/debugger/get-started-debugging-multithreaded-apps?view=vs-2019) 창에서도 스레드 위치를 볼 수 있습니다.



**스코프를 벗어난 객체 주시하기**

디버깅을 하다 보면 스코프를 벗어난 객체를 계속 주시하고 싶을 때가 있습니다. 하지만 비쥬얼 스튜디오의 조사식 창(Watch Window)에서는 입력한 객체가 스코프를 벗어나면 비활성화가 되어 더이상 값을 확인 할수 없게 되어버리죠. 이 때, 조사식에 주시 하고픈 객체의 포인터를 입력하면, 해당 객체가 스코프를 벗어났더라도 (해당 객체가 살아 있다면) 지속적으로 값을 확인할 수 있습니다.



![img](https://t1.daumcdn.net/cfile/tistory/1501434551641DFD03)



위 코드를 보면 mHyuna 객체는 이미 스코프를 벗어나 조사식 창에서 비활성화가 되었지만, (CHyuna*)0x0031fe2c 식으로 직접 객체의 주소를 참조하여 스코프를 벗어난 객체의 값을 확인할 수 있습니다.



**배열값 확인**

간혹 매우 큰 크기의 배열을 사용할때가 있습니다. 대략 1만개라고 해보죠. 이 배열 내부의 값을 확인하려면 어떨까요? 1만개의 배열을 일일히 확인하려면 엄청나게 스크롤링을 해야 할 것 입니다.



![img](https://t1.daumcdn.net/cfile/tistory/1954EB4D5164223C18)



이럴때 범위식을 사용하여 특정 구간의 값만을 확인하는 방법이 있습니다. 배열명, 범위 식으로 조사식 창에 입력하여주면 그 범위 만큼의 배열만 보여주는 것이죠. 또한 포인터 연산을 통해서 특정 범위 부터의 값도 확인할 수 있습니다.



![img](https://t1.daumcdn.net/cfile/tistory/1368E24F516422960C)



**CRT 라이브러리를 활용한 메모리 누수 탐지**

메모리 누수는 항상 골치 거리입니다. 수많은 코드들 중에서 어디서 메모리가 새는지 원인을 찾기도 힘들죠. CRT 라이브러리를 활용하여 메모리 누수 지점을 찾기 위한 방법이 있습니다. 먼저 아래와 같이 CRT 라이브러리를 사용하기 위한 헤더를 선언 해줍니다. 그리고 메모리 누수 체크를 위한 플래그를 선언 해줍니다( **_CrtSetDbgFlag ( _CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF );** ).



![img](https://t1.daumcdn.net/cfile/tistory/031FB437516428823D)



위 코드를 보시면 일부러 char[8] 만큼의 메모리를 할당 해주고, 해제를 안하고 있습니다. 이 코드를 실행시키면 아래와 같이 출력 창에서 메모리 누수가 탐지 되었다는 메시지가 나타납니다.



![img](https://t1.daumcdn.net/cfile/tistory/2371CC345164296B1F)





출력창 메시지에서 빨간 네모 박스의 숫자를 잘 기억해두세요. 이 것이 메모리가 누수되는 위치를 가리키고 있는 값입니다. 이제 이 값을 이용해 메모리 누수 위치를 찾아보도록 하겠습니다.



우선 프로그램 아무 곳에나 중단점을 걸고 디버깅 모드로 들어갑니다. 되도록 이면 프로그램의 시작 점에 거는 것이 좋습니다. 디버깅 모드에 들어갔으면 아래와 같이 조사식 창에 {,,msvcrXXXd.dll}_crtBreakAlloc 을 입력해줍니다. 여기서 XXX는 비쥬얼 스튜디오 버전을 적어줍니다. 2008일 경우 msvcr90d.dll, 2010일 경우 msvcr100d.dll, 2012 일 경우 msvcr110d.dll 입니다.



![img](https://t1.daumcdn.net/cfile/tistory/243EFD36516429CF14)



조사식 창에 위의 구문을 입력하면 처음에는 값이 -1로 나올 것입니다. 여기에 출력창에 나왔던 메모리 누수 위치값을 입력해줍니다. 위의 예제에서는 108 이죠. 그 다음 F5를 눌러 프로그램 실행을 재개합니다. 



그러면 어디선가 중단점이 걸립니다. 이제 콜스택을 확인해봅니다.



![img](https://t1.daumcdn.net/cfile/tistory/220DE14551642ADC2C)



중단점이 걸린 곳은 msvcr110d.dll 모듈입니다. 이 부분은 디버깅을 위한 곳이니 신경 쓰지 마시고, 밑으로 따라 내려가 보시면 실제 작업 영역 호출 부분이 있습니다. 이 곳으로 따라 가보면...



![img](https://t1.daumcdn.net/cfile/tistory/2153C53651642B530D)



짜잔~ 메모리를 할당하고 해제 하지 않은 부분을 찾아냈습니다. 이렇게 CRT 라이브러리를 이용하여 메모리 누수 원인을 찾아 낼수 있습니다.



**값이 변경 되는 위치 찾기**

1. C++ 프로젝트에서 디버깅을 시작하고 중단점에 도달할 때까지 기다립니다. **디버그** 메뉴에서 **새 중단점** > **데이터 중단점** 을 선택합니다.

   **중단점 창** 에서 **새로 만들기** > **데이터 중단점** 을 선택하거나, **자동** , **조사식** 또는 **지역** 창의 항목을 마우스 오른쪽 단추로 클릭해 바로 가기 메뉴에서 **값이 변경되면 중단** 을 선택할 수도 있습니다.

2. **주소** 상자에 메모리 주소를 입력하거나 메모리 주소로 계산되는 식을 입력합니다. 예를 들어, 변수 `&avar` 의 내용이 변경되면 중단하려면 `avar` 을 입력합니다.

3. 디버거에서 조사할 바이트 수를 **바이트 계산** 드롭다운에서 선택합니다. 예를 들어, **4** 를 선택하면 디버거가 `&avar` 에서 시작되는 4바이트를 조사하여 해당 바이트의 값이 변경되면 중단됩니다.

디버깅을 하다보면 특정 변수가 어디서 값이 변경 되는 지를 알고 싶을 때가 있습니다. 변수를 사용하는 곳을 전부 검색하여 중단점을 걸어서 볼수도 있지만 데이터 중단점 기능을 이용하면 값을 변경 하는 곳을 손쉽게 찾을 수 있습니다.



먼저 추적 하고 싶은 데이터의 주소를 파악합니다.



![img](https://t1.daumcdn.net/cfile/tistory/233E354051642F3E34)



그 다음 비쥬얼 스튜디오의 **디버그 -> 새 중단점 -> 새 데이터 중단점**을 선택합니다. 여기에 위의 데이터 주소 값을 입력 해줍니다. 타입의 크기 값에 주의 합니다.



![img](https://t1.daumcdn.net/cfile/tistory/223DEC4651642F8410)



중단점을 추가 한 후, F5를 눌러 실행을 재개합니다. 그러면 어디선가 해당 데이터가 값이 변경 되면 아래와 같이 중단점이 작동하게 됩니다.



![img](https://t1.daumcdn.net/cfile/tistory/1248813351642FF034)



위의 예제에서는 SexyUp 함수에서 해당 데이터를 변경하는 것을 알아냈습니다.