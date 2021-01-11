---
title: "비주얼 스튜디오 관련 단축키 총정리"
date: 2020-11-30T11:36:17+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN
categories:
- Common
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- Common
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

#thumbnailImage: //example.com/image.jpg개읹
---

비주얼 스튜디오로 개발시 생산성이나 편의성 관련 개발자로 생활하며 사용하는 단축키 정리

visual asist는 왠만하면 안쓰려고 하지만, 유용한 것은 지속적으로 업데이트 할 예정

<!--more-->

#### VisaulStudio 기본 단축키

> Input 관련 규칙
>
> A + B + C 일 경우 A와 B키, C키를 떼지 않고 눌러야함
>
>  A + B, C 일 경우 A와 B키를 같이 입력 후 손 뗀 뒤 C 입력

- **빌드 관련**
  - `F5` : 빌드 + 디버깅 시작
  - `Ctrl + F5` : 빌드 + 디버깅 없이 시작
  - `Ctrl + Shift + B` : 전체 솔루션 빌드만
  - `Ctrl + F7` : 현재 프로젝트만 빌드

- **검색 관련**

  - `Ctrl + ,` : 만능 검색창

  - `F3` : 공통적으로 포커싱 되거나 검색 대상이 있을 경우 다음 대상으로 이동
  - `F3 + Shift` : 공통적으로 포커싱 되거나 검색 대상이 있을 경우 이전 대상으로 이동

  - `Ctrl + i` : 현재 포커싱중인 문서에서 찾기(증분방식 글자를 늘리거나 줄이면서 찾아줌)
  - `Shift + F12` : 포커싱 대상의 모든 참조 검색
  - `Ctrl + F + (H)` : 기본적인 검색 (or 치환)
  - `Ctrl + Shift + F + (H)` : 심화 검색 (or 파일에서 찾아서 바꾸기 (바꿀때는 이것 보다는 `Ctrl + R + R` 추천) )
  - `F12` : 포커싱 대상 (함수 or 변수)의 (선언 위치 <-> 정의 위치)로 이동
  - `Ctrl + F12` : 포커싱 대상 (함수 or 변수)의 선언 위치로 이동
  - `Alt + F12` : 현재 창에서 팝업으로 포커싱 대상 (함수 or 변수)의 구현 볼 수 있는 창 레이오버
  - `Ctrl + K + T` : 포커싱 대상 함수 호출 계층 보기
  - `Ctrl + K + K` : 현재 포커싱 위치에 북마크 찍기
  - `Ctrl + K + L` : 전체 북마크 제거
  - `Ctrl + K + W` : 북마크 목록창 열기

