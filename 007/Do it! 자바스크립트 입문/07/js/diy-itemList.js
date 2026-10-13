var itemList = [];
var addBtn = document.querySelector("#add");
addBtn.addEventListener("click", addList);

getItems();

function getItems() {
  var storedData = localStorage.getItem("storageList");
  if (storedData != null) itemList = JSON.parse(storedData);
  showList();
}

function addList() {
  var item = document.querySelector('#item').value;
  if (item != null) {
    itemList.push(item);
    document.querySelector('#item').value = "";
    document.querySelector('#item').focus();
  }
  localStorage.setItem("storageList", JSON.stringify(itemList));
  showList();
}

function showList() {
  var list
}