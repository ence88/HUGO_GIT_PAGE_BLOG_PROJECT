---
title: "std upper_bound"
date: 2020-11-08T23:22:20+09:00
#Dev, C++
categories:
- Dev
- C++
tags:
- c++
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

##  upper_bound

컨테이너에서 지정된 키보다 큰 값을 가진 키가 포함된 첫 번째 요소에 대한 it를 반환합니다.

<!--more-->

```cpp
iterator upper_bound(const Key& key);

const_iterator upper_bound(const Key& key) const;
```



### 반환 값

`iterator` `const_iterator` 인수 키 보다 큰 키를 사용 하 여 map에서 요소 위치의 주소를 가져오거나, 해당 `map` 키와 일치 하는 항목이 없는 경우에서 마지막 요소 다음 위치의 주소를 나타냅니다.



## Example

```c++
mymap['a']=20;
mymap['b']=40;
mymap['c']=60;
mymap['d']=80;
mymap['e']=100;

itlow = mymap.lower_bound ('b');
itup  = mymap.upper_bound ('d');
```



> 위 코드의 경우 itlow는 b를 itup은 e를 가르키는 iterator가 된다.