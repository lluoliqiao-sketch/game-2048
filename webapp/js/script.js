var board;
var score = 0;
var rows = 4;
var columns = 4;
let askAiBtn, sidebar, closeSidebarBtn;
var stopGame = false;

window.onload = function() {
    setGame();
    askAiBtn = document.getElementById("toggleSidebar");
    sidebar = document.getElementById("sidebar");
    oneClickAskBtn = document.getElementById("oneClickAskBtn");

    // sidebar toggle
    askAiBtn.onclick = function() {
        if (sidebar.classList.contains("hidden")) {
            sidebar.classList.remove("hidden");
        } else {
            sidebar.classList.add("hidden");
        }
    }

    // close sidebar
    closeSidebarBtn = document.getElementById("closeSidebar");
    closeSidebarBtn.onclick = function() {
        if (!sidebar.classList.contains("hidden")) {
            sidebar.classList.add("hidden");
        }
    }

    // one click ask
    oneClickAskBtn.addEventListener("click", oneClickAsk);

    // send message in chat
    sendBtn = document.getElementById("sendBtn");
    input = document.getElementById("userInput");
    chatbox = document.getElementById("chatMsg");
    sendBtn.addEventListener("click", sendMsg);
}

async function fetchAnswer(question, useTemplate = true) {
    const url = useTemplate ? "http://localhost:8080/api/assistant/board" : "http://localhost:8080/api/assistant/msg";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: question })
        });
    if (!response.ok) {
        console.log("Response failed:", response);
        return "Error";
    }

    console.log("Response received:", response);
    const result = await response.text();
    console.log(result);
    return result;
    } catch (error) {
        console.error(error.message);
        return "Error";
    }
}

// one click to ask AI button
async function oneClickAsk() {
    // display user message
    createNewUserMsg("One click to get the best move suggestion from AI");

    // display AI response
    let aiResponse = await fetchAnswer(JSON.stringify(board));
    createNewAiMsg(aiResponse);

    // scroll to bottom
    chatbox.scrollTop = chatbox.scrollHeight;
}


// send button
async function sendMsg() {
    let userInput = input.value;
    console.log("User input: ", userInput);
    if (userInput.trim() === "") {
        return;
    }

    // display user message
    createNewUserMsg(userInput);
    // clear input field
    input.value = "";

    // display AI response
    let aiResponse = await fetchAnswer(userInput, false);
    createNewAiMsg(aiResponse);

    // scroll to bottom
    chatbox.scrollTop = chatbox.scrollHeight;
}


