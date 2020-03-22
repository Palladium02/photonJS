function isObject(o) {
    return typeof(o) === 'object' ? true : false;
}

function isArray(a) {
    return Array.isArray(a);
}

class Photon {
    constructor(options) {
        if(isObject(options)) {
            this.root = document.querySelector(options.el);
            this.data = options.data;
            this.methods = options.methods;
            this.lifecycle;
            this.DIRECTIVEKEYS = [
                'p-if',
                'p-else',
                'p-for',
                'click'
            ];
            this.directiveELements = {
                'p-if': [],
                'p-else': [],
                'p-for': [],
                'click': []
            }
            this.traverseRoot();
            this.addEvents();
            this.lifeCycle();
        } else {
            console.error('');
            return undefined;
        }
    }

    traverseRoot() {
        this.DIRECTIVEKEYS.forEach(KEY => {
            let matches = this.root.querySelectorAll(`[${KEY}]`);
            matches.forEach(match => {
                this.directiveELements[KEY].push([match, match.getAttribute(KEY), match.parentNode]);
                match.removeAttribute(KEY);
            });

        });
    }

    addEvents() {
        this.directiveELements.click.forEach(element => {
            element[0].addEventListener('click', () => {
                this.methods[element[1]]();
            });
        });
    }

    lifeCycle() {
        this.traverseRoot();
        this.lifecycle = setInterval(() => {
            for(let [key, value] of Object.entries(this.directiveELements)) {
                value.forEach(value => {
                    switch (key) {
                        case 'p-if':
                            eval(value[1]) ? value[0].style.display = 'initial' : value[0].style.display = 'none';
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