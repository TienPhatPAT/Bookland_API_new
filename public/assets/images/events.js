setTimeout(() => {
    var myElements = []

    if (document.querySelectorAll('.story-item')) {
        myElements.push(document.querySelectorAll('.story-item'))
    }

    if (document.querySelectorAll('.story-item-no-image')) {
        myElements.push(document.querySelectorAll('.story-item-no-image'))
    }

    if (document.querySelectorAll('.story-item-full')) {
        myElements.push(document.querySelectorAll('.story-item-full'))
    }

    // console.log(myElements);
    myElements.forEach((item) => {
        item.forEach((item1) => {
            item1.addEventListener('mouseenter', function () {
                // console.log(item1.id);
                localStorage.setItem("currentNovel", item1.id);
            });
        })
    })
}, 200)

