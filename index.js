var baseUrl = "https://l1braryapi.herokuapp.com";
var selectedRecord = null;
var selectedRecordID = null;

function closeForm() {
  document.getElementById("requestbook").style.display = "none";
}

function showAdd() {
  if (document.getElementById("addbook").style.display == "block") {
    document.getElementById("addbook").style.display = "none";
  } else {
    document.getElementById("addbook").style.display = "block";
  }
}

function showBorrow() {
  if (document.getElementById("allbrw").style.display == "block") {
    document.getElementById("allbrw").style.display = "none";
    document.getElementById("allbks").style.display = "block";
    document.getElementById("btn").innerText = "Show Borrowings";
    document.getElementById("bkbtn").style.display = "block";
  } else {
    document.getElementById("allbrw").style.display = "block";
    document.getElementById("addbook").style.display = "none";
    document.getElementById("allbks").style.display = "none";
    document.getElementById("btn").innerText = "Show Books";
    document.getElementById("bkbtn").style.display = "none";
  }
}

function submitBook() {
  var formData = {};
  formData["title"] = document.getElementById("title").value;
  formData["copies"] = document.getElementById("copies").value;
  if (selectedRecord == null) {
    saveBook(formData);
  } else {
    updateBook(formData);
  }
  clearBookForm();
}

function updateBook(data) {
  var updateData = JSON.stringify(data);
  $.ajax({
    type: "PUT",
    url: baseUrl + "/book/" + selectedRecordID,
    dataType: "json",
    data: updateData,
    contentType: "application/json; charset=utf-8",
    cache: false,
    success: function () {
      alert("Book updated");
      document.getElementById("addbook").style.display = "none";
    },
  });
}

function ReqBook() {
  document.getElementById("requestbook").style.display = "none";
  var formData = {};
  formData["titleid"] = document.getElementById("titleid").value;
  formData["memberid"] = document.getElementById("memberid").value;
  RequestBook(formData);
  clearReqForm();
}

function RequestBook(data) {
  var postData = JSON.stringify(data);
  $.ajax({
    type: "POST",
    url: baseUrl + "/borrow/",
    dataType: "json",
    data: postData,
    contentType: "application/json; charset=utf-8",
    cache: false,
    success: function (response) {
      if (!response.success) {
        alert(response.message);
      } else {
        var data = response.data;
        location = location;
      }
    },
    error: function (response) {
      alert("Error");
    },
  });
}

function saveBook(data) {
  var postData = JSON.stringify(data);
  $.ajax({
    type: "POST",
    url: baseUrl + "/book/",
    dataType: "json",
    data: postData,
    contentType: "application/json; charset=utf-8",
    cache: false,
    success: function (response) {
      var data = response.data;
      addBookToTable(data);
      document.getElementById("addbook").style.display = "none";
    },
  });
}

function addBookToTable(data) {
  var allbks = document
    .getElementById("allbks")
    .getElementsByTagName("tbody")[0];
  var newRecord = allbks.insertRow(allbks.length);

  var cell1 = newRecord.insertCell(0);
  cell1.innerHTML = data.bookid;
  var cell2 = newRecord.insertCell(1);
  cell2.innerHTML = data.title;
  var cell3 = newRecord.insertCell(2);
  cell3.innerHTML = data.copies;
  var cell4 = newRecord.insertCell(3);
  cell4.innerHTML =
    '<a onclick="onBookEdit(this)"><i class="fa fa-pencil" aria-hidden="true"></i></a>';
  var cell5 = newRecord.insertCell(4);
  cell5.innerHTML =
    '<a onclick="onBookDel(this)"><i class="fa fa-trash-o" aria-hidden="true"></i></a>';
  var cell6 = newRecord.insertCell(5);
  cell6.innerHTML =
    '<a onclick="onBookReq(this)"><i class="fa fa-plus" aria-hidden="true"></i></a>';
}

function onBookEdit(td) {
  document.getElementById("addbook").style.display = "block";
  selectedRecord = td.parentElement.parentElement;
  selectedRecordID = selectedRecord.cells[0].innerHTML;
  document.getElementById("title").value = selectedRecord.cells[1].innerHTML;
  document.getElementById("copies").value = selectedRecord.cells[2].innerHTML;
}

function onBookDel(td) {
  if (confirm("Are you sure you want to delete this book")) {
    var row = td.parentElement.parentElement;
    deleteBook(row);
  }
}

function deleteBook(row) {
  $.ajax({
    type: "DELETE",
    url: baseUrl + "/book/" + row.cells[0].innerHTML,
    cache: false,
    success: function (response) {
      if (!response.success) {
        alert(response.message);
      } else {
        alert("Deleted successfully");
      }
    },
  });
}

function onBookReq(td) {
  document.getElementById("requestbook").style.display = "block";
  selectedRecord = td.parentElement.parentElement;
  selectedRecordID = selectedRecord.cells[0].innerHTML;
  document.getElementById("titleid").value = selectedRecord.cells[0].innerHTML;
}

function addBorrowToTable(data) {
  var allbrw = document
    .getElementById("allbrw")
    .getElementsByTagName("tbody")[0];
  var newRecord = allbrw.insertRow(allbks.length);

  var cell1 = newRecord.insertCell(0);
  cell1.innerHTML = data.borrowid;
  var cell2 = newRecord.insertCell(1);
  cell2.innerHTML = data.title;
  var cell3 = newRecord.insertCell(2);
  cell3.innerHTML = data.memberid;
  var cell4 = newRecord.insertCell(3);
  cell4.innerHTML = data.returndate;
  var cell5 = newRecord.insertCell(4);
  cell5.innerHTML =
    '<a onclick="onBookRet(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>';
}

function onBookRet(td) {
  selectedRecord = td.parentElement.parentElement;
  selectedRecordID = selectedRecord.cells[0].innerHTML;
  onReturnBook();
}

function onReturnBook() {
  console.log(selectedRecordID);
  $.ajax({
    type: "POST",
    url: baseUrl + "/borrow/" + selectedRecordID,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    cache: false,
    success: function (response) {
      var data = response.data;
      location = location;
    },
  });
}

function clearBookForm() {
  document.getElementById("title").value = "";
  document.getElementById("copies").value = "";
}

function clearReqForm() {
  document.getElementById("titleid").value = "";
  document.getElementById("memberid").value = "";
}

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: baseUrl + "/book/",
    cache: false,
    success: function (response) {
      var data = response.data;
      data.forEach((book) => {
        addBookToTable(book);
      });
    },
  });
});

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: baseUrl + "/borrow/",
    cache: false,
    success: function (response) {
      var data = response.data;
      data.forEach((book) => {
        addBorrowToTable(book);
      });
    },
  });
});
