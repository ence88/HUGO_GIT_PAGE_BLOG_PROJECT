---
title: "MsSQL linked server와 OPENQUERY 정의, 사용법"
date: 2020-11-29T23:26:55+09:00
#Language, C++, DB, MsSQL, MySQL, Common, SCM, Perforce, Blog, SVN
categories:
- DB
- MsSQL
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- DB
- MsSQL
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

linked server는 

MsSQL은 linked server라는 기능을 제공하는데, 이를 이용하면 물리적, 논리적으로 독립된 네트워크의 데이터베이스에 원격으로 접속하여 쿼리를 수행 할 수 있습니다.

<!--more-->

\- MSSQL 연결된 서버 생성

```mssql
EXEC sp_addlinkedserver
    @server = '[연결된 서버별칭]',
    @srvproduct = '',
    @provider = 'SQLOLEDB',
    @datasrc = '[서버 아이피]',
    @catalog = '[데이터 베이스명]'
```


\- MSSQL 연결계정 생성

```mssql
EXEC sp_addlinkedsrvlogin
    @rmtsrvname= '[연결된 서버별칭]',
    @useself= 'false',
    @rmtuser = '[사용자 이름]',
    @rmtpassword = '[사용자 암호]'
```


\- MSSQL 연결된 서버 확인

```mssql
SELECT * FROM master.dbo.sysservers WHERE srvname = '[연결된 서버별칭]'
```


\- MSSQL 연결계정 확인

```mssql
SELECT * FROM master.sys.linked_logins WHERE remote_name = '[사용자 이름]'
```


\- MSSQL 연결된 서버 사용 예시

```mssql
--  연결된 서버를 등록한 후 사용하려면 [연결된 서버별칭].[데이터 베이스명].[데이터베이스 소유자명].[테이블명]
--  형태로 호출하여 사용할 수 있습니다.
--  SELECT 쿼리를 예로 들면 아래와 같습니다.

```


\- MSSQL 연결된 서버에 SELECT 쿼리시

```mssql
SELECT [컬럼명] FROM [연결된 서버별칭].[데이터 베이스명].[데이터베이스 소유자명].[테이블명] WHERE [조건절]
```


- Openquery 활용

  ``` mssql
  -- 'OpenQuery' 이용이 Linked Server를 이용하는 방식보다 빠르다.
  -- OpenQuery() 안의 내용은 varchar(8000) 까지이다.
  
  -- select
  SELECT *
  FROM OPENQUERY(
      [192.168.0.1],
      'SELECT * FROM [테이블] WHERE no < 101'
  );
  
  -- update
  UPDATE OpenQuery(
      [192.168.0.1],
      'SELECT regDate
      FROM [데이터베이스].dbo.[테이블]
      WHERE Seq = 1')
  Set regDate = getDate()
  
  -- Update : 동적 쿼리
  Declare @strQuery varchar(4000)
  Declare @no bigint = 123
  Declare @a int = 10
  Declare @b int = 10
  Set @strQuery = N'UPDATE OpenQuery([192.168.0.1], '''
          + N'SELECT a, b'
          + N' FROM [데이터베이스].dbo.[테이블]'
          + N' WHERE no = ' + CONVERT(varchar(30),@no)+''
      + N''')'
      + N' Set a = a + '+ Convert(varchar(30),@a)+''
      + N', b = b + '+ Convert(varchar(30),@b)
  --print @strQuery
  Exec (@strQuery);
  ```

  