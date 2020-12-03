---
title: "비주얼 스튜디오 프로젝트 구성속성 옵션 정리"
date: 2020-12-01T11:35:36+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN
categories:
- SCM
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- VisaulStudio
- 형상관리
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

#thumbnailImage: //example.com/image.jpg플
---

VisualStudio에서 `프로젝트` -> `우클릭` -> `속성`에 들어가면 프로젝트의 `구성 속성`에 다양한 옵션을 지정 할 수있습니다.

의미가 명확하지 않은 옵션들이 있어 틈날 때마다 본 포스팅에 정리 할 예정입니다.

<!--more-->

- `강제 포함 파일` : 전처리기로 하여금 지정된 헤더 파일을 포함하도록 합니다. 이 옵션은 모든 소스 파일 첫 줄에 `#include "파일명"`을 삽입하는 효과와 동일합니다.
- `추가 옵션` : 빌드 명령줄에 커스텀하게 추가 할 옵션을 n개 이상 명시 할 수 있습니다.
  - `/bigobj` : 목적 파일에 포함 할 수 있는 섹션의 수를 늘립니다. 목적 파일은 기본적으로 65,279개(약 2^16)의 주소 섹션을 갖는데 4,294,967,296(2^32)로 늘립니다.
  - `**`/std:c++14`** or /std:c++17 or /std:c++latest or /std:c++20(예정)` : 프로젝트의 C++ 버전 세팅 관련 옵션입니다.
  - `/await` : 코루틴에 대한 컴파일러 지원 사용 가능케 합니다. **`co_await`** **`co_yield`** **`co_return`** 등
- `디버깅 정보 생성` : .PDB 파일 생성시 관련된 옵션이며 여러 설정값이 있습니다. [자세한 내용](https://docs.microsoft.com/ko-kr/cpp/build/reference/debug-generate-debug-info?view=msvc-160)
- `링크 타임 코드 생성` : LTCG를 이용해 링크타임에 소스코드 최적화 관련 기능, 프로젝트가 복잡 할 경우 이 옵션을 끌 경우 빌드속도가 기적절으로 빨라 질 수 있습니다. 15분 -> 2~3분. [자세한 내용](https://docs.microsoft.com/ko-kr/cpp/build/reference/ltcg-link-time-code-generation?view=msvc-160), 관련 [NDC 자료](https://www.slideshare.net/yikwonhwang/ndc2015-msvc)
- `프레임 포인터 생략` : `/Oy-` 추천, 이 옵션을 설정하면 프레임 포인터를 설정하고 제거할 필요가 없기 때문에 함수 호출 속도가 빨라집니다. 또한 일반 용도를 위해 레지스터를 하나 더 해제합니다. 호출 스택에서 프레임 포인터를 생성하지 않으며 이에 따라 함수 호출 속도가 빨라진다. 이 것은 x86 컴파일러에서만 사용할 수 있다. /Oy를 사용하면 프레임 포인터가 생략되며 /Oy-를 사용하면 프레임 포인터 생략이 비활성화된다. 이 옵션을 사용하면 즉 /Oy가 설정되면 이 EBP를 스택 프레임으로서 사용하지 않고 General Purpose로 사용하게 된다.
- `준수 모드` : 컴파일러에 대해 프로그래밍 문법 표준 준수 여부 지시
- `컴파일 옵션` : C or C++로 컴파일 대상 지정 가능