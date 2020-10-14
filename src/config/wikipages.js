class WikiPages {
    constructor() {
        this.category = "userdirectory";
        this.subcat = {
            A: "A",
            B: "B",
            C: "C",
            D: "D",
            E: "E",
            F: "F",
            G: "G",
            H: "H",
            I: "I",
            J: "J",
            K: "K",
            L: "L",
            M: "M",
            N: "N",
            O: "O",
            P: "P",
            Q: "Q",
            R: "R",
            S: "S",
            T: "T",
            U: "U",
            V: "V",
            W: "W",
            X: "X",
            Y: "Y",
            Z: "Z",
            ETC: "etc"
        }
        this.list = this.generateList()
    }
    generateList() {
        const arr = new Array();
        for (const [k, v] of Object.entries(this.subcat)) {
            arr.push(v)

        }
        return arr;
    }
}

module.exports = {
    WikiPages
}