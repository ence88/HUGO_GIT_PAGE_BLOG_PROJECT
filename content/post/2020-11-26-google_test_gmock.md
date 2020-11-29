---
title: "UnitTesting 관련 Google Test, gMock 정리"
date: 2020-11-26T18:33:54+09:00
#Dev, C++, DB, MsSQL, MySQL, Common, Perforce, Blog
categories:
- Language
- C++
#C++, Modern C++, DB, MsSQL, MySQL, Perforce, SVN, Git, GitHub, Management, Blog, Hugo, Architecture
tags:
- C++
- UnitTest
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

#thumbnailImage: //example.com/image.jpg유니
---

유닛 테스트는 프로그램의 품질과 안정성을 향상시킬 수 있지만 꽤나 번거로운 작업이고 어느정도의 테스트 케이스를 로직과 pair로 작성해야 하기 때문에 관리 비용이 들지만, 이러한 테스팅 환경을 구축하고 습관화 할 경우 어느날 치명적인 버그를 막아주는 경우가 있습닙니다. C#에서는 nUnit이라는 라이브러리를 사용했었는데, C++ 환경에서 Google Test 사용이 필요하여 관련 리서치 내용을 포스팅합닙니다.

<!--more-->

### GoogleTest?

구글에서 만든 C++ Testing Framework.

1. 테스트는 독립적이고 반복할 수 있어야 합니다. 다른 테스트의 결과에 따라 결과가 달라지는 테스트는 좋은 테스트가 아닙니다. 구글 테스트는 각각의 테스트를 분리하여 다른 오브젝트로 관리할 수 있도록 도와줍니다.  
2. 테스트는 잘 구조화되고 테스트하는 코드를 잘 반영해야 합니다. 구글테스트는 관련된 테스트를 test suite로 그룹화하여 데이터와 subroutine을 공유할 수 있도록 합니다.  
3. 테스트는 재사용 가능하고 플랫폼 종속되지 않아야 합니다. 구글테스트는 다른 OS에서도 돌 수 있도록 합니다.  
4. 테스트가 Fail했을 때 왜 실패했는지를 보고해주기 때문에 버그를 쉽게 찾을 수 있습니다.    
5. 테스팅 프레임워크는 테스트 작성자들의 귀찮음을 덜어주고 테스트 자체에 집중할 수 있도록 만들어줍니다.  
6. 테스트는 빨라야합니다. 구글테스트를 이용해서 shared resource를 테스트간에 재사용 할 수 있고, 한번만 실행되는 set-up/tear-down 메소드도 사용할 수 있습니다.  



### Assertion

Fatal assertion (ASSERT_) 는 테스트 실패시 바로 테스트가 중단됩니다.
Nonfatal assertion (EXPECT_) 는 테스트 실패해도 모든 테스트를 실행합니다.

보통은 EXPECT_를 쓰나, 이 테스트가 실해하면 무조건 바로 중단해야 할 경우는 ASSERT_를 씁니다.



### Basic Assertion

Fatal assertion | Nonfatal assertion | Verifies ————————– | ————————– | ——————– ASSERT_TRUE(condition); | EXPECT_TRUE(condition); | condition is true ASSERT_FALSE(condition); | EXPECT_FALSE(condition); | condition is false



### Binary Comparison

Fatal assertion | Nonfatal assertion | Verifies ———————— | ———————— | ————– `ASSERT_EQ(val1, val2);` | `EXPECT_EQ(val1, val2);` | `val1 == val2` `ASSERT_NE(val1, val2);` | `EXPECT_NE(val1, val2);` | `val1 != val2` `ASSERT_LT(val1, val2);` | `EXPECT_LT(val1, val2);` | `val1 < val2` `ASSERT_LE(val1, val2);` | `EXPECT_LE(val1, val2);` | `val1 <= val2` `ASSERT_GT(val1, val2);` | `EXPECT_GT(val1, val2);` | `val1 > val2` `ASSERT_GE(val1, val2);` | `EXPECT_GE(val1, val2);` | `val1 >= val2`



### String Comparison

