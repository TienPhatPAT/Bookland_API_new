var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const editItem = (id, url = "category") => {
    if (id) {
        localStorage.setItem("curentID", id);
        window.location.href = "edit";
    }
};
const editCategory = (event) => {
    event.preventDefault();
    // Lấy giá trị từ các trường trong form
    var title = document.getElementById("name").value;
    var type = document.getElementById("exampleSelect").value;
    var priority = document.getElementById("number").value;
    var isShow = document.getElementById("checkbox1").checked;
    // Lấy _id của danh mục (giả sử _id đã được lưu ở một nơi nào đó)
    var categoryId = localStorage.getItem("curentID");
    // Tạo đối tượng dữ liệu để gửi đến API
    var requestData = {
        title: title,
        type: type,
        index: priority,
        is_show: isShow
    };
    // Gửi request đến API sử dụng phương thức PATCH hoặc PUT
    fetch(`http://localhost:3000/api/category/${categoryId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
        // Xử lý kết quả từ API (data) nếu cần
        console.log('API response:', data);
        window.location.href = "http://localhost:3000/admin/category";
    })
        .catch(error => {
        // Xử lý lỗi nếu có
        console.error('Error:', error);
    });
};
const editUser = (event) => {
    event.preventDefault();
    // Lấy giá trị từ các trường trong form
    const userId = localStorage.getItem("curentID");
    var fullname = document.getElementById("fullname").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var address = document.getElementById("address").value;
    var isAdmin = document.getElementById("isAdmin").checked ? "admin" : "user";
    var isActive = document.getElementById("isActive").checked ? "active" : "inactive";
    var currentDate = new Date();
    var formattedDate = currentDate.toISOString();
    var data = {
        fullname: fullname,
        phone: phone,
        email: email,
        address: address,
        role: isAdmin,
        username: username,
        password: password,
        status: isActive,
        created_date: formattedDate,
        google_id: null,
        facebook_id: null
    };
    console.log(data);
    fetch(`http://localhost:3000/api/user/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
        // Xử lý kết quả từ API (nếu cần)
        console.log('Success:', data);
        location.href = "../";
    })
        .catch((error) => {
        console.error('Error:', error);
    });
};
function uploadImage(imageFile) {
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
function extractFilename(filePath) {
    const pathArray = filePath.split('\\');
    return pathArray[pathArray.length - 1];
}
function editNovel(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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
            status: isShow,
            total_chapter: totalChapter,
            last_update: formattedDate,
            category_id: categories
        };
        if (imageInput.value) {
            // alert(imageInput)
            data.image = extractFilename(imageInput.value);
        }
        try {
            const response = yield fetch('http://localhost:3000/api/novel/' + localStorage.getItem("curentID"), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const responseData = yield response.json();
            // console.log(imageInput);
            if (response.ok) {
                if (imageInput.value) {
                    uploadImage((_a = imageInput.files) === null || _a === void 0 ? void 0 : _a[0]);
                }
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
}
if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/";
}
const editaChapter = (event) => __awaiter(this, void 0, void 0, function* () {
    event.preventDefault();
    const novelId = document.getElementById("novel-select").value;
    const chapterNumber = document.getElementById("chapter_number").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value.replace(/\n/g, '<br>');
    const isShow = document.getElementById("checkbox1").checked;
    // alert(1)
    const data = {
        novel_id: novelId,
        chapter_number: chapterNumber,
        title: title,
        content: content,
        is_show: isShow
    };
    try {
        const response = yield fetch('http://localhost:3000/api/chapter/' + localStorage.getItem("currentId"), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = yield response.json();
        if (response.ok) {
            console.log('Success:', responseData);
            // lastUpdateHandle(novelId, chapterNumber)
            location.href = "../";
        }
        else {
            console.error('Error:', responseData);
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
});
