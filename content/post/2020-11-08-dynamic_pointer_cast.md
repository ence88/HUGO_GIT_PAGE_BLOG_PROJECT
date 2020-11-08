---
title: "shard_ptr의 다운/업 캐스팅"
date: 2020-11-08T22:31:11+09:00
#Dev, C++
categories:
- Dev
- C++
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

### shard_ptr 다운, 업 캐스팅

`dynamic_pointer_cast`, `static_pointer_cast` 및 `const_pointer_cast`를 사용하여 `shared_ptr`을 캐스팅할 수 있습니다. 이러한 함수는 **`dynamic_cast`** , **`static_cast`** 및 연산자와 유사 **`const_cast`** 합니다. 다음 예제에서는 기본 클래스에서 `shared_ptr`의 벡터에 있는 각 요소의 파생 형식을 테스트한 다음 요소를 복사하고 이에 대한 정보를 표시하는 방법을 보여 줍니다.

<!--more-->

C++복사

```cpp
vector<shared_ptr<MediaAsset>> assets;

assets.push_back(shared_ptr<Song>(new Song(L"Himesh Reshammiya", L"Tera Surroor")));
assets.push_back(shared_ptr<Song>(new Song(L"Penaz Masani", L"Tu Dil De De")));
assets.push_back(shared_ptr<Photo>(new Photo(L"2011-04-06", L"Redmond, WA", L"Soccer field at Microsoft.")));

vector<shared_ptr<MediaAsset>> photos;

copy_if(assets.begin(), assets.end(), back_inserter(photos), [] (shared_ptr<MediaAsset> p) -> bool
{
    // Use dynamic_pointer_cast to test whether
    // element is a shared_ptr<Photo>.
    shared_ptr<Photo> temp = dynamic_pointer_cast<Photo>(p);		
    return temp.get() != nullptr;
});

for (const auto&  p : photos)
{
    // We know that the photos vector contains only 
    // shared_ptr<Photo> objects, so use static_cast.
    wcout << "Photo location: " << (static_pointer_cast<Photo>(p))->location_ << endl;
}
```