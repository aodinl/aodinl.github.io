let viewportHeight = window.visualViewport.height;
let viewportWidth = window.visualViewport.width;

let rightHalf = document.getElementById("rightHalf");
let rightHalfItem = rightHalf.getElementsByClassName("item");

let leftHalf = document.getElementById("leftHalf");
let leftHalfItem = leftHalf.getElementsByClassName("item");

let gyobi = document.getElementById("gyobi");

let gennkou = document.getElementById('gennkou');

let isTransitioning = false;
let isPanelTranstioning = false;

let leftItemList = [];
let rightItemList = [];

for (let i = 0, m = 0; i < 10; i++) {

    m = 200 - 20* (i + 1);
    leftItemList[i] = [];
    rightItemList[i] = [];

    for (let iinner = 0; iinner < 20; iinner++, m++) {
        leftItemList[i][iinner] = leftHalfItem[m];
        rightItemList[i][iinner] = rightHalfItem[m];
    }
}

let targetList = [];

if (viewportWidth <= 12.5 / 20 * viewportHeight) {
    for (let i = 0; i < 10; i++) {
        targetList[i] = rightItemList[i];
    }
} else {
    for (let i = 0; i < 20; i++) {
        if (i < 10) {
            targetList[i] = rightItemList[i];
        } else {
            targetList[i] = leftItemList[i - 10];
        }
    }
}

for (let i = 0; i < targetList.length; i++) {
    for (let m = 0; m < 20; m++) {
        targetList[i][m].myIdCardNumber = `${i}${m}`;
    }
}

function opacityToZ() {
    this.style.color = 'rgba(0, 0, 0, 0)';
}

function opacityToH() {
    this.style.color = 'rgba(0, 0, 0, 1)';
}

function ireru(mode, txt, href="#", evn= () => {console.log(1)}) {
    if (mode == 'p') {
        this.innerHTML = `<p>${txt}</p>`;
    } else if (mode == 'a'){
        this.innerHTML = `<a href="${href}" target="_blank">${txt}</a>`
    } else {
        this.innerHTML = `<p id='${this.myIdCardNumber}click' class='clickIcon'>${txt}</p>`
        setTimeout(() => {document.getElementById(`${this.myIdCardNumber}click`).addEventListener("click", evn, false);isTransitioning = false}, 2100);
    }

    this.opacityToH();
}

function ketsujyo() {
    if (this.firstElementChild) {
        this.firstElementChild.replaceWith(this.firstElementChild.cloneNode(true));
    }
    this.opacityToZ();
    setTimeout(() => {this.innerHTML = ''}, 2100);
}

HTMLDivElement.prototype.opacityToZ = opacityToZ;
HTMLDivElement.prototype.opacityToH = opacityToH;
HTMLDivElement.prototype.ireru = ireru;
HTMLDivElement.prototype.ketsujyo = ketsujyo;


let page = {
    textX: 1,
    textY: 0,
    rows: 20,
    columns: 0,
    containers: targetList,
    inta: function() {
        this.textX = 1;
        this.textY = 0;
        this.rows = 20;
        this.columns = this.containers.length;
    },
    isFlood: function() {
        if(this.textY == 20 || this.textX == this.columns) {
            return true;
        } else {
            return false;
        }
    },
    freshPage: function(mode, time = 1000) {
        if (mode == 'row') {
            for (let i = 0; i < this.rows; i++) {
                setTimeout((row) => {this.freshRow(row)}, i * time, i);
            }
        } else {
            for (let i = 1; i < this.columns; i++) {
                setTimeout((columns) => {this.freshColumns(columns)}, i * time, i);
            }
        }
        this.textX = 1;
        this.textY = 0;
    },
    freshRow: function(row) {
        for (let i = 1; i < this.columns; i++) {
            this.containers[i][row].ketsujyo();
        }
    },
    freshColumns: function(columns) {
        for (let i = 0; i < 20; i++) {
            this.containers[columns][i].ketsujyo();
        }
    },
    getTxtIN: function(txt) {
        this.containers[this.textX][this.textY].ireru('p', txt);
        this.txtNext();
    },
    txtNext: function() {
        if (this.textX == this.columns - 1 && this.textY == 19) {
            this.textY = 20;
        } else if (this.textY == 19) {
            this.textX = this.textX + 1;
            this.textY = 0;
        } else {
            this.textY = this.textY + 1;
        }
    },
    breakLine() {
        if (this.textX == 1 && this.textY == 0) {
            this.textY = 1;
        } else {
            this.textX = this.textX + 1;
            this.textY = 1;
        }
    },
    getTitleIn: function(text, startPosition, even) {
        let tempLength = text.length;
        for (let i = 0; i < tempLength; i++) {
            this.containers[0][startPosition + i].ireru('click', text[i], '#', even);
        }
    },
    getPanelIn: function(mode, txt, column, startPosition, href = '#', even = () => {console.log(2)}) {
        let tempLength = txt.length;
        for (let i = 0; i < tempLength; i++) {
            this.containers[column][startPosition + i].ireru(mode, txt[i], href, even);
        }
    }
}

