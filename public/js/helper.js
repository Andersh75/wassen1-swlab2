var helper = {};
(function() {


    // Map, Reduce, Filter
    this.map = my.curry(function(callback, array) {
        var newArray = [];
        for (var i = 0; i < array.length; i = i + 1) {
            newArray[i] = callback(array[i], i);
        }
        return newArray;
    });

    this.reduce = my.curry(function(callback, initialValue, array) {
        var working = initialValue;
        //console.log('array:', typeof(initialValue));
        for (var i = 0; i < array.length; i = i + 1) {
            working = callback(working, array[i]);
            //console.log('working: ', working);
        }
        return working;
    });


    //Functions
    this.functions = {


        serialize: my.curry(function(newFunction) {
           return JSON.stringify(newFunction, function (key, value) {
            if (typeof value === 'function') {
                return value.toString();
            }
            return value;
        })}),

        deSerialize: my.curry(function(newFunctionString) {
           return JSON.parse(newFunctionString, function (key, value) {

            if (value
    
                &&
                typeof value === "string"
    
                &&
                value.substr(0, 8) == "function") {
    
                var startBody = value.indexOf('{') + 1;
    
                var endBody = value.lastIndexOf('}');
    
                var startArgs = value.indexOf('(') + 1;
    
                var endArgs = value.indexOf(')');
    
    
    
                return new Function(value.substring(startArgs, endArgs)
    
                    , value.substring(startBody, endBody));
    
            }
    
            return value;
    
        })})
    }



    //Booleans
    this.boolean = {

        //Null, undefined, empty array, empty object, empty string = empty
        isEmpty: my.curry(function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }
            if(typeof(obj) === "boolean") {
                return false;
            }
        
            return true;
        }),

        isEven: my.curry(function(x) {
            return (x % 2 === 0);
        }),

        isDefined: my.curry(function(item) {
            return (typeof item !== 'undefined')
        })
    }
    




    //Strings
    this.str = {

        /**
         * Adds a string to an accumulated string
         */
        adder: my.curry(function(acc, nextString) {
        return acc + nextString;
        }),

        /**
         * Tries if the first character is equal to the test character
         */
        startsWith: my.curry(function(str, test) {
            return str.substring(0,2) === test;
        }),

        /**
         * Tries if the last character is equal to the test character
         */
        endsWith: my.curry(function(str, test) {
            return str.substring(str.length - 1) === test;
        }),

        /**
         * Returns the last word from a string using splitter function
         */
        getLastWordFromStringUsingSpliter: my.curry(function(str, splitter) {
            return str.split(splitter).pop();
        }),

        /**
         * Returns first word from a string using splitter function
         */
        getFirstWordFromStringUsingSpliter: my.curry(function(str, splitter) {
            return str.split(splitter).slice(0, 1).join(" ");
        }),
        /**
         * Returns the first word from a string
         */
        getFirstWordFromString: my.curry(function(str) {
            return str.split(" ").slice(0, 1).join(" ");
        }),

        /**
         * Returns the first words from a string
         */
        getFirstWordsFromString: my.curry(function(str, count) {
            return str.split(" ").slice(0, count).join(" ");
        }),

        /**
         * Returns the last word from a string
         */
        getLastWordFromString: my.curry(function(str) {
            return str.split(" ").pop();
        }),

        /**
         * Returns the last words from a string
         */
        getLastWordsFromString: my.curry(function(str, count) {
            return str.split(" ").slice(count, str.length).join(" ");
        }),

        /**
         * Removes first word from a string and returns the rest
         */
        removeFirstWordFromString: my.curry(function(str) {
            return str.split(" ").slice(1).join(" ");
        }),

/**
         * Removes first words from a string and returns the rest
         */
        removeFirstWordsFromString: my.curry(function(str, count) {
            return str.split(" ").slice(count).join(" ");
        }),

        /**
         * Removes the last word from at string and returns the mod string
         */
        removeLastWordFromString: my.curry(function(str) {
            //var shortStr = str.split(" ").pop();
            var strArr = str.split(" ");

            strArr.pop();

            var newStr = strArr.join(" ");

            return newStr;
        }),

         /**
         * Removes the last words from a string
         */
        removeLastWordsFromString: my.curry(function(str, count) {

            return str.split(" ").slice(0, - count).join(" ");
        }),

        /**
         * Converts a string into number
         */
        convertStrToNumber: my.curry((str) => {
            return  Number(str);
        })

        
        
       

        
    };


    //Arrays
    this.arr = {


        flatten: my.curry(function (arr) {
            return arr.reduce(function (flat, toFlatten) {
                return flat.concat(Array.isArray(toFlatten) ? helper.arr.flatten(toFlatten) : toFlatten);
            }, []);
        }),

        seqArrayFromLength: my.curry(function (length) {
            let seqArray = new Array(length);

            for (let i = 1; i <= length; i++) {
                seqArray[i] = i;
            }
            console.log("seqArray");
            console.log(seqArray);
            return seqArray;
        }),

        seqArrayFromTo: my.curry(function (from, to) {
            console.log(from);
            console.log(to);
            let seqArray = [];

            for (let i = from; i <= to; i++) {
                seqArray.push(i);
            }
            console.log("seqArrayFromTo");
            console.log(seqArray);
            return seqArray;
        }),

        sortArray: my.curry(function (arrayToSort, sortBy, direction) {

            let sortedArray = arrayToSort.sort(function(a, b) {
               let dirValue = 1;
                if (direction === "asc") {
                    dirValue = -dirValue;
                }
           // console.log(a[sortBy]);
                if(a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) {
                    return dirValue;
                }
                else if (a[sortBy].toLowerCase() == b[sortBy].toLowerCase()){
                    return 0;
                } else {
                    return -dirValue;
                }
            });
           // console.log("resultsorted");
            //console.log(sortedArray);
            return sortedArray;
        })
    };


    //Events
    this.events = (function(){
        var topics = {};
        var hOP = topics.hasOwnProperty;
      
        return {
          subscribe: function(topic, listener) {
            // Create the topic's object if not yet created
            if(!hOP.call(topics, topic)) topics[topic] = [];
      
            // Add the listener to queue
            var index = topics[topic].push(listener) -1;
      
            // Provide handle back for removal of topic
            return {
              remove: function() {
                delete topics[topic][index];
              }
            };
          },
          publish: function(topic, info) {
            // If the topic doesn't exist, or there's no listeners in queue, just leave
            if(!hOP.call(topics, topic)) return;
      
            // Cycle through topics queue, fire!
            topics[topic].forEach(function(item) {
                    item(info != undefined ? info : {});
            });
          }
        };
    })();
    
    
    //Requests
    this.requestPostJson = my.curry(function(baseString, requestString, data) {
            return new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();
                request.open('POST', baseString + requestString, true);
                console.log(baseString + requestString);
                console.log(JSON.stringify(data));
                request.setRequestHeader('Content-type', 'application/json');
                request.send(JSON.stringify(data));
                request.onreadystatechange = function () {
                    if (request.readyState === 4 && request.status === 200) {
                        resolve(request.response);
                    }
                };
            })
        });

        


    this.requestGetJson = my.curry(function(baseString, requestString) {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open('GET', baseString + requestString);
            request.responseType = 'application/json';
            request.send();
            console.log('here...');
            request.onreadystatechange = function () {
                console.log(baseString + requestString);
                console.log(request.readyState);
                console.log(request.status);
                if (request.readyState === 4 && request.status === 200) {
                    console.log(request.response);
                    resolve(JSON.parse(request.response));
                    
                }
                if (request.readyState === 4 && request.status !== 200) {
                    console.log(request.response);
                    //throw 'Uh-oh! rejected message';
                    reject('meddelande');
                    
                }
            };
        })
    });



    //DOM
    this.dom = {

        appendInnerHTMLIO: my.curry(function(inner, outer) {
            outer.innerHTML = inner;
            return outer;
        }),
        appendInnerHTMLOI: my.curry(function(el, inner) {
            el.innerHTML = inner;
            return el;
        }),

        /**
         * Appends child node to parent @param child the inner element @param parent the outer element
         */
        appendChildNodeIO: my.curry(function(child, parent) {
            parent.appendChild(child);
            return parent;
        }),
        appendChildNodeOI: my.curry(function(el, child) {
            el.appendChild(child);
            return el;
        }),
        appendSiblingNodeCS: my.curry(function(el, sibling) {
            el.insertAdjacentElement('afterend',sibling);
            return el;
        }),
        check: my.curry(function(el) {
            el.checked = true;
            return el;
        }),

        /**
         * Creates element. @param tag kind of element
         */
        createElement: my.curry(function(tag) {
            return document.createElement(tag);
        }),

       
       /**
        * Gets element. @param kind ether "id" or "class" @param name the name of the kind
        */
        getElement: my.curry(function(kind, name) {
            switch(kind) {
                case 'id':
                    return document.getElementById(name);
                    break;
                case 'class':
                    return document.getElementsByClassName(name);
                    break;
            }   
        }),
        removeChildrenUntil: my.curry(function(el, numb) {
            while (el.children.length > numb) {
            el.removeChild(el.lastChild);
            }
        }),

        /**
         * Sets attribute to element 
         * @param {string} key 
         * @param {*} value 
         * @param  el the element
         */
        setAttribute: my.curry(function(key, value, el) {
            el.setAttribute(key, value);
            return el;
        }),

        setStyle: my.curry(function(key, value, el) {
            el.style[key] = value;
            return el;
        }),

        uncheck: my.curry(function(el) {
            el.checked = false;
            return el;
        }),
        wrapTag: my.curry(function(tag, str) {
            return '<' + tag + '>' + str + '</' + tag + '>';
        }),

        getAttribute: my.curry(function(attribute, el) {
            return el.getAttribute(attribute);
            
        }),

        /**
         * Creates a new element
         */
        elementBuilder: my.curry(function (testingObject, db) {

            //check if element exists
            if (helper.boolean.isDefined(testingObject.kind)) {
                
                 //create element
                let element = helper.dom.createElement(testingObject.kind);

                //wraps div around element
                // let elementWrapper = helper.dom.createElement("div");
                // helper.dom.appendChildNodeIO(element, elementWrapper);
               
                //sets attributes
                if (helper.boolean.isDefined(testingObject.attribute)) {
                    testingObject.attribute.forEach(function (item) {
                        helper.dom.setAttribute(item.key, item.value, element);
                    });
                }

                //sets style
                if (helper.boolean.isDefined(testingObject.style)) {
                    testingObject.style.forEach(function (item) {
                        helper.dom.setStyle(item.key, item.value, element);
                    });
                }

                //sets textNode
                if (helper.boolean.isDefined(testingObject.textNode)) {
                    testingObject.textNode.forEach(function (item) {
                        let tempTextNode = document.createTextNode(item);
                        helper.dom.appendChildNodeIO(tempTextNode, element);
                    });
                }

                //sets eventlistender
                testingObject.event.forEach(function (item) {
                    element.addEventListener(item.key, function(event) {
                       item.value(event, db);
                    });
                });

                console.log(element);

                
                // if(testingObject.element === "option") {
                  
    
                //     elementWrapper = element;
                // }

                // elementWrapper = element;
               
                return element;


            }
        }),


        /**
         * Constructs an empty element info object
         */
        ElementInfoConstructor: my.curry(function () {
            this.kind = "";
            this.attribute = [

            ];
            this.style = [


            ];
            this.textNode = [

            ];

            this.event = [

            ];
        }),


        /**
         * Constructs array with element info from database array
         */
        constructElementInfoFromDb: my.curry(function(rows) {

            let elementInfos = rows.map((item) => {

                let elementInfo = new helper.dom.ElementInfoConstructor();
                elementInfo.kind = "input";
                elementInfo.attribute.push({
                    key: "dbName",
                    value: item.doc.dbName

                });
                elementInfo.attribute.push({
                    key: "placeholder",
                    value: item.doc.country

                });
                elementInfo.attribute.push({
                    key: "written",
                    value: item.doc.written

                });
                elementInfo.attribute.push({
                    key: "_id",
                    value: item.doc._id

                });
                elementInfo.attribute.push({
                    key: "_rev",
                    value: item.doc._rev

                });
                
                return elementInfo;
            });

            return elementInfos;

        }),

        appendBuiltElementsOnId: my.curry(function(builtElements, id) {
            let myId = helper.dom.getElement("id", id);
                builtElements.forEach((builtElement) => {
                    helper.dom.appendChildNodeIO(builtElement, myId);
                });
        }),

        //makes a node list with the specified attribute from from DOM. Slices the node list into an array
        selectAllElementsByAttribute: my.curry(function(elementAtrribute) {
            return [].slice.call(document.querySelectorAll(elementAtrribute));
        })
         
      

    
    },

    this.event = {
        deleteLastDocWithFilter: my.curry(function (event, db) {
            let elementIdKind = event.target.attributes.kind.value;

            helper.pouch.deleteLastRowWithFilter(db, elementIdKind)
            .then(() => {
                return helper.pouch.fetchAll(db);     
            })
            .then((result) => {
                console.log(result.rows);
            });
        }),

        addOneDocLastWithFilter: my.curry(function (event, db) {
            let elementIdKind = event.target.attributes.kind.value;

            helper.pouch.getLastElementIdNumber(db, elementIdKind)
            .then((newElementIdNumber) => {
                return createDoc(db, newElementIdNumber, elementIdKind);
            })
            .then((doc) => {
                return helper.pouch.postDoc(doc, db);
            })
            .then(() => {
                return helper.pouch.fetchAll(db);
            })
            .then((result) => {
                console.log(result.rows);
            });   
        }),

        deleteAllDocsWithFilter: my.curry(function (event, db) {
            let elementIdKind = event.target.attributes.kind.value;
            helper.pouch.deleteAllRowsWithFilter(db, elementIdKind);  
        }),

        addSelectedNumberOfDocsWithFilter: my.curry(function (event, db) {
            let selectedValue;
            let elementIdKind;
            
            selectedValue = helper.str.convertStrToNumber(event.target.value);
            elementIdKind = event.target.attributes.kind.value;

            helper.pouch.getLastElementIdNumber(db, elementIdKind)
            .then((newElementIdNumber) => {
                let newElementIdNumbers = helper.arr.seqArrayFromTo(newElementIdNumber, (newElementIdNumber + selectedValue - 1));
                return newElementIdNumbers;
            })
            .then((newElementIdNumbers) => {
                return createDocs(db, newElementIdNumbers, elementIdKind);
            })
            .then((docs) => {
                return helper.pouch.postDocs(docs, db);
            }); 
        }),

        detectClickFunction: my.curry(function (event, db) {
            console.log(event);
        }),

        detectKeybordFunction: my.curry(function (event, db) {
            let keyPressed = event.whitch || event.keyCode || event.charCode;
            if (keyPressed === 13) {
                event.preventDefault();
                updateDbWithNewElementValue(event, db);
                event.target.blur();
            }
        }),

        detectBlurFunction: my.curry(function (event, db) {
            event.preventDefault();
            updateDbWithNewElementValue(event, db);
        })
    },

    //POUCH
    this.pouch = {


        sortRows: my.curry(function (rows, sortParameter, direction) {
            let sortedRows = helper.arr.sortArray(rows, sortParameter, direction);
            return sortedRows;
        }),

        getConflictRows: my.curry(function (docs) {
            console.log(docs);
            return docs['rows'].filter(function (row) {
                return row.doc._conflicts;
            });
        }),


        //gets the previously revision id
        getPreviousRev: my.curry(function (latestDocRev) {
            //console.log(latestDocRev);

            let previousRev = (latestDocRev._revisions.ids.length - 1) + '-' + latestDocRev._revisions.ids[1];
            let id = latestDocRev._id;
            // console.log(oldRev);
            // console.log(oldId);
            return db.get(id, { rev: previousRev, include_docs: true });
        }),

        deleteRevision: my.curry(function (rev, docId, db) {
            db.remove(docId, rev);
        }),

        deleteDoc: my.curry(function (docId, db) {
            return helper.pouch.getDoc(docId, db)
                .then((doc) => helper.pouch.removeDoc(doc, db));
        }),

        deleteRows: my.curry(function (rows, db) {
            return rows.forEach((row) => {
                helper.pouch.removeDoc(row.doc, db);    
            });
        }),

        removeDoc: my.curry(function (doc, db) {
            return new Promise(function (resolve, reject) {
                doc._deleted = true;
                doc.written = new Date().toISOString();
                resolve(db.put(doc));
            });
        }),

        getDoc: my.curry(function (docId, db) {
            return db.get(docId, {
                conflicts: true,
                include_docs: true
            });
        }),

        postDoc: my.curry(function (doc, db) {
            return db.put(doc);
        }),

        putDoc: my.curry(function (doc, db) {
            return db.put(doc);
        }),

        postDocs: my.curry(function (docs, db) {
            return db.bulkDocs(docs);
        }),

        fetchAll: my.curry(function(db) {
            return db.allDocs({
                include_docs: true,
                conflicts: true
            });
        }),

        getAllRows: my.curry(function (db) {
            return helper.pouch.fetchAll(db)
                .then((docs) => {
                    console.log("docs")
                    console.log(docs);
                    return docs.rows;
                });
        }),

        getAllRowsWithFilter: my.curry(function (db, filter) {
            return helper.pouch.getAllRows(db)
                .then((rows) => {
                    let filteredRows = rows.filter((row) => {
                        return row.doc.kind === filter;
                    });
                    console.log("filteredRows");
                    console.log(filteredRows);
                    return filteredRows;
                });
        }),

        deleteAllRowsWithFilter: my.curry(function (db, filter) {
            return helper.pouch.getAllRowsWithFilter(db, filter)
            .then((filteredRows) => {
                helper.pouch.deleteRows(filteredRows, db);
            });
        }),

        deleteLastRowWithFilter: my.curry(function (db, filter) {
            return helper.pouch.getAllRowsWithFilter(db, filter)
            .then((filteredRows) => {
                let sortedFilteredRows = helper.pouch.sortRows(filteredRows, 'id', "desc");

                if (!helper.boolean.isEmpty(sortedFilteredRows)) {
                    let idOfDocToRemove = sortedFilteredRows[0].id;
                    helper.pouch.deleteDoc(idOfDocToRemove, db);
                }   
            });
        }),




        getLastElementIdNumber: my.curry(function (db, elementIdKind) {
            return helper.pouch.getAllRowsWithFilter(db, elementIdKind)
            .then((filteredRows) => {
                let newElementIdNumber;
                let sortedFilteredRows;
                let elementIdOfLastDoc;
                let elementIdNumberOfLastDoc;

                if (!helper.boolean.isEmpty(filteredRows)) {
                    sortedFilteredRows = helper.pouch.sortRows(filteredRows, 'id', "desc");
                    elementIdOfLastDoc = sortedFilteredRows[0].doc.elementId;
                    elementIdNumberOfLastDoc = helper.str.getLastWordFromStringUsingSpliter(elementIdOfLastDoc, "-");
                    newElementIdNumber = helper.str.convertStrToNumber(elementIdNumberOfLastDoc) + 1;
                } else {
                    newElementIdNumber = 1;
                }

                console.log("newElementIdNumber", newElementIdNumber);

                return newElementIdNumber;
            });
        })
        
    }




}).apply(helper);    












