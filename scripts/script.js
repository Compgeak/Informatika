function loadMenuOnLoad(currentDropdown, imagePath) {
    addOnContentLoaded(function () {
        let headerTag = document.createElement('header');
        headerTag.innerHTML = headerHtml;

        let timeElement = document.createElement("div");
        timeElement.classList.add("time");
        startTimerDisplay(timeElement);
        headerTag.getElementsByTagName("ul")[0].appendChild(timeElement);

        document.body.insertBefore(headerTag, document.body.childNodes[0]);

        if (imagePath != null) {
            let headerImageDiv = document.createElement("div");
            headerImageDiv.id = "header-image";
            let headerImage = document.createElement("img");
            headerImage.src = imagePath;
            headerImage.style = "width:100%";
            headerImageDiv.appendChild(headerImage);
            document.body.insertBefore(headerImageDiv, headerTag);
        }
        
        if (!setCurrentMenuItem(currentDropdown)) {
            console.error("ELEMENT " + currentDropdown + " NOT FOUND!");
        }

        if (typeof footerHtml !== 'undefined') {
            let footerTag = document.createElement('footer');
            footerTag.innerHTML = footerHtml;
            document.body.appendChild(footerTag);
        }
    });
}

function addOnContentLoaded(fn) {
    document.addEventListener('DOMContentLoaded', fn, false);
}

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

async function startTimerDisplay(element) {
    while (true)
    {
        let d = new Date();
        months = d.getMonth() < 9 ? '0'+ (d.getMonth() + 1) : d.getMonth() + 1;
        days = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate();
        hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
        minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
        seconds = d.getSeconds().toString().length == 1 ? '0' + d.getSeconds() : d.getSeconds();
        element.innerHTML = d.getFullYear() + ":" + months + ":" + days + " " + hours + ":" + minutes + ":" + seconds;
        await sleep(100);
    }
}

function setCurrentMenuItem(currentMenuItem) {
    currentMenuItem = currentMenuItem.replace(/&/g, "&amp;");
    let currentMenuItems = currentMenuItem.split('/');
    if (currentMenuItems.length < 1 || currentMenuItems.length > 3) return false;

    let menuBar = document.getElementById("menu");
    if (menu == null) return false;
    
    for (let columnIndex = 0; columnIndex < menuBar.children.length; columnIndex++) {
        let column = menuBar.children[columnIndex];
        if (column.tagName != "LI") continue;
        for (let rowIndex = 0; rowIndex < column.children.length; rowIndex++) {
            let columnElement = column.children[rowIndex];
            switch (columnElement.tagName) {
                case "A":
                    if (currentMenuItems.length != 1) continue;
                    if (columnElement.innerHTML == currentMenuItems[0]) {
                        column.classList.add("current");
                        return true;
                    }

                case "UL":
                    if (!"dropdown" in columnElement.classList) continue;
                    for (let rowElementIndex = 0; rowElementIndex < columnElement.children.length; rowElementIndex++) {
                        let dropdownItem = columnElement.children[rowElementIndex];
                        if (dropdownItem.tagName != "LI") continue;
                        for (let dropdownSubitemIndex = 0; dropdownSubitemIndex < dropdownItem.children.length; dropdownSubitemIndex++) {
                            let dropdownElement = dropdownItem.children[dropdownSubitemIndex];
                            switch (dropdownElement.tagName) {
                                case "A":
                                    if (currentMenuItems.length != 2) continue;
                                    if (dropdownElement.innerHTML == currentMenuItems[1]) {
                                        column.classList.add("current");
                                        // columnElement.classList.add("current");
                                        return true;
                                    }

                                case "UL":
                                    if (!"dropdown-content" in dropdownElement.classList) continue;
                                    for (let secondaryRowIndex = 0; secondaryRowIndex < dropdownElement.children.length; secondaryRowIndex++) {
                                        let dropdownContentItem = dropdownElement.children[secondaryRowIndex];
                                        if (dropdownContentItem.tagName != "LI") continue;
                                        for (let dropdownContentIndex = 0; dropdownContentIndex < dropdownContentItem.children.length; dropdownContentIndex++) {
                                            let dropdownContent = dropdownContentItem.children[dropdownContentIndex];
                                            if (dropdownContent.tagName != "A") continue;
                                            if (currentMenuItems.length != 3) continue;
                                            if (dropdownContent.innerHTML == currentMenuItems[2]) {
                                                column.classList.add("current");
                                                // columnElement.classList.add("current");
                                                // dropdownElement.classList.add("current");
                                                return true;
                                            }
                                        }
                                    }
                            }
                        }
                    }


            }
        }
    };

    return false;
}