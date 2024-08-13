interface CategoryData {
    title: string;
    type: string;
    priority: string;
    is_show: boolean;
    created_date: string;
}

interface UserData {
    fullname: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    address: string;
    role: string;
    status: string;
    created_date: string;
    google_id: string | null;
    facebook_id: string | null;
}

interface NovelData {
    name: string;
    description: string;
    director: string;
    image: string;
    status: boolean;
    total_chapter: string;
    newest_chapter: number;
    total_view: number;
    created_date: string;
    last_update: string;
    view: number;
    category_id: string[];
}

function extractFilenameAdd(filePath: string): string {
    const pathArray = filePath.split('\\');
    return pathArray[pathArray.length - 1];
}

async function uploadImageAdd(imageFile: File) {
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

const addnewCategory = async (event: Event) => {
    event.preventDefault();

    const title = (document.getElementById("name") as HTMLInputElement).value;
    const type = (document.getElementById("exampleSelect") as HTMLSelectElement).value;
    const priority = (document.getElementById("number") as HTMLInputElement).value;
    const isShow = (document.getElementById("checkbox1") as HTMLInputElement).checked;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const data: CategoryData = {
        title: title,
        type: type,
        priority: priority,
        is_show: isShow,
        created_date: formattedDate,
    };

    try {
        const response = await fetch('http://localhost:3000/api/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (response.ok) {
            location.href = "../";
            console.log('Success:', responseData);
        } else {
            console.error('Error:', responseData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const addnewUser = async (event: Event) => {
    event.preventDefault();

    const fullname = (document.getElementById("fullname") as HTMLInputElement).value;
    const phone = (document.getElementById("phone") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
    const address = (document.getElementById("address") as HTMLInputElement).value;
    const isAdmin = (document.getElementById("isAdmin") as HTMLInputElement).checked ? "admin" : "user";
    const isActive = (document.getElementById("isActive") as HTMLInputElement).checked ? "active" : "inactive";

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const data: UserData = {
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
        const response = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (response.ok) {
            location.href = "../";
            console.log('Success:', responseData);
        } else {
            console.error('Error:', responseData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const addnewNovel = async (event: Event) => {
    event.preventDefault();

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

    const data: NovelData = {
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
        const response = await fetch('http://localhost:3000/api/novel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        // console.log(imageInput);

        if (response.ok) {
            uploadImageAdd(imageInput.files?.[0] as File);
            console.log('Success:', responseData);
        } else {
            console.error('Error:', responseData);
        }
        location.href = "../";
    } catch (error) {
        console.error('Error:', error);
    }
};

const addnewChapter = async (event: Event) => {
    event.preventDefault();
    const novelId = (document.getElementById("novel-select") as HTMLSelectElement).value;
    const chapterNumber = (document.getElementById("chapter_number") as HTMLInputElement).value;
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const content = (document.getElementById("content") as HTMLInputElement).value.replace(/\n/g, '<br>');
    const isShow = (document.getElementById("checkbox1") as HTMLInputElement).checked;
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
        const response = await fetch('http://localhost:3000/api/chapter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (response.ok) {
            console.log('Success:', responseData);
            lastUpdateHandle(novelId, chapterNumber)
        } else {
            console.error('Error:', responseData);
            location.href = "../";
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const lastUpdateHandle = (idNovel, chapterNumber) => {
    fetch(`http://localhost:3000/api/novel?_id=${idNovel}`)
        .then(res => res.json())
        .then(data => {
            // console.log(`http://localhost:3000/api/novel?_id=${idNovel}`);
            lastUpdate(idNovel, data[0].total_chapter, chapterNumber)
        });
}

const lastUpdate = (idNovel, totalChapter, chapterNumber) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const newestChapter = chapterNumber;
    if (totalChapter < newestChapter) {
        totalChapter = newestChapter
    }
    const data = {
        last_update: formattedDate,
        total_chapter: totalChapter,
        newest_chapter: newestChapter
    }
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
}

if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/"
}