---


title: "MsSQL Cursor"
date: 2020-11-15T15:17:47+09:00
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

커서는 행 단위 작업을 추가로 제어해야 할 경우 사용되는 기능입니다.

여러 행을 select 하여 While 반복문 등에 활용 될 수 있습니다. 프로그래밍의 for문의 첨자 i와 비슷합니다.

프로시저 작성시 활용됩니다.

<!--more-->

  

### 커서 선언

```sql
--커서 생성
DECLARE   CursorEmail   CURSOR  
FOR SELECT Email from tblUserTable where IsDelete = 'False'
```

   

  

### 커서 열기

```
--커서 열기
Open CursorEmail;
```

  

  

### 불러온 데이터를 이용한 작업

```sql
-- 맨처음 결과 데이터로 이동
Fetch Next From CursorEmail Into @email 

WHILE(@@FETCH_STATUS <> -1) 
BEGIN; 
    --원하는 작업 수행 

    --다음 결과 데이터로 이동 
    Fetch Next From CursorEmail Into @email; 
END;
```

   

  

### 커서 닫기

```sql
Close CursorEmail; 
Deallocate CursorEmail;
```

​    

   

### FETCH 구문

```sql
FETCH   
          [ [ NEXT | PRIOR | FIRST | LAST   
                    | ABSOLUTE { n | @nvar }   
                    | RELATIVE { n | @nvar }   
               ]   
               FROM   
          ]   
{ { [ GLOBAL ] cursor_name } | @cursor_variable_name }   
[ INTO @variable_name [ ,...n ] ]  
```

  

#### 인수

NEXT
현재 행 바로 다음의 결과 행을 반환하며 현재 행을 반환되는 행 앞의 행으로 만듭니다. 커서에 대해 `FETCH NEXT`가 첫 번째 인출인 경우 결과 집합의 첫 번째 행을 반환합니다. `NEXT`는 커서 인출의 기본 옵션입니다.

PRIOR
현재 행 바로 앞의 결과 행을 반환하며 현재 행을 반환되는 행 뒤의 행으로 만듭니다. 커서에 대해 `FETCH PRIOR`가 첫 번째 인출인 경우 행이 반환되지 않으며 커서는 첫 번째 행 앞에 위치하게 됩니다.

FIRST
커서의 첫 번째 행을 반환하며 그 행을 현재 행으로 만듭니다.

LAST
커서의 마지막 행을 반환하며 그 행을 현재 행으로 만듭니다.

ABSOLUTE { *n*| @*nvar*}
*n* 또는 @*nvar*가 양수인 경우 커서 맨 앞에서 *n*번째 행을 반환하며 반환되는 행을 새 현재 행으로 만듭니다. *n* 또는 @*nvar*가 음수인 경우에는 커서 맨 뒤에서 *n*번째 행을 반환하며 반환되는 행을 새 현재 행으로 만듭니다. *n* 또는 @*nvar*가 0이면 행이 반환되지 않습니다. *n*은 정수 상수여야 하며 @*nvar*는 **smallint**, **tinyint** 또는 **int**이어야 합니다.

RELATIVE { *n*| @*nvar*}
*n* 또는 @*nvar*이 양수인 경우에는 현재 행에서 위로 *n*번째 행을 반환하며 반환되는 행을 새 현재 행으로 만듭니다. *n* 또는 @*nvar*이 음수인 경우에는 현재 행에서 앞으로 *n*번째 행을 반환하며 반환되는 행을 새 현재 행으로 만듭니다. *n* 또는 @*nvar*가 0인 경우에는 현재 행을 반환합니다. *n* 또는 @*nvar*가 음수로 설정되거나 첫 번째 인출에 있는 0이 커서에 대해 수행되도록 `FETCH RELATIVE`가 지정된 경우 행은 반환되지 않습니다. *n*은 정수 상수여야 하며 @*nvar*는 **smallint**, **tinyint** 또는 **int**이어야 합니다.

GLOBAL
*cursor_name*이 전역 커서를 참조하도록 지정합니다.

*cursor_name*
인출이 수행되는 열린 커서의 이름입니다. 동일한 *cursor_name*을 가진 전역 커서와 지역 커서가 있을 경우 GLOBAL이 지정되면 *cursor_name*은 전역 커서를 참조하고 GLOBAL이 지정되지 않으면 지역 커서를 참조합니다.

@*cursor_variable_name*
수행할 인출에서 열린 커서를 참조하는 커서 변수의 이름입니다.

INTO @*variable_name*[ ,...*n*]
인출하는 열에서 지역 변수로 데이터를 가져가도록 허용합니다. 목록의 각 변수는 왼쪽에서 오른쪽 순으로 커서 결과 집합의 해당 열과 연관됩니다. 각 변수의 데이터 형식은 반드시 해당 결과 집합 열의 데이터 형식과 일치하거나 암시적 변환이 지원되어야 합니다. 변수의 개수는 커서 선택 목록의 열 수와 일치해야 합니다.