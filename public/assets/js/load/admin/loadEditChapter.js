fetch(`http://localhost:3000/api/chapter?_id=${localStorage.getItem("currentId")}`)
    .then(res => res.json())
    .then(data => loadEditDataChapter(data[0]));
// .then(data => console.log(data));
function loadEditDataChapter(data) {
    // Lấy các phần tử trong form
    var novel = document.querySelectorAll("#novel-select option");
    var chapterTitle = document.getElementById("title");
    var chapterNumber = document.getElementById("chapter_number");
    var content = document.getElementById("content");
    var isShow = document.getElementById("checkbox1");
    document.querySelector("#novel-select").innerHTML = "";
    const tempNovel = [];
    novel.forEach((item) => {
        if (item.value !== data.novel_id) {
            tempNovel.push(item);
            document.querySelector("#novel-select").appendChild(item);
        }
        else {
            const newOption = document.createElement("option");
            newOption.value = item.value;
            newOption.textContent = item.textContent;
            newOption.selected = true;
            document.querySelector("#novel-select").appendChild(newOption);
        }
    });
    chapterTitle.value = data.title;
    content.value = data.content.replaceAll("<br>", "\n");
    chapterNumber.value = data.chapter_number;
    isShow.value = data.isShow || false;
}