| Fatal assertion | Nonfatal assertion | Verifies | | ————————– | —————————— | ——————————————————– | | `ASSERT_STREQ(str1,str2);` | `EXPECT_STREQ(str1,str2);` | the two C strings have the same content | | `ASSERT_STRNE(str1,str2);` | `EXPECT_STRNE(str1,str2);` | the two C strings have different contents | | `ASSERT_STRCASEEQ(str1,str2);` | `EXPECT_STRCASEEQ(str1,str2);` | the two C strings have the same content, ignoring case | | `ASSERT_STRCASENE(str1,str2);` | `EXPECT_STRCASENE(str1,str2);` | the two C strings have different contents, ignoring case



### Simple Test

**TEST()** 라는 매크로를 씁니다. 이것은 결과를 리턴하지 않는 평범한 C++ 함수입니다.
첫번째 파라미터는 test suite의 이름이고, 두번째 파라미터는 구체적인 테스트의 이름입니다.
이름에는 underscores (_)가 들어갈 수 없습니다.

```c++
TEST(TestSuiteName, TestName) {
  ... test body ...
}
```

#### Example

```c++
// Tests factorial of 0.
TEST(FactorialTest, HandlesZeroInput) {
  EXPECT_EQ(Factorial(0), 1);
}

// Tests factorial of positive numbers.
TEST(FactorialTest, HandlesPositiveInput) {
  EXPECT_EQ(Factorial(1), 1);
  EXPECT_EQ(Factorial(2), 2);
  EXPECT_EQ(Factorial(3), 6);
  EXPECT_EQ(Factorial(8), 40320);
}
```



### Test Fixtures (Setup()/TearDown())

같은 데이터 설정을 여러 테스트에서 사용하고 싶을 때 필요한 방법입니다. ::testing::Test를 상속받습니다. Setup()과 같은 메소드들은 protected로 정의합니다.
또한 TEST() 대신 TEST_F()를 사용합니다.

```c++
TEST_F(TestFixtureName, TestName) {
  ... test body ...
}
```

#### Example

```c++
template <typename E>  // E is the element type.
class Queue {
 public:
  Queue();
  void Enqueue(const E& element);
  E* Dequeue();  // Returns NULL if the queue is empty.
  size_t size() const;
  ...
};
class QueueTest : public ::testing::Test {
 protected:
  void SetUp() override {
     q1_.Enqueue(1);
     q2_.Enqueue(2);
     q2_.Enqueue(3);
  }

  // void TearDown() override {}

  Queue<int> q0_;
  Queue<int> q1_;
  Queue<int> q2_;
};
TEST_F(QueueTest, IsEmptyInitially) {
  EXPECT_EQ(q0_.size(), 0);
}

TEST_F(QueueTest, DequeueWorks) {
  int* n = q0_.Dequeue();
  EXPECT_EQ(n, nullptr);

  n = q1_.Dequeue();
  ASSERT_NE(n, nullptr);
  EXPECT_EQ(*n, 1);
  EXPECT_EQ(q1_.size(), 0);
  delete n;

  n = q2_.Dequeue();
  ASSERT_NE(n, nullptr);
  EXPECT_EQ(*n, 2);
  EXPECT_EQ(q2_.size(), 1);
  delete n;
}
```



### main function

gtest_main과 Link했다면 메인함수를 작성할 필요는 없습니다. gtest_main을 링크합니다면 구글 테스트가 메인 함수 기본 구현을 제공하기 때문입니다. 만약 자신만의 메인을 만들고 싶다면 RUN_ALL_TEST()를 리턴하게 해야 합니다.

