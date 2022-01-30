---
title: "MsSQL SET ANSI_NULLS ON|OFF"
date: 2020-11-14T22:00:20+09:00
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

### 구문

```sql
-- Syntax for SQL Server

SET ANSI_NULLS { ON | OFF }
```

<!--more-->

  

  

### 설명

ANSI_NULLS 옵션이 ON인 경우, WHERE *column_name* = **NULL**을 사용하는 SELECT 문은 *column_name*에 null 값이 있어도 0행을 반환합니다. WHERE *column_name* <> **NULL**을 사용하는 SELECT 문은 *column_name*에 Null 이외의 값이 있어도 0행을 반환합니다.

ANSI_NULLS 옵션이 OFF면 Equals(=)와 Not Equal(<>) 비교 연산자가 ISO 표준을 따르지 않습니다. WHERE *column_name* = **NULL**을 사용하는 SELECT 문은 *column_name*에 Null 값이 있는 행을 반환합니다. WHERE *column_name* <> **NULL**을 사용하는 SELECT 문은 열에 Null 이외의 값이 있는 행을 반환합니다. 또한 WHERE *column_name* <> *XYZ_value*를 사용하는 SELECT 문은 *XYZ_value*가 아니고 NULL이 아닌 모든 행을 반환합니다.

ANSI_NULLS 옵션이 OFF면 Equals(=)와 Not Equal(<>) 비교 연산자가 ISO 표준을 따르지 않습니다. WHERE *column_name* = **NULL**을 사용하는 SELECT 문은 *column_name*에 Null 값이 있는 행을 반환합니다. WHERE *column_name* <> **NULL**을 사용하는 SELECT 문은 열에 Null 이외의 값이 있는 행을 반환합니다. 또한 WHERE *column_name* <> *XYZ_value*를 사용하는 SELECT 문은 *XYZ_value*가 아니고 NULL이 아닌 모든 행을 반환합니다.

{{< adsense >}}

다음 표에서는 ANSI_NULLS 설정이 null과 null이 아닌 값을 사용하여 많은 부울 식의 결과에 어떤 영향을 미치는지를 보여 줍니다.

| 부울 식(Boolean Expression) | SET ANSI_NULLS ON | SET ANSI_NULLS OFF |
| :-------------------------- | :---------------- | :----------------- |
| NULL = NULL                 | UNKNOWN           | TRUE               |
| 1 = NULL                    | UNKNOWN           | FALSE              |
| NULL <> NULL                | UNKNOWN           | FALSE              |
| 1 <> NULL                   | UNKNOWN           | TRUE               |
| NULL > NULL                 | UNKNOWN           | UNKNOWN            |
| 1 > NULL                    | UNKNOWN           | UNKNOWN            |
| NULL IS NULL                | TRUE              | TRUE               |
| 1 IS NULL                   | FALSE             | FALSE              |
| NULL IS NOT NULL            | FALSE             | FALSE              |
| 1 IS NOT NULL               | TRUE              | TRUE               |

SET ANSI_NULLS ON 옵션은 비교의 피연산자 중 하나가 NULL 변수 또는 리터럴 NULL 변수인 경우에만 해당 비교에 영향을 줍니다. 비교의 양쪽이 열 또는 복합 식인 경우에는 설정이 비교에 영향을 주지 않습니다.

ANSI_NULLS 데이터베이스 옵션이나 SET ANSI_NULLS 설정에 관계없이 스크립트가 의도했던 대로 실행되도록 하려면 Null 값을 포함할 수 있는 비교에 IS NULL과 IS NOT NULL을 사용하십시오.

분산 쿼리를 실행할 때는 ANSI_NULLS를 ON으로 설정해야 합니다.

계산 열이나 인덱싱된 뷰에서 인덱스를 만들거나 변경할 때는 ANSI_NULLS 옵션도 ON으로 설정해야 합니다. SET ANSI_NULLS 옵션이 OFF면 계산 열의 인덱스가 있는 테이블이나 인덱싱된 뷰에서 CREATE, UPDATE, INSERT, DELETE 문이 실패합니다. SQL Server는 필요한 값을 위반하는 모든 SET 옵션이 나열된 오류를 반환합니다. 뿐만 아니라 SELECT 문 실행 시 SET ANSI_NULLS 옵션이 OFF면 SQL Server는 계산 열이나 뷰의 인덱스 값을 무시하고 테이블이나 뷰에 이러한 인덱스가 없는 것처럼 SELECT 작업을 처리합니다.



  

  

### 예제

다음 예에서는 Equals(`=`)와 Not Equal To(`<>`) 비교 연산자를 사용하여 테이블의 `NULL` 및 Null이 아닌 값에 비교를 수행합니다. 또한 `IS NULL`이 `SET ANSI_NULLS` 설정의 영향을 받지 않는다는 것을 보여 줍니다.

```sql
-- Create table t1 and insert values.  
CREATE TABLE dbo.t1 (a INT NULL);  
INSERT INTO dbo.t1 values (NULL),(0),(1);  
GO  
  
-- Print message and perform SELECT statements.  
PRINT 'Testing default setting';  
DECLARE @varname int;   
SET @varname = NULL;  
  
SELECT a  
FROM t1   
WHERE a = @varname;  
  
SELECT a   
FROM t1   
WHERE a <> @varname;  
  
SELECT a   
FROM t1   
WHERE a IS NULL;  
GO 
```

이제 ANSI_NULLS를 ON으로 설정하고 테스트합니다.

SQL복사

```sql
PRINT 'Testing ANSI_NULLS ON';  
SET ANSI_NULLS ON;  
GO  
DECLARE @varname int;  
SET @varname = NULL  
  
SELECT a   
FROM t1   
WHERE a = @varname;  
  
SELECT a   
FROM t1   
WHERE a <> @varname;  
  
SELECT a   
FROM t1   
WHERE a IS NULL;  
GO  
```

이제 ANSI_NULLS를 OFF로 설정하고 테스트합니다.

```sql
PRINT 'Testing ANSI_NULLS OFF';  
SET ANSI_NULLS OFF;  
GO  
DECLARE @varname int;  
SET @varname = NULL;  
SELECT a   
FROM t1   
WHERE a = @varname;  
  
SELECT a   
FROM t1   
WHERE a <> @varname;  
  
SELECT a   
FROM t1   
WHERE a IS NULL;  
GO  
  
-- Drop table t1.  
DROP TABLE dbo.t1;  
```