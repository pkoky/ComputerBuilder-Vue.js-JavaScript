import fetch from 'node-fetch'


const config = {
    'URL': 'https://api.recursionist.io/builder/computers?type=',
    'CPU': {
        'Brand': [],
        'Model': [],
    },
    'GPU': [],
    'STORAGE': ['ssd', 'hdd']

}

class Controller {
    static getTargetMap(data) {
        let resultMap = new Map();

        for (let currObj of data) {
            if (resultMap.has(currObj.Brand)) {
                resultMap.get(currObj.Brand).push(currObj);
            } else {
                resultMap.set(currObj.Brand, [currObj]);
            }
        }
        return resultMap;
    }

    static getResultObj(arr, selectedModel) {
        return arr.filter(ele => ele.Model === selectedModel)[0];
    }
}

// select => Brand, Model
function selectCpu() {
    fetch(config.URL + "cpu").then(res=>res.json()).then(function(data) {
        // キーをブランドでセットされたMap
        let cpuMap = Controller.getTargetMap(data);
    
        // cpu連想配列からbrandを配列として抜き出す
        let brandArr = Array.from(cpuMap.keys());

        // Brandをセレクト
        let selectedBrand = brandArr[1];

        let cpuArrForSelectModel = cpuMap.get(selectedBrand);

        let modelArr = [];
        // セレクトしたブランドの配列からモデルを抜き出し
        cpuArrForSelectModel.forEach(ele => modelArr.push(ele.Model));
        
        let selectedModel = modelArr[0];

        // ブランドとモデルが一致したデータを抽出
        let cpuObj = Controller.getResultObj(cpuArrForSelectModel, selectedModel);
        console.log(cpuObj)

        
        selectGpu()

    })
}

// select => Brand, Model
function selectGpu() {
    fetch(config.URL + "gpu").then(res=>res.json()).then(function(data) {
        // キーをブランドでセットされたMap
        let gpuMap = Controller.getTargetMap(data);

        let brandArr = Array.from(gpuMap.keys());
        
        let selectedBrand = brandArr[0];

        let gpuArrForSelectModel = gpuMap.get(selectedBrand)

        let modelArr = [];
        gpuArrForSelectModel.forEach(ele => modelArr.push(ele.Model));

        let selectedModel = modelArr[0];

        let gpuObj = Controller.getResultObj(gpuArrForSelectModel, selectedModel);

        console.log(gpuObj)

        selectRam()
    })
}

// select => Quantity, Brand, Model

function selectRam() {
    fetch(config.URL + "ram").then(response=>response.json()).then(function(data) {
        let ramMap = new Map();

        for (let curr of data) {
            let spaceIndex = curr.Model.lastIndexOf(' ');
            let xIndex = curr.Model.lastIndexOf('x');
            let currNum = curr.Model.substring(spaceIndex+1, xIndex);
            if (ramMap.has(currNum)) {
                ramMap.get(currNum).push(curr)
            } else {
                ramMap.set(currNum, [curr]);
            };
        }

        let numArr = Array.from(ramMap.keys());
        let selectedNum = numArr[1];

        let brandSet = new Set();

        // ブランド抽出
        ramMap.get(selectedNum).forEach(ele => brandSet.add(ele.Brand))

        let brandArr = Array.from(brandSet);
        let selectedBrand = brandArr[2];
        let ramArrForSelectModel = ramMap.get(selectedNum).filter(ele => ele.Brand === selectedBrand);
        let modelArr = [];
        ramArrForSelectModel.forEach(ele => modelArr.push(ele.Model))

        let selectedModel = modelArr[1];

        let ramObj = Controller.getResultObj(ramArrForSelectModel, selectedModel);

        console.log(ramObj)

        selectStorage();
    })
}

// select => Type, Capacity, Brand, Model
function selectStorage() {
    let selectedStorageType = config.STORAGE[0];
    fetch(config.URL + selectedStorageType).then(response=>response.json()).then(function(data) {
        let storageMap = new Map();


        for (let curr of data) {
            let bIndex = curr.Model.lastIndexOf('B');
            let spaceIndex = curr.Model.lastIndexOf(' ', bIndex);
            let currStorageCapacity = curr.Model.substring(spaceIndex+1, bIndex+1);
            if (storageMap.has(currStorageCapacity)) {
                storageMap.get(currStorageCapacity).push(curr)
            } else {
                storageMap.set(currStorageCapacity, [curr]);
            };
        }

        let storageArr = Array.from(storageMap.keys());
        
        storageArr.sort(function(a,b) {
            let aStorageType = a.substr(a.length-2, 1);
            let bStorageType = b.substr(b.length-2, 1);
            
            let aStorageCapacity = a.substring(0, a.length-2) ;
            let bStorageCapacity = b.substring(0, b.length-2) ;
            
            if (bStorageType === "T" && aStorageType != bStorageType) {
                return -1;
            } else if (aStorageType === "T" && aStorageType != bStorageType) {
                return 1;
            } else if (aStorageCapacity > bStorageCapacity) {
                return 1;
            } else {
                return -1;
            }
        })

        let selectedStorageCapacity = storageArr[2];


        let brandSet = new Set();

        // ブランド抽出
        storageMap.get(selectedStorageCapacity).forEach(ele => brandSet.add(ele.Brand));
        let brandArr = Array.from(brandSet);
        let selectedBrand = brandArr[0];


        let storageArrForSelectModel = storageMap.get(selectedStorageCapacity).filter(ele => ele.Brand === selectedBrand);

        let modelArr = [];
        storageArrForSelectModel.forEach(ele => modelArr.push(ele.Model));

        let selectedModel = modelArr[0];
        let storageObj = Controller.getResultObj(storageArrForSelectModel, selectedModel);
        console.log(storageObj)
    })
}



selectCpu()

// var app = new Vue({
//     el: '#app',
//     data: {
//       message: 'Hello Vue!'
//     }
// })

// test