---
title: "C# 중급 - Orientation[1]"
date: 2021-05-17T09:00:00+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN
categories:
- Language
- C#
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- C#
- CSharp
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

C# 언어와 .Net Framework 중급 이상의 기술 학습을 진행하는 시리즈 입니다.

<!--more-->

  본 시리즈에서는 다음과 같은 내용을 배울 수 있으며, 기본 문법은 다루지 않습니다.

1. IL과 C# 언어

2. Net Framework 와 객체지향 디자인

3. Assembly, CLR, AppDomain 등
4. Concurrency in C#



## 실습 환경

#### 1. 개발 도구

- Visual Studio 2019 Community
  - https://visualstudio.microsoft.com/ko/

  

#### 2. 프로젝트 생성

- 파일 -> 새로 만들기 -> 프로젝트 선택
- 언어 : C#, 프로젝트 형태 : 콘솔
  
  - 없을 경우 : 추가 도구 및 기능 설치 -> .NET 데스크톱 개발, 체크 후 설치
- 빌드
  - IDE 환경 빌드 : Ctrl + F5 / F5
  - C# 컴파일러(csc.exe) 빌드
    - Development Command Promt for VS2019 실행
    - csc 입력
    - 소스 폴드 폴더로 이동(cd + 폴더)
    - csc 소스이름.cs
    - 생성된 실행파일(exe) 실행

  

#### 3. ILdsam 유틸리티

- 실행파일 내부의 .net 기계어 코드(CIL)을 분석해서 클래스 내용을 보여주는 유틸리티
- 다양한 C# 문법의 원리를 이해하기 위한 필수 도구
- 개발자 프롬포트 실행 -> Ildasm 실행파일이름.exe