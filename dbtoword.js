// const fs = require('fs');
// const xlsx = require('xlsx');
// const path = require('path');

// function convertSchema(inputFile, outputFile) {
//   try {
//     const workbook = xlsx.readFile(inputFile);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
//     const tables = {};
//     let currentTable = '';
    
//     for (let i = 0; i < rawData.length; i++) {
//       const row = rawData[i];
      
//       // Skip completely empty rows
//       if (!row || row.every(cell => !cell)) continue;
      
//       // If we have at least the table name and column name
//       if (row[0] && row[1]) {
//         const tableName = row[0].toString().trim();
//         const columnName = row[1].toString().trim();
//         const remarks = row[2] || '';
//         const columnType = row[3] || '';
        
//         let fieldType = '';
//         let fieldLength = '';
        
//         if (columnType && typeof columnType === 'string') {
//           const typeMatch = columnType.match(/(\w+)\((\d+)\)/);
//           if (typeMatch) {
//             fieldType = typeMatch[1].toUpperCase();
//             fieldLength = typeMatch[2];
//           } else {
//             fieldType = columnType.toUpperCase();
//           }
//         }
        
//         const isNullable = row[4] || 'YES';
//         const columnKey = row[5] || '';
        
//         currentTable = tableName;
        
//         const isPK = columnKey === 'PRI' ? 'Y' : '';
//         const isMan = isNullable === 'NO' ? 'Y' : '';
//         const isFK = columnKey === 'MUL' ? 'Y' : '';
        
//         if (!tables[currentTable]) {
//           tables[currentTable] = [];
//         }
        
//         tables[currentTable].push({
//           'Field Item': columnName,
//           'Description/Remarks': remarks,
//           'Field Type': fieldType,
//           'Field Length': fieldLength,
//           'Man.': isMan,
//           'PK': isPK,
//           'FK': isFK
//         });
//       }
//     }
    
//     const tableData = [];
    
//     for (const tableName in tables) {
//       if (tables.hasOwnProperty(tableName)) {
//         tableData.push({
//           'Table Name': tableName,
//           'Field Item': '',
//           'Description/Remarks': '',
//           'Field Type': '',
//           'Field Length': '',
//           'Man.': '',
//           'PK': '',
//           'FK': ''
//         });
        
//         tables[tableName].forEach(field => {
//           tableData.push({
//             'Table Name': '',
//             'Field Item': field['Field Item'],
//             'Description/Remarks': field['Description/Remarks'],
//             'Field Type': field['Field Type'],
//             'Field Length': field['Field Length'],
//             'Man.': field['Man.'],
//             'PK': field['PK'],
//             'FK': field['FK']
//           });
//         });
//       }
//     }
    
//     const newWorkbook = xlsx.utils.book_new();
//     const newWorksheet = xlsx.utils.json_to_sheet(tableData);
//     xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'ConvertedSchema');
//     xlsx.writeFile(newWorkbook, outputFile);
    
//     console.log(`Schema converted successfully. Output saved to ${outputFile}`);
//   } catch (error) {
//     console.error('Error converting schema:', error);
//   }
// }

// const inputFile = path.join(__dirname, 'db.xlsx');
// const outputFile = path.join(__dirname, 'converted_schema.xlsx');
// convertSchema(inputFile, outputFile);
// const fs = require('fs');
// const xlsx = require('xlsx');
// const path = require('path');
// const { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, AlignmentType } = require('docx');

// // Function to convert the old format to the new format and output to Word
// async function convertSchemaToWord(inputFile, outputFile) {
//   try {
//     // Read the input Excel file
//     const workbook = xlsx.readFile(inputFile);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
    
//     // Parse the data from the worksheet
//     const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
//     // Extract the table data
//     const tables = {};
//     let currentTable = '';
    
//     // Process each row
//     for (let i = 0; i < rawData.length; i++) {
//       const row = rawData[i];
      
//       // Skip empty rows
//       if (!row || row.length === 0 || !row[0]) continue;
      
//       // Check if this is a table row (in the sample data format)
//       if (typeof row[0] === 'string' && row[0].trim() !== '') {
//         const tableName = row[0].trim();
//         const columnName = row[1] ? row[1].trim() : '';
//         const remarks = row[2] ? row[2].trim() : '';
//         const columnType = row[3] ? row[3].trim() : '';
        
//         // Add null check for columnType before using match()
//         let fieldType = '';
//         let fieldLength = '';
        
//         if (columnType && typeof columnType === 'string') {
//           const typeMatch = columnType.match(/(\w+)\((\d+)\)/);
//           if (typeMatch) {
//             fieldType = typeMatch[1].toUpperCase();
//             fieldLength = typeMatch[2];
//           } else {
//             fieldType = columnType.toUpperCase();
//           }
//         }
        
