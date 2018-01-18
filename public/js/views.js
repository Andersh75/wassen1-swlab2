var views = {};
(function() {


    //Functions
    this.parmaco = {


        form: my.curry(function(title, extraAttributes, extraEvents) {
            let element4 = title;

            let info3 = new helper.dom.kindInfoConstructor();
            info3.kind = "div";
    
            info3.attribute.push({
                key: "class",
                value: "text-block"
            });
    
            let element3 = helper.dom.elementBuilder(info3);
    
            helper.dom.appendInnerHTMLIO(element4, element3);
    
            console.log("element3");
            console.log(element3);
    
    
            let info2 = new helper.dom.ElementInfoConstructor();
            info2.kind = "div";
    
            info2.attribute.push({
                key: "class",
                value: "text-box"
            });
    
            let element2 = helper.dom.elementBuilder(info2);
    
            helper.dom.appendChildNodeIO(element3, element2);
    
            console.log(element2);
    
    
            let info1 = new helper.dom.ElementInfoConstructor();
            info1.kind = "div";
    
            info1.attribute.push({
                key: "class",
                value: "form-box"
            });
    
            let element1 = helper.dom.kindBuilder(info1);
    
            helper.dom.appendChildNodeIO(element2, element1);
    
            console.log(element1);
    
    
    
            let info4 = new helper.dom.ElementInfoConstructor();
            info4.kind = "input";
    
            info4.attribute.push({
                key: "class",
                value: "w-input"
            });
    
            info4.attribute.push({
                key: "type",
                value: "text"
            });
            
            extraAttributes.forEach((item) => {
                info4.attribute.push(item);
            });

            extraEvents.forEach((item) => {
                info4.event.push(item);
            });

    
            element4 = helper.dom.elementBuilder(info4);
    
            console.log(element4);
    
    
            info3 = new helper.dom.ElementInfoConstructor();
            info3.kind = "form";
    
            info3.attribute.push({
                key: "class",
                value: "input-form"
            });
    
            element3 = helper.dom.elementBuilder(info3);
    
            helper.dom.appendChildNodeIO(element4, element3);
    
            console.log(element3);
    
    
            info2 = new helper.dom.ElementInfoConstructor();
            info2.kind = "form";
    
            info2.attribute.push({
                key: "class",
                value: "form-block w-form"
            });
    
            element2 = helper.dom.elementBuilder(info2);
    
            helper.dom.appendChildNodeIO(element3, element2);
    
            console.log(element2);
    
    
            helper.dom.appendChildNodeIO(element2, element1);
    
    
            console.log(element1);

            return element1;
        }),

        createButtonAddOneDocOfKind: my.curry(function (kind, db, parentElement) {
            let buttonElement;
            let elementInfo;

            elementInfo = new helper.dom.ElementInfoConstructor();
            elementInfo.kind = "button";

            elementInfo.attribute.push({
                key: "kind",
                value: kind
            });

            elementInfo.event.push({
                key: "click",
                value: helper.event.addOneDocLastWithFilter
            });

            buttonElement = helper.dom.elementBuilder(elementInfo, db);
            helper.dom.appendInnerHTMLIO("Add one rent!", buttonElement);
            helper.dom.appendChildNodeIO(buttonElement, parentElement);
        }),

        createButtonRemoveLastDocOfKind: my.curry(function (kind, db, parentElement) {
            let buttonElement;
            let elementInfo;

            elementInfo = new helper.dom.ElementInfoConstructor();
            elementInfo.kind = "button";

            elementInfo.attribute.push({
                key: "kind",
                value: kind
            });

            elementInfo.event.push({
                key: "click",
                value: helper.event.deleteLastDocWithFilter
            });

            buttonElement = helper.dom.elementBuilder(elementInfo, db);
            helper.dom.appendInnerHTMLIO("remove last rent!", buttonElement);
            helper.dom.appendChildNodeIO(buttonElement, parentElement);
        }),

        createButtonRemoveAllDocsOfKind: my.curry(function (kind, db, parentElement) {
            let buttonElement;
            let elementInfo;

            elementInfo = new helper.dom.ElementInfoConstructor();
            elementInfo.kind = "button";

            elementInfo.attribute.push({
                key: "kind",
                value: kind
            });

            elementInfo.event.push({
                key: "click",
                value: helper.event.deleteAllDocsWithFilter
            });

            buttonElement = helper.dom.elementBuilder(elementInfo, db);
            helper.dom.appendInnerHTMLIO("remove all!", buttonElement);
            helper.dom.appendChildNodeIO(buttonElement, parentElement);
        }),

        createSelectAddSelectedNumberOfDocsOfKind: my.curry(function (kind, db, parentElement) {
            let selectElement;
            let elementInfo;
            let optionValues = [1, 2, 3, 4, 5];

            elementInfo = new helper.dom.ElementInfoConstructor();
            elementInfo.kind = "select";

            elementInfo.attribute.push({
                key: "kind",
                value: kind
            });

            elementInfo.event.push({
                key: "change",
                value: helper.event.addSelectedNumberOfDocsWithFilter
            });

            selectElement = helper.dom.elementBuilder(elementInfo, db);


            optionValues.forEach((optionValue) => {

                let elementInfo = new helper.dom.ElementInfoConstructor();
                elementInfo.kind = "option";

                elementInfo.attribute.push({
                    key: "value",
                    value: optionValue
                });
                
                let optionElement = helper.dom.elementBuilder(elementInfo, db);

                helper.dom.appendInnerHTMLIO(optionValue, optionElement);
                helper.dom.appendChildNodeIO(optionElement, selectElement);

            });

            //helper.dom.appendInnerHTMLIO("remove all!", selectElement);
            helper.dom.appendChildNodeIO(selectElement, parentElement);
        })
    };
}).apply(views);