- **작성 / 편집 관련**

  - `Ctrl + Shift + Z` : Ctrl + Z로 되돌린 상황 다시 복구하기

  -  `Ctrl + R + W` : 공백문자 보기/숨기기 (협업시 보이게 해놓는 것 추천)
  - `Ctrl + M + M` : 현재 포커싱 위치 +- 범위 닫기 / 열기
  - `Ctrl + M + O, Ctrl + M + L` : 전체 범위 +- 닫기 / 열기

  - `프로그래밍 예약 키워드(for, switch 등등 ..) + Tab + Tab` : 코드 자동으로 완성 

  - `Ctrl + .` : 포커싱 대상 빠른 작업 및 리펙토링 ( .h파일에서 함수 선언 후 해당 기능 이용시 .cpp 파일에 자동으로 표현에 맞는 정의부 생성 )

  - `Ctrl + Shift + S` : 열려 있는 모든 변경된 창 저장(`Ctrl + S` 현재 포커싱 창만 저장)

  - `Ctrl + R + R` : 전체 이름 바꾸기(포커싱 대상 변수나 클래스 이름 등 변경시 연관된 모든 이름 변경) 
  - `Ctrl + (J or Space)`  : 포커싱 대상 객체, 네임스페이스 등의 멤버 목록
  - `Ctrl + Shift + Space` : 함수 파라메터 안나올 때 보기
  - `Ctrl + K + i` : 빨간줄 오류 내용 안나 올 때 다시 띄우기
  - `Ctrl + L` : 포커싱 중인 라인 한 줄 삭제
  - `Alt + 위 or 아래` : 포커싱 중인 라인 위 아래로 통째로 이동, 손을 떼지 않으면 쭉 이동
  - `Alt + Shift + 방향키` : 현재 커서에서 수직 or 수평 자유롭게 선택 범위(세부 간격 조절 할 때 좋음)
  - `Tab + (Shfit)` : /t 만큼 들여쓰기, 내어쓰기
  - `Ctrl + K + S` : 포커싱된 범위 #ifdef, if, for, swith ... 등으로 감싸서 자동 들여쓰기
  - `Ctrl + ]` : 맵핑된 괄호, 대괄호간 이동
  - `Ctrl + 좌/우 방향키 + (Shift)` : 포커싱된 커서 의미 단위로 이동 (+ 범위 선택하며 이동)
  - `Ctrl + K + C` : 범위 or 한줄 주석 처리
  - `Ctrl + K + U` : 범위 or 한줄 주석 해제
  - `Ctrl + X` : 포커싱 범위 잘라내기
  - `Ctrl + K + F` : 범위 문장 자동 정렬(내 옵션 스타일로) 

- **창 / 이동 관련**

  - `Ctrl + Alt + L` : 솔루션 탐색기 열기 or 포커싱
  - `Ctrl + 위/아래 방향키` : 현재 창에서 위 아래로 마우스 휠 스타일로 이동
  
  - `Ctrl + Shift + G` : 포커싱 대상 파일로 이동 include문 등에서 대상 파일 등등
  - `Ctrl + Tab + 방향키` : 열려 있는 모든 window간 이동(솔루션 탐색기 등 포함)
  
  - `Ctrl + Alt + 아래방향키` : 열린 작업 문서 목록간 드랍다운 리스트로 이동
  - `Ctrl + -` : 뒤로 가기(이전 하던 작업 포커싱)
  
  - `Ctrl + Shift + -` : 앞으로 가기(뒤로 갔던 포커싱 다시 앞으로)
  - `Ctrl + F4` : 현재 포커싱 중인 창만 닫기
  - `Ctrl + K + O` : .h <-> .cpp 파일 전환, 안 열려 있을 경우 열어줌
  
  - `Alt + W, N` : 현재 포커싱된 같은 문서 하나 더 띄우기
  - `Alt + W, V` : 현재 문서 창 분할해서 띄우기
  
- **디버깅 관련**

  - `Alt + D + N` : 모든 break point 잠시 비활성화/활성화
  - `Ctrl + Shift + D, S` : 멀티스레스 디버깅시 병렬 스레드뷰 팝업창
  - `Ctrl + Shift + F10` : 디버깅중 커서 위치로 강제 디버깅 흐름 이동

  - `Ctrl + F10` : 포커싱된 커서 위치까지 쭉 실행
  - `F9` : 포커싱 라인에 break point 삽입 / 제거

  - `Ctrl + F9` : 포커싱 라인의 break point 비활성화 / 활성화
  - `Ctrl + Shift + F9` : 모든 break point 제거
  - `Alt + F9, C` : 포커싱 라인의 break point의 조건식 창 띄우기
  - `F10` : 디버깅 중 함수 단위 건너뛰기
  - `F11` : 디버깅 중 다음 흐름으로
  - `Shift + F11` : 디버깅 중 현재 진행중인 함수 즉시 탈출
  - `Ctrl + K + V` : 클래스 뷰

  

  

#### VisualAsist

- **검색 관련**
  - `Alt + Shift + S` : 포커싱 대상 이름으로 전체 솔루션에서 심볼 검색 (VS 기본기능인 `F12`로 안따라가지는 경우 찾기 수월)