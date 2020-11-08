@echo off
echo Create New Post File
@set YEAR=%date:~0,4%
@set MONTH=%date:~5,2%
@set DAY=%date:~8,2%

@set POSTFIX="%YEAR%-%MONTH%-%DAY%-"

set /p str=Input post name:

@set POSTFIX2="post/%YEAR%-%MONTH%-%DAY%-%str%.md"

hugo new %POSTFIX2%