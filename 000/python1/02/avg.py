kor = int(input("국어 성적을 입력하세요."))
eng = int(input("영어 성적을 입력하세요."))
math = int(input("수학 성적을 입력하세요."))

sum = kor + eng + math
avg = sum / 3

print("합계 : %d" % sum)
print("평균 : %f" % avg)