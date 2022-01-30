---
title: "MsSQL 무결성 강제 적용(제약조건) PRIMARY KEY 및 FOREIGN KEY"
date: 2020-11-15T13:39:43+09:00
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

MsSQL 테이블에서 데이터 무결성을 강제 적용하는 데 사용할 수 있는 두 가지 유형의 제약 조건으로 기본 키와 외래 키가 있습니다. 이들 키는 중요한 데이터베이스 개체입니다.

<!--more-->

  

  

### 기본 키 제약 조건

테이블에는 일반적으로 테이블의 각 행을 고유하게 식별하는 값을 가진 열 또는 열 조합이 포함되어 있습니다. 이러한 열이나 열 조합은 테이블의 PK(기본 키)라고 하며 테이블에 엔터티 무결성을 적용합니다. 기본 키 제약 조건은 데이터의 고유성을 보장하므로 자주 ID 열에 정의됩니다.

테이블에 대해 기본 키 제약 조건을 지정하면 데이터베이스 엔진 은 기본 키 열에 대해 고유 인덱스를 자동으로 만들어 데이터 고유성을 적용합니다. 또한 쿼리에서 기본 키가 사용되는 경우 이 인덱스를 사용하여 데이터에 빠르게 액세스할 수 있습니다. 기본 키 제약 조건이 두 개 이상의 열에 정의되는 경우 한 열에 중복된 값이 있을 수 있지만 기본 키 제약 조건 정의에 있는 모든 열의 값 조합은 각각 고유해야 합니다.

다음 그림에서와 같이 **Purchasing.ProductVendor** 테이블의 **ProductID** 및 **VendorID** 열은 이 테이블에 대한 복합 기본 키 제약 조건을 구성합니다. 그 결과 **Pr**

**oductVendor** 테이블의 모든 열에서 **ProductID**와 **VendorID**의 조합은 고유합니다. 따라서 중복 행을 삽입할 수 없습니다.

![복합 PRIMARY KEY 제약 조건](\img\fund04.png)

- 테이블은 하나의 기본 키 제약 조건만 포함할 수 있습니다.
- 기본 키는 16개 열을 초과할 수 없으며 총 키 길이가 900바이트를 넘을 수 없습니다.
- 기본 키 제약 조건에 의해 생성된 인덱스 수는 비클러스터형 인덱스 999개, 클러스터형 인덱스 1개인 테이블의 인덱스 수 제한을 초과할 수 없습니다.
- 기본 키 제약 조건에 대해 클러스터형 또는 비클러스터형을 지정하지 않은 경우 테이블에 클러스터형 인덱스가 없으면 클러스터형이 사용됩니다.
- 기본 키 제약 조건 내에서 정의된 모든 열은 NOT NULL로 정의되어야 합니다. NULL 허용 여부를 지정하지 않은 경우에는 기본 키 제약 조건에 참여하는 모든 열의 NULL 허용 여부가 NOT NULL로 설정됩니다.
- CLR 사용자 정의 형식 열에 기본 키를 정의하는 경우 형식 구현이 이진 순서를 지원해야 합니다.



  

  

### Foreign Key Constraints

외래 키(FK)는 두 테이블의 데이터 간 연결을 설정하고 강제 적용하여 외래 키 테이블에 저장될 수 있는 데이터를 제어하는 데 사용되는 열입니다. 외래 키 참조에서는 한 테이블의 기본 키 값을 가지고 있는 열을 다른 테이블의 열이 참조할 때 두 테이블 간에 연결이 생성됩니다. 이때 두 번째 테이블에 추가되는 열이 외래 키가 됩니다.

