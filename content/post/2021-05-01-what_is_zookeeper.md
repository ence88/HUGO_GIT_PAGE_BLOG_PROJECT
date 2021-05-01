---
title: "아파치 Zookeeper 살펴보기"
date: 2021-05-01T14:00:00+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN
categories:
- Common
- Architecture
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- Zookeeper
- Architecture
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

#thumbnailImage: //example.com/image.jpgC스터디 내용작성 ㅇS이번 항이번 이버C++ 대
---

분산 처리 시스템 구축시 코디네이션 서비스를 위한 Zookeeper에 대해 살펴보겠습니다.

<!--more-->

​    

### Zookeeper란?

한대 이상의 장비를 묶은 분산 처리 시스템간 코디네이션 서비스를 제공하는 오픈소스 프로젝트이다. (공식 사이트 : https://zookeeper.apache.org)

아파치의 오픈소스 프로젝트들은 하둡(코끼리), 하이브(꿀벌) 등 동물로 표현하고 있는데, 이 동물들을 관리하는 zookeeper(사육사) 이미지를 떠올리면 적당 할 것이다.

주키퍼는 Leader Follower로 구성되는 Master-Slave 아키텍처를 기반으로 구성되어 있습니다. 이것을 기반으로 여러 주키퍼 서버로 이루어진 앙상블(Ensemble), 앙상블 데이터의 불일치를 방지하고자 하는 쿼럼(Quorum) 그리고 분산 데이터 시스템인 znode로 이루어진 주키퍼 데이터 모델(zookeeper data model)이 주키퍼를 구성합니다.

코디네이션 서비스는 분산된 시스템간의 정보를 어떻게 공유할것이고, 클러스터에 있는 서버들의 상태 체크와, 분산된 서버들간에 동기화를 위한 글로벌 락(lock)을 제공합니다.

HBase, Kafka, Hadoop, kubernetes와 같은 인기 오픈소스 프로젝트에서도 분산 코디네이션 시스템을 구현하기 위해 주키퍼를 채택했습니다.



### Zookeeper의 Architecture

![structure](/img/zookeeper.png)

앙상블안의 주키퍼 서버들은 조율된 상태이며 항상 동일한 데이터를 가지고 있습니다. 따라서 어느 서버에서 데이터를 읽어도 같은 데이터를 전달받습니다.

주키퍼 서버에 쓰기 동작을 할 경우에, 클라이언트는 특정 서버에 접속하여 그 서버의 데이터를 업데이트 합니다. 그리고 업데이트 된 서버는 leader의 역할을 맡은 주키퍼 서버에 그 데이터를 알리고 업데이트합니다.. 이 업데이트를 감지한 leader 서버는 그 정보를 다른 곳에 브로드캐스트(Broadcast) 형식으로 알리게 됩니다. 그 업데이트 정보를 받은 나머지 Follower 주키퍼 서버들은 그 내용을 갱신하여 전체 서버들의 데이터들이 일관된 상태로 유지된 상태로 있게 됩니다.

- znode

  데이터를 저장할 수 있는 디렉토리 구조를 제공하며, 디렉토리와 비슷한 구조로 byte[]형태의 정보를 저장

  - Persistent Node : 노드에 데이터를 저장하면 클라이언트가 앙상블과의 연결이 끊기더라도 노드가 살아있다. (기본값, 영구성)
  - Ephemeral Node : 노드를 생성한 클라이언트의 세션이 연결되어 있을 경우만 유효, 즉 클라이언트 연결이 끊어지는 순간 삭제 -> 이를 통해 클라이언트가 연결되어있는지 아닌지 판단, 자식 노드를 갖을 수 없음
  - Sequence Node : 노드를 생성할 때 자동으로 Sequent 번호가 붙는 노드

- Watcher

  - 클라이언트가 znode에 watch를 걸어 놓으면 해당 znode가 변경이 되었을 때 클라이언트로 callback호출을 날려서 클라이언트에 해당 znode가 변경되었음을 알려주고 해당 watcher는 삭제됨

- 클라이언트들은 주키퍼 서버들로 이루어진 앙상블에 접근하여 znode의 데이터를 읽거나 씀

- 쓰기 과정

  - 클라이언트가 특정 서버로 접속하여 데이터 업데이트
  - 업데이트 된 서버는 leader 서버에 그 데이터를 알리고 업데이트
  - leader 서버는 그정보를 나머지 follower 서버들에게 broadcast
  - 그 정보를 받은 follower 서버들도 데이터 업데이트



### Zookeeper의 특징

- 읽기 작업에서 빠른 성능(읽기 작업이 쓰기 작업보다 많은 솔루션에서 유리)



### Zookeeper 활용 예

- Queue
  - Watcher와 Sequence node를 이용하여 순서가 보장된 큐를 만들 수 있고, 이 큐를 메세지 큐로 활용하여 서버간 pub/sub 통신으로 활용 할 수 있다.
- config 서버
  - 클러스터(서버군) 내의 각 서버의 설정(config)을 관리하는 용도로 사용이 가능하며, watch를 활용 할 경우 설정 변경시 해당 서버로 noti하여 동적 반영이 가능하다.
- 클러스터(서버군) 상태 관리
  - Ephemeral node를 활용하여 현재 동작중인 하위 서버들의 동작 상태를 관리 할 수 있다.
- Global Lock
  - 서버간 공용 정보를 관리 할 때 스레드간 동기화와 같이 주키퍼에서 제공하는 lock을 활용하여 서버간 자원 동기 처리가 가능하다.