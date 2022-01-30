---
title: "std::advance 예제"
date: 2020-11-29T22:59:40+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN
categories:
- Language
- C++
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
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

iterator를 원하는 위치로 옮길 수 있는 함수이다. 컨테이너의 iterator를 i번째 위치로 옮기고 싶을 때 사용할 수 있습니다.

<!--more-->

{{< adsense >}}

표현식 std::advance(i, n)은 반복자 i를 거리 n만큼 증가시킵니다.

- n > 0 이면,

  ++i를 n번 수행하는 것과 동등(다만, __InIter 형식이 임의접근 반복자의 모형이면 advance가 훨씬 더 빠릅니다.)

- n < 0 이면,

  --i를 n번 수행하는 것과 동등합니다.

```cpp
std::vector<int> vec{1,2,3,4,5};
auto it = vec.begin();
std::advance(it, 1);
cout<<"result: "<<*it<<endl;
//결과 result: 2

it = vec.begin();
std::advance(it, 3);
cout<<"result: "<<*it<<endl;
//결과 result: 4
```

advance를 통해 정해지지 않은 type의 iterator를 다룰 수 있다는 장점이 있습니다.