//         const isNullable = row[4] ? row[4].trim() : '';
//         const columnKey = row[5] ? row[5].trim() : '';
        
//         // If the tableName is different from the current table, we're starting a new table
//         if (tableName !== currentTable) {
//           currentTable = tableName;
//         }
        
//         // Initialize the table array if it doesn't exist
//         if (!tables[currentTable]) {
//           tables[currentTable] = [];
//         }
        
//         // Determine if it's a primary key
//         const isPK = columnKey === 'PRI' ? 'Y' : '';
        
//         // Determine if it's mandatory
//         const isMan = isNullable === 'NO' ? 'Y' : '';
        
//         // FK is identified by MUL in the MySQL schema
//         const isFK = columnKey === 'MUL' ? 'Y' : '';
        
//         // Add to table data
//         tables[currentTable].push({
//           'Field Item': columnName,
//           'Description/Remarks': remarks,
//           'Field Type': fieldType,
//           'Field Length': fieldLength,
//           'Man.': isMan,
//           'PK': isPK,
//           'FK': isFK
//         });
//       }
//     }
    
//     // Create the document
//     const doc = new Document();
    
//     let tableCounter = 0;
//     // We'll use a base section number, you can change this to any value you need
//     const sectionNumber = 4.2;
    
//     // Create Word tables for each database table
//     for (const tableName in tables) {
//       if (tables.hasOwnProperty(tableName)) {
//         tableCounter++;
        
//         // Add heading for the table using the format you specified
//         doc.sections[0].children.push(
//           new Paragraph({
//             text: `${sectionNumber.toFixed(1)}.1 ${tableName}`,
//             heading: HeadingLevel.HEADING_4
//           })
//         );
        
//         // Create the table
//         const tableRows = [
//           // Header row
//           new TableRow({
//             children: [
//               new TableCell({ children: [new Paragraph('Field Item')] }),
//               new TableCell({ children: [new Paragraph('Description/\nRemarks')] }),
//               new TableCell({ children: [new Paragraph('Field Type')] }),
//               new TableCell({ children: [new Paragraph('Field Length')] }),
//               new TableCell({ children: [new Paragraph('Man.')] }),
//               new TableCell({ children: [new Paragraph('PK')] }),
//               new TableCell({ children: [new Paragraph('FK')] })
//             ]
//           })
//         ];
        
//         // Add data rows
//         tables[tableName].forEach(field => {
//           tableRows.push(
//             new TableRow({
//               children: [
//                 new TableCell({ children: [new Paragraph(field['Field Item'] || '')] }),
//                 new TableCell({ children: [new Paragraph(field['Description/Remarks'] || '')] }),
//                 new TableCell({ children: [new Paragraph(field['Field Type'] || '')] }),
//                 new TableCell({ children: [new Paragraph(field['Field Length'] || '')] }),
//                 new TableCell({ children: [new Paragraph(field['Man.'] || '')] }),
//                 new TableCell({ children: [new Paragraph(field['PK'] || '')] }),
//                 new TableCell({ children: [new Paragraph(field['FK'] || '')] })
//               ]
//             })
//           );
//         });
        
//         // Add table to document
//         doc.sections[0].children.push(
//           new Table({
//             width: {
//               size: 100,
//               type: 'pct',
//             },
//             rows: tableRows
//           })
//         );
        
//         // Add a space after the table
//         doc.sections[0].children.push(new Paragraph(''));
//       }
//     }
    
//     // Write the document to a file
//     const buffer = await Packer.toBuffer(doc);
//     fs.writeFileSync(outputFile, buffer);
    
//     console.log(`Schema converted successfully. Output saved to ${outputFile}`);
//   } catch (error) {
//     console.error('Error converting schema to Word:', error);
//   }
// }

// // Handle direct execution of the script
// if (require.main === module) {
//   // Check if input and output file paths are provided as command-line arguments
//   const args = process.argv.slice(2);
  
//   if (args.length >= 2) {
//     const inputFile = args[0];
//     const outputFile = args[1];
//     convertSchemaToWord(inputFile, outputFile);
//   } else {
//     // Default example usage
//     const inputFile = path.join(__dirname, 'db.xlsx');
//     const outputFile = path.join(__dirname, 'converted_schema.docx');
//     console.log(`Using default paths: Input: ${inputFile}, Output: ${outputFile}`);
//     convertSchemaToWord(inputFile, outputFile);
//   }
// }

// module.exports = { convertSchemaToWord };
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } = require('docx');

