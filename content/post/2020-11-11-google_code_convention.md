---
title: "C++ Google Coding Convention Style 정리"
date: 2020-11-11T21:25:16+09:00
#Dev, C++
categories:
- Common
tags:
- C++
- CodingConventions
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

코딩 컨벤션이란 협업 관계에서 프로그래머 사이의 규칙입니다.

컨벤션이 잘 되어 있을 경우 그 구조만으로 의도 파악이 쉽고(내부에서 Lock을 사용하는 함수를 바로 알아본다거나) 유지보수 비용과 버그를 줄일 수 있습니다.

컨벤션 규칙은 다양하며 본인 스타일이 있더라도 회사에서 정하는 규칙이 있을 경우 따르는 것이 좋습니다.

<!--more-->

Google에서는 C++ 언어의 코딩 컨벤션 스타일 가이드를 제시하는데 제너럴한 스타일이기 때문에 참고해 볼만 합니다.

https://google.github.io/styleguide/cppguide.html



### 간단 요약

- 탭
  탭 문자를 사용하는 hard탭 (O)

- 클래스
  파스칼 표기법 -> Player, Item, Monster

- Method
  파스칼 표기법 -> ItemInventorySlot, MonsterPower

- Parameter, 지역 변수
  가능하면 camelCase -> helloWorldVision

- 포인터
  약식 헝가리안 표기법 -> pItemSlot, pStore

- 멤버 변수
  가능하면 camelCase -> m_powerOverSuper, m_pLocalManager(포인터류)
  
- 멤버 함수
    protected, private은 camelCase -> private void helloWorld()
    public 파스칼 -> public void HelloWorld()
    
- Lock 사용 함수
  _가 들어가면 lock을 사용하지 않습니다 -> private void _noLockFunction()
  
- 레퍼런스 parameter
    약식 헝가리안 표기법, Output 인자인 경우 rf를 붙입니다

- namespace indentation
    들여쓰기 하지 않음. 대신 closing bracket에 주석으로 어떤 네임스페이스인지 명시(} //namespace spacename)

- global namespace
    코드 양을 줄이기 위해 name::, ::name::와 같은 global namespace 사용은 하지 않습니다

- namespace hierarchy

    가능하면 2단계(1단계는 namespace name)로 사용합니다
    특히 wrapper의 경우 name::wrapper::item 보단 name::wrapper를 사용합니다
    이래야 wrapper 클래스 내에서 name::item 네임스페이스를 쓸 때 name::를 안붙일 수 있습니다

- using typename
    using Ptr = std::shared_ptr<Item> 보단 std::shared_ptr<Item>를 직접 사용합니다

- newline
    가능하면 두줄 이상의 빈 라인을 사용하지 않습니다

- include directive
    #include "character/item.h" 보단 #include "Common/character/item.h"와 같이 프로젝트 이름을 넣어줍니다.

- 한 줄 길이
    100 컬럼(탭 사이즈가 4 컬럼이기 때문입니다)

- 약어

    itemID
    userPvpHistory