//Set
Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}





// this.indexedDB = {
//     openDb: my.curry(function (db_name, db_version, storeAndIndex) {
//         console.log("openDb ...");
    
//         var openRequest = indexedDB.open(db_name,db_version);
        
//         openRequest.onupgradeneeded = function(e) {
//             var thisDB = e.target.result; 
//             console.log("running onupgradeneeded");
    
//             storeAndIndex.forEach(function(item) {
//                 if(!thisDB.objectStoreNames.contains(item.OS)) {
//                     let itemOS = thisDB.createObjectStore(item.OS, {keyPath: "id"});
    
//                     item.indices.forEach(function(info) {
//                         itemOS.createIndex(info.index, info.name, {unique:info.unique});
//                     }) 
//                 }
    
//             });
        
            
//         };
//         openRequest.onsuccess = function(e) {
//             console.log("running onsuccess");
//             db = e.target.result;
//             helper.events.publish('reloadedPage', '5091');
//         };
        
//         openRequest.onerror = function(e) {
//             console.log("onerror!");
//             console.dir(e);
//         };
//     }),
//     getObjectStore: my.curry(function (store_name, mode) {
//         var tx = db.transaction(store_name, mode);
//         return tx.objectStore(store_name);
//     }),
//     getAllInStore: my.curry(function (store_name) {
//         return new Promise((resolve, reject) => {
//             let store = helper.indexedDB.getObjectStore(store_name, 'readonly');
//             let request;
//             let arr = [];
        