let SCENproject = {
    pointer: 0,
    length: 0,
    SCEN: SCEN,
    inta: function() {
        this.pointer = 0;
        this.length = this.SCEN.length;
    },
    txtGetout: function() {
        let tempTxt = this.SCEN[this.pointer];
        this.nextTxt();
        return tempTxt;
    },
    nextTxt: function() {
        if (this.pointer < this.length - 1) {
            this.pointer++;
        } else {
            this.pointer = 0;
        }
    }
}

let txtManipulator = {
    pointer: 0,
    length: 0,
    content: '',
    timeID: 0,
    resultFunction: null,
    isRunning: true,
    freshPage: function() {
        page.freshPage('column');
        setTimeout(() => {this.start()}, (page.columns + 1) * 1000);
    },
    inta: function() {
        this.content = SCENproject.txtGetout();
        this.pointer = 0;
        this.length = this.content.length;
    },
    cancel: function(resultFunction) {
        this.isRunning = false;
        this.resultFunction = resultFunction;
    },
    start: function() {
        if (this.isRunning) {
            if (this.pointer == 0) {
                page.breakLine();
            }
            if (this.pointer < this.length) {
                if (page.isFlood()) {
                    this.freshPage();
                } else {
                    page.getTxtIN(this.content[this.pointer]);
                    this.timeID = setTimeout(() => {this.start()}, 1000);
                    this.pointer++;
                }
            } else {
                this.inta();
                this.start();
            }
        } else {
            isTransitioning = false;
            this.resultFunction();
        }
    }
}

let titleMani = {
    content: [],
    pointer: 0,
    length: 0,
    before: 'ーー',
    after: '⋯⋯',
    beforeEve: null,
    titleEve: null,
    afterEve: null,
    inta: function(mycontent, myBeforeEve, myTitleEve, myAfterEve) {
        this.content = mycontent;
        this.beforeEve = myBeforeEve;
        this.titleEve = myTitleEve;
        this.afterEve = myAfterEve;
        this.pointer = 0;
        this.length = this.content.length;
        this.getTextIn();
    },
    getTextIn: function(delayTime = 2200) {
        let tempLength = this.content[this.pointer].length;
        let titleStart = Math.floor((20 - tempLength) / 2);
        let beforeStart = Math.floor((titleStart - 2) / 2);
        let afterStart = Math.ceil((20 - tempLength - titleStart - 2) / 2) + titleStart + tempLength;
        page.freshColumns(0);
        setTimeout(() => {
            page.getTitleIn(this.before, beforeStart, this.beforeEve);
            page.getTitleIn(this.content[this.pointer], titleStart, this.titleEve[this.pointer]);
            page.getTitleIn(this.after, afterStart, this.afterEve);
        }, delayTime);
    },
    lastOne: function() {
        if (this.pointer == 0) {
            this.pointer = this.length - 1;
        } else {
            this.pointer = this.pointer - 1;
        }

        this.getTextIn();
    },
    nextOne: function() {
        if (this.pointer < this.length - 1) {
            this.pointer = this.pointer + 1;
        } else {
            this.pointer = 0;
        }

        this.getTextIn();
    }
}

function beforeEve() {
    if (!isTransitioning) {
        titleMani.lastOne();
    }
}

function afterEve() {
    if (!isTransitioning) {
        titleMani.nextOne();
    }
}


let bookmarkPanel = {
    list: [],
    pointer: 0,
    onceNumber: 0,
    length: 0,
    beforeEve: null,
    afterEve: null,
    inta: function(mylist, myBeforeEve, myAfterEve) {
        this.list = mylist;
        if (targetList.length == 10) {
            this.onceNumber = 2;
        } else {
            this.onceNumber = 7;
        }
        this.pointer = 0;
        this.length = this.list.length;
        this.beforeEve = myBeforeEve;
        this.afterEve = myAfterEve;
    },
    nextOne: function() {
        if(this.pointer < this.length - 1) {
            this.pointer = this.pointer + 1;
        } else {
            this.pointer = 0;
        }
    },
    lastOne: function() {
        if(this.pointer == 0) {
            this.pointer = this.length - 1;
        } else {
            this.pointer = this.pointer - 1;
        }
    },
    nextThree: function() {
        for (let i = 0; i < this.onceNumber; i++) {
            page.freshColumns(4 + 2 * i);
        }
        setTimeout(() => {this.renderPanel();
                          isPanelTranstioning = false;}, 2110);
    },
    lastThree: function() {
        for (let i = 0; i < this.onceNumber; i++) {
            page.freshColumns(4 + 2 * i);
        }
        setTimeout(() => {this.renderPanel();
                          isPanelTranstioning = false;}, 2110);
    },
    renderPanel: function(jyunn = true) {
        for(let i = 0; i < this.onceNumber; i++) {
            let tempLength = this.list[this.pointer].meisyou.length;
            let startPosition = Math.floor((20 - tempLength) / 2);
            page.getPanelIn('a', this.list[this.pointer].meisyou, 4 + 2 * i, startPosition, this.list[this.pointer].website);
            if (jyunn) {
                this.nextOne();
            } else {
                this.lastOne();
            }
        }
    },
    renderArc: function() {
        let before = 'ーー';
        let after = '⋯⋯';
        page.getPanelIn('click', before, 2, 9, '#', this.beforeEve);
        page.getPanelIn('click', after, targetList.length - 2, 9, '#', this.afterEve);
    }
};