예를 들어 **Sales.SalesOrderHeader** 테이블에는 **Sales.SalesPerson** 테이블에 대한 외래 키 연결이 생성되는데 이는 판매 주문과 영업 사원 간에 논리적 관계가 있기 때문입니다. **SalesOrderHeader** 테이블의 **SalesPersonID** 열은 **SalesPerson** 테이블의 기본 키 열과 일치합니다. **SalesOrderHeader** 테이블의 **SalesPersonID** 열은 **SalesPerson** 테이블에 대한 외래 키입니다. 이 외래 키 관계를 만들면 **SalesPerson** 테이블에 **SalesPersonID** 값이 없을 경우 **SalesOrderHeader** 테이블에 이 값을 삽입할 수 없습니다.

각 테이블은 최대 253개의 다른 테이블 및 열을 외래 키(나가는 참조)로 참조할 수 있습니다. SQL Server 2016(13.x) 에서는 단일 테이블의 열을 참조할 수 있는 다른 테이블 및 열의 수 제한이 253에서 10,000으로 증가합니다. 단, 호환성 수준이 130 이상이어야 합니다. 이러한 참조 가능 테이블 및 열 수의 증가에는 다음과 같은 제한이 적용됩니다.

- 253개를 초과하는 외래 키 참조는 DELETE DML 작업에서만 지원됩니다. UPDATE 및 MERGE 작업은 지원되지 않습니다.
- 자기 자신에 대한 외래 키 참조가 포함된 테이블은 계속 253개의 외래 키 참조만 사용할 수 있습니다.
- columnstore 인덱스, 메모리 최적화 테이블, 스트레치 데이터베이스 또는 분할된 외래 키 테이블에 대해서는 현재 253개보다 많은 외래 키 참조를 포함할 수 없습니다.

{{< adsense >}}

### FOREIGN KEY 제약 조건에 대한 인덱스

기본 키 제약 조건과 달리 외래 키 제약 조건을 만들어도 해당 인덱스가 자동으로 생성되지 않습니다. 그러나 외래 키에 대해 인덱스를 수동으로 만들면 다음과 같은 경우 유용합니다.

- 외래 키 열은 쿼리에서 한 테이블의 외래 키 제약 조건 열을 다른 테이블의 기본 또는 고유 키 열과 연결하여 테이블의 데이터를 병합하는 조인에서 자주 사용됩니다. 데이터베이스 엔진 에서는 인덱스를 만들어 외래 키 테이블에 있는 관련 데이터를 빠르게 찾을 수 있습니다. 그러나 반드시 인덱스를 만들 필요는 없습니다. 테이블 간에 기본 키 또는 외래 키 제약 조건이 정의되지 않더라도 관련된 두 테이블의 데이터를 결합할 수 있습니다. 그러나 두 테이블 간 외래 키 관계가 설정되면 키를 기준으로 하는 쿼리에서 결합할 때 최적화될 수 있습니다.

- 기본 키 제약 조건이 변경되면 연결된 테이블의 외래 키 제약 조건도 검사합니다.






### 참조 무결성

외래 키 제약 조건의 기본 목적이 외래 키 테이블에 저장되는 데이터를 제어하는 것이지만 기본 키 테이블의 데이터 변경 사항도 제어할 수 있습니다. 예를 들어 한 영업 사원에 대한 행이 **Sales.SalesPerson** 테이블에서 삭제되었는데 이 영업 사원의 ID가 **Sales.SalesOrderHeader** 테이블의 판매 주문에 사용된 경우 두 테이블 간의 관계 무결성이 손상됩니다. **SalesPerson** 테이블의 데이터에 대한 연결이 끊어졌으므로 삭제된 영업 사원의 판매 주문은 **SalesOrderHeader** 테이블에서 고아 항목이 됩니다.

