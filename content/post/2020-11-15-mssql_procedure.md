---
title: "Mssql Procedure 프로시저"
date: 2020-11-15T15:29:56+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce, Blog
categories:
- Dev
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

저장 프로시저는 다음과 같은 점에서 다른 프로그래밍 언어의 프로시저와 유사합니다.

- 입력 매개 변수를 받아 여러 값을 출력 매개 변수의 형태로 호출하는 프로시저 또는 일괄 처리에 반환합니다.
- 다른 프로시저 호출을 비롯하여 데이터베이스에서 작업을 수행하는 프로그래밍 문이 포함되어 있습니다.
- 호출하는 프로시저 또는 일괄 처리에 상태 값을 반환하여 성공 또는 실패 및 실패 원인을 나타냅니다.

<!--more-->

### 구문

```mssql
/*

*****프로시져기본형식********

CREATE PROC 프로시져명

매개변수선언부

AS

변수선언부

BEGIN

프로시져본문

END

GO

*****************************

*/
CREATE [ OR ALTER ] { PROC | PROCEDURE }
    [schema_name.] procedure_name [ ; number ]
    [ { @parameter [ type_schema_name. ] data_type }
        [ VARYING ] [ = default ] [ OUT | OUTPUT | [READONLY]
    ] [ ,...n ]
[ WITH <procedure_option> [ ,...n ] ]
[ FOR REPLICATION ]
AS { [ BEGIN ] sql_statement [;] [ ...n ] [ END ] }
[;]

<procedure_option> ::=
    [ ENCRYPTION ]
    [ RECOMPILE ]
    [ EXECUTE AS Clause ]
```


#### 인수

**@** *parameter* 프로시저에 선언된 매개 변수입니다. at 기호( **@** )를 첫 번째 문자로 사용하여 매개 변수 이름을 지정합니다. 매개 변수 이름은 [식별자](https://docs.microsoft.com/ko-kr/sql/relational-databases/databases/database-identifiers?view=sql-server-ver15)에 대한 규칙을 따라야 합니다. 매개 변수는 프로시저에서 로컬로 사용되므로 다른 프로시저에서 동일한 매개 변수 이름을 사용할 수 있습니다.

하나 이상의 매개 변수를 선언할 수 있으며 최대 2,100개까지 선언할 수 있습니다. 선언된 각 매개 변수의 값은 기본값이 정의된 경우나 다른 매개 변수와 값이 같도록 설정된 경우를 제외하면 프로시저가 호출될 때 사용자가 지정해야 합니다.

FOR REPLICATION을 지정하면 매개 변수를 선언할 수 없습니다.

VARYING 결과 집합이 출력 매개 변수로 사용되도록 지정합니다. 이 매개 변수는 프로시저에 의해 동적으로 생성될 수 있으며 해당 내용은 여러 가지가 될 수 있습니다. **cursor** 매개 변수에만 적용됩니다. CLR 프로시저에는 이 옵션이 유효하지 않습니다.

*default* 매개 변수의 기본값을 지정합니다. 매개 변수에 대해 기본값이 정의되어 있으면 해당 매개 변수 값을 지정하지 않아도 프로시저를 실행할 수 있습니다. 기본값은 상수이거나 NULL입니다. 상수 값을 와일드카드 형태로 지정할 수 있으므로 프로시저에 매개 변수를 전달할 때 LIKE 키워드를 사용할 수 있습니다.

OUT | OUTPUT 매개 변수가 출력 매개 변수임을 나타냅니다. OUTPUT 매개 변수를 사용하여 프로시저의 호출자에 값을 반환할 수 있습니다. 프로시저가 CLR 프로시저가 아니면 **text** , **ntext** 및 **image** 매개 변수를 OUTPUT 매개 변수로 사용할 수 없습니다. 프로시저가 CLR 프로시저가 아닐 경우 출력 매개 변수는 커서 자리 표시자일 수 있습니다. 테이블 반환 데이터 형식은 프로시저의 OUTPUT 매개 변수로 지정할 수 없습니다.

READONLY 프로시저 본문 내에서 매개 변수를 업데이트하거나 수정할 수 없음을 나타냅니다. 매개 변수 형식이 테이블 반환 형식인 경우 READONLY를 지정해야 합니다.

RECOMPILE 데이터베이스 엔진에서 현재 프로시저의 쿼리 계획을 캐시하지 않고 프로시저가 실행될 때마다 컴파일한다는 것을 나타냅니다.



### 활용 예시

```mssql
CREATE PROC PROC_MJOIN --PROC_MJOIN 라는 프로시저 이름 명시

--매개변수나 내부변수를 만들때 꼭 변수 앞에는 "@"를 붙여 변수임을 구분
    @ID NVARCHAR(10),
    @PWD NVARCHAR(10),
    @NAME NVARCHAR(5),
    @NICK NVARCHAR(50),
    @IP NVARCHAR(15),
    @RESULT BIT OUTPUT --프로시저가 실행하고 반환 시켜줄 매개변수

AS --변수 선언 끝

--내부변수선언부
DECLARE @N NVARCHAR(50)

BEGIN --구문의 본문 시작

	--NULL체크는IS NULL-NULL(빈값)값을받았다면/ NOT NULL-값이NULL이아니라면
    IF @NICK IS NULL
        BEGIN

        SET @N = @NAME; --SET은변수에값을저장하겠다고선언할때사용

        END

    ELSE

        BEGIN

        SET @N = @NICK

    END

/*
트랜젝션은업무를처리하기위한SQL문이다
작업이실행중에에러가발생하면ROLLBACK 시켜서처음상태로되돌려주고
실행과정이이상이없다면DML코드와관련된일들을COMMIT 하여정상적으로
저장, 업데이트, 삭제등을해준다.
*/
    BEGIN TRAN

        BEGIN TRY --예외처리를위한TRY~ CATCH문의본문

            INSERT INTO MEMBERS(ME_ID, ME_PWD, ME_NAME, ME_NICK, ME_STATE, ME_INOUT, ME_IP)
            VALUES(LOWER(@ID), PWDENCRYPT(@PWD), @NAME, @N, 0, 0, @IP);

            INSERT INTO HISTORY(HI_MEID, HI_DATETIME, HI_INOUT)
            VALUES(LOWER(@ID), DEFAULT, 0);

            COMMIT TRAN

            SET @RESULT = 1

        END TRY

    BEGIN CATCH --TRY~ CATCH문에본문처리중에러가발생했을때처리해야부분

        IF @@ERROR > 0 --@@ERROR(에러가발생하면에러가저장되는전역변수)가0이상이라면에러가발생했다는의미

        BEGIN

            ROLLBACK TRAN --트랜잭션이시작되기이전상태로되돌려준다.
            SET @RESULT = 0

        END

    END CATCH

END --구문의끝여기서END는프로시져생성구문이끝났음을의미한다.

GO
-- 테스트
DECLARE @RESULT BIT; --반환받을변수선언
EXEC PROC_MJOIN 'ZZANG', 'A1234', '짱', NULL, '112.169.178.151', @RESULT OUTPUT
print @RESULT
```