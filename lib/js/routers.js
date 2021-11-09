// routie('users/bob'); 
let setupRouters = () => {
    console.log("routers.js: setting up routers");
    routie({
    '': () => {
        console.log("routers.js: Start");
        //$("#pageBody").innerHTML = "s";
    },
    'print': function () {
        console.log("routers.js: Print");
    },
    'list': function () {
        //console.log("list", id);
        persons = JSON.parse(sessionStorage.getItem("sfk-members-list"));
        getTemplate('listTemplate', '#pageBody', persons);

        // Add table sort capabilities
        $('#membersList').DataTable({
            "processing": true,
            "columnDefs": [
                { "type": "natural", targets: 4 }
            ],
            /* Hide columns
            columnDefs: [
                { targets: [0, 1], visible: true},
                { targets: '_all', visible: false }
            ],*/
            /*"searchCols": [
              null,
              null,
              { "search": "calle" },
              null,
              null,
              null,
              null,
              null,
              null,
              //{ "search": "^[0-9]", "regex": true }
            ],*/
            /*columnDefs: [ {
                orderable: false,
                className: 'select-checkbox',
                targets:   0
            } ],
            select: {
                style:    'os',
                selector: 'td:first-child'
            },*/
            /*"columns": [
                { "orderDataType": "dom-checkbox" },
                { "orderDataType": "dom-text", type: 'string' },
                { "orderDataType": "dom-text", type: 'string' },
                { "orderDataType": "dom-text", type: 'string' },
                { "orderDataType": "dom-text", type: 'string' },
                null,
                null,
                null,
                //{ "orderDataType": "dom-text", "type": "numeric" },
                //{ "orderDataType": "dom-text", "type": "numeric" },
                null
            ],*/
            "lengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
            "language": {
                "sEmptyTable": "Tabellen innehåller ingen data",
                "sInfo": "Visar _START_ till _END_ av totalt _TOTAL_ rader",
                "sInfoEmpty": "Visar 0 till 0 av totalt 0 rader",
                "sInfoFiltered": "(filtrerade från totalt _MAX_ rader)",
                "sInfoPostFix": "",
                "sInfoThousands": " ",
                "sLengthMenu": "Visa _MENU_ rader",
                "sLoadingRecords": "Laddar...",
                "sProcessing": "Bearbetar...",
                "sSearch": "Sök:",
                "sZeroRecords": "Hittade inga matchande resultat",
                "oPaginate": {
                  "sFirst": "Första",
                  "sLast": "Sista",
                  "sNext": "Nästa",
                  "sPrevious": "Föregående"
                },
                "oAria": {
                  "sSortAscending": ": aktivera för att sortera kolumnen i stigande ordning",
                  "sSortDescending": ": aktivera för att sortera kolumnen i fallande ordning"
                }
            }
        });

        /*if(id) {
            var el = document.getElementById("id");
            el.scrollIntoView();
        }*/
    },
    'selectall': function () {
        selectAll();
    },
    'deselectall': function () {
        deselectAll();
    },
    'toggle/:id': function (id) {
        //console.log("id: ", id);
        togglePersonState(id);
    },
    'upload': function () {
        upload();
    },
    'savereport': function () {
        saveReportToFile();
    }/*,
    '*': function (e) {
        console.error(`Unhandled route '${e}' - going default route instead`);
        routie("");
    }*/
    })
};