const currentCategory = [
    {
        currentCategoryValue: ""
    }
];
let categoryList, currentID = 0;
fetch("http://localhost:3000/api/category")
    .then(res => res.json())
    .then(data => {
    categoryList = data;
    // loadCategorySelect(getSelectList(data))
});
const deleteCategory = (id) => {
    const element = document.querySelector(`#category-select-${id}`);
    element.remove();
};
const getSelectList = (data) => {
    let temp = `<div class="w-100 d-flex category-margin-custom" id="category-select-${currentID}"><select class="form-select">`;
    data.forEach(item => {
        temp += `
            <option value="${item._id}">${item.title}</option>
        `;
    });
    temp += `</select>
        <button type="button" onclick="deleteCategory(${currentID})"
        class="ms-3 delete-btn">-</button>
    </div>`;
    currentID++;
    return temp;
};
const loadCategorySelect = (selectHtml) => {
    const element = document.querySelector("#select-list");
    element.innerHTML = selectHtml + element.innerHTML;
};
const addCategory = () => {
    const element = document.querySelector("#select-list");
    element.innerHTML += getSelectList(categoryList);
};
const previewImage = () => {
    var _a;
    const input = document.getElementById('imageInput');
    const preview = document.getElementById('preview');
    if (!input || !preview) {
        console.error("Input or preview element not found");
        return;
    }
    const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            if (((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) && typeof e.target.result === 'string') {
                preview.src = e.target.result;
            }
            else {
                console.error("Failed to read file");
            }
        };
        reader.readAsDataURL(file);
    }
};