외래 키 제약 조건은 이런 상황이 발생되지 않도록 합니다. 이 제약 조건은 기본 키 테이블의 데이터를 변경할 때 외래 키 테이블에 있는 데이터로의 연결이 무효화될 가능성이 있으면 그 데이터를 변경하지 못하도록 하여 참조 무결성을 강제 적용합니다. 삭제되거나 변경되는 기본 키 값이 다른 테이블의 외래 키 제약 조건 값과 연결되어 있으면 기본 키 테이블의 행을 삭제하거나 기본 키 값을 변경하려는 동작이 수행되지 않습니다. 외래 키 제약 조건의 행을 제대로 변경하거나 삭제하려면 먼저 외래 키 테이블에 있는 외래 키 데이터를 삭제하거나 변경하여 외래 키를 다른 기본 키 데이터에 연결해야 합니다.

  

  

### 연계 참조 무결성

연계 참조 무결성 제약 조건을 사용하면 기존 외래 키가 가리키는 키를 사용자가 삭제 또는 업데이트하려 할 때 데이터베이스 엔진 에서 수행할 동작을 정의할 수 있습니다. 다음과 같은 연계 동작을 정의할 수 있습니다.

NO ACTION
데이터베이스 엔진 에서는 오류가 발생하며 부모 테이블의 행에 대한 삭제 또는 업데이트 동작이 롤백됩니다.

CASCADE
부모 테이블에서 해당 행이 업데이트되거나 삭제될 때 참조 테이블에서도 해당 행이 업데이트 또는 삭제됩니다. **timestamp** 열이 외래 키 또는 참조되는 키의 일부인 경우에는 CASCADE를 지정할 수 없습니다. INSTEAD OF DELETE 트리거가 있는 테이블에는 ON DELETE CASCADE를 지정할 수 없습니다. INSTEAD OF UPDATE 트리거가 있는 테이블에 대해서는 ON UPDATE CASCADE를 지정할 수 없습니다.

SET NULL
부모 테이블에서 행을 업데이트하거나 삭제하면 해당 외래 키를 구성하는 모든 값이 NULL로 설정됩니다. 이 제약 조건을 실행하려면 외래 키 열이 Null을 허용해야 합니다. INSTEAD OF UPDATE 트리거가 있는 테이블에 대해서는 지정할 수 없습니다.

SET DEFAULT
부모 테이블에서 해당 행을 업데이트하거나 삭제하면 외래 키를 구성하는 모든 값이 기본값으로 설정됩니다. 이 제약 조건을 실행하려면 모든 외래 키 열에 기본 정의가 있어야 합니다. 열이 Null을 허용하고 명시적 기본값이 설정되어 있지 않은 경우 NULL은 해당 열의 암시적 기본값이 됩니다. INSTEAD OF UPDATE 트리거가 있는 테이블에 대해서는 지정할 수 없습니다.

CASCADE, SET NULL, SET DEFAULT 및 NO ACTION은 서로 참조 관계를 가진 테이블에서 결합될 수 있습니다. 데이터베이스 엔진 이 NO ACTION을 발견하면 관련된 CASCADE, SET NULL 및 SET DEFAULT 동작을 멈추고 롤백합니다. DELETE 문으로 CASCADE, SET NULL, SET DEFAULT 및 NO ACTION 동작을 결합하면 데이터베이스 엔진 이 NO ACTION을 확인하기 전에 모든 CASCADE, SET NULL 및 SET DEFAULT 동작을 적용합니다.

  

  

### 트리거 및 연계 참조 동작

연계 참조 동작은 다음과 같은 방식으로 AFTER UPDATE 또는 AFTER DELETE 트리거를 시작합니다.

