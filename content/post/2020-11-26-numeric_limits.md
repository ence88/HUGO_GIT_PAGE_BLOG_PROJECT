---
title: "C++ 변수 타입 최대 최소값 편리하게 확인하는 방법 std::numeric_limits"
date: 2020-11-26T12:31:52+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce, Blog
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

#thumbnailImage: //example.com/image.jpg템플ㄹ
---

numeric_limits 클래스 템플릿은 템플릿 특수화로 구현되었고, 명시한 타입의 최대값이나 최소값을 질의 할 수 있는 표준화 된 방법을 제공합니다.

(예 : int 유형에 대해 가능한 가장 큰 값은 std :: numeric_limits <int> :: max ())

<!--more-->



```C++
#include <limits>
#include <iostream>
 
int main() 
{
    std::cout << "type\tlowest()\tmin()\t\tmax()\n\n"
              << "bool\t"
              << std::numeric_limits<bool>::lowest() << "\t\t"
              << std::numeric_limits<bool>::min() << "\t\t"
              << std::numeric_limits<bool>::max() << '\n'
              << "uchar\t"
              << +std::numeric_limits<unsigned char>::lowest() << "\t\t"
              << +std::numeric_limits<unsigned char>::min() << "\t\t"
              << +std::numeric_limits<unsigned char>::max() << '\n'
              << "int\t"
              << std::numeric_limits<int>::lowest() << '\t'
              << std::numeric_limits<int>::min() << '\t'
              << std::numeric_limits<int>::max() << '\n'
              << "float\t"
              << std::numeric_limits<float>::lowest() << '\t'
              << std::numeric_limits<float>::min() << '\t'
              << std::numeric_limits<float>::max() << '\n'
              << "double\t"
              << std::numeric_limits<double>::lowest() << '\t'
              << std::numeric_limits<double>::min() << '\t'
              << std::numeric_limits<double>::max() << '\n';
}
```

Possible output:

```
type	lowest()	min()		max()
 
bool	0		0		1
uchar	0		0		255
int	-2147483648	-2147483648	2147483647
float	-3.40282e+38	1.17549e-38	3.40282e+38
double	-1.79769e+308	2.22507e-308	1.79769e+308
```

