const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const csvParser = require("csv-parser");
const { parse } = require("csv")

const upload = multer({dest: "./uploads"})


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


app.post("/undirected-graph", upload.fields([ {name: "properties", maxCount: 1}, {name: "adjmatrix", maxCount:1} ]), async (req, res, next) => {
    let propResults = [];
    let adjResults;
    let nodeArr = [];
    let edges = [];
    const { properties, adjmatrix } = req.files;

    const readPropStream = fs.createReadStream(properties[0].path)
    readPropStream.pipe(csvParser({})).on("data", data => propResults.push(data)).on("end", () => {
        fs.unlinkSync(properties[0].path)
    })

    const readAdjStream = fs.createReadStream(adjmatrix[0].path);
    readAdjStream.pipe(parse({column: true}, (err, records) => {
        adjResults = records;

        adjResults.forEach((item, ind) => {
            item.forEach((num, idx) => {
                if (Number(num) === 1){
                    const edge = { 
                        from: ind + 1,
                        to: idx + 1
                    }
        
                    edges.push(edge)
                }
                
            })
        })
        const edgesCopy = JSON.parse(JSON.stringify(edges));
        const nodes = {}
        edgesCopy.forEach(item => {
            item.from = nodes[item.from] || (nodes[item.from] = { id: item.from, label: `Node ${item.from}` })
            item.to = nodes[item.to] || (nodes[item.to] = { id: item.to, label: `Node ${item.to}`})
        })

        for (const val of Object.entries(nodes)){
            nodeArr.push(val[1])
        }
        fs.unlinkSync(adjmatrix[0].path)
        return res.status(200).json({
            message: "ok",
            nodes: nodeArr,
            edges: edges,
            propResults
        })
    }));
})


const server = app.listen(4000, () => {
    console.log("Server is running on port 4000")
})