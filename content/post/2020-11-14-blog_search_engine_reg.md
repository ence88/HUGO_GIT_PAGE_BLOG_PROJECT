---
title: "Hugo 블로그 검색 엔진에 등록하기"
date: 2020-11-14T12:19:25+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce
categories:
- Dev
- Common
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management
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

#thumbnailImage: //example.com/image.jpg검색
---

Google이나 Naver에 블로그나 사이트를 노출시키기 위해서는 검색엔진 제공 업체의 검색콘솔 등에 직접 등록하는 것이 좋습니다.

등록해야 하는 파일은 비슷하지만, 회사마다 방법이 조금 달라 그 방법과 Hugo 기반 블로그에서 필요한 파일을 생성하는 방법을 소개합니다.

<!--more-->

#### 필요 파일 생성
​	사이트 등록에는 robots.txt, sitemap.xml 두 파일이 필요합니다.
​	Hugo에서는 `config.toml` 파일에 해당 파일 생성을 명시 후 build를 진행하면 public 폴더에 생성 해줍니다.

```
# robots.txt
enableRobotsTXT = true

# sitemap 생성
[sitemap]
# always, hourly daily, weekly, monthly, yearly, never
  changefreq = "monthly"
  filename = "sitemap.xml"
  priority = 0.5
```



#### Google에 노출시키는 법

- [Google Search Console](https://search.google.com/search-console/about?hl=ko)에 접속해서 **시작하기**를 누릅니다.

- url(`https://username.github.io`)을 입력하고 `계속` 버튼을 누릅니다.

- 다운받으라는 `html` 파일을 `블로그경로/public` 파일에 저장하고 GitHub에 `push`합니다. 곧바로 소유권이 확인됩니다.

- **속성으로 이동** 을 클릭하여 해당 페이지로 이동한다.

- `sitemap.xml` 제출

  - Google Search Console의 속성 페이지 왼쪽 메뉴에 **Sitemaps** 라는 게 있습니다. 이걸 클릭하면 `sitemap.xml` 파일을 등록할 수 있습니다. 등록할 때 해당 파일의 경로를 입력해야 합니다. **이 때** 주소 입력란에 “sitemap.xml"이라고 입력합니다. 

    

#### Naver에 노출시키는 법

- [네이버 웹마스터](https://searchadvisor.naver.com/)에 접속합니다.
- `url`을 등록하고 소유권을 확인한다(`html` 파일 `public`에 저장, `push`, 확인). 업로드 후 보안문자를 입력하면 소유권 확인 메세지가 확인됩니다.
- 로봇룰 검증을 실시합니다
  - 연동 사이트 목록에서 등록한 블로그 주소를 클릭합니다.
  - 왼쪽 메뉴에 검증을 클릭합니다.
  - `robots.txt`를 업로드해도 “robots.txt 파일이 확인되지 않는다"는 문구가 보이겠지만, **수집요청** 버튼을 클릭하면 업로드한 `robots.txt`이 정상 작동합니다.

- sitemap, RSS xml 제출
  - 웹마스터 페이지 - 왼쪽에 **요청** 메뉴 - 사이트맵 제출(or RSS 제출)`에서 `sitemap.xml`(or `feed.xml`)을 입력합니다.
  
  - 블로그에 만들어져 있는 RSS 버튼을 클릭하면 나오는 주소/filename.xml을 등록합니다.
  
  - sitemap 제출할 때는 `sitemap.xml`만 입력하지만, RSS 제출할 때는 `http`부터 `xml` 파일명까지 통째로 입력해야 합니다.
  
    

#### Daum에 노출시키는 법

- [Daum 검색등록 페이지](https://register.search.daum.net/index.daum)로 이동합니다.
- 블로그 등록 옵션을 눌러 블로그 주소를 입력합니다.(http, https 구분 x).
- 개인정보 관련 규정에 동의합니다.
- 이메일 주소를 입력합니다.