function createNewUserMsg(message) {
    const newMsg = `
        <div class="profile user-profile">
            <div class="username user-username">You</div>
            <div class="avatar user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" style="enable-background:new 0 0 64 64" xml:space="preserve">
                    <path style="fill:black" d="M49.864 56.471v-1.1h4.112a.698.698 0 0 0 .696-.759l-1.387-15.925a7.672 7.672 0 0 0-6.901-6.972l-.458-.043V16.691c0-5.819-4.733-10.556-10.556-10.556-5.819 0-10.556 4.737-10.556 10.556v15.03a7.672 7.672 0 0 0-6.862 6.965l-1.387 15.925a.692.692 0 0 0 .692.759h4.371v1.1h-6.029V45.372a.697.697 0 0 0-.699-.695H4.921a.697.697 0 0 0-.699.695v1.565h-.876a2.795 2.795 0 0 0-2.789 2.792v3.083a2.792 2.792 0 0 0 2.789 2.789h.876v.869H0v1.394h64V56.47H49.864zM4.222 54.207h-.876c-.77 0-1.394-.624-1.394-1.394V49.73c0-.77.624-1.394 1.394-1.394h.876v5.871zm9.982 2.264H5.617v-10.4h8.587v10.4zm12.007-39.78c0-5.053 4.109-9.162 9.158-9.162 5.053 0 9.162 4.109 9.162 9.162v14.842l-3.687-.358-.756-3.342c1.529-2.282 2.484-5.674 2.484-9.531a.7.7 0 0 0-.731-.696c-.028 0-2.902.114-4.471-.777-1.607-.912-3.559-3.8-3.58-3.832-.177-.263-.511-.373-.813-.263a.71.71 0 0 0-.461.731c.007.043.099 1.125-.926 2.282-1.125 1.274-2.927 1.888-2.945 1.895a.698.698 0 0 0-.475.66c0 4.162 1.114 7.778 2.856 10.045l-.635 2.828-4.18.408V16.691zM31.7 31.718l.483-2.15c.958.805 2.033 1.267 3.186 1.267 1.32 0 2.544-.6 3.598-1.636l.568 2.519-3.857 7.057h-.124L31.7 31.718zm2.264 7.057h-1.352l-4.574-3.431 2.729-2.42 3.197 5.851zm-.905-22.648a5.115 5.115 0 0 0 .547-1.029c.798 1.004 1.966 2.317 3.073 2.945 1.384.784 3.406.937 4.485.962-.195 5.723-2.768 10.435-5.794 10.435-.082 0-.163-.004-.245-.011-.018-.004-.035-.004-.057-.007a2.47 2.47 0 0 1-.231-.032c-.06-.011-.117-.025-.174-.039h-.004c-2.746-.674-4.964-5.205-5.088-10.574.713-.302 2.072-.983 3.062-2.104.164-.184.306-.365.426-.546zm7.405 16.797 2.732 2.42-4.577 3.431h-1.348l3.193-5.851zm-18.837 8.644v12.408h-3.609l1.32-15.169a6.28 6.28 0 0 1 5.649-5.702l3.903-.383-2.416 2.147a.702.702 0 0 0 .043 1.082l3.772 2.824h-5.872a2.793 2.793 0 0 0-2.79 2.793zm26.842 14.903H23.021V41.568c0-.77.624-1.394 1.394-1.394h22.659c.766 0 1.394.624 1.394 1.394v14.903zm-1.394-17.696h-6.128l3.768-2.824a.705.705 0 0 0 .28-.532.703.703 0 0 0-.234-.55l-2.42-2.147 3.907.383a6.275 6.275 0 0 1 5.645 5.702l1.323 15.169h-3.353V41.568a2.794 2.794 0 0 0-2.788-2.793zm-36.043 1.292-.487-.667a.686.686 0 0 1-.11-.578l.465-1.863-1.355-.341-.465 1.863a2.103 2.103 0 0 0 .337 1.742l.472.642-.082.979-.681.966 1.139.805.784-1.111a2.089 2.089 0 0 0-.017-2.437zm2.788 0-.482-.667a.691.691 0 0 1-.114-.578l.465-1.863-1.352-.341-.465 1.863a2.089 2.089 0 0 0 .337 1.742l.468.642-.077.98-.685.965 1.139.805.788-1.111a2.094 2.094 0 0 0-.022-2.437zm-5.577 0-.487-.667a.702.702 0 0 1-.114-.578l.465-1.863-1.352-.341-.465 1.863a2.089 2.089 0 0 0 .337 1.742l.468.642-.078.979-.683.966 1.143.805.784-1.111a2.1 2.1 0 0 0-.018-2.437z"/>
                    <path style="fill:#eee4da" d="M5.617 46.071h8.587v10.4H5.617z"/>
                    <path style="fill:#eee4da" d="M41.163 19.005c-.195 5.723-2.768 10.435-5.794 10.435-3.062 0-5.663-4.836-5.798-10.663.713-.302 2.072-.983 3.062-2.104a5.207 5.207 0 0 0 .972-1.575c.798 1.004 1.966 2.317 3.073 2.945 1.384.784 3.407.937 4.485.962zM26.516 35.951a.702.702 0 0 1-.043-1.082l2.416-2.147-3.903.383a6.28 6.28 0 0 0-5.649 5.702l-1.32 15.169h3.609V41.568a2.792 2.792 0 0 1 2.789-2.792h5.872l-3.771-2.825zm26.701 18.025-1.323-15.169a6.276 6.276 0 0 0-5.645-5.702l-3.907-.383 2.42 2.147a.703.703 0 0 1 .234.55.709.709 0 0 1-.28.532l-3.768 2.824h6.128a2.795 2.795 0 0 1 2.789 2.792v12.408h3.352z"/>
                    <path style="fill:#eee4da" d="M36.678 18.043c-1.107-.628-2.274-1.941-3.073-2.945a5.12 5.12 0 0 1-.55 1.027c.673.748 1.451 1.491 2.204 1.918 1.384.784 3.406.937 4.485.962-.18 5.269-2.375 9.678-5.084 10.345.233.057.469.09.709.09 3.027 0 5.599-4.712 5.794-10.435-1.078-.025-3.101-.178-4.485-.962z"/>
                </svg>
            </div>
        </div>
        <div class="message user-message">${message}</div>
    `;
    chatbox.insertAdjacentHTML("beforeend", newMsg);
}

