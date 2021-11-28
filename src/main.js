// import fetch from 'node-fetch'

class User {
    constructor() {
        this.computers = [];
    }
}

class Computer {
    constructor(cpu, gpu, ram, storage) {
        this.cpu = cpu;
        this.gpu = gpu;
        this.ram = ram;
        this.storage = storage;
    }

    
} 

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

    static startCreateComputer() {
        let obj = new Computer();
        obj = selectCpu(obj);
    }

    static getKeysArr(map) {
        return Array.from(map.keys());
    }

    static getTargetMap(data) {
        let resultMap = new Map();

        for (let currObj of data) {
            if (resultMap.has(currObj.Brand)) resultMap.get(currObj.Brand).push(currObj);
            else resultMap.set(currObj.Brand, [currObj]);
        }

        return resultMap;
    }

    static getResultObj(arr, selectedModel) {
        return arr.filter(ele => ele.Model === selectedModel)[0];
    }


    static sortStorageArr(arr) {
        arr.sort(function(a,b) {
            let aStorageType = a.substr(a.length-2, 1);
            let bStorageType = b.substr(b.length-2, 1);
            
            let aStorageCapacity = Number(a.substring(0, a.length-2));
            let bStorageCapacity = Number(b.substring(0, b.length-2));
            
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
        return arr;
    }

    
}

// select => Brand, Model
function selectCpu(obj) {
    fetch(config.URL + "cpu").then(res=>res.json()).then(function(data) {
        // キーをブランドでセットされたMap
        let cpuMap = Controller.getTargetMap(data);
    
        // cpu連想配列からbrandを配列として抜き出す
        let brandArr = Controller.getKeysArr(cpuMap);


        // Brandをセレクト
        let selectedBrand = brandArr[1];

        let cpuArrForSelectModel = cpuMap.get(selectedBrand);

        let modelArr = [];
        // セレクトしたブランドの配列からモデルを抜き出し
        cpuArrForSelectModel.forEach(ele => modelArr.push(ele.Model));
        
        let selectedModel = modelArr[0];

        // ブランドとモデルが一致したデータを抽出
        let cpuObj = Controller.getResultObj(cpuArrForSelectModel, selectedModel);
   
        obj.cpu = cpuObj;
        // selectGpu(obj)
    })
}

// select => Brand, Model
function selectGpu(obj) {
    fetch(config.URL + "gpu").then(res=>res.json()).then(function(data) {
        // キーをブランドでセットされたMap
        let gpuMap = Controller.getTargetMap(data);

        let brandArr = Controller.getKeysArr(gpuMap);
        
        let selectedBrand = brandArr[0];

        let gpuArrForSelectModel = gpuMap.get(selectedBrand)

        let modelArr = [];
        gpuArrForSelectModel.forEach(ele => modelArr.push(ele.Model));

        let selectedModel = modelArr[0];

        let gpuObj = Controller.getResultObj(gpuArrForSelectModel, selectedModel);

        obj.gpu = gpuObj;

        selectRam(obj)

    })
}

// select => Quantity, Brand, Model

function selectRam(obj) {
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

        let numArr = Controller.getKeysArr(ramMap);
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

        obj.ram = ramObj;

        selectStorage(obj)

    })
}

// select => Type, Capacity, Brand, Model
function selectStorage(obj) {
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

        let storageArr = Controller.getKeysArr(storageMap);
        
        storageArr = Controller.sortStorageArr(storageArr);

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
        
        obj.storage = storageObj;
        console.log(obj)
    })
}

// Controller.startCreateComputer()

var SelectBrandComponent = {
    template: `#selectBrandComponent`,
    props: ['brands'],
    data() {
        return {
            brandArr: this.brands,
        }
    },
    updated: function() {
        console.log('selectBrandComponent created')
    }
}


var CpuComponent = {
    template:`#CpuComponent`,
    props:['computer'],
    data(){
        return {
            computerObj: 'this.computer',
            brandArr: [],
        }
    },
    created: async function() {
        await fetch(config.URL + "cpu").then(res=>res.json()).then(function(data) {
            // キーをブランドでセットされたMap
            let cpuMap = Controller.getTargetMap(data);
        
            // cpu連想配列からbrandを配列として抜き出す
            let brandArr = Controller.getKeysArr(cpuMap);

            this.brandArr = brandArr;
            console.log('CpuComponent created')
        })
    },
    components: {
        'select-brand': SelectBrandComponent,

    }
}


var ComputerComponent = {
    template: '#computerComponent',
    data(){
        return {
            computerObj: new Computer(),
        }
    },
    components: {
        'cpu-component': CpuComponent,
    }
}


var app = new Vue({
    el: '#app',
    data: {
      user: new User(),
    },
    components: {
        'computer-component': ComputerComponent,
    }
})


