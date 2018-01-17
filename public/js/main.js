'use strict';
//SYNC FUNCTIONS
function getConflictingObjs(conflictRows, db) {
    return new Promise(function (resolve, reject) {

        Promise.all(conflictRows.map(function (conflictRow) {
            return getRevisions(conflictRow.doc.country, conflictRow.doc.written, conflictRow.doc._rev, conflictRow.doc._conflicts, conflictRow.doc._id, db);
        })).then((results) => {
            resolve(results);
        });
    });

}


function getRevisions(winnerName, winnerWritten, winnerRev, conflictingRevs, docId, db) {
    console.log(conflictingRevs);
    return new Promise(function (resolve, reject) {
        Promise.all(conflictingRevs.map(function (conflictingRev) {
            return db.get(docId, { rev: conflictingRev }).then(function (doc) {
                console.log(doc);
                return {
                    winner: {
                        name: winnerName,
                        written: winnerWritten,
                        rev: winnerRev
                    },
                    conflict: {
                        name: doc.country,
                        written: doc.written,
                        rev: doc._rev
                    },
                    docId: docId
                };
            });
        })).then((results) => resolve(results));
    });

}


function useExistingRev(latestDocRev) {
    helper.pouch.getPreviousRev(latestDocRev)
        .then((previousDocRev) => {
            console.log(previousDocRev);
            latestDocRev.country = previousDocRev.country;
            return db.put(latestDocRev);
        })
        .then(() => {
            db.get(latestDocRev._id).then((latestDocRev) => console.log(latestDocRev));
        })
        .then(() => {
            fetchAllAndUpdate();
        });
}


function ChoosePulledOrExistingRev(latestDocRev) {
    fetchAllAndUpdate();

    // if (confirm("Do you want these? " + latestDocRev.country) == true) {
    //     helper.pouch.fetchAllAndUpdate();
    // } else {
    //     useExistingRev(latestDocRev);
    // }
}



function displayConflicts(conflictingObjs) {
    console.log(conflictingObjs[0][0].conflict.name);

    let el = helper.dom.getElement('id', 'conflicts');

    helper.dom.appendInnerHTMLIO('', el);





    conflictingObjs.forEach(function (conflictingObj) {
        let newInput = helper.dom.createElement('input');
        helper.dom.setAttribute('type', 'radio', newInput);

        newInput.addEventListener('click', function () {
            console.log(conflictingObj[0].winner.rev);
            Promise.all(conflictingObj.map(function (arrayEl) {
                //return new Promise(function (resolve, reject) {
                return db.remove(conflictingObj[0].docId, arrayEl.conflict.rev);
            }))
                .then(function () {
                    console.log('DONE');
                    helper.dom.appendInnerHTMLIO('', el);
                });

        });
        helper.dom.appendChildNodeIO(newInput, el);

        let newBold = helper.dom.createElement('b');
        helper.dom.appendInnerHTMLIO('Keep: ' + conflictingObjs[0][0].winner.name, newBold);
        helper.dom.appendChildNodeIO(newBold, el);


        conflictingObj.forEach(function (item) {
            let newInput = helper.dom.createElement('input');
            helper.dom.setAttribute('type', 'radio', newInput);

            newInput.addEventListener('click', function () {
                console.log(item.conflict.rev);
                Promise.all(conflictingObj.filter(function (element) {
                    return element.conflict.rev != item.conflict.rev;
                }).map(function (arrayEl) {
                    //return new Promise(function (resolve, reject) {
                    return db.remove(conflictingObj[0].docId, arrayEl.conflict.rev);
                }))
                    .then(function () {
                        return db.remove(conflictingObj[0].docId, conflictingObj[0].winner.rev);
                    })
                    .then(function () {
                        console.log('DONE');
                        helper.dom.appendInnerHTMLIO('', el);
                    });
            });

            helper.dom.appendChildNodeIO(newInput, el);

            let newBold = helper.dom.createElement('b');
            helper.dom.appendInnerHTMLIO('Keep: ' + item.conflict.name, newBold);
            helper.dom.appendChildNodeIO(newBold, el);

        });
    });

}



