function isObject(o) {
    return typeof(o) === 'object' ? true : false;
}

function isArray(a) {
    return Array.isArray(a);
}

class Photon {
    constructor(options) {
        this.root = document.querySelector(options.el);
        this.data = options.data;
        this.methods = options.methods;
        this.lifecycle;
        this.DIRECTIVEKEYS = [
            'p-if',
            'p-else',
            'p-for',
            '@click'
        ];
        this.directiveELements = {
            'p-if': [],
            'p-else': [],
            'p-for': [],
            '@click': []
        }

        this.initializeElements();
        this.lifeCycle();
    }

    initializeElements() {
        let attributes;
        let children = Array.from(this.root.querySelectorAll('*'));
        children.forEach(child => {
            if(child.nodeType === 1) {
                child.hasAttributes() ? attributes = Array.from(child.attributes) : attributes = [];
            } else {
                attributes = [];
            }
            if(isArray(attributes)) {
                attributes.forEach(attribute => {
                    this.DIRECTIVEKEYS.forEach(key => {
                        if(attribute.name == key) {
                            this.directiveELements[key].push([child, child.getAttribute(key), child.parentNode]);
                            child.removeAttribute(key);
                        }
                    })
                });
            }
            
        });

    }
     
    addEvents() {
        this.directiveELements['@click'].forEach(element => {
            element[0].addEventListener('click', () => {
                this.methods[element[1]]();
            });
        });
        this.directiveELements['@click'] = [];
    }

    lifeCycle() {
        this.lifecycle = setInterval(() => {
            this.initializeElements();
            this.addEvents();
            for(let [key, value] of Object.entries(this.directiveELements)) {
                value.forEach(value => {
                    switch (key) {
                        case 'p-if':
                            eval(value[1]) ? value[0].style.display = 'initial' : value[0].style.display = 'none';
                            break;
                        case '@click':
                            value[0].addEventListener('click', () => {
                                this.methods[value[1]]();
                            });
                            break;
                        case 'p-for':
                            let parent = value[0].parentNode;
                            if(isArray(this.data[value[1]])) {
                                parent = value[2];
                                if(parent.children.length != this.data[value[1]].length) {
                                    parent.innerHTML = '';
                                    this.data[value[1]].forEach(dataElement => {
                                        let loopedChild = value[0].cloneNode(true);
                                        loopedChild.textContent = dataElement;
                                        parent.appendChild(loopedChild);
                                    });
                                }
                            } else {
                                console.error('p-for expects typeof Array');
                                this.killLifeCycle();
                            }
                        default:
                            break;
                    }
                });
            }
        }, 0);
    }

    killLifeCycle() {
        clearInterval(this.lifecycle);
    }
}