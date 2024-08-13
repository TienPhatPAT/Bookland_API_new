setTimeout(() => {
    increaseViewHandle(localStorage.getItem("currentNovel"))
}, 10000);

fetch(`http://localhost:3000/api/novel?status=true&_id=${localStorage.getItem("currentNovel")}`)
    .then(res => res.json())
    .then(data => {
        loadTitleNovel(data[0].name);
    });

fetch("http://localhost:3000/api/category?is_show=true")
    .then(res => res.json())
    .then(data => {
        headerTypeListChapter(data);
        headerListChapter(data);
        tagListChapter(data);
    });

// localStorage.setItem("currentChapter", 1)
fetch(`http://localhost:3000/api/chapter?is_show=true&novel_id=${localStorage.getItem("currentNovel")}&chapter_number=${localStorage.getItem("currentChapter")}`)
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            // localStorage
            location.href = "/novel";
        }
        loadTitleChapter(data[0].title, data[0].chapter_number);
        loadContent(data[0].content);
    });

const loadTitleNovel = (title: string) => {
    document.querySelector("#novel-title")!.textContent = title;
};

const loadTitleChapter = (title: string, chapterNumber: number) => {
    const novelChapterTitle = document.querySelector("#novel-chapter-title")!;
    if (title) {
        novelChapterTitle.textContent = `Chương ${chapterNumber}: ${title}`;
    } else {
        novelChapterTitle.textContent = `Chương ${chapterNumber}`;
    }
};

const loadContent = (content: string) => {
    document.querySelector("#novel-content")!.innerHTML = content;
};

const headerTypeListChapter = (data: any[]) => {
    const element = document.querySelector("#header-category-list") as HTMLElement;
    data.forEach((item) => {
        if (item.type === 1) {
            element.innerHTML +=
                `<li><button onclick="changeCategoryChapter('${item._id}')" class="dropdown-item">${item.title}</button></li>`;
        }
    });
};

const changeCategoryChapter = (idValue: string) => {
    localStorage.setItem("currentCategory", idValue);
    console.log(localStorage.getItem("currentCategory"));
    location.href = "/category";
};

const headerListChapter = (data: any[]) => {
    const element = document.querySelector("#header-list") as HTMLElement;
    data.forEach((item, index) => {
        if (item.type === 0) {
            element.innerHTML +=
                `<li><button onclick="changeCategoryChapter('${item._id}')" class="dropdown-item">${item.title}</button></li>`;
        }
    });
};

const tagListChapter = (data: any[]) => {
    const element = document.querySelector("#footer-tag-list") as HTMLElement;
    data.forEach((item, index) => {
        if (item.type === 0) {
            element.innerHTML += `<li class="me-1">
                <span class="badge text-bg-light">
                    <button class="text-dark text-decoration-none tag-btn" onclick="changeCategoryChapter('${item._id}')" title="${item.title}">
                        ${item.title}
                    </button>
                </span>
            </li>`;
        }
    });
};

const changeChapterHandle = (option: string) => {
    if (option === "next") {
        localStorage.setItem("currentChapter", String(Number(localStorage.getItem("currentChapter")) + 1));
        location.reload();
    } else if (option === "previous") {
        const currentChapter = Number(localStorage.getItem("currentChapter"));
        if (currentChapter > 1) {
            localStorage.setItem("currentChapter", String(currentChapter - 1));
            location.reload();
        }
    }
};

const searchHandleChapter = (text) => {
    localStorage.setItem("currentCategory", `search:${text}`);
    location.href = "/category";
};

document.querySelector(".header__form-search")!.addEventListener("submit", (event) => {
    event.preventDefault();
    if ((document.querySelector(".search-story") as HTMLInputElement).value.length > 0) {
        searchHandleChapter((document.querySelector(".search-story") as HTMLInputElement).value);
    }
});

const increaseViewHandle = (idNovel) => {
    fetch(`http://localhost:3000/api/novel?&_id=${idNovel}`)
        .then(res => res.json())
        .then(data => {
            console.log(`http://localhost:3000/api/novel?&novel_id=${idNovel}`);

            increaseView(idNovel, data[0].view, data[0].total_view)
        });
}

const increaseView = (idNovel, view, totalView) => {
    const data = {
        view: view + 1,
        total_view: totalView + 1
    }
    fetch(`http://localhost:3000/api/novel/${idNovel}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            // Xử lý kết quả từ API (nếu cần)
            console.log('view increased:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const changeFullHandleChapter = () => {
    localStorage.setItem("currentCategory", "full")
    location.href = "/category"
}

const changeNewupdateHandleChapter = () => {
    localStorage.setItem("currentCategory", "newupdate")
    location.href = "/category"
}