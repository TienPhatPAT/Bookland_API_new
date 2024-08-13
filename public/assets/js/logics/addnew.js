var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function extractFilenameAdd(filePath) {
    const pathArray = filePath.split('\\');
    return pathArray[pathArray.length - 1];
}
function uploadImageAdd(imageFile) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(imageFile);
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            const response = yield fetch('http://localhost:3000/api/novel/upload', {
                method: 'POST',
                body: formData,
            });
            const data = yield response.json();
            if (data.status === 1) {
                console.log('Upload successful. Image URL:', data.url);
            }
            else {
                console.error('Upload failed. Server response:', data);
            }
        }
        catch (error) {
            console.error('Error uploading image:', error);
        }
    });
}
const addnewCategory = (event) => __awaiter(this, void 0, void 0, function* () {
    event.preventDefault();
    const title = document.getElementById("name").value;
    const type = document.getElementById("exampleSelect").value;
    const priority = document.getElementById("number").value;
    const isShow = document.getElementById("checkbox1").checked;
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const data = {
        title: title,
        type: type,
        priority: priority,
        is_show: isShow,
        created_date: formattedDate,
    };
    try {
        const response = yield fetch('http://localhost:3000/api/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = yield response.json();
        if (response.ok) {
            location.href = "../";
            console.log('Success:', responseData);
        }
        else {
            console.error('Error:', responseData);
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
});
const addnewUser = (event) => __awaiter(this, void 0, void 0, function* () {
    event.preventDefault();
    const fullname = document.getElementById("fullname").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const address = document.getElementById("address").value;
    const isAdmin = document.getElementById("isAdmin").checked ? "admin" : "user";
    const isActive = document.getElementById("isActive").checked ? "active" : "inactive";
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const data = {
        fullname: fullname,
        phone: phone,
        email: email,
        username: username,
        password: password,
        address: address,
        role: isAdmin,
        status: isActive,
        created_date: formattedDate,
        google_id: null,
        facebook_id: null
    };
    try {
        const response = yield fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = yield response.json();
        if (response.ok) {
            location.href = "../";
            console.log('Success:', responseData);
        }
        else {
            console.error('Error:', responseData);
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
});
const addnewNovel = (event) => __awaiter(this, void 0, void 0, function* () {
    var _a;
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value.replace(/\n/g, '<br>');
    ;
    const director = document.getElementById("director").value;
    const totalChapter = document.getElementById("total_chapter").value;
    const imageInput = document.getElementById("imageInput");
    const isShow = document.getElementById("is_show").checked;
    // const isFull = (document.getElementById("is_full") as HTMLInputElement).checked;
    // const isHot = (document.getElementById("is_hot") as HTMLInputElement).checked;
    // const isNew = (document.getElementById("is_new") as HTMLInputElement).checked;
    let categories = [];
    document.querySelectorAll("#select-list>div>select").forEach((item) => {
        categories.push(item.value);
    });
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const data = {
        name: title,
        description: description,
        director: director,
        image: extractFilenameAdd(imageInput.value),
        status: isShow,
        total_chapter: totalChapter,
        newest_chapter: 0,
        total_view: 0,
        created_date: formattedDate,
        last_update: formattedDate,
        view: 0,
        category_id: categories
    };
    // console.log(data);
    try {
        const response = yield fetch('http://localhost:3000/api/novel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = yield response.json();
        // console.log(imageInput);
        if (response.ok) {
            uploadImageAdd((_a = imageInput.files) === null || _a === void 0 ? void 0 : _a[0]);
            console.log('Success:', responseData);
        }
        else {
            console.error('Error:', responseData);
        }
        location.href = "../";
    }
    catch (error) {
        console.error('Error:', error);
    }
});
const addnewChapter = (event) => __awaiter(this, void 0, void 0, function* () {
    event.preventDefault();
    const novelId = document.getElementById("novel-select").value;
    const chapterNumber = document.getElementById("chapter_number").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value.replace(/\n/g, '<br>');
    const isShow = document.getElementById("checkbox1").checked;
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    // alert(1)
    const data = {
        novel_id: novelId,
        chapter_number: chapterNumber,
        title: title,
        content: content,
        created_date: formattedDate,
        is_show: isShow
    };
    try {
        const response = yield fetch('http://localhost:3000/api/chapter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = yield response.json();
        if (response.ok) {
            console.log('Success:', responseData);
            lastUpdateHandle(novelId, chapterNumber);
        }
        else {
            console.error('Error:', responseData);
            location.href = "../";
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
});
const lastUpdateHandle = (idNovel, chapterNumber) => {
    fetch(`http://localhost:3000/api/novel?_id=${idNovel}`)
        .then(res => res.json())
        .then(data => {
        // console.log(`http://localhost:3000/api/novel?_id=${idNovel}`);
        lastUpdate(idNovel, data[0].total_chapter, chapterNumber);
    });
};
const lastUpdate = (idNovel, totalChapter, chapterNumber) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const newestChapter = chapterNumber;
    if (totalChapter < newestChapter) {
        totalChapter = newestChapter;
    }
    const data = {
        last_update: formattedDate,
        total_chapter: totalChapter,
        newest_chapter: newestChapter
    };
    console.log(data);
    fetch(`http://localhost:3000/api/novel/${idNovel}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
        console.log("updated");
    })
        .catch((error) => {
        console.error('Error:', error);
    });
};
if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/";
}
