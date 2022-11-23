// Config
const sheetMainName = "horary";                     //Nombre de la hoja principal
const sheetDaysName = "daysdefs";                   //Nombre de la hoja de los dias
const sheetPeriodsName = "periods";                 //Nombre de la hoja de las horas
const sheetClassesName = "classes";                 //Nombre de la hoja de las clases
//const domain = '@vonex.edu.pe';
const domain = '@';                                 //Validador de nombre de dominio del correo
const className = `SM INT1 P LC (USMSI1022LCPA)`;   //Clase a buscar
const daysColIndex = 0;                             //Indice de la columna Dia
const emailColIndex = 7;                            //Indice de la columna Email
const classColIndex = 10;                           //Indice de la columna Clase

// Sheet
const googleSheetId = "1WnoXbqAPGNk3kwJ9L6JHQr0q31znZHCOIH0h03nVlrE";
const ss = SpreadsheetApp.openById(googleSheetId);
const sheetMain = ss.getSheetByName(sheetMainName)
const sheetDays = ss.getSheetByName(sheetDaysName)
const sheetPeriods = ss.getSheetByName(sheetPeriodsName)
const sheetClasses = ss.getSheetByName(sheetClassesName)

// Data
let horaryClass = [];
let horaryTeacher = [];
let days = [];
let hours = [];
let hoursEnd = [];
let show = true;

//Get
function doGet() {
  // Build Html
  let email = Session.getActiveUser().getEmail();
  let htmlOutput = HtmlService.createTemplateFromFile('index');

  // Read Sheet
  let lastRow = sheetMain.getLastRow();
  let lastCol = sheetMain.getLastColumn();
  let horary = sheetMain.getRange(2, 1, lastRow, lastCol).getDisplayValues();

  // Get Days
  let daysTemp = sheetDays.getRange("C2:C6").getDisplayValues();
  daysTemp.forEach(day => days.push(day[daysColIndex]));

  // Get Hours
  let hoursLastRow = sheetPeriods.getLastRow();
  let hoursTemp = sheetPeriods.getRange(2,4,(hoursLastRow - 1)).getDisplayValues();
  let hoursEndTemp = sheetPeriods.getRange(2,5,(hoursLastRow - 1)).getDisplayValues();
  hoursTemp.forEach(hour => hours.push(hour[0]));
  hoursEndTemp.forEach(hour => hoursEnd.push(hour[0]));

  // Validate Email Domain
  email.includes(domain) ? show = true : show = false

  // Get Horary Teacher & Filter By Email
  horary.forEach((item) => {
    if (item[emailColIndex] == email) {
      // Add Class Ext
      for(let i = classColIndex; i < (classColIndex+3); i++){
        if(item[i] != ""){
          item[classColIndex] = `${item[classColIndex]}, ${item[i]}`;
        }
      }
      // Add Email records
      horaryTeacher.push(item);
    }
  })

  // Get Horary Class & Filter By Class
  horary.forEach((item) => {
    if (item[classColIndex] == className) {
      horaryClass.push(item);
    }
  })

  // Export Html
  htmlOutput.show = show;
  htmlOutput.email = email;
  htmlOutput.days = days;
  htmlOutput.hours = hours;
  htmlOutput.hoursEnd = hoursEnd;
  htmlOutput.cantHours = hoursLastRow - 1;
  htmlOutput.horaryTeacher = horaryTeacher;
  htmlOutput.horaryClass = horaryClass;
  return htmlOutput.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