function convertSchemaToWord(inputFile, outputFile) {
  try {
    const xlsx = require('xlsx');
    const workbook = xlsx.readFile(inputFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    const tables = {};
    let currentTable = '';
    
    // Process the input data
    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      
      if (!row || row.every(cell => !cell)) continue;
      
      if (row[0] && row[1]) {
        const tableName = row[0].toString().trim();
        const columnName = row[1].toString().trim();
        const remarks = row[2] || '';
        const columnType = row[3] || '';
        
        let fieldType = '';
        let fieldLength = '';
        
        if (columnType && typeof columnType === 'string') {
          const typeMatch = columnType.match(/(\w+)\((\d+)\)/);
          if (typeMatch) {
            fieldType = typeMatch[1].toUpperCase();
            fieldLength = typeMatch[2];
          } else {
            fieldType = columnType.toUpperCase();
          }
        }
        
        const isNullable = row[4] || 'YES';
        const columnKey = row[5] || '';
        
        currentTable = tableName;
        
        const isPK = columnKey === 'PRI' ? 'Y' : '';
        const isMan = isNullable === 'NO' ? 'Y' : '';
        const isFK = "";
        
        if (!tables[currentTable]) {
          tables[currentTable] = [];
        }
        
        tables[currentTable].push({
          'Field Item': columnName,
          'Description/Remarks': remarks,
          'Field Type': fieldType,
          'Field Length': fieldLength,
          'Man.': isMan,
          'PK': isPK,
          'FK': isFK
        });
      }
    }
    
    // Create Word document
    const doc = new Document({
      sections: [{
        children: []
      }]
    });
    
    
    // Headers for the table
    const tableHeaders = [
      'Field Item', 'Description/Remarks', 'Field Type', 'Field Length', 'Man.', 'PK', 'FK'
    ];
    
    // Define column widths in DXA units
    // Converting from cm to DXA (1 cm ≈ 567 DXA)
    const columnWidths = [
      2376, // Field Item - 4.19cm
      1452, // Description/Remarks - 2.56cm
      1134, // Field Type - 2cm
      709,  // Field Length - 1.25cm
      709,  // Man. - 1.25cm
      567,  // PK - 1cm
      567   // FK - 1cm
    ];
    
    // Create a single section with all content
    const children = [];
    
    // Add all tables to the document in sequence
    for (const tableName in tables) {
      if (tables.hasOwnProperty(tableName)) {
        // Add table name as Heading 4
        children.push(
          new Paragraph({
            text: tableName,
            heading: HeadingLevel.HEADING_4
          })
        );
        
        // Create table rows
        const rows = [];
        
        // Header row
        rows.push(new TableRow({
          children: tableHeaders.map((header, index) => new TableCell({
            children: [new Paragraph(header)],
            width: { size: columnWidths[index], type: WidthType.DXA }
          })),
          tableHeader: true 
        }));
        
        // Data rows
        tables[tableName].forEach(field => {
          rows.push(new TableRow({
            children: [
              new TableCell({ 
                children: [new Paragraph(field['Field Item'])],
                width: { size: columnWidths[0], type: WidthType.DXA } 
              }),
              new TableCell({ 
                children: [new Paragraph(field['Description/Remarks'])],
                width: { size: columnWidths[1], type: WidthType.DXA } 
              }),
              new TableCell({ 
                children: [new Paragraph(field['Field Type'])],
                width: { size: columnWidths[2], type: WidthType.DXA } 
              }),
              new TableCell({ 
                children: [new Paragraph(field['Field Length'])],
                width: { size: columnWidths[3], type: WidthType.DXA } 
              }),
              new TableCell({ 
                children: [new Paragraph(field['Man.'])],
                width: { size: columnWidths[4], type: WidthType.DXA } 
              }),
              new TableCell({ 
                children: [new Paragraph(field['PK'])],
                width: { size: columnWidths[5], type: WidthType.DXA } 
              }),
              new TableCell({ 
                children: [new Paragraph(field['FK'])],
                width: { size: columnWidths[6], type: WidthType.DXA } 
              })
            ]
          }));
        });
        
        // Add table to document using the workaround mentioned in the issue
        children.push(
          new Table({
            rows: rows,
            width: 0, // Set to 0 for "auto" to ensure proper XML structure
            columnWidths: columnWidths // Use DXA values directly
          })
        );
        
        // Add spacing after table
        children.push(new Paragraph(''));
      }
    }
    
    // Set the document's children
    doc.addSection({
      children: children
    });
    
    // Save the document
    Packer.toBuffer(doc).then(buffer => {
      fs.writeFileSync(outputFile, buffer);
      console.log(`Schema converted successfully. Output saved to ${outputFile}`);
    });
    
  } catch (error) {
    console.error('Error converting schema:', error);
  }
}

// File paths
const inputFile = path.join(__dirname, 'db.xlsx');
const outputFile = path.join(__dirname, 'converted_schema.docx');
convertSchemaToWord(inputFile, outputFile);