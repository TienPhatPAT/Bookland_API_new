var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const deleteItem = (id, url = "category") => __awaiter(this, void 0, void 0, function* () {
    const apiUrl = `http://localhost:3000/api/${url}/` + id;
    try {
        const response = yield fetch(apiUrl, {
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
        const data = yield response.json();
        console.log('Success:', data);
        location.reload();
    }
    catch (error) {
        console.error('Error:', error);
        // Xử lý lỗi nếu có
    }
});
const deleteUser = (id) => {
    deleteItem(id, "user");
};
const deleteChapter = (id) => {
    deleteItem(id, "chapter");
};
const deleteNovel = (id) => {
    deleteItem(id, "novel");
};
if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/";
}
