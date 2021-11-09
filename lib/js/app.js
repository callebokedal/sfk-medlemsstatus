'use strict';

/* Invoke and update target with template html */
let getTemplate = (tid, el, data = {}) => {
    let elem = document.querySelector(el);
    if(elem) {
        var e = _.unescape(document.querySelector(`script#${tid}`).innerHTML);
        var t = _.template(e);
        var r = t({'data':data});
        elem.innerHTML = r;
    } else {
        console.error("getTemplate - element missing: ", tid);
    }
}

/* Invoke and return template html */
let invokeTemplate = (tid, data = {}) => {
    var e = _.unescape(document.querySelector(`script#${tid}`).innerHTML);
    var t = _.template(e);
    var r = t({'data':data});
    return r;
}

let selectAll = () => {
    let persons = JSON.parse(sessionStorage.getItem("sfk-members-list"));
    persons = _.each(persons, (person) => {
        person.print = true;
    });
    sessionStorage.setItem("sfk-members-list",JSON.stringify(persons));
    routie.navigate("list");
}

let deselectAll = () => {
    let persons = JSON.parse(sessionStorage.getItem("sfk-members-list"));
    persons = _.each(persons, (person) => {
        person.print = false;
    });
    sessionStorage.setItem("sfk-members-list",JSON.stringify(persons));
    routie.navigate("list");
}

let upload = () => {
    //Reference the FileUpload element
    console.log("upload")
    // 
    //let persons = JSON.parse(sessionStorage.getItem("sfk-members-list"));
    //sessionStorage.setItem("sfk-members-list-old",JSON.stringify(persons));
    //sessionStorage.removeItem("sfk-members-list");
    let fileUpload = document.getElementById("formFile");
    //console.log("file: ", fileUpload.value);

    // Works
    //document.getElementById("viewReport").removeAttribute("disabled");

    // Validate whether File is valid Excel file.
    let regex = /^([a-zA-Z0-9\s_\\.-:]).+(.xls|.xlsx|.xlsb)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            let reader = new FileReader();
            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    processExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    processExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("Den här webbläsaren har inte stöd för HTML5 - vilket är ett krav");
        }
    } else {
        alert("Vald fil är ogiltig!");
    }
    //routie.navigate("list");
}

let togglePersonState = (id) => {
    let persons = JSON.parse(sessionStorage.getItem("sfk-members-list"));
    // Toggle value
    let p = _.find(persons, {id: id});
    var val = p.print;
    _.set(_.find(persons, {id: id}), 'print', !val);
    // Update person
    sessionStorage.setItem("sfk-members-list",JSON.stringify(persons));
    //routie("list");
    routie.navigate("list");
}

let saveReportToFile = () => {
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push("Rapport");

    var ws_data = [];
    document.querySelectorAll("#pageBody .person").forEach((p) => {
        let id = p.querySelector("a").id;
        let name = p.querySelector(".name").innerText;
        //console.log("name: ", name);
        let address = p.querySelector(".streetaddress").innerText;
        let print = $(p).hasClass("bg-success-light")?"Utskriven":"Ej utskriven";
        let noPaper = p.querySelector(".float-end > div:nth-of-type(1)")?_.trim(p.querySelector(".float-end > div:nth-of-type(1)").innerText):'';
        let familyHead = p.querySelector(".float-end > div:nth-of-type(2)")?_.trim(p.querySelector(".float-end > div:nth-of-type(2)").innerText):'';
        let familyMember = p.querySelector(".float-end > div:nth-of-type(3)")?_.trim(p.querySelector(".float-end > div:nth-of-type(3)").innerText):'';
        let householdHead = p.querySelector(".float-end > div:nth-of-type(4)")?_.trim(p.querySelector(".float-end > div:nth-of-type(4)").innerText):'';
        let householdMember = p.querySelector(".float-end > div:nth-of-type(5)")?_.trim(p.querySelector(".float-end > div:nth-of-type(5)").innerText):'';
        ws_data.push([id, name, address, print, noPaper, familyHead, familyMember, householdHead, householdMember]);
    })
    //console.log(ws_data);
    wb.Sheets["Rapport"] = XLSX.utils.aoa_to_sheet(ws_data);

    // Save to file
    XLSX.writeFile(wb, "Rapport etiketter.xlsx", {});
    routie.navigate("#");
}
