var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
fetch("http://localhost:3000/api/category?is_show=true")
    .then(res => res.json())
    .then(data => {
    headerTypeListHome(data);
    contentTypeListHome(data);
    headerListHome(data);
    tagListHome(data);
    // selectStoriesHot(data);
});
fetch("http://localhost:3000/api/novel?status=true")
    .then(res => res.json())
    .then(data => {
    // console.log(data);
    loadHotItem(data.sort((b, a) => a.view - b.view));
    loadFullItem(data);
    loadNewestNovel(data.sort((a, b) => new Date(b.last_update) - new Date(a.last_update)));
});
function loadHotItem(data) {
    const element = document.querySelector("#hot-list");
    let temp = 0;
    data.forEach(item => {
        if (temp < 16 && item.view >= 50) {
            const storyItem = document.createElement('div');
            storyItem.classList.add('story-item');
            storyItem.id = item._id;
            const anchor = document.createElement('a');
            anchor.href = '/novel?id=' + item._id;
            anchor.classList.add('d-block', 'text-decoration-none', 'position-relative');
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('story-item__image');
            const image = document.createElement('img');
            image.src = '../../../assets/images/' + item.image;
            image.alt = item.name;
            image.width = 150;
            image.height = 230;
            image.loading = 'lazy';
            imageDiv.appendChild(image);
            const heading = document.createElement('h3');
            heading.classList.add('story-item__name', 'text-one-row', 'story-name');
            heading.textContent = item.name;
            let span;
            // console.log(item.newest_chapter === item.total_chapter);
            if (item.newest_chapter === item.total_chapter) {
                // alert(1)
                span = document.createElement('span');
                span.classList.add('full-label');
            }
            anchor.appendChild(imageDiv);
            anchor.appendChild(heading);
            if (item.newest_chapter === item.total_chapter) {
                anchor.appendChild(span);
            }
            storyItem.appendChild(anchor);
            element.appendChild(storyItem);
            temp++;
        }
    });
}
function loadFullItem(data) {
    const element = document.querySelector("#full-list");
    let temp = 0;
    data.forEach((item, index) => {
        if (temp < 16 && item.newest_chapter === item.total_chapter) {
            var storyItemFull = document.createElement("div");
            storyItemFull.classList.add("story-item-full", "text-center");
            storyItemFull.id = item._id;
            var linkElement = document.createElement("a");
            linkElement.href = "/novel";
            linkElement.classList.add("d-block", "story-item-full__image");
            var imgElement = document.createElement("img");
            imgElement.src = "../../../assets/images/" + item.image;
            imgElement.alt = item.name;
            imgElement.classList.add("img-fluid", "w-100");
            imgElement.width = 150;
            imgElement.height = 230;
            imgElement.loading = "lazy";
            linkElement.appendChild(imgElement);
            storyItemFull.appendChild(linkElement);
            var h3Element = document.createElement("h3");
            h3Element.classList.add("fs-6", "story-item-full__name", "fw-bold", "text-center", "mb-0");
            var nameLinkElement = document.createElement("a");
            nameLinkElement.href = "/novel";
            nameLinkElement.classList.add("text-decoration-none", "text-one-row", "story-name");
            nameLinkElement.textContent = item.name;
            h3Element.appendChild(nameLinkElement);
            storyItemFull.appendChild(h3Element);
            var spanElement = document.createElement("span");
            spanElement.classList.add("story-item-full__badge", "badge");
            spanElement.textContent = "Full - " + (item.total_chapter || "0") + " chương";
            storyItemFull.appendChild(spanElement);
            element.appendChild(storyItemFull);
            temp++;
        }
    });
}
function changeCategoryHome(idValue) {
    localStorage.setItem("currentCategory", idValue);
    // console.log(localStorage.getItem("currentCategory"));
    location.href = "/category";
}
function contentTypeListHome(data) {
    const element = document.querySelector("#content-category-list");
    data.forEach((item, index) => {
        if (item.type === 1) {
            element.innerHTML +=
                `<li><button onclick="changeCategoryHome('${item._id}')" class="dropdown-item">${item.title}</button></li>`;
        }
    });
}
function headerTypeListHome(data) {
    const element = document.querySelector("#header-category-list");
    data.forEach((item) => {
        if (item.type === 1) {
            element.innerHTML +=
                `<li><button onclick="changeCategoryHome('${item._id}')" class="dropdown-item">${item.title}</button></li>`;
        }
    });
}
function headerListHome(data) {
    const element = document.querySelector("#header-list");
    data.forEach((item, index) => {
        if (item.type === 0) {
            element.innerHTML +=
                `<li><button onclick="changeCategoryHome('${item._id}')" class="dropdown-item">${item.title}</button></li>`;
        }
    });
}
function tagListHome(data) {
    const element = document.querySelector("#footer-tag-list");
    data.forEach((item, index) => {
        if (item.type === 0) {
            element.innerHTML += `<li class="me-1">
                <span class="badge text-bg-light">
                    <button class="text-dark text-decoration-none tag-btn" onclick="changeCategoryHome('${item._id}')" title="${item.title}">
                        ${item.title}
                    </button>
                </span>
            </li>`;
        }
    });
}
// function selectStoriesHot(data: any[]) {
//     const element = document.querySelector("#select-stories-hot") as HTMLSelectElement;
//     var optionElement = document.createElement("option");
//     optionElement.innerText = "Tất cả";
//     element.appendChild(optionElement);
//     data.forEach((item, index) => {
//         if (item.type === 1) {
//             var optionElement = document.createElement("option");
//             optionElement.innerText = item.title;
//             optionElement.value = item._id;
//             element.appendChild(optionElement);
//         }
//     });
// }
function formatTimeDifferenceHome(timestamp) {
    const postedTime = new Date(timestamp);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - postedTime.getTime();
    if (timeDifference < 60000) {
        return "Vừa xong";
    }
    else if (timeDifference < 3600000) {
        const minutes = Math.floor(timeDifference / 60000);
        return `${minutes} phút trước`;
    }
    else if (timeDifference < 86400000) {
        const hours = Math.floor(timeDifference / 3600000);
        return `${hours} giờ trước`;
    }
    else if (timeDifference < 604800000) {
        const days = Math.floor(timeDifference / 86400000);
        return `${days} ngày trước`;
    }
    else {
        const day = (postedTime.getDate()).toString();
        const month = (postedTime.getMonth() + 1).toString(); // Tháng bắt đầu từ 0
        const year = (postedTime.getFullYear()).toString();
        return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year.padStart(2, "0")}`;
    }
}
function isWithinOneMonth(isoString) {
    const inputDate = new Date(isoString);
    const currentDate = new Date();
    const timeDifference = currentDate - inputDate;
    // within 3 hours
    const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    // within 1 month
    // const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    return timeDifference < oneMonthInMilliseconds;
}
function loadNewestNovel(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const element = document.querySelector("#newest-updated-novel");
        data.forEach((item, index) => __awaiter(this, void 0, void 0, function* () {
            const mainDivElement = document.createElement("div");
            mainDivElement.classList.add("story-item-no-image");
            mainDivElement.id = item._id;
            // alert(item._id)
            const nameDivElement = document.createElement("div");
            nameDivElement.classList.add("story-item-no-image__name", "d-flex", "align-items-center");
            const nameH3Element = document.createElement("h3");
            nameH3Element.classList.add("me-1", "mb-0", "d-flex", "align-items-center");
            const nameSvgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            nameSvgElement.setAttribute("style", "width: 10px; margin-right: 5px");
            nameSvgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            nameSvgElement.setAttribute("height", "1em");
            nameSvgElement.setAttribute("viewBox", "0 0 320 512");
            const namePathElement = document.createElement("path");
            namePathElement.setAttribute("d", "M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z");
            nameSvgElement.appendChild(namePathElement);
            const nameAElement = document.createElement("a");
            nameAElement.setAttribute("href", "/novel");
            nameAElement.classList.add("text-decoration-none", "text-dark", "fs-6", "hover-title", "text-one-row", "story-name");
            nameAElement.textContent = item.name;
            nameH3Element.appendChild(nameSvgElement);
            nameH3Element.appendChild(nameAElement);
            const nameBadgeNewElement = document.createElement("span");
            nameBadgeNewElement.classList.add("badge", "story-status", "story-status--new");
            nameBadgeNewElement.textContent = "New";
            const nameBadgeFullElement = document.createElement("span");
            nameBadgeFullElement.classList.add("badge", "story-status", "story-status--full");
            nameBadgeFullElement.textContent = "Full";
            const nameBadgeHotElement = document.createElement("span");
            nameBadgeHotElement.classList.add("badge", "story-status", "story-status--hot");
            nameBadgeHotElement.textContent = "Hot";
            nameDivElement.appendChild(nameH3Element);
            if (item.newest_chapter === item.total_chapter) {
                nameDivElement.appendChild(nameBadgeFullElement);
            }
            if (item.view >= 50) {
                nameDivElement.appendChild(nameBadgeHotElement);
            }
            if (isWithinOneMonth(item.created_date)) {
                nameDivElement.appendChild(nameBadgeNewElement);
            }
            mainDivElement.appendChild(nameDivElement);
            const categoriesDivElement = document.createElement("div");
            categoriesDivElement.classList.add("story-item-no-image__categories", "ms-2", "d-none", "d-lg-block");
            const categoriesPElement = document.createElement("p");
            categoriesPElement.classList.add("mb-0");
            const categoryAElement1 = document.createElement("a");
            categoryAElement1.setAttribute("href", "/category");
            categoryAElement1.classList.add("hover-title", "text-decoration-none", "text-dark", "category-name");
            item.category_id.forEach((item) => {
                fetchCategory(item);
            });
            function fetchCategory(id) {
                return __awaiter(this, void 0, void 0, function* () {
                    const response = yield fetch("http://localhost:3000/api/category?_id=" + id);
                    const data = yield response.json();
                    if (data[0].type === 1) {
                        if (categoryAElement1.textContent === "") {
                            categoryAElement1.textContent += data[0].title;
                        }
                        else {
                            categoryAElement1.textContent += ", " + data[0].title;
                        }
                    }
                });
            }
            // const categoryAElement2 = document.createElement("a");
            // categoryAElement2.setAttribute("href", "#");
            // categoryAElement2.classList.add("hover-title", "text-decoration-none", "text-dark", "category-name");
            // categoryAElement2.textContent = "Kiếm Hiệp,";
            // const categoryAElement3 = document.createElement("a");
            // categoryAElement3.setAttribute("href", "#");
            // categoryAElement3.classList.add("hover-title", "text-decoration-none", "text-dark", "category-name");
            // categoryAElement3.textContent = "Dị Giới,";
            categoriesPElement.appendChild(categoryAElement1);
            // categoriesPElement.appendChild(categoryAElement2);
            // categoriesPElement.appendChild(categoryAElement3);
            categoriesDivElement.appendChild(categoriesPElement);
            const chaptersDivElement = document.createElement("div");
            chaptersDivElement.classList.add("story-item-no-image__chapters", "ms-2");
            const chaptersAElement = document.createElement("a");
            chaptersAElement.setAttribute("href", "/chapter");
            chaptersAElement.classList.add("hover-title", "text-decoration-none", "text-info");
            if (item.newest_chapter) {
                chaptersAElement.textContent = "Chương " + item.newest_chapter;
            }
            else {
                chaptersAElement.textContent = "Chương " + 0;
            }
            chaptersDivElement.appendChild(chaptersAElement);
            const timeDivElement = document.createElement("div");
            timeDivElement.classList.add("story-item-no-image__time", "ms-2");
            const timeAElement = document.createElement("a");
            timeAElement.setAttribute("href", "#");
            timeAElement.classList.add("hover-title", "text-decoration-none", "text-info");
            timeAElement.textContent = formatTimeDifferenceHome(item.last_update);
            timeDivElement.appendChild(timeAElement);
            mainDivElement.appendChild(categoriesDivElement);
            mainDivElement.appendChild(chaptersDivElement);
            mainDivElement.appendChild(timeDivElement);
            element.appendChild(mainDivElement);
        }));
    });
}
// const eventSelectChange = () => {
//     const element = document.querySelector("#select-stories-hot");
//     // alert(element.value)
//     element.addEventListener('change', () => {
//         fetch("http://localhost:3000/api/novel?is_hot=true&status=true&category_id=" + element.value)
//             .then(res => res.json())
//             .then(data => console.log(data))
//     });
// }
// eventSelectChange();
// export { }
const searchHandleHome = (text) => {
    localStorage.setItem("currentCategory", `search:${text}`);
    location.href = "/category";
};
document.querySelector(".header__form-search").addEventListener("submit", (event) => {
    event.preventDefault();
    if (document.querySelector(".search-story").value.length > 0) {
        searchHandleHome(document.querySelector(".search-story").value);
    }
});
const changeFullHandleHome = () => {
    localStorage.setItem("currentCategory", "full");
    location.href = "/category";
};
const changeNewupdateHandleHome = () => {
    localStorage.setItem("currentCategory", "newupdate");
    location.href = "/category";
};
let isShow = false;
const checkLogin = () => {
    if (localStorage.getItem("userId"))
        document.querySelector(".form-login-icon").addEventListener("click", (event) => {
            isShow = !isShow;
            if (isShow === true) {
                document.querySelector(".form-login-icon").innerHTML += `
                <form action="" id="user-form">
                    <button>Tài khoản</button>
                    <button onclick="logout()">Đăng xuất</button>
                </form>
            `;
            }
            else {
                document.querySelector(".form-login-icon").innerHTML = `
                <img src="../../../assets/images/Group 167.svg" alt="">
            `;
            }
        });
    else {
        document.querySelector(".form-login-icon").addEventListener("click", (event) => {
            localStorage.setItem("currentAction", "login");
            showOverlay();
        });
    }
};
const showOverlay = () => {
    isShow = !isShow;
    if (isShow === true && localStorage.getItem("currentAction")) {
        if (localStorage.getItem("currentAction") === "login") {
            document.querySelector("#loginForm").addEventListener("submit", (event) => {
                event.preventDefault();
                const formDataLogin = {
                    username: document.querySelector("#username").value || "",
                    password: document.querySelector("#password").value || ""
                };
                // console.log(formDataLogin);
                fetch("http://localhost:3000/api/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataLogin),
                })
                    .then(res => res.json())
                    .then(data => {
                    if (data === null || data === void 0 ? void 0 : data.msg) {
                        document.querySelector("#login-msg").innerHTML = data.msg;
                        document.querySelector("#password").value = "";
                    }
                    else {
                        if (data.role === "admin") {
                            localStorage.setItem("userId", data.userId);
                            localStorage.setItem("userRole", data.role);
                            location.href = "/admin";
                        }
                        else {
                            localStorage.setItem("userId", data.userId);
                            location.reload();
                        }
                    }
                });
            });
        }
    }
};
checkLogin();
console.log(localStorage.getItem("userId"));
const logout = () => {
    localStorage.removeItem("userId");
    location.reload();
};
const changeOverlay = (type) => {
    if (type === "login") {
        document.querySelector("#modal-content").innerHTML = `
        <div class="modal-header">
                    <h5 class="modal-title" id="loginModalLabel">Login</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Login Form -->
                    <form id="loginForm">
                        <div id="login-msg"></div>
                        <div class="form-group">
                            <label for="username">Username:</label>
                            <input type="text" class="form-control" id="username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password:</label>
                            <input type="password" class="form-control" id="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary mt-4">Login</button>
                    </form>

                    <!-- Register and Forgot Password Links -->
                    <div class="mt-2 d-flex justify-content-between align-items-center login-action-wrapper">
                        <div class="">Don't have an account?
                            <button type="button" onclick="changeOverlay('register')" id="register">Register</button>
                        </div>
                        <button type="button" onclick="changeOverlay('forgotPassword')" id="forgotPasswordLink">Forgot
                            Password?</button>
                    </div>
                </div>`;
    }
    else if (type === "register") {
        document.querySelector("#modal-content").innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title" id="loginModalLabel">Register</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <!-- Register Form -->
            <form id="loginForm">
                <div id="login-msg"></div>
                <div class="form-group">
                    <label for="fullname">Fullname:</label>
                    <input type="text" class="form-control" id="fullname" required>
                </div>
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" class="form-control" id="username" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" class="form-control" id="password" required>
                </div>
                <div class="form-group">
                    <label for="re-password">Re-password:</label>
                    <input type="password" class="form-control" id="re-password" required>
                </div>
                <button type="submit" class="btn btn-primary mt-4">Login</button>
            </form>

            <!-- Register and Forgot Password Links -->
            <div class="mt-2 d-flex justify-content-between align-items-center login-action-wrapper">
                <div class="">Don't have an account?
                    <button type="button" onclick="changeOverlay('login')" id="register">Register</button>
                </div>
                <button type="button" onclick="changeOverlay('forgotPassword')" id="forgotPasswordLink">Forgot
                    Password?</button>
            </div>
        </div>`;
    }
};
