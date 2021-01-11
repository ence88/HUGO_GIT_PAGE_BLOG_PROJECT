---
title: "std::atomic, memory_order"
date: 2020-11-09T21:45:07+09:00
#Dev, C++
categories:
- Language
- C++
tags:
- C++
- atomic
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

```cpp
std::atomic<T>
```

동기화 객체 없이 원자적 계산 가능합니다..(CPU 지원 필요)

```cpp
std::atomic<int> x;
std::cout << "is lock free ? : " << boolalpha << x.is_lock_free() << std::endl;
```

is lock free가 true인 경우 CPU에서 지원 해주는 것입니다.

<!--more-->

  

`atomic` 객체들의 경우 원자적 연산 시에 메모리에 접근할 때 어떠한 방식으로 접근하는지 지정할 수 있습니다.

  

#### memory_order_relexed

`memory_order_relaxed` 는 가장 **느슨한** 조건입니다. 다시 말해, `memory_order_relaxed` 방식으로 메모리에서 읽거나 쓸 경우, 주위의 다른 메모리 접근들과 순서가 바뀌어도 무방합니다.

```cpp
  b->store(1, memory_order_relaxed);      // b = 1 (쓰기)
  int x = a->load(memory_order_relaxed);  // x = a (읽기)
```



  

#### memory_order_acquire

`memory_order_acquire` 의 경우, `release` 와는 반대로 **해당 명령 뒤에 오는 모든 메모리 명령들이 해당 명령 위로 재배치 되는 것을 금지** 합니다.



  

#### memory_order_acq_rel

`memory_order_acq_rel` 은 이름에서도 알 수 있듯이, `acquire` 와 `release` 를 모두 수행하는 것입니다. 이는, 읽기와 쓰기를 모두 수행하는 명령들, 예를 들어서 `fetch_add` 와 같은 함수에서 사용될 수 있습니다.



  

#### memory_order_seq_cst

`memory_order_seq_cst` 는 메모리 명령의 **순차적 일관성(sequential consistency)** 을 보장해줍니다.

순차적 일관성이란, 메모리 명령 재배치도 없고, 모든 쓰레드에서 모든 시점에 동일한 값을 관찰할 수 있는, 여러분이 생각하는 그대로 CPU 가 작동하는 방식이라 생각하면 됩니다.

`memory_order_seq_cst` 를 사용하는 메모리 명령들 사이에선 이러한 순차적 일관성을 보장해줍니다.



정리해보자면 다음과 같습니다.

| 연산                                           | 허용된 `memory order`                                        |
| ---------------------------------------------- | ------------------------------------------------------------ |
| 쓰기 (store)                                   | `memory_order_relaxed`, `memory_order_release`, `memory_order_seq_cst` |
| 읽기 (load)                                    | `memory_order_relaxed`, `memory_order_consume`, `memory_order_acquire`, `memory_order_seq_cst` |
| 읽고 - 수정하고 - 쓰기 (read - modify - write) | `memory_order_relaxed`, `memory_order_consume`, `memory_order_acquire`, `memory_order_release`, `memory_order_acq_rel`, `memory_order_seq_cst` |

`C++ atomic` 객체들의 경우 따로 지정하지 않는다면 기본으로 `memory_order_seq_cst` 로 설정되는데, 이는 일부 CPU 에서 매우 값비싼 명령 입니다. 만약에 제약 조건을 좀 더 느슨하게 할 수 있을 때 더 약한 수준의 `memory_order` 을 사용한다면 프로그램의 성능을 더 크게 향상 시킬 수 있습니다.