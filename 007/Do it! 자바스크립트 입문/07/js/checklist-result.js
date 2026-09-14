var itemList = [];

var addBtn = document.querySelector("#add");
addBtn.addEventListener("click", addList);  // addBtn.onclick = addList;라고 해도 됨

function addList() {
  var item = document.querySelector("#item").value;  // 텍스트 필드 내용 가져옴
  if (item != null) {
    itemList.push(item);  // itemList 배열의 끝에 item 변수 값 추가
    document.querySelector("#item").value = "";  // id = "item"인 요소의 값을 지움
    document.querySelector("#item").focus();  // 텍스트 필드에 focus() 메서드 적용
  }
  showList();
}

function showList() {
  var list = "<ul>";  // 목록을 시작하는 <ul> 태그 저장
  for (var i = 0; i < itemList.length; i++) {
    list += "<li>" + itemList[i] + "<span class = 'close' id = >"
  }
}