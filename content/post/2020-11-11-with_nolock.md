---
title: "MsSQL with nolock"
date: 2020-11-11T21:13:26+09:00
#Dev, C++
categories:
- DB
- MsSQL
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

MSSQL은 기본적으로 SELECT 시에 공유잠금(TRANSACTION ISOLATION READ COMMIT)이 걸리게 됩니다.

MSSQL에서 SELECT 시에 **WITH (NOLOCK)** 을 주면 공유잠금을 걸지 않고 바로 조회 수행합니다.

```sql
SELECT * FROM TABLE1 WITH (NOLOCK)
```


<!--more-->

SELECT 문이 수행되는 테이블에 대해서 INSERT, UPDATE, DELETE 문이 수행되고 있다면 SELECT문은 선행 작업이 모두 끝날때까지 LOCK이 걸립니다.

이때 SELECT 문에 WITH (NOLOCK)을 추가하면 선행작업의 결과와 관계없이 바로 SELECT문이 수행되어서 결과를 반환하게 됩니다.

SELECT 문장에서 여러 테이블을 조인해서 가져오는 경우 WITH (NOLOCK)을 사용하기 위해서는 모든 테이블에 적어주어야 합니다.
```mssql
select * into dbo.A from B as sb with(nolock)
inner join Bonus as b with(nolock) on b.id = sb.BonusID and b.BonusTypeID = 1111
```



프로시저 내에서 사용되는 SELECT 문에서 WITH (NOLOCK)을 사용하기 위해서는 각 문장마다 삽입할 필요없이 프로시저 시작 부분에 다음 문장을 추가해 주면 됩니다.

 ```mssql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
 ```



사용 예시

```mssql
CREATE PROCEDURE 프로시저명

AS

  SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

  SET NOCOUNT ON;

BEGIN

 

  ...



END
```