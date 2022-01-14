---
title: "모나드(Monad)란 무엇인가?"
date: 2020-11-18T21:43:34+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce, Blog
categories:
- Common
- Programming
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- Achitecture
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

하스켈에서 모나드는 매우 유용하지만 처음에는 그 개념이 꽤 어렵습니다. 모나드는 수많은 응용이 있기 때문에 사람들은 모나드를 특정 관점에서만 설명하는 경향이 있는데, 그러면 여러분이 모나드를 완벽히 이해하는 데 혼란을 줄 수도 있습니다.

<!--more-->

  

  

역사적으로 보면 모나드는 하스켈에서 입출력을 수행하기 위해 도입되었습니다. 미리 정의된 실행 순서는 파일 읽고 쓰기 같은 작업에 중대한 사항이고 모나딕 연산은 내재된inherent 순서를 따릅니다.

모나드는 입출력에 한정되지 않습니다. 모나드는 예외, 상태, 비결정성non-determinism, 연속성continuation, 코루틴, 그 외에 수많은 것을 지원합니다. 사실 모나드의 다재다능함 덕에 이 중 어느 것도 하스켈 언어의 일부로 내장될 필요가 없었습니다. 이것들은 대신 표준 라이브러리에 정의되어 있습니다.

  

  

### 정의

모나드는 세 가지에 의해 정의됩니다.

- 타입 생성자 M
- return 함수
- "bind"라 부르는 (>>=) 연산자

위의 함수와 연산자는 Monad 타입 클래스의 메서드이며 다음의 타입을 가집니다.

```haskell
return :: a -> M a
(>>=)  :: M a -> ( a -> M b ) -> M b
```

그리고 나중에 설명할 세 개의 법칙을 따라야 합니다.

구체적인 예시로 Maybe 모나드를 보겠습니다. 타입 생성자는 M = Maybe이고 return과 (>>=)는 이렇게 정의됩니다.

```haskell
return :: a -> Maybe a
return x  = Just x

(>>=)  :: Maybe a -> (a -> Maybe b) -> Maybe b
m >>= g = case m of
             Nothing -> Nothing
             Just x  -> g x
```

Maybe는 모나드고 return은 하나의 값을 Just로 감싸서 반환합니다. (>>=)는 m :: Maybe a 값과 g :: a -> Maybe b 함수를 취합니다. m이 Nothing이면 하는 일 없이 결과도 Nothing입니다. 반대로 Just x의 경우 Just로 감싼 x에 g가 적용되고 Maybe b를 결과로 내놓습니다. 그 결과는 g가 x에 하는 일에 따라 Nothing일 수도 있습니다. 종합하면, m에 포함된 값이 있으면 이 값에 g를 적용하고 그 결과가 Maybe 모나드에 다시 들어가 반환됩니다.

return과 (>>=)가 어떻게 작동하는지 이해하는 첫 걸음은 어떤 값과 인수가 모나딕인지 아닌지 추적하는 것입니다. 다른 많은 경우와 마찬가지로 타입 시그너쳐가 그 과정의 안내자가 될 것입니다.

  

  

#### 동기: Maybe

`(>>=)`와 `Maybe` 모나드의 유용함을 다음 예제에서 살펴보겠습니다. 두 함수를 제공하는 가계도 데이터베이스를 가정합니다.

```haskell
father :: Person -> Maybe Person
mother :: Person -> Maybe Person
```

이 함수들은 누군가의 아버지나 어머니의 이름을 검색합니다. 데이터베이스에 그런 정보가 없을 때 `Maybe` 덕에 프로그램을 고장내는 대신 `Nothing` 값을 반환할 수 있습니다.

이 함수들을 결합하여 할아버지들을 찾아보겠습니다. 다음 함수는 외할아버지를 검색합니다.

```haskell
maternalGrandfather :: Person -> Maybe Person
maternalGrandfather p =
    case mother p of
        Nothing -> Nothing
        Just mom -> father mom
```

다음 함수는 데이터베이스에 친할아버지와 외할아버지가 모두 있는지 검사합니다.

```haskell
bothGrandfathers :: Person -> Maybe (Person, Person)
bothGrandfathers p =
    case father p of
        Nothing -> Nothing
        Just dad ->
            case father dad of
                Nothing -> Nothing
                Just gf1 ->                          -- found first grandfather
                    case mother p of
                        Nothing -> Nothing
                        Just mom ->
                            case father mom of
                                Nothing -> Nothing
                                Just gf2 ->          -- found second grandfather
                                    Just (gf1, gf2)
```

