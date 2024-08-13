let novelList;

fetch("http://localhost:3000/api/novel")
    .then(res => res.json())
    .then(data => {
        novelList = data;
        loadNovelSelect(novelList)
    })

const novelHtml = (title, id) => {
    return `<option value="${id}">${title}</option>`;
}

const loadNovelSelect = (data) => {
    const element = document.querySelector("#novel-select")
    data.forEach(item => {
        // console.log(item);
        element.innerHTML += novelHtml(item.name, item._id);
    });
}