- 원래 DELETE 또는 UPDATE 문에 의해 직접적으로 시작된 모든 연계 참조 동작이 먼저 수행됩니다.
- 영향을 받는 테이블에 AFTER 트리거가 정의되어 있는 경우 해당 트리거는 모든 연계 동작이 수행된 후에 시작됩니다. 이 트리거는 연계 동작 순서와 반대로 시작됩니다. 단일 테이블에 여러 트리거가 있는 경우 이 테이블에 첫 번째 또는 마지막으로 지정된 트리거가 없다면 임의의 순서로 시작됩니다. 이 시작 순서는 sp_settriggerorder를 사용하여 지정한 대로 수행됩니다.
- UPDATE 또는 DELETE 동작의 직접적인 대상인 테이블로부터 여러 연계 체인이 시작되는 경우 이 체인이 각 트리거를 시작하는 순서는 지정되지 않습니다. 그러나 항상 한 체인이 해당 트리거를 모두 시작한 후에 다른 체인이 해당 트리거를 시작합니다.
- UPDATE 또는 DELETE 동작의 직접적인 대상인 테이블에 대한 AFTER 트리거는 영향을 받는 행이 있는지 여부에 관계 없이 항상 시작됩니다. 이 경우 다른 테이블은 연계 작업에 영향을 받지 않습니다.
- 이전 트리거 중 하나가 다른 테이블에 대해 UPDATE 또는 DELETE 작업을 수행하는 경우 이 동작에 의해 보조 연계 체인이 시작될 수 있습니다. 이러한 보조 체인은 기본 체인의 모든 트리거가 시작된 후에 각 UPDATE 또는 DELETE 작업에서 처리됩니다. 이러한 과정은 나중에 수행되는 UPDATE 또는 DELETE 작업에서 재귀적으로 반복될 수 있습니다.
- 트리거 내에서 CREATE, ALTER, DELETE 또는 기타 DDL(데이터 정의 언어) 작업이 수행되면 DDL 트리거가 시작될 수 있습니다. 그리고 추가 연계 체인과 트리거를 시작하는 DELETE 또는 UPDATE 작업이 뒤이어 수행될 수 있습니다.
- 특정 연계 참조 동작 체인 내에서 오류가 생성되면 오류가 발생하고 해당 체인에서 AFTER 트리거가 시작되지 않으며 체인을 만든 DELETE 또는 UPDATE 작업이 롤백됩니다.
- INSTEAD OF 트리거가 있는 테이블은 연계 동작을 지정하는 REFERENCES 절도 가질 수 없습니다. 그러나 연계 동작의 대상이 되는 테이블의 AFTER 트리거는 다른 테이블 또는 그 개체에 정의된 INSTEAD OF 트리거를 시작하는 뷰에서 INSERT, UPDATE 또는 DELETE 문을 실행할 수 있습니다.

  

  

### SSMS 사용하여 기본 키를 만들려면

1. 개체 탐색기에서 UNIQUE 제약 조건을 추가하려는 테이블을 마우스 오른쪽 단추로 클릭하고 **디자인**을 선택합니다.
2. **테이블 디자이너**에서 기본 키로 정의하려는 데이터베이스 열의 행 선택기를 클릭합니다. 여러 열을 선택하려면 Ctrl 키를 누른 상태로 다른 열의 행 선택기를 클릭합니다.
3. 열의 행 선택기를 마우스 오른쪽 단추로 클릭하고 **기본 키 설정**을 선택합니다.

 주의

기본 키를 다시 정의하려면 기존의 기본 키에 대한 관계를 모두 삭제한 다음 기본 키를 새로 만들어야 합니다. 이 과정에서 기존의 관계가 자동으로 삭제된다는 경고 메시지가 나타납니다.

기본 키 열을 구분하기 위해 해당 행 선택기에 기본 키 기호가 표시됩니다.

기본 키가 두 개 이상의 열로 구성되어 있는 경우 한 열에는 중복 값이 허용되지만 기본 키의 모든 열에 있는 값의 각 조합은 중복되지 않아야 합니다.

