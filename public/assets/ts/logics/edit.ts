const editItem = (id: string | null, url: string = "category"): void => {
    if (id) {
        localStorage.setItem("curentID", id);
        window.location.href = "edit";
    }
};

const editCategory = (event: Event): void => {
    event.preventDefault();

    // Lấy giá trị từ các trường trong form
    var title = (document.getElementById("name") as HTMLInputElement).value;
    var type = (document.getElementById("exampleSelect") as HTMLSelectElement).value;
    var priority = (document.getElementById("number") as HTMLInputElement).value;
    var isShow = (document.getElementById("checkbox1") as HTMLInputElement).checked;

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
        method: 'PATCH', // hoặc 'PUT' tùy thuộc vào yêu cầu của API
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

const editUser = (event: Event): void => {
    event.preventDefault();

    // Lấy giá trị từ các trường trong form
    const userId = localStorage.getItem("curentID");
    var fullname = (document.getElementById("fullname") as HTMLInputElement).value;
    var phone = (document.getElementById("phone") as HTMLInputElement).value;
    var email = (document.getElementById("email") as HTMLInputElement).value;
    var username = (document.getElementById("username") as HTMLInputElement).value;
    var password = (document.getElementById("password") as HTMLInputElement).value;
    var address = (document.getElementById("address") as HTMLInputElement).value;
    var isAdmin = (document.getElementById("isAdmin") as HTMLInputElement).checked ? "admin" : "user";
    var isActive = (document.getElementById("isActive") as HTMLInputElement).checked ? "active" : "inactive";

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

interface NovelDataEdit {
    name: string;
    description: string;
    director: string;
    image?: string;
    status: boolean;
    total_chapter: string;
    last_update: string;
    category_id: string[];
}

async function uploadImage(imageFile: File) {
    // console.log(imageFile);

    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch('http://localhost:3000/api/novel/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.status === 1) {
            console.log('Upload successful. Image URL:', data.url);
        } else {
            console.error('Upload failed. Server response:', data);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

function extractFilename(filePath: string): string {
    const pathArray = filePath.split('\\');
    return pathArray[pathArray.length - 1];
}

async function editNovel(event) {
    event.preventDefault()

    const title = (document.getElementById("title") as HTMLInputElement).value;
    const description = (document.getElementById("description") as HTMLInputElement).value.replace(/\n/g, '<br>');;
    const director = (document.getElementById("director") as HTMLInputElement).value;
    const totalChapter = (document.getElementById("total_chapter") as HTMLInputElement).value;
    const imageInput = document.getElementById("imageInput") as HTMLInputElement;
    const isShow = (document.getElementById("is_show") as HTMLInputElement).checked;
    // const isFull = (document.getElementById("is_full") as HTMLInputElement).checked;
    // const isHot = (document.getElementById("is_hot") as HTMLInputElement).checked;
    // const isNew = (document.getElementById("is_new") as HTMLInputElement).checked;

    let categories: string[] = [];
    document.querySelectorAll("#select-list>div>select").forEach((item) => {
        categories.push((item as HTMLSelectElement).value);
    });

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const data: NovelDataEdit = {
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
        data.image = extractFilename(imageInput.value)
    }

    try {
        const response = await fetch('http://localhost:3000/api/novel/' + localStorage.getItem("curentID"), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        // console.log(imageInput);

        if (response.ok) {
            if (imageInput.value) {
                uploadImage(imageInput.files?.[0] as File);
            }
            console.log('Success:', responseData);
        } else {
            console.error('Error:', responseData);
        }
        location.href = "../";
    } catch (error) {
        console.error('Error:', error);
    }
}

if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/"
}

const editaChapter = async (event: Event) => {
    event.preventDefault();
    const novelId = (document.getElementById("novel-select") as HTMLSelectElement).value;
    const chapterNumber = (document.getElementById("chapter_number") as HTMLInputElement).value;
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const content = (document.getElementById("content") as HTMLInputElement).value.replace(/\n/g, '<br>');
    const isShow = (document.getElementById("checkbox1") as HTMLInputElement).checked;
    // alert(1)

    const data = {
        novel_id: novelId,
        chapter_number: chapterNumber,
        title: title,
        content: content,
        is_show: isShow
    };

    try {
        const response = await fetch('http://localhost:3000/api/chapter/' + localStorage.getItem("currentId"), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (response.ok) {
            console.log('Success:', responseData);
            // lastUpdateHandle(novelId, chapterNumber)
            location.href = "../";
        } else {
            console.error('Error:', responseData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};