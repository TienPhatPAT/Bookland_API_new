if (localStorage.getItem("currentNovel")) {
    fetch(`http://localhost:3000/api/novel?status=true&_id=${localStorage.getItem("currentNovel")}`)
        .then(res => res.json())
        .then(data => {
        setInformation(data[0]);
    });
}
else {
    location.href = "/";
}
fetch("http://localhost:3000/api/category?is_show=true")
    .then(res => res.json())
    .then(data => {
    headerTypeList(data);
    headerList(data);
    contentTypeList(data);
    tagList(data);
});
const fetchChapter = (limit = 50, offset = 0) => {
    fetch(`http://localhost:3000/api/chapter?limit=${limit}&offset=${offset}&is_show=true&novel_id=${localStorage.getItem("currentNovel")}`)
        .then(res => res.json())
        .then(data => {
        loadChapterList(data);
    });
};
const fetchPagination = () => {
    fetch(`http://localhost:3000/api/chapter?is_show=true&novel_id=${localStorage.getItem("currentNovel")}`)
        .then(res => res.json())
        .then(data => {
        loadPagination(data.length);
    });
};
fetchPagination();
fetchChapter();
const changeChapter = (number) => {
    localStorage.setItem("currentChapter", number.toString());
    location.href = "/chapter";
};
const loadChapterList = (data) => {
    const element = document.querySelector("#chapter-list");
    element.innerHTML = "";
    data.forEach((item) => {
        let chapterText;
        if (item.title) {
            chapterText = `Chương ${item.chapter_number}: ${item.title}`;
        }
        else {
            chapterText = `Chương ${item.chapter_number}`;
        }
        element.innerHTML += `
            <li class="col-sm-12 col-lg-6">
                <button onclick="changeChapter(${item.chapter_number})"
                    class="text-hiding text-decoration-none text-dark hover-title chapter-btn">${chapterText}</button>
            </li>`;
    });
};
const contentTypeList = (data) => {
    const element = document.querySelector("#content-category-list");
    data.forEach((item, index) => {
        if (item.type === 1) {
            element.innerHTML +=
                `<li><button onclick="changeCategory('${item._id}')" class="dropdown-item">${item.title}</button></li>`;
        }
    });
};
const headerTypeList = (data) => {
    const element = document.querySelector("#header-category-list");
    data.forEach((item) => {
        if (item.type === 1) {
            element.innerHTML +=
                `<li><button onclick="changeCategory('${item._id}')" class="dropdown-item">${item.title}</button></li>`;
        }
    });
};
const headerList = (data) => {
    const element = document.querySelector("#header-list");
    data.forEach((item, index) => {
        if (item.type === 0) {
            element.innerHTML +=
                `<li><button onclick="changeCategory('${item._id}')" class="dropdown-item">${item.title}</button></li>`;
        }
    });
};
const changeCategory = (idValue) => {
    localStorage.setItem("currentCategory", idValue);
    console.log(localStorage.getItem("currentCategory"));
    location.href = "/category";
};
const tagList = (data) => {
    const element = document.querySelector("#footer-tag-list");
    data.forEach((item, index) => {
        if (item.type === 0) {
            element.innerHTML += `<li class="me-1">
                <span class="badge text-bg-light">
                    <button class="text-dark text-decoration-none tag-btn" onclick="changeCategory('${item._id}')" title="${item.title}">
                        ${item.title}
                    </button>
                </span>
            </li>`;
        }
    });
};
const setImage = (item) => {
    const element = document.querySelector("#book-image");
    const imgElement = document.createElement("img");
    imgElement.src = `../../../assets/images/${item.image}`;
    imgElement.alt = item.name;
    imgElement.classList.add("img-fluid", "w-100");
    imgElement.width = 200;
    imgElement.height = 300;
    imgElement.loading = "lazy";
    element.appendChild(imgElement);
};
const setTitle = (title) => {
    const element = document.querySelector("#book-title");
    element.textContent = title;
};
const setDescription = (description) => {
    const element = document.querySelector("#book-description");
    element.innerHTML = description;
};
const loadCategory = (categories, element) => {
    categories.forEach((item, index) => {
        fetch(`http://localhost:3000/api/category?is_show=true&_id=${item}`)
            .then(res => res.json())
            .then((data) => {
            if (data[0].type === 1) {
                const innerDivElement = document.createElement("div");
                innerDivElement.classList.add("d-flex", "align-items-center", "flex-warp", "me-1");
                element.appendChild(innerDivElement);
                if (index === categories.length - 1) {
                    innerDivElement.textContent += data[0].title;
                }
                else {
                    innerDivElement.textContent += data[0].title + ", ";
                }
            }
        });
    });
};
const loadDetailBottom = (director, category_id, is_full) => {
    const element = document.querySelector("#novel-detail--bottom");
    const pElement = document.createElement("p");
    pElement.classList.add("mb-1");
    const strongElement1 = document.createElement("strong");
    strongElement1.textContent = "Tác giả:";
    const aElement = document.createElement("a");
    aElement.href = "#";
    aElement.classList.add("text-decoration-none", "text-dark", "hover-title");
    aElement.textContent = ` ${director}`;
    pElement.appendChild(strongElement1);
    pElement.appendChild(aElement);
    element.appendChild(pElement);
    const divElement = document.createElement("div");
    divElement.classList.add("d-flex", "align-items-center", "mb-1", "flex-wrap");
    const strongElement2 = document.createElement("strong");
    strongElement2.classList.add("me-1");
    strongElement2.textContent = "Thể loại: ";
    loadCategory(category_id, divElement);
    divElement.appendChild(strongElement2);
    element.appendChild(divElement);
};
const setInformation = (data) => {
    setImage(data);
    setTitle(data.name);
    setDescription(data.description);
    loadDetailBottom(data.director, data.category_id, data.is_full);
};
const loadPagination = (number) => {
    localStorage.setItem("localPage", "0");
    const element = document.querySelector("#pagination-list");
    const paginationNumber = Math.ceil(number / 50);
    for (let i = 0; i < paginationNumber; i++) {
        const liElement = document.createElement("li");
        if (i.toString() === localStorage.getItem("localPage")) {
            liElement.classList.add("pagination__item", "page-current");
        }
        else {
            liElement.classList.add("pagination__item");
        }
        const buttonElement = document.createElement("button");
        buttonElement.classList.add("page-link", "story-ajax-paginate", "w-100", "h-100", "d-flex", "justify-content-center", "align-items-center");
        buttonElement.setAttribute("style", "cursor: pointer;");
        buttonElement.textContent = `${i + 1}`;
        liElement.appendChild(buttonElement);
        element.appendChild(liElement);
    }
};
// export { }
const searchHandleNovel = (text) => {
    localStorage.setItem("currentCategory", `search:${text}`);
    location.href = "/category";
};
document.querySelector(".header__form-search").addEventListener("submit", (event) => {
    event.preventDefault();
    if (document.querySelector(".search-story").value.length > 0) {
        searchHandleNovel(document.querySelector(".search-story").value);
    }
});
const changeFullHandleNovel = () => {
    localStorage.setItem("currentCategory", "full");
    location.href = "/category";
};
const changeNewupdateHandleNovel = () => {
    localStorage.setItem("currentCategory", "newupdate");
    location.href = "/category";
};
