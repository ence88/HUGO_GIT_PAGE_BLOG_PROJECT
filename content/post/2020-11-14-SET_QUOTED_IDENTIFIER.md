---
title: "MsSQL SET QUOTED_IDENTIFIER ON|OFF"
date: 2020-11-14T22:08:35+09:00
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

#### 구문

```sql
-- Syntax for SQL Server, Azure SQL Database and SQL on-demand (preview) in Azure Synapse Analytics

SET QUOTED_IDENTIFIER { ON | OFF }
```

<!--more-->

#### 설명

`SET QUOTED_IDENTIFIER`가 ON(기본값)이면, 식별자는 큰따옴표(“ ”)로 구분할 수 있고 리터럴은 작은따옴표(‘ ’)로 구분해야 합니다. 큰따옴표로 구분되는 모든 문자열은 개체 식별자로 해석됩니다. 따라서 따옴표 붙은 식별자는 Transact-SQL 식별자 규칙을 따르지 않아도 됩니다. 따옴표 붙은 식별자는 예약 키워드일 수 있으며 Transact-SQL 식별자에서 일반적으로 허용되지 않는 문자를 포함할 수 있습니다. 큰따옴표로는 리터럴 문자열 식을 구분할 수 없습니다. 리터럴 문자열을 묶으려면 작은따옴표를 사용해야 합니다. 리터럴 문자열에 작은따옴표(‘)가 포함되어 있으면, 두 개의 작은따옴표(‘’)로 나타낼 수 있습니다. 데이터베이스의 개체 이름에 예약된 키워드를 사용하는 경우 `SET QUOTED_IDENTIFIER`를 ON으로 설정해야 합니다.

`SET QUOTED_IDENTIFIER`가 OFF이면, 식별자를 따옴표로 묶을 수 없으며 모든 Transact-SQL 식별자 규칙을 따라야 합니다. 자세한 내용은 [Database Identifiers](https://docs.microsoft.com/ko-kr/sql/relational-databases/databases/database-identifiers?view=sql-server-ver15)을 참조하세요. 리터럴은 작은따옴표 또는 큰따옴표로 구분할 수 있습니다. 리터럴 문자열을 큰따옴표로 구분할 때 아포스트로피와 같은 작은따옴표가 들어갈 수 있습니다.