function chooseWinner(conflictObj) {
    return new Promise(function (resolve, reject) {

        if (!helper.boolean.isEmpty(conflictObj)) {
            var el = helper.dom.getElement('id', 'conflicts');
            el.innerHTML = '';

            let wrapperDiv = helper.dom.createElement('div');
            let lableDiv = helper.dom.createElement('div');
            let newButton = helper.dom.createElement('button');


            helper.dom.setAttribute('data-rev', conflictObj.winner.rev, newButton);
            helper.dom.setAttribute('data-id', conflictObj.winner.id, newButton);

            newButton.addEventListener('click', function (event) {
                console.log(event.target);
                el.innerHTML = '';
                db.remove(event.target.getAttribute('data-id'), event.target.getAttribute('data-rev')).then(function () {
                    helper.pouch.fetchAll(db).then((countries) => displayList(countries, 'countries', db));
                });
            });

            helper.dom.appendInnerHTMLIO('Remove: ' + conflictObj.winner.name, newButton);

            helper.dom.appendInnerHTMLIO('WINNER', lableDiv);

            helper.dom.appendChildNodeIO(lableDiv, wrapperDiv);
            helper.dom.appendChildNodeIO(newButton, wrapperDiv);
            helper.dom.appendChildNodeIO(wrapperDiv, el);

            wrapperDiv = helper.dom.createElement('div');
            lableDiv = helper.dom.createElement('div');
            helper.dom.appendInnerHTMLIO('LOOSERS', lableDiv);
            helper.dom.appendChildNodeIO(lableDiv, wrapperDiv);

            console.log(conflictObj.loosers);

            console.log(conflictObj.loosers[0].rev);


            Promise.all(conflictObj.loosers.map(function (item) {
                return new Promise(function (resolve, reject) {
                    console.log('in loosers');
                    console.log(item);
                    let newButton = helper.dom.createElement('button');

                    helper.dom.setAttribute('data-rev', item.rev, newButton);

                    helper.dom.setAttribute('data-id', conflictObj.winner.id, newButton);

                    newButton.addEventListener('click', function (event) {
                        console.log(event.target);
                        el.innerHTML = '';
                        db.remove(event.target.getAttribute('data-id'), event.target.getAttribute('data-rev')).then(function () {
                            helper.pouch.fetchAll(db).then((countries) => displayList(countries, 'countries', db));
                        });
                    });

                    helper.dom.appendInnerHTMLIO('Remove: ' + item.name, newButton);

                    helper.dom.appendChildNodeIO(newButton, wrapperDiv);

                    resolve();

                });

            })).then(function () {
                helper.dom.appendChildNodeIO(wrapperDiv, el);
                console.log('object NOT empty');
                resolve();
            });
        }

        if (helper.boolean.isEmpty(conflictObj)) {
            console.log('object empty');
            resolve();
        }
    });
}



