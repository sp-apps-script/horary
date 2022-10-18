// Sheet
const tableId = "1RWBItawrDM77Tb83fNokK0m6H6C_zJ6MwuvTjZ1LH1g";
const ss = SpreadsheetApp.openById(tableId);
const sheet = ss.getSheetByName("horary");
const sheetDays = ss.getSheetByName("days");
const sheetPeriods = ss.getSheetByName("periods");
const emailActive = Session.getActiveUser().getEmail();
const scriptProp = PropertiesService.getScriptProperties();

// Permisions
function initialSetup() {
  scriptProp.setProperty("key", ss);
  scriptProp.setProperty("key", emailActive);
}

//Get
function doGet(e) {
  // Data
  let email = Session.getActiveUser().getEmail();
  let htmlOutput = HtmlService.createTemplateFromFile("index");

  // Read Sheet
  let lastRow = sheet.getLastRow();
  let lastCol = sheet.getLastColumn();
  let horary = sheet.getRange(2, 1, lastRow, lastCol).getDisplayValues();
  let horaryTeacher = [];
  let days = [];
  let hours = [];

  // Filter
  horary.forEach(function (item) {
    if (item[7] == email) {
      horaryTeacher.push(item);
    }
  });

  // Get Days
  let daysTemp = sheetDays.getRange("C2:C6").getDisplayValues();
  for (let i in daysTemp) {
    days.push(daysTemp[i][0]);
  }

  // Get Time
  let hoursTemp = sheetPeriods.getRange("B2:C8").getDisplayValues();
  for (let i in hoursTemp) {
    hours.push(hoursTemp[i][0]);
  }

  // Export
  htmlOutput.email = email;
  htmlOutput.days = days;
  htmlOutput.hours = hours;
  htmlOutput.dataHorary = horaryTeacher;
  return htmlOutput
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
