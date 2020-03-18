// import {
//     StudentGrid
// } from "./components/student_grid";
// import { initJsStore } from "./storage_service/idb_service";

// initJsStore();
// var componentStudentGrid = new StudentGrid();
// document.getElementById('app').innerHTML = componentStudentGrid.getHtml();
// componentStudentGrid.init();

import { Terminal } from "./components/terminal";
const terminal = new Terminal();
terminal.init('#app');