너무 길고 복잡하다! 각각의 질의는 `Nothing`을 반환하면서 실패할 수 있고 그럴 경우 전체 함수도 실패해야 합니다.

분명히 `Nothing`을 쓰고 또 쓰는 것보다 나은 방법이 있을 것입니다. 모나드가 바로 그 방법입니다. 예컨데 외할아버지에 접근하는 함수는 `(>>=)` 연산자와 정확히 동일한 구조를 가지므로 이렇게 다시 쓸 수 있습니다.

```haskell
maternalGrandfather p = mother p >>= father
```

람다 표현식과 return의 도움을 받아 두 할아버지를 찾는 함수도 다시 작성할 수 있습니다.

```haskell
bothGrandfathers p =
   father p >>=
       (\dad -> father dad >>=
           (\gf1 -> mother p >>=   -- this line works as "\_ -> mother p", but naming gf1 allows later return
               (\mom -> father mom >>=
                   (\gf2 -> return (gf1,gf2) ))))
```

중첩된 람다 표현식이 혼란스러울 지도 모르겠다. 여기서 눈여겨볼 점은 `(>>=)` 덕에 모든 `Nothing`을 나열하는 부분을 없애서 코드의 관심 있는 부분에만 집중할 수 있다는 것입니다.

좀 더 정확히 하자면, `father p`의 결과는 모나딕 값입니다. 그 값은 `p`의 아버지가 데이터베이스에 있느냐 없느냐에 따라 `Just dad` 또는 `Nothing`입니다. `father` 함수가 모나드딕 값이 아닌 정규 값을 취하기 때문에 `(>>=)`는 모나딕이 아닌 값인 `p`의 `dad`를 `father`에게 인자로 전달합니다. 그리고 `father dad`의 결과는 다시 모나딕 값이고, 이 과정은 계속됩니다.

즉 `(>>=)`는 모나드를 떠나지 않고도 함수에 모나딕이 아닌 값을 전달할 수 있도록 합니다. `Maybe` 모나드의 모나딕 관점은 그 값을 구할 수 있을지에 대한 불확실성입니다.

  

  

#### 타입 클래스

