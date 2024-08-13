fetch(`http://localhost:3000/api/category?_id=${localStorage.getItem("curentID")}`)
    .then(res => res.json())
    .then(data => loadEditDataCategory(data[0]));

function loadEditDataCategory(data: any) {
    // Lấy các phần tử trong form
    var titleInput = document.getElementById("name") as HTMLInputElement;
    var typeSelect = document.getElementById("exampleSelect") as HTMLSelectElement;
    var priorityInput = document.getElementById("number") as HTMLInputElement;
    var isShowCheckbox = document.getElementById("checkbox1") as HTMLInputElement;

    // Gán giá trị từ đối tượng data vào các trường của form
    titleInput.value = data.title || ""; // Nếu không có giá trị, đặt giá trị mặc định là ""
    typeSelect.value = data.type.toString() || "0"; // Nếu không có giá trị, đặt giá trị mặc định là "0"
    priorityInput.value = data.index.toString() || "0"; // Nếu không có giá trị, đặt giá trị mặc định là "0"
    isShowCheckbox.checked = data.is_show || false; // Nếu không có giá trị, đặt giá trị mặc định là false
}

// export { }

if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/"
}