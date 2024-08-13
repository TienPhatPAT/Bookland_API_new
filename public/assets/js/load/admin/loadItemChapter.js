fetch("http://localhost:3000/api/chapter")
    .then(res => res.json())
    .then(data => loadChapterTable(data));
const loadChapterTable = (data) => {
    const element = document.querySelector("#chapter-table");
    let html = "";
    data.forEach((item, index) => {
        html += `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${item._id}</td>
                <td>Chap ${item.chapter_number}</td>
                <td class="table-scope">
                    <span>${item.title}</span>
                </td>
                <td class="table-scope">
                    <span id="novel-name-${index}"></span>
                </td>`;
        if (item.is_show) {
            html += `<td>
            <span
                class="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c rounded-pill">Active
            </span>
        </td>`;
        }
        else {
            html += `<td>
            <span
                class="badge bgc-red-50 c-red-700 p-10 lh-0 tt-c rounded-pill">Inactive
            </span>
        </td>`;
        }
        html += `<td>${item.created_date}</td>
                <td>
            <button class="option-btn" onclick="editChapter('${item._id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21"
                    viewBox="0 0 20 21" fill="none">
                    <path
                        d="M9.401 16.661L16.797 9.26503C15.5526 8.7455 14.4226 7.98645 13.471 7.03103C12.5151 6.07924 11.7557 4.9488 11.236 3.70403L3.84 11.1C3.263 11.677 2.974 11.966 2.726 12.284C2.4331 12.6593 2.18196 13.0654 1.977 13.495C1.804 13.859 1.675 14.247 1.417 15.021L0.0549955 19.104C-0.00769076 19.291 -0.0169912 19.4917 0.0281393 19.6836C0.0732699 19.8756 0.171042 20.0511 0.310467 20.1906C0.449892 20.33 0.625441 20.4278 0.817383 20.4729C1.00932 20.518 1.21005 20.5087 1.397 20.446L5.48 19.084C6.255 18.826 6.642 18.697 7.006 18.524C7.436 18.319 7.842 18.068 8.217 17.775C8.535 17.527 8.824 17.238 9.401 16.661ZM18.849 7.21303C19.5864 6.47559 20.0007 5.47542 20.0007 4.43253C20.0007 3.38964 19.5864 2.38946 18.849 1.65203C18.1116 0.914591 17.1114 0.500305 16.0685 0.500305C15.0256 0.500305 14.0254 0.914591 13.288 1.65203L12.401 2.53903L12.439 2.65003C12.8761 3.90074 13.5914 5.03593 14.531 5.97003C15.493 6.93773 16.668 7.66713 17.962 8.10003L18.849 7.21303Z"
                        fill="#E5C165" />
                </svg>
            </button>
            <button onclick="deleteChapter('${item._id}')" class="option-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21"
                    viewBox="0 0 18 21" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M11.281 0.5C11.7007 0.500109 12.1098 0.632286 12.4503 0.877808C12.7907 1.12333 13.0453 1.46975 13.178 1.868L13.721 3.5H17.001C17.2662 3.5 17.5205 3.60536 17.7081 3.79289C17.8956 3.98043 18.001 4.23478 18.001 4.5C18.001 4.76522 17.8956 5.01957 17.7081 5.20711C17.5205 5.39464 17.2662 5.5 17.001 5.5L16.998 5.571L16.131 17.714C16.0769 18.4706 15.7382 19.1786 15.183 19.6956C14.6279 20.2125 13.8975 20.4999 13.139 20.5H4.86298C4.10443 20.4999 3.37408 20.2125 2.81894 19.6956C2.2638 19.1786 1.92509 18.4706 1.87098 17.714L1.00398 5.57C1.00217 5.54671 1.00117 5.52336 1.00098 5.5C0.73576 5.5 0.481406 5.39464 0.29387 5.20711C0.106333 5.01957 0.000976563 4.76522 0.000976562 4.5C0.000976562 4.23478 0.106333 3.98043 0.29387 3.79289C0.481406 3.60536 0.73576 3.5 1.00098 3.5H4.28098L4.82398 1.868C4.95667 1.46959 5.21141 1.12305 5.55208 0.877515C5.89274 0.631978 6.30205 0.499899 6.72198 0.5H11.281ZM6.00098 8.5C5.75604 8.50003 5.51964 8.58996 5.3366 8.75272C5.15357 8.91547 5.03663 9.13975 5.00798 9.383L5.00098 9.5V15.5C5.00126 15.7549 5.09886 16 5.27382 16.1854C5.44879 16.3707 5.68793 16.4822 5.94237 16.4972C6.19681 16.5121 6.44736 16.4293 6.64281 16.2657C6.83826 16.1021 6.96387 15.8701 6.99398 15.617L7.00098 15.5V9.5C7.00098 9.23478 6.89562 8.98043 6.70808 8.79289C6.52055 8.60536 6.26619 8.5 6.00098 8.5ZM12.001 8.5C11.7358 8.5 11.4814 8.60536 11.2939 8.79289C11.1063 8.98043 11.001 9.23478 11.001 9.5V15.5C11.001 15.7652 11.1063 16.0196 11.2939 16.2071C11.4814 16.3946 11.7358 16.5 12.001 16.5C12.2662 16.5 12.5205 16.3946 12.7081 16.2071C12.8956 16.0196 13.001 15.7652 13.001 15.5V9.5C13.001 9.23478 12.8956 8.98043 12.7081 8.79289C12.5205 8.60536 12.2662 8.5 12.001 8.5ZM11.281 2.5H6.72098L6.38798 3.5H11.614L11.281 2.5Z"
                        fill="#E5421B" />
                </svg>
            </button>
            </td>
            </tr>
            `;
        fetch("http://localhost:3000/api/novel?_id=" + item.novel_id)
            .then(res => res.json())
            .then(data => loadNovelName(data[0].name, `#novel-name-${index}`));
    });
    element.innerHTML = html;
};
const loadNovelName = (title, element) => {
    document.querySelector(element).textContent = title;
};
function editChapter(chapterId) {
    localStorage.setItem("currentId", chapterId);
    location.href = "edit";
}
// function deleteChapter(chapterId: string) {
//     // Viết logic để xử lý sự kiện khi click vào nút xóa (delete) với chapterId
//     console.log("Delete chapter with ID:", chapterId);
// }
// export { }
if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/";
}
