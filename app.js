const fs = require("fs");
const readline = require("readline");
const translate = require("translate");

async function readFile() {
    const file = fs.createReadStream("files/input.txt");
    const rl1 = readline.createInterface({ //Input Stream Reader
        input: file,
        crlfDelay: Infinity
    });

    let logger1 = fs.createWriteStream("files/outputJP.txt", { //Output Stream Writer
        flags: "a" //append
    });

    for await (const ln of rl1) {
        let content = "";
        if ((ln) && ln.includes("size")) { //Whether it includes text
            let isName = ln.includes("name"); // bool is Character name
            let name = ln.substring(ln.indexOf(">") + 1, ln.lastIndexOf("<")); //Text beautifying
            if (name.includes("{USER}")) //Replaces personal user local variable name by general MC name
                name = name.replace("{USER}", "MC");

            if (isName) //Name formatting
                name = "[" + name + "]"
            name += "\n"

            name = name.replace(/\\n/g," "); //Line breaks removal

            if (name)
                logger1.write(name + "\n"); //Line end break addition

            name = await translate(name, { from: "ja", to: "en"}); //Line translation (Can be replaced by any other language supported by the API)
            name = name.charAt(0).toUpperCase() + name.slice(1); //Capitalizing

            content = name;
            
            content += "\n";
            if (content.includes("USER"))
                content = content.replace("{USER}", "MC");
            content = content.replace(/\\n/g," ");
        }
        let logger2 = fs.createWriteStream("files/outputEN.txt", {
            flags: "a" //append
        });

        if (content)
            logger2.write(content + "\n");
    }
    
    const rl2 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl2.question("Done! Exit? (Y/N)\n", (res) => {
        if (res != "Y" && res != "y")
            readFile();
        else
            process.exit(0);

        rl2.close();
    });

}

readFile() //Main