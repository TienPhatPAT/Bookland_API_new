fetch(`http://localhost:3000/api/user?_id=${localStorage.getItem("curentID")}`)
    .then(res => res.json())
    .then(data => loadEditData(data[0]));
function loadEditData(data) {
    // Lấy các phần tử trong form
    var fullnameInput = document.getElementById("fullname");
    var phoneInput = document.getElementById("phone");
    var emailInput = document.getElementById("email");
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");
    var addressInput = document.getElementById("address");
    var isAdminCheckbox = document.getElementById("isAdmin");
    var isActiveCheckbox = document.getElementById("isActive");
    let isAdmin;
    let isActive;
    if (data.role === "admin") {
        isAdmin = true;
    }
    else {
        isAdmin = false;
    }
    if (data.status === "active") {
        isActive = true;
    }
    else {
        isActive = false;
    }
    console.log(isActive, isAdmin);
    // Gán giá trị từ đối tượng data vào các trường của form
    fullnameInput.value = data.fullname || "";
    phoneInput.value = data.phone || "";
    emailInput.value = data.email || "";
    usernameInput.value = data.username || "";
    passwordInput.value = data.password || "";
    addressInput.value = data.address || "";
    isAdminCheckbox.checked = isAdmin;
    isActiveCheckbox.checked = isActive; // Gán giá trị mặc định là true nếu không có giá trị
    // Nếu có thêm các trường khác trong data, bạn cũng có thể thêm vào đây tương tự
}
// export { }
if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/";
}