```c++
#include "this/package/foo.h"
#include "gtest/gtest.h"

namespace my {
namespace project {
namespace {

// The fixture for testing class Foo.
class FooTest : public ::testing::Test {
 protected:
  // You can remove any or all of the following functions if their bodies would
  // be empty.

  FooTest() {
     // You can do set-up work for each test here.
  }

  ~FooTest() override {
     // You can do clean-up work that doesn't throw exceptions here.
  }

  // If the constructor and destructor are not enough for setting up
  // and cleaning up each test, you can define the following methods:

  void SetUp() override {
     // Code here will be called immediately after the constructor (right
     // before each test).
  }

  void TearDown() override {
     // Code here will be called immediately after each test (right
     // before the destructor).
  }

  // Class members declared here can be used by all tests in the test suite
  // for Foo.
};

// Tests that the Foo::Bar() method does Abc.
TEST_F(FooTest, MethodBarDoesAbc) {
  const std::string input_filepath = "this/package/testdata/myinputfile.dat";
  const std::string output_filepath = "this/package/testdata/myoutputfile.dat";
  Foo f;
  EXPECT_EQ(f.Bar(input_filepath, output_filepath), 0);
}

// Tests that Foo does Xyz.
TEST_F(FooTest, DoesXyz) {
  // Exercises the Xyz feature of Foo.
}

}  // namespace
}  // namespace project
}  // namespace my

int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
```

More Information [Advanced Guide](https://github.com/google/googletest/blob/master/googletest/docs/advanced.md)



### gMock이란?

> https://github.com/google/googletest/blob/master/googlemock/README.md

구글에서 만든 유닛테스트를 위한 Mocking 라이브러리입니다.

유닛테스트를 작성할 때는 외부 디펜던시를 차단하고 테스트해야 합니다. 이때 외부에서 주입받은 클래스를 가짜로 만드는것이 Mocking하는 것입니다.

더 상세한 정보는 아래에 있습니다.

- [gMock for dummies](https://github.com/google/googletest/blob/master/googlemock/docs/for_dummies.md)
- [gMock Cookbook](https://github.com/google/googletest/blob/master/googlemock/docs/cook_book.md)
- [gMock Chear Sheet](https://github.com/google/googletest/blob/master/googlemock/docs/cheat_sheet.md)



먼저 Mocking을 하기 전에 Mocking할 대상을 상속받는 클래스를 만들어야 합니다.

```c++
#include "gmock/gmock.h"

class MockFoo : public Foo {
  ...
  MOCK_METHOD(int, GetSize, (), (const, override));
  MOCK_METHOD(string, Describe, (const char* name), (override));
  MOCK_METHOD(string, Describe, (int type), (override));
  MOCK_METHOD(bool, Process, (Bar elem, int count), (override));
};
```

하지만 이는 번거로운 일입니다. 이를 위해 제너레이터가 파이썬 스크립트로 이미 작성되어 있습니다.

`{구글테스트 폴더}/googlemock/scripts/generator` 에 가면, gmock_gn.py가 존재합니다. `python3 gmock_gn.py` 명령어를 통해 실행하고, 변경하고 싶은 클래스의 절대경로를 입력하면 모킹클래스를 자동으로 출력해줍니다. 이를 사용하면 됩니다.

이제 Mocking 클래스를 사용해보겠습니다.

```c++
using ::testing::Return;                          // #1

TEST(BarTest, DoesThis) {
  MockFoo foo;                                    // #2
ccc
  ON_CALL(foo, GetSize())                         // #3
      .WillByDefault(Return(1));
  // ... other default actions ...

  EXPECT_CALL(foo, Describe(5))                   // #4
      .Times(3)
}         
```

위 코드에서 `EXPECT_CALL`이란 Mocking class의 메소드 호출이 기대됩니다는 뜻입니다. 따라서 위 코드에서는 foo의 Describe 함수가 호출되야 테스트가 성공합니다.

또한 Times(3)의 의미는 foo의 Describe 함수가 3번 호출되어야 합니다는 것을 뜻합니다. 이를 잘 활용하면 외부에서 주입받은 클래스를 모킹하고 예상되는 행위 호출을 통해 클래스를 테스트할 수 있습니다.

`ON_CALL`은 Mocking class가 테스트용으로 만든 가짜 클래스이기 때문에 특정한 함수가 불렸을 때의 행동을 정의하는 것입니다. 위의 예제에서 `ON_CALL(foo, GetSize()).WillByDefault(Return(1))`의 의미는 foo에서 GetSize()가 불렸을 때 1을 리턴하게 합니다는 뜻입니다.

> gMock Test Suite를 작성할때 주의할 점은, EXPECT_CALL을 실제 함수를 부르기 전에 정의해두어야 합니다.