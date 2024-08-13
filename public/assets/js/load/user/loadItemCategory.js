const loadTitle = (title) => {
    document.querySelector("#category-title").innerHTML = `<span class="d-block text-decoration-none text-dark fs-4 category-name"
    title="${title}">${title}</span>`;
};
function isWithinOneMonthCategory(isoString) {
    const inputDate = new Date(isoString);
    const currentDate = new Date();
    const timeDifference = currentDate - inputDate;
    // within 3 hours
    // const oneMonthInMilliseconds = 24 * 60 * 60 * 1000;
    // within 1 month
    const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    return timeDifference < oneMonthInMilliseconds;
}
if (!localStorage.getItem("currentCategory")) {
    location.href = "/";
}
if (localStorage.getItem("currentCategory").split(":")[0] === "search") {
    fetch(`http://localhost:3000/api/novel?&status=true&search=${localStorage.getItem("currentCategory").split(":")[1]}`)
        .then(res => res.json())
        .then(data => {
        loadNovelList(data);
    });
    loadTitle(`Tìm kiếm "${localStorage.getItem("currentCategory").split(":")[1]}"`);
}
else if (localStorage.getItem("currentCategory").split(":")[0] === "full") {
    fetch(`http://localhost:3000/api/novel?&status=true`)
        .then(res => res.json())
        .then(data => {
        loadNovelList(data.filter((item) => item.newest_chapter === item.total_chapter).slice(0, 100));
    });
    loadTitle(`Truyện full`);
}
else if (localStorage.getItem("currentCategory").split(":")[0] === "newupdate") {
    fetch(`http://localhost:3000/api/novel?&status=true`)
        .then(res => res.json())
        .then(data => {
        loadNovelList(data.filter((item) => isWithinOneMonthCategory(item.last_update)).slice(0, 100).sort((a, b) => new Date(b.last_update) - new Date(a.last_update)));
    });
    loadTitle(`Truyện mới cập nhật`);
}
else {
    fetch(`http://localhost:3000/api/novel?&status=true&category_id=${localStorage.getItem("currentCategory")}`)
        .then(res => res.json())
        .then(data => {
        loadNovelList(data);
    });
    fetch(`http://localhost:3000/api/category?&is_show=true&_id=${localStorage.getItem("currentCategory")}`)
        .then(res => res.json())
        .then(data => {
        loadTitle(data[0].title);
    });
}
fetch("http://localhost:3000/api/category?is_show=true")
    .then(res => res.json())
    .then(data => {
    tagListCategory(data);
    headerTypeListCategory(data);
    headerListCategory(data);
});
const headerTypeListCategory = (data) => {
    const element = document.querySelector("#header-category-list");
    data.forEach((item) => {
        if (item.type === 1) {
            element.innerHTML +=
                `<li><button onclick="changeCategoryHandle('${item._id}')" class="dropdown-item">${item.title}</button></li>`;
        }
    });
};
const changeCategoryHandle = (idValue) => {
    localStorage.setItem("currentCategory", idValue);
    // console.log(localStorage.getItem("currentCategory"));
    location.href = "/category";
};
const headerListCategory = (data) => {
    const element = document.querySelector("#header-list");
    data.forEach((item, index) => {
        if (item.type === 0) {
            element.innerHTML +=
                `<li><button onclick="changeCategoryHandle('${item._id}')" class="dropdown-item">${item.title}</button></li>`;
        }
    });
};
const tagListCategory = (data) => {
    const element = document.querySelector("#footer-tag-list");
    data.forEach((item, index) => {
        if (item.type === 0) {
            element.innerHTML += `<li class="me-1">
                    <span class="badge text-bg-light">
                        <button class="text-dark text-decoration-none tag-btn" onclick="changeCategoryHandle('${item._id}')" title="${item.title}">
                            ${item.title}
                        </button>
                    </span>
                </li>`;
        }
    });
};
const loadNovelList = (data) => {
    // console.log(data);
    const element = document.querySelector("#category-novel-list");
    let html = "";
    data.forEach((item) => {
        html += `<div class="story-item" id=${item._id}>
        <a href="/novel" class="d-block text-decoration-none">
            <div class="story-item__image">
                <img src="../../../assets/images/${item.image}" alt="${item.name}" class="img-fluid" width="150" height="230" loading="lazy">
            </div>
            <h3 class="story-item__name text-one-row story-name">${item.name}</h3>

            <div class="list-badge">`;
        if (item.is_full) {
            html += `<span class="story-item__badge badge text-bg-success">Full</span>`;
        }
        if (item.is_show) {
            html += `<span class="story-item__badge story-item__badge-new badge text-bg-info text-light">New</span>`;
        }
        if (item.is_hot) {
            html += `<span class="story-item__badge story-item__badge-hot badge text-bg-danger">Hot</span>`;
        }
        html += `</div >
        </a >
    </div > `;
    });
    element.innerHTML = html;
};
const searchHandle = (text) => {
    localStorage.setItem("currentCategory", `search:${text}`);
    location.href = "/category";
};
document.querySelector(".header__form-search").addEventListener("submit", (event) => {
    event.preventDefault();
    if (document.querySelector(".search-story").value.length > 0) {
        searchHandle(document.querySelector(".search-story").value);
    }
});
const changeFullHandleCategory = () => {
    localStorage.setItem("currentCategory", "full");
    location.href = "/category";
};
const changeNewupdateHandleCategory = () => {
    localStorage.setItem("currentCategory", "newupdate");
    location.href = "/category";
};
// export { }
