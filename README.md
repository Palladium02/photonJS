# PhotonJS

## How to use

First you have to initialize a new Photon object.
The property 'el' is required.
```html
<script>
p = new Photon({
 el: 'yourSelector',
 data: {
  list: ['john doe', 'foo', 'bar']
 },
 methods: {
  'sayHello': () => {
   //your functionality here
  }
 }
});
</script>
```

Photon currently has three different directives.
The p-if and the p-for directive.
With the p-if directive you can hide and show an element based on a boolean statement.
The p-for directive generates a list from a example element and fills them with the content of the list which was passed in.
Lastly the click directive which generates a onclick event which executes the passed method from Photon.methods.

```html
<ul>
 <li p-for="list"></li>
</ul>
```
