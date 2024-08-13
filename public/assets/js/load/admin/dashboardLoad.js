fetch("http://localhost:3000/api/user")
    .then(res => res.json())
    .then(data => {
    loadStatisticValue(data.length, "#statistic-user");
});
fetch("http://localhost:3000/api/novel")
    .then(res => res.json())
    .then(data => {
    loadStatisticValue(data.length, "#statistic-novel");
});
fetch("http://localhost:3000/api/chapter")
    .then(res => res.json())
    .then(data => {
    loadStatisticValue(data.length, "#statistic-chapter");
});
fetch("http://localhost:3000/api/chapter?limit=10&offset=0")
    .then(res => res.json())
    .then(data => {
    loadNewChapterTable(data);
});
const loadStatisticValue = (num, element) => {
    document.querySelector(element).innerHTML = num;
    // document.querySelector(element).innerHTML = num + " <small>(+0)</small>"
};
function formatTimeDifference(timestamp) {
    const postedTime = new Date(timestamp);
    const currentTime = new Date();
    const timeDifference = currentTime - postedTime;
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
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year.padStart(2, "0")}`;
    }
}
const loadNewChapterTable = (data) => {
    const element = document.querySelector("#dashboard-table");
    console.log(data);
    let html = "";
    data.forEach((item, index) => {
        html += `
        <tr>
            <td>Chap ${item.chapter_number}
            </td>
            <td id="novel-name-${index}" class="fw-600"></td>`;
        if (item.is_show)
            html += `<td><span class="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c rounded-pill">active</span>`;
        else
            html += `<td><span class="badge bgc-red-50 c-red-700 p-10 lh-0 tt-c rounded-pill">inactive</span>`;
        html += `</td>
            <td>${formatTimeDifference(item.created_date)}</td>
        </tr>`;
        fetch("http://localhost:3000/api/novel?_id=" + item.novel_id)
            .then(res => res.json())
            .then(data => loadNovelNameDashboard(data[0].name, `#novel-name-${index}`));
    });
    element.innerHTML = html;
};
const loadNovelNameDashboard = (title, element) => {
    document.querySelector(element).textContent = title;
};
// export { }
if (!localStorage.getItem("userId") || localStorage.getItem("role")) {
    location.href = "/";
}
