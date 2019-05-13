const fs = require('fs');
var json;
          
// Check if file input and output were provided
if (process.argv.length < 4) {
  console.log(`Script usage: node  ${process.argv[1]} INPUT OUTPUT`);
  process.exit(1);
}

// Converts provided CSV to JSON
function csvToJson(csv) {
  //Split on rows
  var content = csv.replace(/['"]+/g, '').split('\n')
  // Remove white spaces for each row
  .map(row => row.trim());
  // Get first row for column headers
  var header = content[0].split(',');
  // Remove header from content
  content.shift();
  // Ignore last item (undefined)
  content.pop();
  // Create new obj with header and content
  return content.map((row) => {
    return Object.assign({}, ...header.map((head, index) => ({[head]: row.split(',')[index]})));
  });
}

// Read the given file
function readFile(callback) {
  fs.readFile(process.argv[2], 'utf8', function(err, data) {
  if (err) throw err;
  callback(data);
  });
}

// Add optin and email properties
function addPropertiesToJson(data) {
  json = csvToJson(data);
  for (var i = 0; i < json.length; i++) { 
    // Add new param 'optin' with value 'no'
    json[i].optin = 'no';
    // Create an immutable array of integers
    var buff = new Buffer(json[i].first_name + json[i].last_name + json[i].postal_code);  
    // Change the base
    var hash = buff.toString('base64');
    json[i].email =  `dmblacklist${hash}@thirdlove.com`;
  }
  // Write the new json
  fs.writeFileSync(process.argv[3], JSON.stringify(json, null, ' '), function(err) {
    if (err) throw err;
  });
}

readFile(addPropertiesToJson);