//             request = store.openCursor();
//             request.onsuccess = function(event) {
//                 let cursor = event.target.result;
        
//                 if (cursor) {
//                     log(cursor.value);
//                     arr.push(cursor.value);
//                     cursor.continue();

//                 } else {
//                     console.log("No more entries");
//                     if(arr.length != 0) {
//                         resolve(arr);
//                     } else {
//                         reject();
//                     };
                    
//                 }
//             };

//             request.onerror = function(event) {
//                 reject();
//             };
            
//         });      
        
//     }),
//     getOneFromIndexInStore: my.curry(function (store_name, index_name, index_value) {
//         return new Promise((resolve, reject) => {
    
//             let store = helper.indexedDB.getObjectStore(store_name, 'readonly');
//             let index = store.index(index_name);
//             let request;
        
//             request = index.get(index_value);
//             request.onsuccess = function(event) {
//                 log(event.target.result);
//                 resolve(event.target.result);
//             };
//         });
//     }),
//     getAllFromIndexInStore: my.curry(function (store_name, index_name, index_value) {
//         return new Promise((resolve, reject) => {
//             console.log('store_name: ', store_name);
//             console.log('index_name: ', index_name);
//             console.log('index_value: ', index_value);
//             let singleKeyRange = IDBKeyRange.only(index_value);
//             let store = helper.indexedDB.getObjectStore(store_name, 'readonly');
//             let index = store.index(index_name);
//             let request;
//             let arr = [];
        