복합 키를 정의하는 경우 기본 키의 열 순서는 테이블에 표시되는 열 순서와 일치합니다. 기본 키를 만든 후에 이러한 열 순서를 변경할 수 있습니다. 자세한 내용은 [기본 키 수정](https://docs.microsoft.com/ko-kr/sql/relational-databases/tables/modify-primary-keys?view=sql-server-ver15)을 참조하세요.

  

  

### 기존 테이블에 고유 키를 만들려면

다음 예제에서는 AdventureWorks 데이터베이스의 `TransactionID` 열에 기본 키를 만듭니다.

```sql
ALTER TABLE Production.TransactionHistoryArchive
   ADD CONSTRAINT PK_TransactionHistoryArchive_TransactionID PRIMARY KEY CLUSTERED (TransactionID);
```

  

  

### 새 테이블에 고유 키를 만들려면

다음 예제에서는 테이블을 만들고 AdventureWorks 데이터베이스의 `TransactionID` 열에 기본 키를 정의합니다.

```sql
CREATE TABLE Production.TransactionHistoryArchive1
   (
      TransactionID int IDENTITY (1,1) NOT NULL
      , CONSTRAINT PK_TransactionHistoryArchive_TransactionID PRIMARY KEY CLUSTERED (TransactionID)
   )
;
```

  

  

### 클러스터형 인덱스를 사용하여 새 테이블에 기본 키를 만들려면 다음을 수행합니다.

다음 예제에서는 AdventureWorks 데이터베이스에서 테이블을 만들고 `CustomerID` 열에 기본 키를, `TransactionID` 열에 클러스터형 인덱스를 정의합니다.

```sql
-- Create table to add the clustered index
CREATE TABLE Production.TransactionHistoryArchive1
   (
      CustomerID uniqueidentifier DEFAULT NEWSEQUENTIALID()
      , TransactionID int IDENTITY (1,1) NOT NULL
      , CONSTRAINT PK_TransactionHistoryArchive1_CustomerID PRIMARY KEY NONCLUSTERED (CustomerID)
   )
;

-- Now add the clustered index
CREATE CLUSTERED INDEX CIX_TransactionID ON Production.TransactionHistoryArchive1 (TransactionID);
```

  

  

### 개체 탐색기를 사용하여 PRIMARY KEY 제약 조건을 삭제하려면

1. 개체 탐색기에서 기본 키가 포함된 테이블을 확장한 후 **키**를 확장합니다.
2. 키를 마우스 오른쪽 단추로 클릭하고 **삭제**를 선택합니다.
3. **개체 삭제** 대화 상자에서 올바른 키가 지정되었는지 확인하고 **확인**을 클릭합니다.

  

  

### 테이블 디자이너를 사용하여 PRIMARY KEY 제약 조건을 삭제하려면

1. 개체 탐색기에서 기본 키가 있는 테이블을 마우스 오른쪽 단추로 클릭한 다음 **디자인**을 클릭합니다.

2. 테이블 표에서 기본 키가 있는 행을 마우스 오른쪽 단추로 클릭하고 **기본 키 제거** 를 선택하여 기본 키 설정 또는 해제 여부를 전환할 수 있습니다.

    참고

   이 동작을 실행 취소하려면 변경 내용을 저장하지 않은 상태로 테이블을 닫습니다. 기본 키 삭제 작업을 취소하면 테이블에 대한 다른 모든 변경 내용이 손실됩니다.

3. **파일** 메뉴에서 ‘테이블 이름’ **저장**을 클릭합니다.






### Transact-SQL 사용하여 PRIMARY KEY 제약 조건을 삭제하려면

1. **개체 탐색기**에서 데이터베이스 엔진인스턴스에 연결합니다.

2. 표준 도구 모음에서 **새 쿼리**를 클릭합니다.

3. 다음 예를 복사하여 쿼리 창에 붙여 넣고 **실행**을 클릭합니다. 이 예에서는 먼저 PRIMARY KEY 제약 조건의 이름을 식별한 후 해당 제약 조건을 삭제합니다.

   ```sql
   USE AdventureWorks2012;  
   GO  
   -- Return the name of primary key.  
   SELECT name  
   FROM sys.key_constraints  
   WHERE type = 'PK' AND OBJECT_NAME(parent_object_id) = N'TransactionHistoryArchive';  
   GO  
   -- Delete the primary key constraint.  
   ALTER TABLE Production.TransactionHistoryArchive  
   DROP CONSTRAINT PK_TransactionHistoryArchive_TransactionID;   
   GO  
   ```

  

  

###  특정 테이블의 관계에 대한 외래 키 특성을 보려면

1. 보려는 외래 키가 포함된 테이블에 대한 테이블 디자이너를 열고 테이블 디자이너를 마우스 오른쪽 단추로 클릭한 다음 바로 가기 메뉴에서 **관계** 를 선택합니다.
2. **외래 키 관계** 대화 상자에서 표시하려는 속성이 포함된 관계를 선택합니다.

외래 키 열이 기본 키에 연결되어 있으면 기본 키 열이 **테이블 디자이너** 의 행 선택기에서 기본 키 기호로 표시됩니다.

  

  

### 테이블 디자이너에서 외래 키 관계 만들기

#### SQL Server Management Studio 사용

1. 개체 탐색기에서 관계의 외래 키 쪽에 표시할 테이블을 마우스 오른쪽 단추로 클릭하고 **디자인**을 클릭합니다.

   [**테이블 디자이너**](https://docs.microsoft.com/ko-kr/sql/ssms/visual-db-tools/design-tables-visual-database-tools?view=sql-server-ver15)에서 테이블이 열립니다.

2. **테이블 디자이너** 메뉴에서 **관계**를 클릭합니다.

3. **외래 키 관계** 대화 상자에서 **추가**를 클릭합니다.

   **선택한 관계** 목록에 FK_<*tablename*>*<\*tablename\*> 형식으로 자동 지정된 이름과 함께 관계가 표시됩니다. 여기에서 \*tablename\*은 외래 키 테이블의 이름입니다.*

4. **선택한 관계** 목록에서 관계를 클릭합니다.

5. 오른쪽에 있는 표에서 **테이블 및 열 사양**을 클릭한 다음, 속성의 오른쪽에 있는 줄임표( **…** )를 클릭합니다.

6. **테이블 및 열** 대화 상자의 **기본 키** 드롭다운 목록에서 관계의 기본 키 쪽에 사용할 테이블을 선택합니다.

7. 아래 표에서 테이블의 기본 키로 사용할 열을 선택합니다. 각 열 오른쪽에 있는 그리드의 셀에서 외래 키 테이블의 해당 외래 키 열을 선택합니다.

   **테이블 디자이너** 에서 관계의 이름이 자동으로 지정됩니다. 이 이름을 변경하려면 **관계 이름** 입력란의 내용을 편집합니다.

8. **확인** 을 선택하여 관계를 만듭니다.

9. 테이블 디자이너 창을 닫고 외래 키 관계 변경 내용이 적용되도록 **저장**합니다.






### 새 테이블에서 외래 키 만들기

#### Transact-SQL 사용

다음 예제에서는 테이블을 만들고 AdventureWorks 데이터베이스의 `Sales.SalesReason` 테이블에 있는 `SalesReasonID` 열을 참조하는 `TempID` 열의 외래 키 제약 조건을 정의합니다. ON DELETE CASCADE 및 ON UPDATE CASCADE 절을 사용하면 `Sales.SalesReason` 테이블에 대한 변경 내용이 `Sales.TempSalesReason` 테이블에 자동으로 전파되었는지 확인할 수 있습니다.

```sql
CREATE TABLE Sales.TempSalesReason 
   (
      TempID int NOT NULL, Name nvarchar(50)
      , CONSTRAINT PK_TempSales PRIMARY KEY NONCLUSTERED (TempID)
      , CONSTRAINT FK_TempSales_SalesReason FOREIGN KEY (TempID)
        REFERENCES Sales.SalesReason (SalesReasonID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
   )
;
```

  

  

### 기존 테이블에서 외래 키 만들기

#### Transact-SQL 사용

다음 예제에서는 `TempID` 열의 외래 키를 만들고 AdventureWorks 데이터베이스의 `Sales.SalesReason` 테이블에 있는 `SalesReasonID` 열을 참조합니다.

```sql
ALTER TABLE Sales.TempSalesReason
   ADD CONSTRAINT FK_TempSales_SalesReason FOREIGN KEY (TempID)
      REFERENCES Sales.SalesReason (SalesReasonID)
      ON DELETE CASCADE
      ON UPDATE CASCADE
;
```

  

  

### 외래 키를 수정하려면

1. **개체 탐색기**에서 외래 키를 포함하는 테이블을 확장하고 **키**를 확장합니다.

2. 수정할 외래 키를 마우스 오른쪽 단추로 클릭하고 **수정**을 클릭합니다.

3. **외래 키 관계** 대화 상자에서 다음과 같은 사항을 수정할 수 있습니다.

   **선택한 관계**
   기존 관계를 나열합니다. 관계를 선택하면 오른쪽 표에 해당 속성이 표시됩니다. 목록이 비어 있는 경우 테이블에 정의된 관계가 없음을 의미합니다.

   **추가**
   새 관계를 만듭니다. 관계를 유효하게 만들려면 **테이블 및 열 사양** 을 먼저 설정해야 합니다.

   **Delete**
   **선택한 관계** 목록에서 선택한 관계를 삭제합니다. 관계 추가를 취소하려면 이 단추를 사용하여 관계를 제거합니다.

   **일반 범주**
   확장하여 **만들거나 다시 활성화할 때 기존 데이터 검사** 와 **테이블 및 열 사양**을 표시합니다.

   **만들거나 다시 활성화할 때 기존 데이터 검사**
   제약 조건을 만들거나 다시 활성화하기 전부터 테이블에 있던 모든 데이터를 제약 조건에 대해 검사합니다.

   **테이블 및 열 사양 범주**
   확장하여 어떠한 테이블의 어떠한 열이 관계에서 외래 키와 기본 키(또는 고유 키)로 사용되는지에 대한 정보를 표시합니다. 이러한 값을 편집하거나 정의하려면 속성 필드의 오른쪽에 있는 줄임표 단추( **...** )를 클릭합니다.

   **외래 키 기본 테이블**
   선택한 관계에서 외래 키로 사용되는 열이 포함된 테이블을 표시합니다.

   **외래 키 열**
   선택한 관계에서 외래 키로 사용되는 열을 표시합니다.

   **Primary/Unique 키 기본 테이블**
   선택한 관계에서 기본 키(또는 고유 키)로 사용되는 열이 포함된 테이블을 표시합니다.

   **Primary/Unique 키 열**
   선택한 관계에서 기본 키(또는 고유 키)로 사용되는 열을 표시합니다.

   **ID 범주**
   확장하여 **이름** 및 **설명**에 대한 속성 필드를 표시합니다.

   **이름**
   관계의 이름을 표시합니다. 새 관계를 만들면 **테이블 디자이너**의 활성 창에 있는 테이블을 기반으로 한 기본 이름이 새 관계에 지정됩니다. 언제든지 이름을 변경할 수 있습니다.

   **설명**
   관계에 대해 설명합니다. 자세한 설명을 기록하려면 **설명** 을 클릭한 다음 속성 필드의 오른쪽에 있는 줄임표 **(...)** 를 클릭합니다. 이렇게 하면 텍스트를 쓸 수 있는 더 큰 영역이 제공됩니다.

   **테이블 디자이너 범주**
   확장하여 **만들거나 다시 활성화할 때 기존 데이터 검사** 와 **복제에 적용**에 대한 정보를 표시합니다.

   **복제에 적용**
   복제 에이전트가 이 테이블에서 삽입, 업데이트 또는 삭제를 수행할 때 제약 조건을 적용할지 여부를 나타냅니다.

   **외래 키 제약 조건 적용**
   관계를 맺고 있는 열의 데이터를 변경할 때 외래 키 관계의 무결성 제약 조건을 위반하게 되는 경우 이러한 데이터를 변경할 수 있는지 여부를 지정합니다. 이러한 변경을 허용하지 않으려면 **예** 를 선택하고, 이를 허용하려면 **아니요** 를 선택합니다.

   **INSERT 및 UPDATE 사양 범주**
   확장하여 관계의 **삭제 규칙** 및 **업데이트 규칙** 에 대한 정보를 표시합니다.

   **규칙 삭제**
   외래 키 관계를 맺고 있는 데이터가 포함된 행을 사용자가 삭제하려 할 때 적용할 결과를 지정합니다.

   - **동작 안 함** 삭제가 허용되지 않고 DELETE가 롤백된다는 오류 메시지가 나타납니다.
   - **계단식 배열** 외래 키 관계에 관련된 데이터가 포함된 모든 행을 삭제합니다. 논리적 레코드를 사용하는 병합 게시에 테이블이 포함되는 경우 CASCADE를 지정하지 마세요.
   - **Null 설정** 테이블의 모든 외래 키 열에 Null 값을 사용할 수 있으면 값을 Null로 설정합니다.
   - **기본값 설정** 테이블의 모든 외래 키 열에 기본값이 정의되어 있으면 열에 정의된 기본값으로 값을 설정합니다.

   **업데이트 규칙**
   외래 키 관계를 맺고 있는 데이터가 포함된 행을 사용자가 업데이트하려 할 때 적용할 결과를 지정합니다.

   - **동작 안 함** 업데이트가 허용되지 않고 UPDATE가 롤백된다는 오류 메시지가 나타납니다.
   - **계단식 배열** 외래 키 관계에 관련된 데이터가 포함된 모든 행을 업데이트합니다. 논리적 레코드를 사용하는 병합 게시에 테이블이 포함되는 경우 CASCADE를 지정하지 마세요.
   - **Null 설정** 테이블의 모든 외래 키 열에 Null 값을 사용할 수 있으면 값을 Null로 설정합니다.
   - **기본값 설정** 테이블의 모든 외래 키 열에 기본값이 정의되어 있으면 열에 정의된 기본값으로 값을 설정합니다.

4. **파일** 메뉴에서 ‘테이블 이름’ **저장**을 클릭합니다.

  

  

### FOREIGN KEY 제약 조건을 삭제하려면

1. **개체 탐색기**에서 제약 조건을 포함하는 테이블을 확장하고 **키**를 확장합니다.
2. 제약 조건을 마우스 오른쪽 단추로 클릭한 다음 **삭제**를 클릭합니다.
3. **개체 삭제** 대화 상자에서 **확인**을 클릭합니다.

  

  

### Transact-SQL 사용 FOREIGN KEY 제약 조건을 삭제하려면

1. **개체 탐색기**에서 데이터베이스 엔진인스턴스에 연결합니다.

2. 표준 도구 모음에서 **새 쿼리**를 클릭합니다.

3. 다음 예를 복사하여 쿼리 창에 붙여 넣고 **실행**을 클릭합니다.

   ```sql
   USE AdventureWorks2012;  
   GO  
   ALTER TABLE dbo.DocExe   
   DROP CONSTRAINT FK_Column_B;   
   GO  
   ```

  

  

### INSERT 및 UPDATE 문에 대한 FOREIGN KEY 제약 조건을 사용하지 않으려면

1. **개체 탐색기**에서 데이터베이스 엔진인스턴스에 연결합니다.

2. 표준 도구 모음에서 **새 쿼리**를 클릭합니다.

3. 다음 예를 복사하여 쿼리 창에 붙여 넣고 **실행**을 클릭합니다.

   ```sql
   USE AdventureWorks2012;  
   GO  
   ALTER TABLE Purchasing.PurchaseOrderHeader  
   NOCHECK CONSTRAINT FK_PurchaseOrderHeader_Employee_EmployeeID;  
   GO  
   ```