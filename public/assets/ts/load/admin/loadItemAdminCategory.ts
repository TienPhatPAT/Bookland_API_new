fetch("http://localhost:3000/api/category")
    .then(res => res.json())
    .then(data => categoryTable(data));

const categoryTable = (data: any[]) => {
    const element = document.querySelector("#category-tbody");

    var optionElement = document.createElement("option");
    optionElement.innerText = "Tất cả";
    element.appendChild(optionElement);

    data.forEach((item, index) => {
        var tableRow = document.createElement("tr");
        var th1 = document.createElement("th");
        var th2 = document.createElement("th");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
        var td5 = document.createElement("td");
        var td6 = document.createElement("td");
        var td7 = document.createElement("td");

        // Thiết lập nội dung cho các phần tử
        th1.setAttribute("scope", "row");
        th1.textContent = (index + 1).toString();
        th2.setAttribute("scope", "row");
        th2.textContent = item._id;
        td1.textContent = item.title;

        if (item.type === 0) {
            td2.textContent = "Hot list";
        } else if (item.type === 1) {
            td2.textContent = "Type list";
        }

        td3.textContent = item.created_date;
        td4.innerHTML = `
            <button class="category-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 28 16" fill="none">
                    <path d="M26 2L14 14L2 2H26Z" fill="#999999" stroke="#999999" stroke-width="4" stroke-linejoin="round" />
                </svg>
            </button>
            <span class="category-order-label">${item.index}</span>
            <button class="category-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 28 16" fill="none">
                    <path d="M2 14L14 2L26 14L2 14Z" fill="#999999" stroke="#999999" stroke-width="4" stroke-linejoin="round" />
                </svg>
            </button>
        `;

        if (item.is_show === true) {
            td5.innerHTML = `<span class="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c rounded-pill">Active</span>`;
        } else if (item.is_show === false) {
            td5.innerHTML = `<span class="badge bgc-red-50 c-red-700 p-10 lh-0 tt-c rounded-pill">Inactive</span>`;
        }

        if (item.novel_number) {
            td6.textContent = item.novel_number.toString();
        } else {
            td6.textContent = "0";
        }

        td7.innerHTML = `
            <button onClick="editItem('${item._id}')" class="option-btn">
                <img src="../../../assets/images/edit.svg" alt="">
            </button>
            <button onClick="deleteItem('${item._id}')" class="option-btn">
                <img src="../../../assets/images/remove.svg" alt="">
            </button>
        `;

        // Thêm các phần tử vào phần tử tr
        tableRow.appendChild(th1);
        tableRow.appendChild(th2);
        tableRow.appendChild(td1);
        tableRow.appendChild(td2);
        tableRow.appendChild(td3);
        tableRow.appendChild(td4);
        tableRow.appendChild(td5);
        tableRow.appendChild(td6);
        tableRow.appendChild(td7);
        element.appendChild(tableRow);
    });
};

// function editItem(categoryId: string) {
//     // Viết logic để xử lý sự kiện khi click vào nút sửa (edit) với categoryId
//     console.log("Edit category with ID:", categoryId);
// }

// function deleteItem(categoryId: string) {
//     // Viết logic để xử lý sự kiện khi click vào nút xóa (delete) với categoryId
//     console.log("Delete category with ID:", categoryId);
// }

// export { }

if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/"
}