function conflictSolver(doc) {
    return new Promise(function (resolve, reject) {

        let conflictObj = {};
        if (doc._conflicts) {
            console.log(doc._conflicts);

            conflictObj.id = doc._id;
            conflictObj.winner = {
                dbName: doc.dbName,
                id: doc._id,
                name: doc.country,
                rev: doc._rev
            };
            conflictObj.loosers = [];

            console.log(conflictObj);


            //FIX SIMILAR IDS

            // 
            //     newDiv.innerHTML = '<div>' + doc.country + '</div><button data-rev="' + doc._rev + '" id="' + "rev-" + doc._id + '">Remove Conflict</button>';
            //     newDiv.children[1].addEventListener('click', function (event) {
            //         console.log(event.target);
            //         db.remove(event.target.getAttribute('id').slice(4), event.target.getAttribute('data-rev'));
            //     });

            //     el.appendChild(newDiv);

            Promise.all(doc['_conflicts'].map(function (element) {
                return new Promise(function (resolve, reject) {
                    db.get(doc._id, { rev: element }).then(function (docItem) {
                        let tempObj = {};
                        tempObj.dbName = docItem.dbName;
                        tempObj.id = docItem._id;
                        tempObj.name = docItem.country;
                        tempObj.rev = docItem._rev;

                        console.log('tempObj');
                        console.log(tempObj);

                        resolve(tempObj);

                        //conflictObj.loosers.push(tempObj);

                        //console.log(conflictObj.loosers);


                        // let newDiv = helper.dom.createElement('div');

                        // newDiv.innerHTML = docItem._rev;
                        // //newDiv.innerHTML = '<div>' + doc.country + '</div><button data-rev="' + docItem._rev + '" data-id="' + "rev-" + docItem._id + '">Remove Conflict</button>';
                        // // newDiv.children[1].addEventListener('click', function (event) {
                        // //     console.log(event.target);
                        // //     db.remove(event.target.getAttribute('data-id').slice(4), event.target.getAttribute('data-rev'));
                        // // });

                        // el.appendChild(newDiv);
                        // console.log(docItem);

                    }).catch(function (err) {
                        console.log('in the catch');
                    });

                });
            })).then(function (loosersAr) {
                console.log('loosersAr');
                console.log(loosersAr);
                conflictObj.loosers = loosersAr;
                resolve(conflictObj);
            });

        } else {
            resolve(conflictObj);
        }
    });
}
////////////////////


function fetchAllAndUpdate() {
    helper.pouch.fetchAll(db)
        .then((docs) => displayList(docs, 'countries', db));
}



//DONE     
function postAndReload(domId, db) {
    getValueFromField('', 'add-name')
        .then((value) => postDoc(value, db))
        .catch(function () {
            console.log('error');
        });
}


//DONE
/**
 * Creates a document with id, country, written
 * @param {*} value 
 * @param {*} db 
 */
function postDoc(value, db) {
    return new Promise(function (resolve, reject) {
        let doc = {
            dbName: db.name,
            _id: new Date().toISOString(),
            country: value,
            written: new Date().toISOString(),
            kind: "country"
        };
        resolve(db.put(doc));
    });
}




//Done
function putAndReload(docId, id, db) {
    getValueFromField('editField-', docId)
        .then((value) => putDoc(value, docId, db))

        .catch(function () {
            console.log('error');
        });
}

//DONE
function putDoc(newValue, docId, db) {
    return helper.pouch.getDoc(docId, db)
        .then((doc) => editDoc(doc, newValue, db))
        .catch((err) => console.log(err));
}





//DONE
function editDoc(doc, newValue, db) {
    return new Promise(function (resolve, reject) {
        doc.country = newValue;
        doc.written = new Date().toISOString();
        resolve(db.put(doc));
    });
}

//DONE
function deleteAndReload(docId, id, db) {
    helper.pouch.deleteDoc(docId, db)

        .catch(function () {
            console.log('error');
        });
}


//DONE
function getValueFromField(domIdPrefix, domIdSuffix) {
    return new Promise(function (resolve, reject) {
        var el = document.getElementById(domIdPrefix + domIdSuffix);
        var value = el.value;
        if (value) {
            el.value = '';
            resolve(value);
        }
    });
}



