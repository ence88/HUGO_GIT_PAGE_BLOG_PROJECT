---
title: "Kafka(카프카)란 무엇인가?"
date: 2020-11-14T21:00:32+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce, Blog
categories:
- Common
- Architecture
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- Kafka
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

#thumbnailImage: //example.com/image.jpg서버간
---

서버간 통신을 할 때 서버간에 다이렉트로 소켓 연결이나, rest call 연결을 할 경우 복잡성이 매우 증가 할 수 있습니다. (최악의 경우 N^2)

예를 들어 128대의 서버간 망형태로 연결이 필요 할 경우 16,384개의 연결이 필요합니다. 보통 이를 해결 하기 위해 중계 서버를 만들거나 메세지큐 형태의 서비스를 이용하는데 이러한 서비스를 제공하는 것이 Kafka라는 서비스입니다.

<!--more-->

  

  

### 카프카란?

[카프카](https://www.redhat.com/ko/topics/integration/what-is-apache-kafka)는 pub-sub모델의 메세지 큐이고, 분산환경에 특화되어 설계되어 있다는 특징을 가짐으로써, 기존의 RabbitMQ와 같은 다른 메세지큐 보다 높은 성능을 갖습니다. 그 외에도 클러스터 구성, fail-over, replication와 같은 여러 가지 특징들을 가지고 있습니다.

Kafka의 broker는 topic을 기준으로 메시지를 관리합니다. Producer는 특정 topic의 메시지를 생성한 뒤 해당 메시지를 broker에 전달합니다. Broker가 전달받은 메시지를 topic별로 분류하여 쌓아놓으면, 해당 topic을 구독하는 consumer들이 메시지를 가져가서 처리하게 됩니다.

기존의 메시징 시스템에서는 broker가 consumer에게 메시지를 push해 주는 방식인데 반해, Kafka는 consumer가 broker로부터 직접 메시지를 가지고 가는 pull 방식으로 동작하기 때문에 consumer는 자신의 처리능력만큼의 메시지만 broker로부터 가져오고, 최적의 성능을 낼 수 있습니다.

- producer : 메세지 생산(발행)자.
- consumer : 메세지 소비자, 하나의 서버
- consumer group : consumer 들끼리 메세지를 나눠서 가져가며, .offset 을 공유하여 중복으로 가져가지 않습니다.
- broker : 카프카 서버
- zookeeper : 카프카 서버 (+클러스터) 상태를 관리
- cluster : 브로커들의 묶음
- topic : 메세지 종류, 데이터베이스의 table정도의 개념으로 생각 카프카에 저장되는 데이터를 구분하기위해 토픽이라는 이름을 사용합니다.
- partitions : topic 이 나눠지는 단위 하나의 파티션에 대해 데이터의 순서를 보장한다. 만약 토픽에 대해 모든데이터의 순서를 보장받고 싶다면 파티션의 수를 1로 생성하면 됩니다. 
- Log : 1개의 메세지
- offset : 파티션 내에서 각 메시지가 가지는 unique id

KAFKA는 기존 메시징과 다르게 메시지를 메모리에 쌓는게 아닌 파일형식으로 저장됩니다. 이 데이터는 디스크에서 파일로 확인 가능 하지만, 내용을 알 수 없고 일정시간동안 유지되다 삭제됩니다.



  

  

### Pub-Sub 모델

카프카는 pub-sub(발행/구독) 모델을 사용하기 때문에, 발행/구독모델이 뭔지 알아보자. pub-sub은 메세지를 특정 수신자에게 직접적으로 보내주는 시스템이 아니다. publisher는 메세지를 topic을 통해서 카테고리화 한다. 분류된 메세지를 받기를 원하는 receiver는 그 해당 topic을 구독(subscribe)함으로써 메세지를 읽어 올 수 있다. 즉, publisher는 topic에 대한 정보만 알고 있고, 마찬가지로 subscriber도 topic만 바라본다. publisher 와 subscriber는 서로 모르는 상태다. 가장 간단한 예제를 들어보자, 신문사에서 신문의 종류(topic)에 메세지를 쓴다. 우리는 그 해당 신문을 구독한다.



  

  

### 카프카의 구성요소 및 특징

- topic, partiton
- Producer, Consumer
- broker, zookeepr
- consumer group
- replication