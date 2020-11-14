---
title: "Hugo 블로그에 Google Analytics 연결"
date: 2020-11-14T13:50:07+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce
categories:
- Dev
- Blog
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo
tags:
- Blog
- Hugo
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

#thumbnailImage: //example.com/image.jpg구글
---

구글에서는 사이트 접근시 유입분석과 체류시간 등의 각종 통계 분석이 가능한 웹 기반 콘솔 서비스를 제공합니다.

<!--more-->

#### 계정 생성 및 측정 ID 획득

- [Google analytics](https://analytics.google.com/analytics) 가입합니다.

- 입맛에 맞는 속성을 설정합니다. (`고급옵션` -> `유니버설 애널리틱스 속성 만들기`는 반드시 체크해야 합니다. Only `유니버셜 애널리틱스`)

- 좌측 메뉴의 `데이터 스트림` -> `스트림 추가` -> `웹`

- 사이트 url과 이름을 등록후 `스트림 만들기`

- 만들어진 스트림의 `추적 ID` 를 얻을 수 있습니다.

  

#### 블로그에 연결

- Hugo 설정파일 `config.toml`에 위에서 얻은 **추적 ID**를 기입합니다. (G-12345 형식 아님, UA-12345)

```
googleAnalytics = "추적 ID"
```

- Hugo 사이트 Build 및 Publish