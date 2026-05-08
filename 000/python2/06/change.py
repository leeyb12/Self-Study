pay = int(input("지불 금액을 입력하세요: "))
price = int(input("물건 값을 입력하세요: "))
num = int(input("구매 개수를 입력하세요: "))

change = pay - (price * num)

print()
print("지불 금액 : %d" % pay)