/// SKA BARA GÖRA EN RAD I TAGET - ÄNDRA ÄVEN FRÅN TABLE TILL DIV
function displayList(countries, id, db) {
    // console.log('db');
    // console.log(db);
    //var el = document.getElementById(id);
    var el = helper.dom.getElement('id', id);

    let data = '';
    el.innerHTML = data;
    if (countries.rows.length > 0) {
        for (var i = 0; i < countries.rows.length; i++) {
            let data = '';

            data += '<td>' + countries.rows[i].doc.country + '</td>';
            data += '<td><input type="text" id="' + "editField-" + countries.rows[i].doc._id + '"><button id="' + "editButton-" + countries.rows[i].doc._id + '">Edit</button></td>';
            data += '<td><input type="text" id="' + "deleteField-" + countries.rows[i].doc._id + '"><button id="' + "deleteButton-" + countries.rows[i].doc._id + '">Delete</button></td>';

            let tblrow = helper.dom.createElement('tr');
            tblrow.innerHTML = data;
            //el.innerHTML += data;

            let editField = tblrow.children[1].children[0];
            let editButton = tblrow.children[1].children[1];

            editButton.addEventListener('click', function () {
                //console.log('db in event listener');
                //console.log(db);
                putAndReload(editField.getAttribute('id').slice(10), 'countries', db);
            });


            let deleteField = tblrow.children[2].children[0];
            let deleteButton = tblrow.children[2].children[1];

            deleteButton.addEventListener('click', function () {
                deleteAndReload(deleteField.getAttribute('id').slice(12), 'countries', db);
            });

            //console.log(tblrow.children[0].children[1].children[0].getAttribute('id'));

            el.appendChild(tblrow);
        }
    }


    return el;
}



/**
 * Saves info from DOM to db
 * @param {*} element DOM element
 * @param {*} dataKind DOM elements attribute
 * @param {*} serializedFunction function connected to element
 */
function updateDBWithElementValue(element, dataKind, serializedFunction, db) {
    return new Promise(function (resolve, reject) {
        let doc;
        let dbId = helper.dom.getAttribute('db-id', element);

        console.log('dbID: ', dbId);

        if (dbId === "") {
            //prepares for database
            doc = {
                dbName: db.name,
                _id: new Date().toISOString(),
                elementId: helper.dom.getAttribute('id', element),
                elementValue: element.value,
                elementFunction: serializedFunction,
                written: new Date().toISOString(),
                kind: dataKind
            };

            db.put(doc)
                .then(() => {
                    resolve();
                })

            //pushes the update into document


            //Sets database document id on element
            helper.dom.setAttribute("db-id", doc._id, element);
        } else {
            //gets doc from db and updates element from DOM value...
            console.log('dbID: ', dbId);

            helper.pouch.getDoc(dbId, db)
                .then((doc) => {
                    if (doc.elementValue !== element.value) {
                        //updates document value on database
                        doc.elementValue = element.value;
                        //updates written 
                        doc.written = new Date().toISOString();
                        db.put(doc);
                    }

                    return doc;
                })
                .then((doc) => {
                    console.log(doc);
                    resolve();
                });
        }
    })
}

function sendEvent(event, db) {

    let serializedNonsensFunction = helper.functions.serialize(nonsensFunction);

    helper.dom.setAttribute('value', event.target.value, event.target);//puts the value into html code
    updateDBWithElementValue(event.target, event.target.kind, serializedNonsensFunction, db)
        .then(() => {
            let elementsOfKind = [].slice.call(document.querySelectorAll('[kind-rent]'));
            elementsOfKind.forEach((element) => {
                let dbId = helper.dom.getAttribute("db-id", element);

                helper.pouch.getDoc(dbId, db)
                    .then((doc) => {
                        //updates document value on database
                        element.value = doc.elementValue;
                        console.log("elemVal: ", element.value);


                        return doc;
                    })
                    .then((doc) => {
                        console.log(doc);
                    });
            })
        });
}


function createDoc(db, elementIdNumber, elementIdKind) {
    return new Promise(function (resolve, reject) {

         console.log('here!');
        
         
         let serializedNonsensFunction = helper.functions.serialize(nonsensFunction);

         let doc = {
             dbName: db.name,
             _id: new Date().toISOString(),
             elementId: elementIdKind + "-" + elementIdNumber,
             elementValue: "",
             elementFunction: serializedNonsensFunction,
             written: new Date().toISOString(),
             kind: "rent"
         };

         console.log(doc);

         resolve(doc);
     });
 }


