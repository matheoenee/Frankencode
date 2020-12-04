class Cell {

    constructor(x, y, state) {
        this.x = x;
        this.y = y;
        this.state = state;
    }

    cellLocation(g) {
        if (this.x == 0) {
            if (this.y == 0) {
                return "top left corner";
            }
            if (this.y == g.grid[0].length - 1) {
                return "top right conrner";
            }
            return "top row";
        }

        if (this.x == g.grid.length - 1) {
            if (this.y == 0) {
                return "bottom left corner";
            }
            if (this.y == g.grid[0].length - 1) {
                return "bottom right conrner";
            }
            return "bottom row";
        }

        if (this.y == 0) {
            return "left column";
        }
        if (this.y == g.grid[0].length - 1) {
            return "right column";
        }

        return "center";
    }

    cellsAround(g) {
        var cells = 0;
        var min_row, max_row, min_col, max_col;
        switch (this.cellLocation(g)) {
            case "center":
                min_row = this.x - 1;
                max_row = this.x + 1;
                min_col = this.y - 1;
                max_col = this.y + 1;
                break;

            case "top row":
                min_row = this.x;
                max_row = this.x + 1;
                min_col = this.y - 1;
                max_col = this.y + 1;
                break;

            case "bottom row":
                min_row = this.x - 1;
                max_row = this.x;
                min_col = this.y - 1;
                max_col = this.y + 1;
                break;

            case "right column":
                min_row = this.x - 1;
                max_row = this.x + 1;
                min_col = this.y - 1;
                max_col = this.y;
                break;

            case "left column":
                min_row = this.x - 1;
                max_row = this.x + 1;
                min_col = this.y;
                max_col = this.y + 1;
                break;

            case "right top corner":
                min_row = this.x;
                max_row = this.x + 1;
                min_col = this.y - 1;
                max_col = this.y;
                break;

            case "left top corner":
                min_row = this.x;
                max_row = this.x + 1;
                min_col = this.y;
                max_col = this.y + 1;
                break;

            case "bottom right corner":
                min_row = this.x - 1;
                max_row = this.x;
                min_col = this.y - 1;
                max_col = this.y;
                break;

            case "bottom left corner":
                min_row = this.x - 1;
                max_row = this.x;
                min_col = this.y;
                max_col = this.y + 1;
                break;

            default:
                min_row = this.x;
                max_row = this.x;
                min_col = this.y;
                max_col = this.y;
                break;

        }
        for (let i = min_row; i <= max_row; i++) {
            for (let j = min_col; j <= max_col; j++) {
                if (!(i == this.x && j == this.y)) {
                    if (g.grid[i][j].state == "alive")
                        cells++;
                }
            }
        }
        return cells;
    }

    will_die(g) {
        var cells = this.cellsAround(g);
        return (cells == 2 || cells == 3) ? false : true;
    }

    will_born(g) {
        var cells = this.cellsAround(g);
        return (cells == 3) ? true : false;
    }

    nextState(g) {
        if (this.state == "alive") {
            if (this.will_die(g)) {
                return "dead";
            } else {
                return "alive";
            }
        }

        if (this.state == "dead") {
            if (this.will_born(g)) {
                return "alive";
            } else {
                return "dead";
            }
        }
    }
}

class Grid {

