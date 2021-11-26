import fetch from 'node-fetch'


const config = {
    'CPU': {
        'Brand': [],
        'Model': [],
    },
    'GPU': [],

}

function selectCpu() {

    
    fetch("https://api.recursionist.io/builder/computers?type=cpu").then(res=>res.json()).then(function(data) {
        let brandSet = new Set();
    
        for (let curr of data) {
            brandSet.add(curr.Brand);
        }
    
        let brands = Array.from(brandSet);
        
        let selectedBrand = brands[1];
        
        let modelSet = new Set();
        for (let curr of data) {
            if (curr.Brand === selectedBrand) {
                modelSet.add(curr.Model);
            }
        }
        let models = Array.from(modelSet);
        let selectedModel = models[0];
        console.log(selectedModel)
    })
}



selectCpu()

// var app = new Vue({
//     el: '#app',
//     data: {
//       message: 'Hello Vue!'
//     }
// })