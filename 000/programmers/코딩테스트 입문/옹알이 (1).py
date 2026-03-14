def solution(babbling):
    possible = ["aya", "ye", "woo", "ma"]
    count = 0
    
    for word in babbling:
        temp = word
        for p in possible:
            # 각 발음은 최대 한 번만 사용 가능
            temp = temp.replace(p, " ", 1)
        # 공백 제거 후 빈 문자열이면 발음 가능
        if temp.replace(" ", "") == "":
            count += 1
    
    return count