    constructor(chance) {
        this.cellSize = 10;
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        var container = document.getElementById("container");
        var dimension = container.getBoundingClientRect();

        ctx.canvas.width = Math.floor(0.8 * window.innerWidth);
        ctx.canvas.height = 600;

        var positionInfo = c.getBoundingClientRect();

        this.row = Math.floor(positionInfo.height / this.cellSize);
        this.col = Math.floor(positionInfo.width / this.cellSize);

        this.grid = new Array(this.row);
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(this.col);
            for (let j = 0; j < this.grid[0].length; j++) {
                var rand = Math.random();
                if (rand > chance) {
                    this.grid[i][j] = new Cell(i, j, "dead");
                } else {
                    this.grid[i][j] = new Cell(i, j, "alive");
                }
            }
        }
    }

    display() {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");

        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                var alive_cells = ["#888844", "#99994d", "#aaaa55"];
                var dead_cells = ["#0099ff", "#1aa3ff", "#33adff"];

                if (this.grid[i][j].state == "alive") {
                    var color = alive_cells[Math.floor(Math.random() * 3)];
                } else {
                    var color = dead_cells[Math.floor(Math.random() * 3)];
                }
                ctx.beginPath();
                ctx.rect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize);
                ctx.fillStyle = color;
                ctx.fill();
            }
        }
    }

    bornCell(x, y) {
        this.grid[x][y].state = "alive";
    }

    dieCell(x, y) {
        thsi.grid[i][j].state = "dead";
    }

    bornGlider(x, y) {
        this.bornCell(x, y);
        this.bornCell(x - 1, y - 1);
        this.bornCell(x, y + 1);
        this.bornCell(x + 1, y);
        this.bornCell(x + 1, y - 1);
    }

    bornSquare(x, y) {
        this.bornCell(x, y);
        this.bornCell(x, y + 1);
        this.bornCell(x + 1, y + 1);
        this.bornCell(x + 1, y);
    }

    bornLine(x, y) {
        this.bornCell(x, y);
        this.bornCell(x, y + 1);
        this.bornCell(x, y - 1);
    }

    bornGunGlider(x, y) {
        this.bornSquare(x, y);
        this.bornSquare(x - 2, y + 34);

        this.bornCell(x, y + 10);
        this.bornCell(x + 1, y + 10);
        this.bornCell(x + 2, y + 10);
        this.bornCell(x + 3, y + 11);
        this.bornCell(x + 4, y + 12);
        this.bornCell(x + 4, y + 13);
        this.bornCell(x - 1, y + 11);
        this.bornCell(x - 2, y + 12);
        this.bornCell(x - 2, y + 13);

        this.bornCell(x + 1, y + 14);
        this.bornCell(x + 1, y + 16);
        this.bornCell(x + 1, y + 17);
        this.bornCell(x, y + 16);
        this.bornCell(x + 2, y + 16);
        this.bornCell(x + 3, y + 15);
        this.bornCell(x - 1, y + 15);

        this.bornSquare(x - 2, y + 20);
        this.bornSquare(x - 1, y + 20);
        this.bornCell(x + 1, y + 22);
        this.bornCell(x - 3, y + 22);
        this.bornCell(x - 3, y + 24);
        this.bornCell(x - 4, y + 24);
        this.bornCell(x + 1, y + 24);
        this.bornCell(x + 2, y + 24);

    }

    bornSpaceship(x, y) {
        this.bornSquare(x - 1, y - 1);
        this.bornSquare(x, y);
        this.bornSquare(x, y + 2);
        this.bornLine(x + 2, y + 1);
        this.bornCell(x + 1, y - 1);
        this.bornCell(x, y - 2);
        this.dieCell(x, y);
    }

    next() {
        var next_grid = new Array(this.grid.length);
        for (let i = 0; i < this.grid.length; i++) {
            next_grid[i] = new Array(this.grid[0].length);
            for (let j = 0; j < this.grid[0].length; j++) {
                var c = this.grid[i][j].nextState(g);
                next_grid[i][j] = new Cell(i, j, c);
            }
        }
        this.grid = next_grid;
    }
}

var generation = 0;
var click_patern = 'g';
var g = new Grid(0);
g.display();

function blank() {
    g = new Grid(0);
    g.display();
}

function random() {
    g = new Grid(0.2);
    g.display();
}

function auto() {
    function loop() {
        g.next();
        g.display();
    }
    setInterval(loop, 100);
}

function next_step() {
    g.next();
    g.display();
}

function patern(c) {
    click_patern = c;
}


window.addEventListener("resize", () => {
    g = new Grid(0);
})

function insertPatern(event) {
    const el = document.getElementById("myCanvas");
    var rect = el.getBoundingClientRect();

    var col = Math.floor((event.pageX - rect.left) / 10);
    var row = Math.floor((event.pageY - rect.top) / 10);
    switch (click_patern) {
        case "g":
            g.bornGlider(row, col);
            break;
        case "c":
            g.bornCell(row, col);
            break;
        case "l":
            g.bornLine(row, col);
            break;
        case "ss":
            g.bornSpaceship(row, col);
            break;
        case "gg":
            g.bornGunGlider(row, col);
            break;
        default:
            g.bornCell(row, col);
            break;
    }
    g.display();
}

const c = document.getElementById("myCanvas");
c.addEventListener("click", insertPatern);