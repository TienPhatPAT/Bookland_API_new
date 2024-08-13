fetch("http://localhost:3000/api/user")
    .then(res => res.json())
    .then(data => loadUserTable(data));

const loadUserTable = (data: any[]) => {
    const element = document.querySelector("#user-table");
    let html = "";
    data.forEach((item, index) => {
        html += `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${item._id}</td>
            <td>${item.fullname}</td>
            <td>${item.email}</td>`;

        if (item.status === "active") {
            html += `<td>
                <span
                    class="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c rounded-pill">Active
                </span>
            </td>`;
        } else {
            html += `<td>
                <span
                    class="badge bgc-red-50 c-red-700 p-10 lh-0 tt-c rounded-pill">Inactive
                </span>
            </td>`;
        }

        html += `<td>${item.created_date}</td>`;

        if (item.role === "user") {
            html += `<td>
                <span
                    class="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c rounded-pill">User
                </span>
            </td>`;
        } else {
            html += `<td>
                <span
                    class="badge bgc-yellow-50 c-yellow-700 p-10 lh-0 tt-c rounded-pill">Admin
                </span>
            </td>`;
        }

        html += `<td>
                <button onclick="editItem('${item._id}')" class="option-btn">
                    <img src="../../../assets/images/edit.svg" alt="">
                </button>
                <button onclick="deleteUser('${item._id}')" class="option-btn">
                    <img src="../../../assets/images/remove.svg" alt="">
                </button>
            </td>
        </tr>`;
    });
    element.innerHTML = html;
};

// function editItem(userId: string) {
//     // Viết logic để xử lý sự kiện khi click vào nút sửa (edit) với userId
//     console.log("Edit user with ID:", userId);
// }

// function deleteUser(userId: string) {
//     // Viết logic để xử lý sự kiện khi click vào nút xóa (delete) với userId
//     console.log("Delete user with ID:", userId);
// }

// export { }

if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/"
}