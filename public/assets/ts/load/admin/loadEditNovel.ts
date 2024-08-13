let categoryListEdit = [];
fetch(`http://localhost:3000/api/novel?_id=${localStorage.getItem("curentID")}`)
    .then(res => res.json())
    .then(data => loadEditDataNovel(data[0]));
// .then(data => console.log(data));

function loadEditDataNovel(data: any) {
    // Lấy các phần tử trong form
    var title = document.getElementById("title") as HTMLInputElement;
    var description = document.getElementById("description") as HTMLInputElement;
    var director = document.getElementById("director") as HTMLInputElement;
    var totalChapter = document.getElementById("total_chapter") as HTMLInputElement;
    var image = document.getElementById("preview") as HTMLInputElement;
    var isShow = document.getElementById("is_show") as HTMLInputElement;


    fetch("http://localhost:3000/api/category")
        .then(res => res.json())
        .then(categories => {
            categoryListEdit = categories
            data.category_id.forEach((item) => {
                loadCurrentCategory(categories, item)
            })
        })

    title.value = data.name
    description.value = data.description
    director.value = data.director
    totalChapter.value = data.total_chapter
    isShow.value = data.is_show || false
    image.src = "../../../assets/images/" + data.image
}

const loadCurrentCategory = (data, currentCategory) => {
    const element = document.querySelector("#select-list").innerHTML += getSelectListEdit(data, currentCategory)
}

const getSelectListEdit = (data, currentCategory) => {
    let temp = `<div class="w-100 d-flex category-margin-custom" id="category-select-${currentID}"><select class="form-select">`;
    data.forEach(item => {
        if (item._id === currentCategory) {
            temp += `
            <option selected value="${item._id}">${item.title}</option>
        `
        } else {
            temp += `
            <option value="${item._id}">${item.title}</option>
        `
        }
    });
    temp += `</select>
        <button type="button" onclick="deleteCategory(${currentID})"
        class="ms-3 delete-btn">-</button>
    </div>`
    currentID++;
    return temp;
}

if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/"
}