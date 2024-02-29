import { green } from "colors";
const fs = require('fs');

const express = require('express');



const app = express();
const port = 8089;

let failuresArray: any = [];
let failureNumber = 0;
let entriesCounter = 0;
console.log(`  `);
console.log(`  `);
console.log(`  `);


app.use(express.json());
app.use(express.static(__dirname + '/public')); // Assuming your index.html is located under public folder

// Create a new route to render the HTML file
app.get("/", (req: any, res: any) => {
    fs.readFile("./public/index.html").then((data) => {
        res.status(200).send(data);
    });
});

app.post('/createEntry', async (req: { body: { entry: string } }, res: any) => {
    const { entry } = req.body;
    failureNumber++;
    console.log(`${green(`Incoming failure ${failureNumber}`)} ${entry}`);
    failuresArray.push(entry);
    res.send(`New entry with path ${entry} created`);
});

app.get('/updatePage', async (req: { body: { entry: string } }, res: any) => {
    let record = `New entry ${entriesCounter++}`;


    let stringFailuresArray = failuresArray.join(',');

    let updatedHtml2 = `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <title>FAILURES TRACKING SERVER 1.0</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans+Narrow:wght@400;700&family=Roboto+Condensed:ital@0;1&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: #ececec;
                /* Yellow */
            }

            .new-line {
                display: block; /* Forces elements onto new lines */                
            }
         
              .mainHeader {
                padding-left: 200px;               
                margin-top: 50px;
                margin-left: auto;
                margin-right: auto;
                font-family: "PT Sans Narrow", sans-serif;
                font-weight: 700;
                font-size: 28pt;
                font-style: normal;
                color:#292A2B;
                display: block;
                /* Forces elements onto new lines */
            }

            .entry {
                padding-left: 30px;
                margin-top: 1px;
                margin-left: auto;
                margin-right: auto;
                font-family: "PT Sans Narrow", sans-serif;
                font-weight: 500;
                font-size: 13pt;
                font-style: normal;
                color:#6F1010;
                display: block;
               
                /* Forces elements onto new lines */
            }

            .secondaryHeader {
                padding-left: 750px;
                padding-top: 1px;
                margin-top: 1px;
                margin-left: auto;
                margin-right: auto;
                font-family: "PT Sans Narrow", sans-serif;
                font-weight: 600;
                font-style: normal;
                font-size: 22pt;
                color:#EE2E2E;
                border:1px;
                border-style: solid;
                border-color: red;
                background-color: #FDD4D4;
                display: block;
                /* Forces elements onto new lines */
            }

            .listFailedEntries {
                padding-left: 550px; 
                font-family: "PT Sans Narrow", sans-serif;
                font-weight: 500;
                font-size: 14pt;
                font-style: normal;
                color:#641919;
                display: block; /* Forces elements onto new lines */
              }
            
              .image-container {
               
                width: 80px; /* Set the width of the container */
                height: 80px; /* Set the height of the container */               
                // text-align: center; /* Center align the content */
                // margin-left: auto;
                // margin-right: auto;
                // display: block;
            }

        </style>
    </head>

    <body>
        <div class="mainHeader">
            <h1> AQA DOCS TEAM ONLINE FAILURES REPORTER</h1>           
        </div>
        
        <div id="FailureSection"><br><span class="secondaryHeader">Failures tracked : ${failureNumber}</span><br></div><br>

        <script>

        let string = "${stringFailuresArray}";
        let arrayInner = string.split(",");

        let container = document.getElementById('FailureSection');
        for (let i=0;i<arrayInner.length;i++) {            
            var pElement = document.querySelector('div');             
            var newSpan = document.createElement('span');   
            newSpan.classList.add('entry');         
            newSpan.textContent = arrayInner[i];            
            pElement.appendChild(newSpan);
            container.innerHTML += '<br>';             
        }        
                
            function updateCounter() {                
                fetch('/updatePage', { method: 'GET' })
                    .then(response => response.json())
                    .then(data => {})
                    .catch(error => console.error('Error updating counter:', error));                     
            }
       
            setInterval(() => {
                updateCounter();  
                window.location.reload();             
            }, 1500);

        </script>
    </body>

        </html>`

    await fs.writeFileSync("./public/index.html", updatedHtml2);
    res.status(200).send(updatedHtml2);
});


app.get('/formReport', (req: any, res: any) => {

    console.log(`  `);
    console.log(`  `);
    console.log(`  `);
    console.log(`FORMING FAILURES REPORT OF ${failuresArray.length} FEATURES`);
    writeArrayToFile(failuresArray, 'failuresReport.txt');
    res.status(200).send('Failures report formed OK');
});

app.get('/clearPastReport', (req: any, res: any) => {
    deleteReport();
    clearFailuresArray();
    console.log(`Previous failures list file deleted.`);
    res.status(200).send('Previous failures list file deleted.');
});

app.listen(port, () => {
    console.log(`Failures tracking server is up and running at http://localhost:${port}`);
});

async function writeArrayToFile(array: any, filename: string) {
    const fs = require('fs');
    const writeStream = fs.createWriteStream(filename);
    const pathName = writeStream.path;

    array.forEach(value => writeStream.write(`${value} \n`));

    writeStream.on('finish', () => {
        console.log(`Formed failed features list file ${pathName}`);
    });

    writeStream.on('error', (err: any) => {
        console.error(`There is an error writing the file ${pathName} => ${err}`)
    });

    writeStream.end();
}

function deleteReport() {
    fs.unlink(`failuresReport.txt`, (err: any) => { });
}

function clearFailuresArray() {
    failuresArray = [];
    failureNumber = 0;
}