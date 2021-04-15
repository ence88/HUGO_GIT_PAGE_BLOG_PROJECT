---
title: "C++ 고급 문법/테크닉 - 개요[1]"
date: 2021-04-15T09:00:00+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN
categories:
- Language
- C++
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- C++
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

#thumbnailImage: //example.com/image.jpgC스터디 내용작성 ㅇS이번 항이번 이버
---

 C++ 관련 고급 문법과 다양한 고급 테크닉을 공부하겠습니다. C++ 언어의 문법들을 다양한 관점에서 깊이 있게 살펴 보고, C++ 진영에서 사용되는 다양한 코딩 관례, 테크닉을 깊이 있는 관점에서 배우게 됩니다. C++98/03 문법 뿐 아니라 C++11/14 그리고 C++17/20의 내용도 배우게 됩니다.

C++ 문법 뿐 아니라 C++ IDioms라고 알려져 있는 다양한 테크닉도 배우게 되며, 이 시리즈에서는 C++ 기본 문법을 다루지 않습니다.

<!--more-->

  

### 실습 환경(windows)

- using g++
  - www.nuwen.net -> C++ MinGW Distro 탭 -> mingw-xx.x-without-git.exe 다운로드 및 압축 해제 -> open_distro_windows 실행
  - 버전 확인 gcc --version
  - 컴파일 g++ hello.cpp

- using vc++

  - www.visualstudio.com/ko -> IDE 다운로드 및 설치

  - vc++ 확장 문법 제거 : 프로젝트 속성 -> C/C++ -> 언어 -> 언어 확장 사용 안 함(예/Za)

    ```c++
    struct Pointer
    {
        int x, y;
    }
    
    int main()
    {
        Point& p = Point(); // 표준 문법에 위배되지만 visual studo에서는 정상 컴파일됨
    }
    ```

  - CL 컴파일러 사용하기 : VS 개발자 명령 프롬포트 -> cl filename.cpp -> 생성된 exe 파일 실행






[더 많은 C++ 관련 정보](https://en.cppreference.com/w/)