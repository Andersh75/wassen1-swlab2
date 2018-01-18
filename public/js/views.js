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
        })
    };
}).apply(views);