import { useState } from "react";
import Papa from "papaparse"; // CSV parser

let conTables = {};

// Templated function for parsing a lookup table
function newConTable(location, tableName) {

    Papa.parse(location, {
        download: true,
        header: true,
        comments: "//",
        skipEmptyLines: true,
        dynamicTyping: true,

        complete: function(result) {
            console.log(`Parsed ${location} as "${tableName}" conversion table`);

            // Add the new table to the big list o' conversion tables
            conTables[tableName] = result;

            return result;
        }
    });
}

// Conversion tables parsed from .CSVs
function parseConTables() {

    // Converts a callback function into an async function
    return Promise.all(
        [
            // Particles
            new Promise((resolve, reject) => {
                resolve(newConTable("contables/particles.csv", "particles"));
            }),

            // Kanji
            new Promise((resolve, reject) => {
                resolve(newConTable("contables/kanji.csv", "kanji"));
            }),
        
            // Custom
            new Promise((resolve, reject) => {
                resolve(newConTable("contables/custom.csv", "custom"));
            })
        ]
    )
}

// Returns the list of conversion tables
function getAllTables () {
    return conTables;
}

// Returns the data for a specific conversion table
function getTableData (tableName) {
    return conTables[tableName].data;
}

export default { parseConTables, getAllTables, getTableData };
