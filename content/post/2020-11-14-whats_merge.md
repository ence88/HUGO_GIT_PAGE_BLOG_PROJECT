---
title: "MsSQL Merge문"
date: 2020-11-14T21:19:54+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce, Blog
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

SQL Server 2008 부터 지원되는 MERGE문은 조건에 따라 INSERT, UPDATE ,DELETE등을 한 문장으로 간단히 실행할 수 있는 편리한 TSQL 문장입니다. MERGE가 없는 이전 버전의 경우 보통 IF문 등으로 조건을 먼저 체크하고 DML 문장(INSERT, UPDATE ,DELETE)을 각각 나눠서 여러 문장으로 기술해야 했습니다.

<!--more-->

  

  

MERGE문은 여러 개의 개별 DML문을 단일 쿼리로 대체할 수 있고, 성능 향상 이점이 있습니다.

사용예

```sql
MERGE 변경될테이블명 AS A
	USING 기준테이블명 AS B
	ON A.컬럼명 = B.컬럼명
	WHEN MATCHED THEN
		일치할때쿼리문
	WHEN NOT MATCHED THEN
		불일치할때쿼리문
```



  

{{< adsense >}}

아래와 같이 기준테이블의 컬럼을 지정할 수 있습니다.

또한, MATCHED, NOT MATCHED와 함께 추가 조건 지정도 가능합니다.

```sql
MERGE 변경될테이블명 AS A
	USING (SELECT 컬럼명 FROM 기준테이블명) AS B
	ON (A.컬럼명 = B.컬럼명 AND A.컬럼명 = B.컬럼명)
	WHEN MATCHED AND 조건 THEN
		INSERT (A.컬럼명) VALUES(B.컬럼명)
	WHEN NOT MATCHED AND 조건 THEN
		UPDATE SET A.컬렴명 = B.컬럼명
	WHEN NOT MATCHED AND 조건 THEN
		DELETE;
```