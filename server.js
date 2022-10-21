// Sheet
const tableId = "1RWBItawrDM77Tb83fNokK0m6H6C_zJ6MwuvTjZ1LH1g";
const ss = SpreadsheetApp.openById(tableId);
const sheet = ss.getSheetByName("horary")
const sheetDays = ss.getSheetByName("days")
const sheetPeriods = ss.getSheetByName("periods")

// Data
let horaryTeacher = [];
let days = [];
let hours = [];

// Config
const domain = '@';
//const domain = '@vonex.edu.pe';
let show = false;

//Get
function doGet() {
  // Build Html
  let email = Session.getActiveUser().getEmail();
  let htmlOutput = HtmlService.createTemplateFromFile('index');

  // Read Sheet
  let lastRow = sheet.getLastRow();
  let lastCol = sheet.getLastColumn();
  let horary = sheet.getRange(2, 1, lastRow, lastCol).getDisplayValues();

  // Get Horary Teacher & Filter By Email
  horary.forEach((item) => {
    if (item[7] == email) {
      horaryTeacher.push(item);
    }
  })

  // Get Days
  let daysTemp = sheetDays.getRange("C2:C6").getDisplayValues();
  daysTemp.forEach(item => days.push(item[0]));

  // Get Hours
  let hoursTemp = sheetPeriods.getRange("B2:C8").getDisplayValues();
  hoursTemp.forEach(item => hours.push(item[0]));

  // Validate Email Domain
  //console.log(`The word "${domain}" ${email.includes(domain) ? 'is' : 'is not'} in the sentence`);
  email.includes(domain) ? show = true : show = false

  // Export Html
  htmlOutput.show = show;
  htmlOutput.email = email;
  htmlOutput.days = days;
  htmlOutput.hours = hours;
  htmlOutput.dataHorary = horaryTeacher;
  return htmlOutput.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