function createNewAiMsg(message) {
    const newMsg = `
        <div class="profile ai-profile">
            <div class="avatar ai-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" preserveAspectRatio="xMidYMid meet">
                    <path fill="#282D33" d="M80.481 16.364h-4C76.481 9.546 70.86 4 63.95 4S51.419 9.546 51.419 16.364h-4C47.419 7.341 54.835 0 63.95 0s16.531 7.341 16.531 16.364zM94.637 66.579h-.491v-4h.491c2.122 0 3.849-1.696 3.849-3.781V48.2c0-2.084-1.727-3.78-3.849-3.78h-.491v-4h.491c4.328 0 7.849 3.49 7.849 7.78v10.598c-.001 4.29-3.521 7.781-7.849 7.781zM108.349 128h-4v-14.499c0-5.292-5.049-9.597-11.255-9.597H34.91c-6.208 0-11.259 4.305-11.259 9.597V128h-4v-14.499c0-7.497 6.845-13.597 15.259-13.597h58.184c8.411 0 15.255 6.1 15.255 13.597V128z"/>
                    <path fill="#282D33" d="M64.001 95.973c-17.436 0-31.619-14.03-31.619-31.275V41.276c0-17.244 14.184-31.273 31.619-31.273 17.435 0 31.619 14.029 31.619 31.273v23.421c0 17.245-14.184 31.276-31.619 31.276zm0-81.97c-15.229 0-27.619 12.234-27.619 27.273v23.421c0 15.04 12.39 27.275 27.619 27.275S91.62 79.737 91.62 64.697V41.276c0-15.039-12.39-27.273-27.619-27.273z"/>
                    <path fill="#282D33" d="m36.382 66.736-2.205-.228c-3.421-.353-9.53-3.231-9.53-7.711V48.2c0-4.48 6.11-7.357 9.53-7.709l2.205-.227v26.472zm-4-21.695c-1.968.78-3.735 2.161-3.735 3.159v10.598c0 .998 1.767 2.379 3.735 3.16V45.041zM62.362 109.924h4v4.815h-4zM62.362 120.699h4v4.818h-4z"/>
                    <path fill="#282D33" d="M95.62 48.729H82.096l-4.029-6.896-4.031 6.896H32.382v-7.454c0-17.244 14.184-31.273 31.619-31.273 17.435 0 31.619 14.029 31.619 31.273v7.454zm-11.229-4h7.229v-3.454c0-15.039-12.39-27.273-27.619-27.273S36.382 26.236 36.382 41.275v3.454H71.74l6.328-10.824 6.323 10.824z"/>
                </svg>
            </div>
            <div class="username ai-username">Assistant</div>
        </div>
        <div class="message ai-message">${message}</div>
    `;
    chatbox.insertAdjacentHTML("beforeend", newMsg);
}


