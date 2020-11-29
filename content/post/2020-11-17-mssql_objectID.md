---
title: "MsSQL OBJECT_ID"
date: 2020-11-17T21:03:29+09:00
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

스키마 범위 개체의 데이터베이스 개체 ID를 반환합니다.

<!--more-->

## 구문

```mssql
OBJECT_ID ( '[ database_name . [ schema_name ] . | schema_name . ]   
  object_name' [ ,'object_type' ] )  
```



## 인수

**'** *object_name* **'**
사용할 개체입니다. *object_name*은 **varchar** 또는 **nvarchar**입니다. *object_name*이 **varchar**인 경우 암시적으로 **nvarchar**로 변환됩니다. 데이터베이스 및 스키마 이름 지정은 옵션입니다.

**'** *object_type* **'**
스키마 범위 개체 형식입니다. *object_type*은 **varchar** 또는 **nvarchar**입니다. *object_type*이 **varchar**인 경우 암시적으로 **nvarchar**로 변환됩니다. 개체 형식의 목록은 [sys.objects (Transact-SQL)](https://docs.microsoft.com/ko-kr/sql/relational-databases/system-catalog-views/sys-objects-transact-sql?view=sql-server-ver15)의 **type** 열을 참조하세요.



## 반환 형식

**int**



## 예외

공간 인덱스의 경우 OBJECT_ID는 NULL을 반환합니다.

오류 발생 시 NULL을 반환합니다.

사용자는 소유하고 있거나 사용 권한을 부여 받은 보안 개체의 메타데이터만 볼 수 있습니다. 즉, 사용자가 개체에 대한 사용 권한이 없으면 OBJECT_ID와 같은 메타데이터 내보내기 기본 제공 함수가 NULL을 반환합니다. 자세한 내용은 [Metadata Visibility Configuration](https://docs.microsoft.com/ko-kr/sql/relational-databases/security/metadata-visibility-configuration?view=sql-server-ver15)을 참조하세요.



## 설명

시스템 함수의 매개 변수가 선택 사항이면 현재 데이터베이스, 호스트 컴퓨터, 서버 사용자 또는 데이터베이스 사용자를 가정합니다. 기본 제공 함수 다음에는 항상 괄호가 와야 합니다.

임시 테이블 이름이 지정된 경우 현재 데이터베이스가 **tempdb**가 아니면 데이터베이스 이름이 임시 테이블 이름 앞에 와야 합니다. 예: `SELECT OBJECT_ID('tempdb..#mytemptable')`

시스템 함수는 선택 목록, WHERE 절 및 식이 허용되는 모든 곳에서 사용될 수 있습니다. 자세한 내용은 [식 (Transact-SQL)](https://docs.microsoft.com/ko-kr/sql/t-sql/language-elements/expressions-transact-sql?view=sql-server-ver15) 및 [WHERE (Transact-SQL)](https://docs.microsoft.com/ko-kr/sql/t-sql/queries/where-transact-sql?view=sql-server-ver15)을 참조하세요.



## 예

### A. 지정한 개체의 개체 ID 반환

다음 예에서는 AdventureWorks2012 데이터베이스의 `Production.WorkOrder` 테이블에 관한 개체 ID를 반환합니다.

SQL복사

```sql
USE master;  
GO  
SELECT OBJECT_ID(N'AdventureWorks2012.Production.WorkOrder') AS 'Object ID';  
GO  
```

### B. 개체의 존재 여부 확인

다음 예에서는 테이블에 개체 ID가 있는지 확인해서 지정한 테이블이 있는지 확인합니다. 테이블이 있는 경우 삭제됩니다. 테이블이 없는 경우 `DROP TABLE` 문이 실행되지 않습니다.

SQL복사

```sql
USE AdventureWorks2012;  
GO  
IF OBJECT_ID (N'dbo.AWBuildVersion', N'U') IS NOT NULL  
DROP TABLE dbo.AWBuildVersion;  
GO  
```

### C. OBJECT_ID 사용하여 시스템 함수 매개 변수의 값을 지정

다음 예제에서는 [sys.dm_db_index_operational_stats](https://docs.microsoft.com/ko-kr/sql/relational-databases/system-dynamic-management-views/sys-dm-db-index-operational-stats-transact-sql?view=sql-server-ver15) 함수를 사용하여 AdventureWorks2012 데이터베이스에 있는 `Person.Address` 테이블의 모든 인덱스와 파티션에 대한 정보를 반환합니다.

>  참고
>
> 이 구문은 Azure Synapse Analytics의 서버리스 SQL 풀(미리 보기)에서 지원되지 않습니다.

>  중요
>
> Transact-SQL 함수 DB_ID 및 OBJECT_ID를 사용하여 매개 변수 값이 반환된 경우 유효한 ID가 반환되는지 항상 확인합니다. 존재하지 않는 이름을 입력하거나 철자를 잘못 입력하는 등의 이유로 데이터베이스 또는 개체 이름을 찾을 수 없으면 두 함수 모두 NULL을 반환합니다. **sys.dm_db_index_operational_stats** 함수는 NULL을 모든 데이터베이스나 모든 개체를 지정하는 와일드카드 값으로 해석합니다. 이는 의도하지 않은 결과일 수 있으므로 이 섹션의 예에서는 안전하게 데이터베이스 및 개체 ID를 확인하는 방법을 보여 줍니다.

```sql
DECLARE @db_id INT;  
DECLARE @object_id INT;  
SET @db_id = DB_ID(N'AdventureWorks2012');  
SET @object_id = OBJECT_ID(N'AdventureWorks2012.Person.Address');  
IF @db_id IS NULL   
  BEGIN;  
    PRINT N'Invalid database';  
  END;  
ELSE IF @object_id IS NULL  
  BEGIN;  
    PRINT N'Invalid object';  
  END;  
ELSE  
  BEGIN;  
    SELECT * FROM sys.dm_db_index_operational_stats(@db_id, @object_id, NULL, NULL);  
  END;  
GO  
```