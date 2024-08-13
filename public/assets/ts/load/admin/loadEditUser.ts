fetch(`http://localhost:3000/api/user?_id=${localStorage.getItem("curentID")}`)
    .then(res => res.json())
    .then(data => loadEditData(data[0]));

function loadEditData(data: any) {
    // Lấy các phần tử trong form
    var fullnameInput = document.getElementById("fullname") as HTMLInputElement;
    var phoneInput = document.getElementById("phone") as HTMLInputElement;
    var emailInput = document.getElementById("email") as HTMLInputElement;
    var usernameInput = document.getElementById("username") as HTMLInputElement;
    var passwordInput = document.getElementById("password") as HTMLInputElement;
    var addressInput = document.getElementById("address") as HTMLInputElement;
    var isAdminCheckbox = document.getElementById("isAdmin") as HTMLInputElement;
    var isActiveCheckbox = document.getElementById("isActive") as HTMLInputElement;
    let isAdmin: boolean;
    let isActive: boolean;

    if (data.role === "admin") {
        isAdmin = true;
    } else {
        isAdmin = false;
    }

    if (data.status === "active") {
        isActive = true;
    } else {
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
    location.href = "/"
}