function panelBeforeEve() {
    if (!isPanelTranstioning) {
        isPanelTranstioning = true;
        bookmarkPanel.nextThree();
    }
}

function panelAfterEve() {
    if (!isPanelTranstioning) {
        isPanelTranstioning = true;
        bookmarkPanel.lastThree();
    }
}





let irokunnrennPanel = {
    list: [],
    pointer: 0,
    onceNumber: 0,
    length: 0,
    beforeEve: null,
    afterEve: null,
    inta: function(mylist, myBeforeEve, myAfterEve) {
        this.list = mylist;
        if (targetList.length == 10) {
            this.onceNumber = 2;
        } else {
            this.onceNumber = 7;
        }
        this.pointer = 0;
        this.length = this.list.length;
        this.beforeEve = myBeforeEve;
        this.afterEve = myAfterEve;
    },
    nextOne: function() {
        if(this.pointer < this.length - 1) {
            this.pointer = this.pointer + 1;
        } else {
            this.pointer = 0;
        }
    },
    lastOne: function() {
        if(this.pointer == 0) {
            this.pointer = this.length - 1;
        } else {
            this.pointer = this.pointer - 1;
        }
    },
    nextThree: function() {
        for (let i = 0; i < this.onceNumber; i++) {
            page.freshColumns(4 + 2 * i);
        }
        setTimeout(() => {this.renderPanel();
                          isPanelTranstioning = false;}, 2110);
    },
    lastThree: function() {
        for (let i = 0; i < this.onceNumber; i++) {
            page.freshColumns(4 + 2 * i);
        }
        setTimeout(() => {this.renderPanel();
                          isPanelTranstioning = false;}, 2110);
    },
    renderPanel: function(jyunn = true) {
        for(let i = 0; i < this.onceNumber; i++) {
            let tempLength = this.list[this.pointer].meisyou.length;
            let startPosition = Math.floor((20 - tempLength) / 2);
            page.getPanelIn('a', this.list[this.pointer].meisyou, 4 + 2 * i, startPosition, this.list[this.pointer].website);
            if (jyunn) {
                this.nextOne();
            } else {
                this.lastOne();
            }
        }
    },
    renderArc: function() {
        let before = 'ーー';
        let after = '⋯⋯';
        page.getPanelIn('click', before, 2, 9, '#', this.beforeEve);
        page.getPanelIn('click', after, targetList.length - 2, 9, '#', this.afterEve);
    }
};


function iroPanelBeforeEve() {
    if (!isPanelTranstioning) {
        isPanelTranstioning = true;
        irokunnrennPanel.nextThree();
    }
}

function iroPanelAfterEve() {
    if (!isPanelTranstioning) {
        isPanelTranstioning = true;
        irokunnrennPanel.lastThree();
    }
}







function honn() {
    if(!isTransitioning && !txtManipulator.isRunning) {
        isTransitioning = true;
        page.freshPage('column', 0);
        setTimeout(() => {
            txtManipulator.isRunning = true;
            txtManipulator.start();
            isTransitioning = false;
        }, 2200);
    }
}

function bookmark() {
    if(!isTransitioning) {
        isTransitioning = true;
        if (txtManipulator.isRunning) {
            txtManipulator.cancel(bookmark);
        } else {
            page.freshPage('column', 0);
            setTimeout(() => {bookmarkPanel.renderPanel();
                              bookmarkPanel.renderArc();}, 2200);
        }
    }
}

function irokunnrenn() {
    if(!isTransitioning) {
        isTransitioning = true;
        if (txtManipulator.isRunning) {
            txtManipulator.cancel(irokunnrenn);
        } else {
            page.freshPage('column', 0);
            setTimeout(() => {irokunnrennPanel.renderPanel();
                              irokunnrennPanel.renderArc();}, 2200);
        }
    }
}

page.inta();
SCENproject.inta();
txtManipulator.inta();
bookmarkPanel.inta(bookmarkList, panelBeforeEve, panelAfterEve);
irokunnrennPanel.inta(irokunnrennList, iroPanelBeforeEve, iroPanelAfterEve);
titleMani.inta(allTitle, beforeEve, [honn, bookmark, irokunnrenn], afterEve);
txtManipulator.start();