function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // create tile element
            // <div id="row-col"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString(); // tile id = r-c
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").appendChild(tile);
        }
    }

    // place two initial tiles of 2
    placeRandomTile(true);
    placeRandomTile(true);
}

// onlyTwo - generate only tile 2 (for starting game)
function placeRandomTile(onlyTwo = false) {
    if (!hasEmptyTile()) {
        console.log("All full, cannot place random tile");
        return;
    }
    let flag = false;
    while (!flag) {
        let r = Math.floor(Math.random() * rows); // int 0-3
        let c = Math.floor(Math.random() * columns); // int 0-3
        if (board[r][c] == 0) { // empty - can insert
            let randomTile = onlyTwo ? 2 : (Math.random() < 0.5 ? 2 : 4);
            board[r][c] = randomTile;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = randomTile == 2 ? "2" : "4";
            tile.classList.add(randomTile == 2 ? "tile2" : "tile4");
            flag = true;
        }
    }
}

function hasEmptyTile() {
    for (r = 0; r < rows; r++) {
        for (c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function updateTile(tile, num) {
    // reset tile
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");

    // add number class and text
    if (num > 0) {
        tile.innerText = num;
        if (num <= 2048) {
            tile.classList.add("tile" + num.toString());
        } else {
            console.error("Unexpected tile number: ", num);
            tile.classList.add("tile2048");
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (stopGame) {
        console.log("Game stopped.");
        return;
    }
    if (e.code == "ArrowLeft") {
        console.log("Sliding left...");
        slideLeft();
        placeRandomTile();
    }
    else if (e.code == "ArrowRight") {
        console.log("Sliding right...");
        slideRight();
        placeRandomTile();
    }
    else if (e.code == "ArrowUp") {
        console.log("Sliding up...");
        slideUp();
        placeRandomTile();
    }
    else if (e.code == "ArrowDown") {
        console.log("Sliding down...");
        slideDown();
        placeRandomTile();
    }

    // update score
    document.getElementById("score").innerText = score;

    // check winning
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 2048) {
                console.log("You win!");
                document.getElementById("status").innerText = "You Win!";
                stopGame = true;
            }
        }
    }

    // check game over
    if (!stopGame && !hasEmptyTile() && checkEndGame()) {
        console.log("Game over...")
        document.getElementById("status").innerText = "Game Over!";
    }
})

// left slide
function slide(row) {
    // remove 0
    row = filterZero(row);

    // slide
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }

    // remove 0
    row = filterZero(row);

    // add 0s back to the end
    while (row.length < columns) {
        row.push(0);
    }

    return row;
}

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        // do slide
        row = slide(row);
        // update board
        board[r] = row;

        // update HTML
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        // reverse and do slide left then reverse back
        row.reverse();
        row = slide(row);
        row.reverse();
        // update board
        board[r] = row;

        // update HTML
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        // transpose and do slide left
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);

        // update board and HTML
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        // transpose and do slide left
        let row = [board[3][c], board[2][c], board[1][c], board[0][c]];
        row = slide(row);
        // update board
        board[0][c] = row[3];
        board[1][c] = row[2];
        board[2][c] = row[1];
        board[3][c] = row[0];

        // update HTML
        for (let r = 0; r < rows; r++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}


function checkEndGame() {
    for (let r = 0; r < rows; r++) {
        // check slide left
        let row = board[r].slice();
        if (canSlide(row)) {
            console.log("Can slide left...");
            return false;
        }

        // check slide right
        row.reverse();
        if (canSlide(row)) {
            console.log("Can slide right...");
            return false;
        }
    }

    for (let c = 0; c < columns; c++) {
        // check slide up
        row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        if (canSlide(row)) {
            console.log("Can slide up...");
            return false;
        }

        // check slide down
        row.reverse
        if (canSlide(row)) {
            console.log("Can slide down...");
            return false;
        }
    }
    return true;
}


function canSlide(row) {
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i+1]) {
            return true;
        }
    }
    return false;
}