하스켈에서는 `Monad` 타입 클래스를 이용해 모나드를 구현합니다. `Monad`는 [Control.Monad](http://hackage.haskell.org/package/base-4.1.0.0/docs/Control-Monad.html) 모듈의 일부이며 Prelude에 포함되어 있습니다. 이 클래스는 다음 메서드들을 가진다.

```haskell
class Monad m where
    return :: a -> m a
    (>>=)  :: m a -> (a -> m b) -> m b

    (>>)   :: m a -> m b -> m b
    fail   :: String -> m a
```

`return`과 `bind` 외에도 `(>>)`와 `fail`이라는 함수가 있습니다. 이 둘도 기본 구현을 가지기 때문에 인스턴스를 작성할 때 굳이 정의하지 않아도 됩니다.

`(>>)` 연산자는 "then"이라 읽으며 그저 편의를 위한 것으로 대개 이렇게 구현됩니다.

```haskell
m >> n = m >>= \_ -> n
```

`(>>)`는 두 모나딕 액션을 연결하는데 두 번째 액션이 첫 번째 액션의 결과를 이용하지 않는다. IO 같은 모나드에서는 흔한 일입니다.

```haskell
printSomethingTwice :: String -> IO ()
printSomethingTwice str = putStrLn str >> putStrLn str
```

`fail` 함수는 `do` 표기 내에서의 패턴 매칭 실패를 처리합니다. 기술적으로 어쩔 수 없이 필요할 뿐 모나드와는 아무 상관이 없습니다. `fail`을 코드에서 직접 호출하는 것은 권장하지 않는다.

#### 

  



#### `Monad`와 `Applicative`

`Applicative`가 `Monad`의 슈퍼클래스이며 이에 따른 주목할 만한 결과들이 있다는 걸 짚고 넘어가야겠다.[2](https://wikidocs.net/1471#fn:2) 먼저 모든 `Monad`는 `Functor`이자 `Applicative`이고, 따라서 모나드에도 `fmap`, `pure`, `(<*>)`을 사용할 수 있습니다. 두 번째로 사실 `Monad` 인스턴스를 작성하려면 `Functor`와 `Applicative` 인스턴스도 작성해야 합니다. 그렇게 하는 방법은 이 장의 뒤에서 논의합니다. 세 번쨰로 [서문](https://en.wikibooks.org/wiki/Haskell/Prologue:_IO,_an_applicative_functor)을 읽어봤다면 `return`과 `(>>)`의 타입과 역할이 친숙할 것입니다...

```haskell
(*>) :: Applicative f => f a -> f b -> f b
(>>) :: Monad m => m a -> m b -> m b

pure :: Applicative f => a -> f a
return :: Monad m => a -> m a
```

`(*>)`와 `(>>)`의 유일한 차이점은 제약이 `Applicative`에서 `Monad`로 바뀌었습니다는 것입니다. 사실 두 메서드 간의 차이는 이것 뿐입니다. `Monad`를 처리할 때는 언제든 `(*>)`와 `(>>)`를 서로 교체할 수 있습니다. `pure`와 `return`도 마찬가집니다. 사실 `Applicative` 인스턴스에 `pure`의 별도 정의가 있다면 `return`을 구현할 필요도 없는데, `return`의 기본 구현은 `retur = pure` 이기 때문입니다.

  

  

### 계산이라는 개념Notions of Computation

Maybe를 사용할 때, 틀에 박힌 코드를 없애는 데 (>>=)와 return이 아주 편리하다는 걸 봤었습니다. 하지만 이걸로는 모나드가 왜 그토록 중요한지 납득하기에는 충분하지 않다. 두 할아버지를 찾는 함수를, do 표기에 괄호와 세미콜론을 붙여 다시 작성하면서 모나드 공부를 계속하겠다. 다른 프로그래밍 언어 경험이 있으면 그 언어가 연상될 수도 있겠다.

```haskell
bothGrandfathers p = do {
    dad <- father p;
    gf1 <- father dad;
    mom <- mother p;
    gf2 <- father mom;
    return (gf1, gf2);
  }
```

이 코드가 명령형 언어의 코드처럼 보이는 이유는 정말 그렇기 때문입니다. 사실 이 명령형 언어는 예외를 지원합니다. father와 mother는 결과를 도출하는 데 실패할 수도 있는 함수다. 즉 예외를 일으킬 수 있습니다. 그리고 그런 일이 발생하면 do 블록 전체가 실패합니다. 즉 예외를 일으키며 종료합니다.

달리 말하자면 표현식 father p는 Maybe Person 타입이며 해석되기로는 명령형 언어에서 Person을 결과값으로 반환하는 하나의 명령문처럼 해석됩니다. 이 말은 모든 모나드에 대해 성립합니다. M a 타입의 값은 명령형 언어에서 a 타입의 값을 결과로 반환하는 명령문으로 해석됩니다. 그리고 이 언어의 의미semantic는 모나드 M에 의해 결정됩니다.[3](https://wikidocs.net/1471#fn:3)

이런 해석에 따르면 bind 연산자 (>>=)는 세미콜론의 함수 버전일 뿐입니다. let 표현식을 함수 적용처럼 작성할 수 있듯이

```haskell
let x = foo in x + 3          는 다음에 대응됩니다      (\x -> x + 3) foo
```

할당과 세미콜론은 bind 연산자로 재작성할 수 있습니다.

```haskell
x <- foo; return (x + 3)      는 다음에 대응됩니다      foo >>= (\x -> return (x + 3))
```

return 함수는 값 `a`를 `M a`로 전이시킨다. `M a`는 모나드 `M`에 대응하는 명령형 언어의 명령문과 같습니다.

명령형 언어의 여러 의미(semantic)는 각기 다른 모나드에 대응합니다. 다음 표는 모든 하스켈 프로그래머가 반드시 알아야 하는 고전적인 사항을 선별한 표다. 모나드에 깔린 발상이 아직도 명확하지 않다면, 뒤에 이어지는 장들의 예제를 공부하면서 좋은 도구상자도 얻고 여러 모나드 뒤에 숨은 공통된 추상화를 이해하는 데 도움을 받을 수 있을 것입니다.

| 모나드     | 명령형 언어에서의 의미semantic |
| ---------- | ------------------------------ |
| Maybe      | 예외(익명)                     |
| Error      | 예외(오류 내용이 있음)         |
| State      | 전역 상태global state          |
| IO         | 입출력                         |
| [](리스트) | 비결정성                       |
| Reader     | 환경설정Environment            |
| Writer     | 로거Logger                     |

더욱이, 서로 다른 이들 의미semantic는 꼭 따로 써야 하는 것이 아니다. 몇몇 장에서 보겠지만 모나드 변환기monad transformer를 사용해서 모나드들을 합성하고, 일치시키거나 여러 모나드의 semantic을 단일 모나드로 합성하는 것이 가능하다.

  

  

### 모나드의 법칙

하스켈에서 Monad 타입 클래스의 모든 인스턴스는(그리고 (>>=)와 return의 모든 구현은) 다음의 세 법칙을 만족해야 합니다.

```haskell
m >>= return     =  m                        -- 우단위원의 법칙(right unit)
return x >>= f   =  f x                      -- 좌단위원의 법칙(left unit)

(m >>= f) >>= g  =  m >>= (\x -> f x >>= g)  -- 결합법칙(associativity)
```

#### 중립원neutral element으로서의 return

return의 동작은 좌단위원(left unit)의 법칙과 우단위원(right unit)의 법칙에 의해 기술됩니다. 이 법칙들은 return이 아무 계산도 하지 않음을 뜻합니다. return은 그저 값을 보관합니다. 예를 들어 다음 코드는

```haskell
maternalGrandfather p = do
        mom <- mother p
        gf  <- father mom
        return gf
```

우단위원의 법칙에 의해 다음과 정확히 같습니다.

```haskell
maternalGrandfather p = do
        mom  <- mother p
        father mom
```

#### bind의 결합법칙

결합법칙은 세미콜론이 그러듯이 bind 연산자 (>>=)가 계산의 순서만 신경쓸 뿐 그 중첩 구조는 고려하지 않음을 보장합니다. 예를 들어 bothGrandfathers를 이렇게 작성할 수도 있습니다. do를 쓰지 않은 이전 버전과 비교해보십시오

```haskell
bothGrandfathers p =
   (father p >>= father) >>=
       (\gf1 -> (mother p >>= father) >>=
           (\gf2 -> return (gf1,gf2) ))
```

then 연산자의 결합 법칙은 특수한 경우입니다.

```haskell
(m >> n) >> o  =  m >> (n >> o)
```

##### 모나딕 합성

bind의 결합 법칙을 이렇게 재구성하면 그 의미를 포착하기가 더 쉽습니다.

```
(f >=> g) >=> h  =  f >=> (g >=> h)
```

여기서 `(>=>)`는 *모나딕 합성 연산자로서* 함수 합성 연산자 `(.)`와 아주 유사하지만 그 인자는 반대로다. `(>=>)`는 다음과 같이 정의됩니다.

```haskell
(>=>) :: Monad m => (a -> m b) -> (b -> m c) -> a -> m c
f >=> g = \x -> f x >>= g
```

`(>=>)`을 뒤집은 `(<=<)`도 있습니다. 이걸 쓸 때는 합성 순서가 `(.)`와 일치하며, 따라서 `(f <=< g)`에서는 `g`가 먼저 옵니다.

  

  

### 모나드와 범주론

모나드는 범주론이라는 수학의 한 갈래에서 유래했다. 다행히도 하스켈에서 모나드를 이해하고 활용하기 위해 범주론을 이해할 필요는 전혀 없습니다. 범주론의 모나드 정의는 사실 표현법이 조금 다릅니다. 이 표현법을 하스켈 식으로 다듬으면 동등하지만 또다른 모나드 정의를 얻습니다. 이로부터 `Monad` 클래스에 대한 또다른 통찰을 얻을 수 있습니다.

지금까지는 `(>>=)`와 `return`을 통해 모나드를 정의했습니다. 또다른 정의에서는 모나드를 두 결합기를 가지는 functor로 취급합니다.

```haskell
fmap   :: (a -> b) -> M a -> M b  -- functor

return :: a -> M a
join   :: M (M a) -> M a
```

펑터를 컨테이너에 비유할 수 있습니다. 이에 따르면 `functor M`은 일종의 컨테이너로서 `M a`는 `a` 타입의 값을 "보관"하고, 대응하는 매핑 함수 `fmap`은 그 내부의 값에 함수들을 적용할 수 있도록 합니다.

이렇게 해석하면 위 함수들은 다음과 같이 작동합니다.

- `fmap`은 주어진 함수를 컨테이너 내부의 모든 원소에 적용합니다
- `return`은 원소를 컨테이너로 감쌉니다
- `join`은 컨테이너의 컨테이너를 취해 단일 컨테이너로 평탄화합니다.

이 함수들을 이용해 bind 연산자를 다음과 같이 정의할 수 있습니다.

```haskell
m >>= g = join (fmap g m)
```

비슷하게 `(>>=)`와 `return`을 이용해 `fmap`과 `join`을 정의할 수 있습니다.

```haskell
fmap f x = x >>= (return . f)
join x   = x >>= id
```

  

  

#### `liftM`과 그 친구들

앞서 모든 `Monad`는 `Applicative`이고 따라서 `Functor`이기도 하다는 것을 짚고 넘어간 적이 있습니다. 그 결과 `return`과 `(>>)`는 각각 `pure`와 `(*>)`의 모나드 전용 버전이 되었습니다. 그런데 여기서 끝이 아닙니다. `Control.Monad`는 `liftM`을 정의하는데 그 타입 시그너쳐가 왠지 친숙합니다.

```haskell
liftM :: (Monad m) => (a1 -> r) -> m a1 -> m r
```

의심했던 대로 `liftM`은 우리가 바로 앞 절에서 한 것처럼 `(>>=)`와 `return`을 통해 구현한 `fmap`일 뿐입니다. 따라서 `liftM`과 `fmap`은 서로 바꿔 쓸 수 있습니다.

`ap`는 `Control.Monad`에 있는 또다른 함수로서 묘한 타입을 가집니다.

```haskell
ap :: Monad m => m (a -> b) -> m a -> m b
```

다른 경우와 비슷하게 `ap`는 `(<*>)`의 모나드 전용 버전입니다.

`Control.Monad`를 비롯해 기본 라이브러리 모듈에는 `Monad`에 *특화된* 버전의 `Applicative` 함수들이 곳곳에 있습니다. 이런 함수들이 존재하는 데는 역사적인 이유가 있습니다. 하스켈에 `Monad`와 `Applicative`가 도입되는 사이에는 몇 년의 간격이 있었고 `Applicative`가 `Monad`의 슈퍼클래스가 되기까지는 더 오랜 시간이 걸렸기에 특화된 버전을 사용하는 것은 선택사항이 되었습니다. 이제와서는 모나드 전용 버전을 사용할 이유가 거의 없어져서, 다른 사람들의 코드를 보면 `return`과 `(>>)`만 보일 것입니다. 이것들의 용법은 하스켈에서 20년이 넘도록 `Applicative`가 `Monad`의 슈퍼클래스가 아니었던 덕에 잘 자리잡게 되었습니다.

> 노트
>
> `Applicative`가 `Monad`의 슈퍼클래스이므로 `Monad`를 구현하는 가장 명료한 방법은 `Functor` 인스턴스를 작성하고 클래스 계층도를 따라 내려가는 것입니다.
>
> ```haskell
> instance Functor Foo where
>     fmap = -- etc.
> 
> instance Applicative Foo where
>     pure = -- etc.
>     (<*>) = -- etc.
> 
> instance Monad Foo where
>     (>>=) = -- etc.
> ```
>
> 여러분은 `Monad`의 인스턴스들을 작성하고 사용해보거나, 여러분이 생각하는 다른 실험을 해볼 것입니다. 하지만 위에서 보여준 방식으로 인스턴스를 작성하려면 `pure`와 `(<*>)`를 구현해야 하는데, 이는 쉬운 일이 아닙니다.  다행히 돌아가는 길이 있습니다. `(>>=)`와 `return`을 구현하여 그 자체로 충분한 `Monad` 인스턴스를 만들고 나면 `liftM`, `ap`, `return`을 사용해 다른 인스턴스들을 채워넣을 수 있습니다.
>
> ```haskell
> instance Monad Foo where
>     return = -- etc.
>     (>>=) = -- etc.
> 
> instance Applicative Foo where
>     pure = return
>     (<*>) = ap
> 
> instance Functor Foo where
>     fmap = liftM
> ```
>

  

  

### 노트

------

1. return 함수는 C나 자바 같은 명령형 언어의 return 키워드와 아무 관련이 없습니다. 둘을 헷갈리지 마십시오
2. 중요한 상하관계는 역사적 우연 덕에 최근에 와서야 (2015년 초기 GHC 7.10 버전) 구현되었습니다. 이보다 오래된 GHC 버전을 쓰고 있다면 이런 클래스 제약이 존재하지 않으므로 우리가 앞으로 고려할 실용적 관점들 중 일부는 해당사항이 없을 것입니다.
3. "의미semantic"라 함은 언어가 여러분에게 말하기를 허락한 것입니다. `Maybe`의 의미는 우리가 실패를 표현하는 것을 허락하여, 명령문이 결과를 내는 데 실패하면 뒤에 따라오는 명령문은 건너뛰게 만듭니다.
4. 물론 정규 함수 합성에 쓰이는 함수들은 모나딕 함수가 아닌 반면, 모나딕 합성은 모나딕 함수만을 취합니다.