//test function
function nonsensFunction(x, y) {
    return x + y;
};

document.addEventListener('DOMContentLoaded', function () {

    let testObj;

    if (helper.boolean.isEmpty(testObj)) {
        console.log("isDefined!");
    }

    var log = [];
    var remoteCouch = 'http://127.0.0.1:5984/kittens';

    new PouchDB('kittens')
       // .destroy()
        .info()
        .then(function () {
            return new PouchDB('kittens');
        })
        .then(function (db) {

            function detectClickFunction(event) {
                console.log(event);
            };

            function detectKeybordFunction(event) {

                let keyPressed = event.whitch || event.keyCode || event.charCode;
                if (keyPressed === 13) {
                    event.preventDefault();
                    sendEvent(event, db);
                    event.target.blur();
                }
            };

            function detectBlurFunction(event) {
                event.preventDefault();
                sendEvent(event, db);
            }

            







            var numberOfElements;
            var seqArray = [];

            let selectDivParent = helper.dom.getElement("id", "forms-chart-id");
            let selectDiv = helper.dom.createElement("select");
            helper.dom.setAttribute('kind', 'hyreskostnad', selectDiv);
            
            selectDiv.addEventListener("change", async function(event){
                let selectedValue = event.target.value;
                selectedValue = helper.str.convertStrToNumber(selectedValue);

                let elementIdKind = event.target.attributes.kind.value;

                let newElementIdNumber = await helper.pouch.getLastElementIdNumber(db, elementIdKind);
                newElementIdNumber = helper.str.convertStrToNumber(newElementIdNumber);

                let newElementIdNumbers = helper.arr.seqArrayFromTo(newElementIdNumber, (newElementIdNumber + selectedValue - 1));

                createDocsAndPutInDb(newElementIdNumbers, elementIdKind)
                .then((docs) => {
                    console.log('docs!');
                    console.log(docs);
                    return db.bulkDocs(docs);
                });
            });

            let optionDiv = helper.dom.createElement("option");
            helper.dom.setAttribute("value", 1, optionDiv);
            helper.dom.appendInnerHTMLIO(1, optionDiv);
            helper.dom.appendChildNodeIO(optionDiv, selectDiv);

            optionDiv = helper.dom.createElement("option");
            helper.dom.setAttribute("value", 2, optionDiv);
            helper.dom.appendInnerHTMLIO(2, optionDiv);
            helper.dom.appendChildNodeIO(optionDiv, selectDiv);

            optionDiv = helper.dom.createElement("option");
            helper.dom.setAttribute("value", 3, optionDiv);
            helper.dom.appendInnerHTMLIO(3, optionDiv);
            helper.dom.appendChildNodeIO(optionDiv, selectDiv);

            helper.dom.appendChildNodeIO(selectDiv, selectDivParent);


//REMOVE ALL DOCS
            let buttonDiv = helper.dom.createElement("button");
            buttonDiv.addEventListener("click", function() {
                helper.pouch.fetchAll(db)
                .then((result) => {
                    result.rows.forEach((row) => {
                        helper.pouch.removeDoc(row.doc, db);
                       
                    });
                })
            });
            helper.dom.appendInnerHTMLIO("remove all!", buttonDiv);
            helper.dom.appendChildNodeIO(buttonDiv, selectDivParent);

            
            
            //REMOVE LAST DOC WITH hyreskostnad GÖR SOM MED SELECT OVAN!!!!
            buttonDiv = helper.dom.createElement("button");
            buttonDiv.addEventListener("click", function () {
                helper.pouch.fetchAll(db)
                    .then((result) => {
                        console.log("resultUnsorted");
                        console.log(result.rows);
                        let elementIdKind = "hyreskostnad";
                        let filteredSortedArray = helper.pouch.sortAndFilterDocs(result.rows, elementIdKind, "desc");
                        console.log("filteredSortedArray");
                        console.log(filteredSortedArray);
                        if (!helper.boolean.isEmpty(filteredSortedArray)) {
                            let idOfDocToRemove = filteredSortedArray[0].id;
                            helper.pouch.deleteDoc(idOfDocToRemove, db);
                        }

                        helper.pouch.fetchAll(db)
                            .then((result) => {
                                console.log(result.rows);
                            })
                    })
            });
            helper.dom.appendInnerHTMLIO("remove last hyreskostnad!", buttonDiv);
            helper.dom.appendChildNodeIO(buttonDiv, selectDivParent);



            //ADD ONE DOC hyreskostnad

            buttonDiv = helper.dom.createElement("button");
            buttonDiv.addEventListener("click", function() {


                
                helper.pouch.fetchAll(db)
                    .then((result) => {
                        console.log("resultUnsorted");
                        console.log(result.rows);
                        let newElementIdNumber;
                        let elementIdKind = "hyreskostnad";
                        if (helper.boolean.isEmpty(result.rows)) {

                            newElementIdNumber = 1;

                        } else {

                            let filteredSortedArray = helper.pouch.sortAndFilterDocs(result.rows, elementIdKind, "desc");

                            let elementIdOfLastDoc = filteredSortedArray[0].doc.elementId;
                            let zOfLastDoc = helper.str.getLastWordFromStringUsingSpliter(elementIdOfLastDoc, "-");
                            console.log("zOfLastDoc");
                            console.log(zOfLastDoc);
                            newElementIdNumber = helper.str.convertStrToNumber(zOfLastDoc) + 1;
                        }


                        createDoc(db, newElementIdNumber, elementIdKind)
                        .then((doc) => {
                            //console.log(elementIdNumber);
                            console.log(doc);
                            return db.put(doc);
                        });;


                        helper.pouch.fetchAll(db)
                            .then((result) => {
                                console.log(result.rows);
                            })
                    })
            });
            helper.dom.appendInnerHTMLIO("Add one hyreskostnad!", buttonDiv);
            helper.dom.appendChildNodeIO(buttonDiv, selectDivParent);
            



            function buildRent(event) {

                numberOfElements = event.target.value;
                seqArray = helper.arr.seqArrayFromLength(numberOfElements);
                console.log(event);
            }

            
            numberOfElements = 0;
            seqArray = helper.arr.seqArrayFromLength(numberOfElements);
            


            function createDocsAndPutInDb(arr, elementIdKind) {
                return new Promise((resolve, reject) => {
                    let docs = [];
                    let index = 0;
                    let timer = setInterval(function() {
                        if (index < arr.length) {
                            createDoc(db, arr[index++], elementIdKind)
                            .then((doc) => {
                                docs.push(doc);
                            })
                            .catch(() => {
                                clearInterval(timer);
                                reject();                        
                            });
                        } else {
                            clearInterval(timer);
                            resolve(docs);
                        }
                    }, 100);
                })
            }









            // createDocsAndPutInDb(seqArray, "hyreskostnad")
            // .then((docs) => {
            //     db.bulkDocs(docs);
            //     console.log('after put');
            //     let divFirstFormsBox = helper.dom.getElement("id", "first-forms-box");

            //     helper.pouch.getAllDocsWithFilter(db, "rent")
            //         .then((filteredRows) => {
            //             console.log("filteredRows");
            //             console.log(filteredRows);
            //             let numberOfElements = filteredRows.length;
            //             console.log("numOfElements");
            //             console.log(numberOfElements);
            //             return numberOfElements;
            //         })
            //         .then((numberOfElements) => {
            //             for (let z = 1; z <= numberOfElements; z++) {
            //                 //let letter = String.fromCharCode("A".charCodeAt(0) + z);
            //                 let letter = z;

            //                 let extraAttributes = [
            //                     {
            //                         key: "kind-rent",
            //                         value: true
            //                     },
            //                     {
            //                         key: "kind",
            //                         value: "rent"
            //                     },
            //                     {
            //                         key: "placeholder",
            //                         value: "Enter your name"
            //                     },
            //                     {
            //                         key: "id",
            //                         value: "hyreskostnad-" + letter
            //                     },
            //                     {
            //                         key: "data-cell",
            //                         value: "hyreskostnad-" + letter
            //                     }
            //                 ];

            //                 let extraEvents = [
            //                     {
            //                         key: "click",
            //                         value: detectClickFunction
            //                     },
            //                     {
            //                         key: "keypress",
            //                         value: detectKeybordFunction
            //                     },
            //                     {
            //                         key: "blur",
            //                         value: detectBlurFunction
            //                     }
            //                 ];

            //                 db.allDocs({ include_docs: true })
            //                     .then((docs) => {
            //                         let filteredRows = docs.rows.filter((doc) => {
            //                             return doc.doc.elementId === "hyreskostnad-" + letter;
            //                         });

            //                         return filteredRows;
            //                     })
            //                     .then((filteredRows) => {
            //                         if (filteredRows.length > 0) {

            //                             let valueAttribute = {
            //                                 key: "value",
            //                                 value: filteredRows[0].doc.elementValue
            //                             };

            //                             extraAttributes.push(valueAttribute);

            //                             let docIdAttribute = {
            //                                 key: "db-id",
            //                                 value: filteredRows[0].doc._id
            //                             }

            //                             extraAttributes.push(docIdAttribute);

            //                             let divFirstForms1 = views.parmaco.form('Hyreskostnad', extraAttributes, extraEvents);
            //                             helper.dom.appendChildNodeIO(divFirstForms1, divFirstFormsBox);

            //                         }
            //                     });
            //             }
            //         });
            // })

            













            db.sync(remoteCouch, { live: true, retry: true, conflicts: true, include_docs: true })
                .on('change', function (info) {

                    info.syncTime = new Date().toISOString();
                    log.push(info);


                    if ((info.direction == "pull") && (info.change.docs.length < 2)) {
                        console.log("Normal pull");
                        // console.log(info);
                        // console.log(info.change.docs[0]);
                        info.change.docs.forEach((doc) => ChoosePulledOrExistingRev(doc));

                    }

                    else if ((info.direction == "pull") && (info.change.docs.length > 1)) {
                        console.log("Bulk pull");
                        //console.log(info);
                        // console.log(info.change.docs);
                        // myFunction(info.change.docs);
                        info.change.docs.forEach((doc) => ChoosePulledOrExistingRev(doc));

                    }

                    else if ((info.direction == "push") && (info.change.docs.length < 2)) {
                        console.log("Normal push");
                        console.log(info);
                    }

                    else if ((info.direction == "push") && (info.change.docs.length > 1)) {
                        console.log("Bulk push");
                        console.log(info);

                    }
                    else {
                        console.log('NOT ANY OF THE PUSH AND PULLS');
                        console.log(log);
                    }



                    //helper.pouch.fetchAll(db).then((countries) => displayList(countries, 'countries', db));

                    // helper.pouch.fetchAll(db)
                    // .then((countries) => displayList(countries, 'countries', db))
                    // .then(() => db.sync(remoteCouch, { conflicts: true, include_docs: true}))
                    // .then(function() {
                    //     console.log('sy');
                    //     helper.pouch.fetchAll(db).then((countries) => displayList(countries, 'countries', db));
                    // });


                }).on('paused', function (info) {
                    //     //console.log(new Date().toISOString());
                    console.log('PAUSED');
                }).on('active', function () {
                    console.log('ACTIVE');
                    // replicate resumed (e.g. new changes replicating, user went back online)
                }).on('denied', function (err) {
                    console.log('DENIED');
                    // a document failed to replicate (e.g. due to permissions)
                }).on('complete', function (info) {
                    console.log('COMPLETE');
                    // handle complete
                }).on('error', function (err) {
                    console.log('ERROR');
                    // handle error
                });

        })
}, false);


    //   let dataChartArray = [];
    //   let chartDocs = [];
    //   dataChartArray = [
    //       {
    //           serie: 5,
    //           label: 2016
    //       },
    //       {
    //         serie: 6,
    //         label: 2014
    //     },
    //     {
    //         serie: 1,
    //         label: 2015
    //     },
    //     {
    //         serie: 5,
    //         label: 2018
    //     },
    //     {
    //         serie: 3,
    //         label: 2017
    //     }
    //   ]



    //   chartRecursive(dataChartArray);

    //   function chartRecursive(chartArray) {

    //       //Create doc and sets attributes
    //       let doc = {
    //           dbName: db.name,
    //           _id: new Date().toISOString(),
    //           written: new Date().toISOString(),
    //           chartData: chartArray[0],
    //           kind: "chart-data"
    //       };




    //       //adds to mydocs
    //       chartDocs.push(doc);
    //       //wait function
    //       setTimeout(function () {
    //           if (chartArray.length > 1) {
    //               chartRecursive(chartArray.slice(1));
    //           } else {
    //               console.log(chartDocs);
    //               db.bulkDocs(chartDocs);
    //           }
    //       }, 1);

    //   };


    //   chartRecursive2(dataChartArray);

    //   function chartRecursive2(chartArray) {

    //       //Create doc and sets attributes
    //       let doc = {
    //           dbName: db.name,
    //           _id: new Date().toISOString(),
    //           written: new Date().toISOString(),
    //           chartid: chartArray[0],
    //           kind: "chart-id"
    //       };




    //       //adds to mydocs
    //       chartDocs.push(doc);
    //       //wait function
    //       setTimeout(function () {
    //           if (chartArray.length > 1) {
    //               chartRecursive2(chartArray.slice(1));
    //           } else {
    //               console.log(chartDocs);
    //               db.bulkDocs(chartDocs);
    //           }
    //       }, 1);

    //   };

    //   function compare(a,b) {
    //     if (a.chartData.label < b.chartData.label)
    //       return -1;
    //     if (a.chartData.label > b.chartData.label)
    //       return 1;
    //     return 0;
    //   }



    //   db.createIndex({
    //     index: {fields: ['kind']}
    //   })
    //   .then((result) => {
    //     db.find({
    //         selector: {
    //             kind: {$eq: 'chart-data'}
    //         }
    //       })
    //   .then((selected) => {
    //     console.log("selected");
    //       console.log(selected.docs);
    //       console.log(selected.docs.sort(compare));



    //       let sortedLabels = selected.docs.map((item) => {
    //         return item.chartData.label;
    //      });

    //      let sortedSeries = selected.docs.map((item) => {
    //         return item.chartData.serie;
    //      });

    //      console.log("sortedSeries");
    //      console.log(sortedSeries);
    //      console.log(sortedLabels);

    //       var chartData = {

    //         labels: sortedLabels,

    //         series: [
    //             sortedSeries
    //         ]

    //     };
    //     var options = {high: 10,
    //         low: -10,
    //         axisX: {
    //           labelInterpolationFnc: function(value, index) {
    //             return index % 4 === 0 ? value : null;
    //           }
    //         }
    //     }

    //     // var options = {
    //     //     width: 300,
    //     //     hight: 200
    //     // };

    //     new Chartist.Bar('.ct-chart', chartData, options);



    //   });
    // });






    //     var chartData = {

    //         labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    //         series: [
    //             [4, 5, 7, 2, -1, -4],
    //             [1, 3, 5, 2, -2, -3]
    //         ]
    //     };
    //     var options = {high: 10,
    //         low: -10,
    //         axisX: {
    //           labelInterpolationFnc: function(value, index) {
    //             return index % 4 === 0 ? value : null;
    //           }
    //         }
    //     }

    //     // var options = {
    //     //     width: 300,
    //     //     hight: 200
    //     // };

    //     new Chartist.Bar('.ct-chart', chartData, options);