//             request = index.openCursor(singleKeyRange);
//             request.onsuccess = function(event) {
//                 let cursor = event.target.result;
        
//                 if (cursor) {
//                     log(cursor.value);
//                     arr.push(cursor.value);
//                     console.log('cursor: ', arr);
//                     cursor.continue();
//                 } else {
//                     console.log("No more entries", index_name);
//                     console.log(arr);
//                     if (arr.length) {
//                         console.log('arr.length');
//                         resolve(arr);
//                     } else {
//                         console.log('arr.length == 0');
//                         reject(); 
//                     }
                    
//                 }
//             };

//             request.onerror = function(event) {
//                 console.log('An error!');
//                 reject();
//             };
//         });
//     }),
//     deleteOneFromKeyInStore: my.curry(function (store_name, key) {
        
        
//         let store = helper.indexedDB.getObjectStore(store_name, 'readwrite');
//         let request = store.delete(key);
        
//         request.onsuccess = function(e) {
//             log('deleted one');
//             console.dir(e);
//         }
    
//         request.onerror = function(e) {
//             console.log("Error");
//             console.dir(e);
//         }
//     }),
//     addObjectToStore: my.curry(function (store_name, obj) {
//         //console.log("addPublication arguments:", obj);
    
//         var store = helper.indexedDB.getObjectStore(store_name, 'readwrite');
//         var req;
//         try {
//           req = store.add(obj);
//         } catch (e) {
//           if (e.name == 'DataCloneError') {
//             console.log(e.name);
//           }
            
//           throw e;
//         }
//         req.onsuccess = function (event) {
//           console.log("Insertion in DB successful");
//         };
//         req.onerror = function() {
//           //console.error("addPublication error", this.error);
//         };
//     }),
//     getOneFromKeyInStore: my.curry(function (store_name, key) {
        
        
//             let store = helper.indexedDB.getObjectStore(store_name, 'readonly');
//             let request = store.get(key);
            
//             request.onsuccess = function(e) {
//                 log('get one');
//                 var result = e.target.result;
//                 console.dir(result);
//             }
        
//             request.onerror = function(e) {
//                 console.log("Error");
//                 console.dir(e);
//             }
//         })
// };



