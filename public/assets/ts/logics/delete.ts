const deleteItem = async (id: number, url: string = "category"): Promise<void> => {
    const apiUrl = `http://localhost:3000/api/${url}/` + id;

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Nếu cần thêm các header khác, thêm vào đây
            },
            // Nếu có body dữ liệu cần gửi, thêm vào đây
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);
        location.reload();
    } catch (error) {
        console.error('Error:', error);
        // Xử lý lỗi nếu có
    }
};

const deleteUser = (id: number): void => {
    deleteItem(id, "user");
};

const deleteChapter = (id: number): void => {
    deleteItem(id, "chapter");
};

const deleteNovel = (id: number): void => {
    deleteItem(id, "novel");
};

if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/"
}