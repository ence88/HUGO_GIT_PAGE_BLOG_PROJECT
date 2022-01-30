---
title: "코틀린 리서치 - 개발환경 세팅[2]"
date: 2021-02-22T16:12:30+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN, Book, Study, VOCA, Kotlin
categories:
- Language
- Kotlin
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture, Kotlin, Research
tags:
- Kotlin
- 코틀린
- Research
- Language
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

#thumbnailImage: //example.com/image.jpg코틀
---

코틀린은 JVM 위에서 동작하기에 플랫폼에 독립적입니다. (possible Windows or linux 등등..)

이는 곧 JDK를 사용한다는 말이며, 작성 관련해서는 다양한 IDE가 존재합니다.

<!--more-->

자바가 오라클에 인수 된 이후로부터 JDK의 라이센스는 상업적 이용시 구독 비용이 발생하게 되었으며, 회사의 RnD성 프로젝트에서는 돈이 남아 돌지 않는 이상 무료 라이센스인 open JDK를 권장합니다.(for free)

본 블로그에서는 회사에서의 사용을 염두하여 openJDK 및 IntelliJ IDEA 환경에서 코틀린 리서치를 진행합니다.



### IDE 설치

- https://www.jetbrains.com/ko-kr/idea/download/#section=windows 다음 주소에서 개발 플랫폼에 맞는 Community 다운로드 및 설치

{{< adsense >}}

### JDK 설치

- https://openjdk.java.net/ 다음 주소에서 개발 플랫폼 및 원하는 버전의 open JDK 다운로드(https://jdk.java.net/archive/ 아카이브)
- 적당한 위치에 다운로드 받은 파일(ex : openjdk-11_windows-x64_bin.zip)의 압축 해제
- 환경변수 -> 시스템변수 -> 새로만들기 -> 이름 "JAVA_HOME", 값 ""폴더 경로"(ex : D:\openjdk-11_windows-x64_bin\jdk-11)
- 시스템 변수 -> 존재하는 Path에 %JAVA_HOME%\bin 값 추가



### JDK 설치 확인

- cmd -> java -version 입력 -> jdk 관련 출력 확인

  ```
  C:\Users\id>java -version
  openjdk version "11" 2018-09-25
  OpenJDK Runtime Environment 18.9 (build 11+28)
  OpenJDK 64-Bit Server VM 18.9 (build 11+28, mixed mode)
  ```

  

### IDEA에서 코틀린 프로젝트 생성

- IDEA 실행 -> Projects -> New Project

  - Kotlin -> 템플릿은 Console Application -> Project JDK는 위에서 설치한 JDK
  ![1](/img/kotlin2_11.png)
  - JVM Target 설치한 JDK로 세팅
  ![2](/img/kotlin2_22.png)
  - 자동으로 생성된 프로젝트 Build and Run시 Configuration 세팅 요구 할 경우 다음과 같이 설정
    ![3](/img/kotlin2_33.png)
  - Build and Run 후 Output에 HelloWorld 정상 출력 확인
    ![4](/img/kotlin2_44.png)
  



### 코틀린 웹 컴파일러(for study)

- https://try.kotlinlang.org/



[더 많은 코틀린 관련 정보](https://kotlinlang.org/docs/reference/)