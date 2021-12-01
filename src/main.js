// import fetch from 'node-fetch'

const config = {
    'URL': 'https://api.recursionist.io/builder/computers?type=',
    'CPU': {
        'Brand': [],
        'Model': [],
    },
    'GPU': [],
    'STORAGE': ['ssd', 'hdd'],
    'BENCHMARKRATIO': {
        'Gaming': {
            'cpu': 0.25,
            'gpu': 0.6,
            'ram': 0.125,
            'storage': 0.1
        },
        'Working': {
            'cpu': 0.6,
            'gpu': 0.25,
            'ram': 0.1,
            'storage': 0.05
        }
    }
}

let a = config.cpuMap


class Computer {
    constructor(cpu, gpu, ram, storage) {
        this.cpu = cpu;
        this.gpu = gpu;
        this.ram = ram;
        this.storage = storage;
    }
}




class MapData {
    constructor(cpu, gpu, ram, ssd, hdd) {
        this.cpu = cpu;
        this.gpu = gpu;
        this.ram = ram;
        this.ssd = ssd;
        this.hdd = hdd;
    }

    getCpuData(maps) {
        fetch(config.URL + 'cpu')
            .then(res => res.json())
            .then(data => {
                this.cpu = Controller.getTargetMap(data);
            })
    }
}


class Controller {
    static calculateBenchmarkScore(obj, type) {
        let benchmarkData = '';
        if (type === "Gaming") {
            benchmarkData = config.BENCHMARKRATIO.Gaming;
        } else if (type === "Working") {
            benchmarkData = config.BENCHMARKRATIO.Working;
        }

        let cpu = obj.cpu.Benchmark * benchmarkData.cpu;
        let gpu = obj.gpu.Benchmark * benchmarkData.gpu;
        let ram = obj.ram.Benchmark * benchmarkData.ram;
        let storage = obj.storage.Benchmark * benchmarkData.storage;
        console.log(cpu)
        let result = Math.floor(cpu + ram + gpu + storage);

        return result
    }

    static getKeysArr(map) {
        return Array.from(map.keys());
    }

    static getRamMap(data) {
        let resultMap = new Map();

        for (let curr of data) {
            let spaceIndex = curr.Model.lastIndexOf(' ');
            let xIndex = curr.Model.lastIndexOf('x');
            let currNum = curr.Model.substring(spaceIndex+1, xIndex);
            if (resultMap.has(currNum)) {
                resultMap.get(currNum).push(curr)
            } else {
                resultMap.set(currNum, [curr]);
            };
        }

        return resultMap;
    }

    static getResultObj(arr, selectedModel) {
        return arr.filter(ele => ele.Model === selectedModel)[0];
    }

    static getStorageMap(data) {
        let resultMap = new Map();

        for (let curr of data) {
            let bIndex = curr.Model.lastIndexOf('B');
            let spaceIndex = curr.Model.lastIndexOf(' ', bIndex);
            let currStorageCapacity = curr.Model.substring(spaceIndex+1, bIndex+1);

            if (resultMap.has(currStorageCapacity)) {
                resultMap.get(currStorageCapacity).push(curr)
            } else {
                resultMap.set(currStorageCapacity, [curr]);
            };
        }
        return resultMap;
    }

    static getTargetMap(data) {
        let resultMap = new Map();

        for (let currObj of data) {
            if (resultMap.has(currObj.Brand)) resultMap.get(currObj.Brand).push(currObj);
            else resultMap.set(currObj.Brand, [currObj]);
        }

        return resultMap;
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
    })
}



var ResultComponent = {
    template: '#resultComponent',
    props: ['pc', 'id'],
    data(){
        return {
            cpu: this.pc.cpu,
            gpu: this.pc.gpu,
            ram: this.pc.ram,
            storage: this.pc.storage,
            benchmark: this.pc.benchmark
        }
    }
}



var AddButtonComponent = {
    template: '#addButtonComponent',
    props: ['done'],
    data() {
        return {
            hasDone: this.done,
        }
    },
    watch: {
        done: function(newValue) {
            this.hasDone = this.done;
        },
    }
}


var StorageComponent = {
    template: '#storageComponent',
    data(){
        return {
            storageType: config.STORAGE,
            selectedType: '',
            map: '',
            capacityArr: '',
            selectedCapacity: '',
            brandArr: [],
            selectedBrand: '',
            modelArr: [],
            selectedModel: '',
            arrForSelectModel: '',
        }
    },
    methods: {
        getStorageData() {
            Promise.resolve(fetch(config.URL + this.selectedType))
            .then(res => res.json())
            .then(data => {
                this.map = Controller.getStorageMap(data);
                this.capacityArr = Controller.getKeysArr(this.map);
                this.capacityArr = Controller.sortStorageArr(this.capacityArr);
            })
        },

        selectedEvent() {
            let resultObj = Controller.getResultObj(this.arrForSelectModel, this.selectedModel);
            this.$emit("selected-event", "storage", resultObj)
        },

        unSelectedEvent() {
            this.$emit('un-selected-event', "storage")
        },

        setBrand() {
            this.unSelectedEvent();
            this.selectedBrand = '';
            this.selectedModel = '';
            let brandSet = new Set();

            // ブランド抽出
            this.map.get(this.selectedCapacity).forEach(ele => brandSet.add(ele.Brand));
            this.brandArr = Array.from(brandSet);
        },

        setModel() {
            this.unSelectedEvent();
            this.selectedModel= '';
            this.modelArr = [];
            this.arrForSelectModel = this.map.get(this.selectedCapacity).filter(ele => ele.Brand === this.selectedBrand);
            this.arrForSelectModel.forEach(ele => this.modelArr.push(ele.Model));
        },

        setStorageCapacity() {
            this.unSelectedEvent();
            this.selectedCapacity = '';
            this.selectedModel = '';
            this.getStorageData();
        }
    }
}



var RamComponent = {
    template: `#ramComponent`,
    data(){
        return {
            map: '',
            numArr: '',
            selectedNum: '',
            brandArr: '',
            selectedBrand: '',
            modelArr: [],
            selectedModel: '',
            arrForSelectModel: '',
        }
    },
    created() {
        this.getRamData();
    },
    methods: {
        getRamData() {
            Promise.resolve(fetch(config.URL + 'ram'))
            .then(res => res.json())
            .then(data => {
                this.map = Controller.getRamMap(data);
                this.numArr = Controller.getKeysArr(this.map);
                this.numArr.sort();
            })
        },

        selectedEvent() {
            let resultObj = Controller.getResultObj(this.arrForSelectModel, this.selectedModel);
            this.$emit("selected-event", "ram", resultObj)
        },

        unSelectedEvent() {
            this.$emit('un-selected-event', "ram")
        },

       
        setBrands() {
            this.unSelectedEvent();
            this.selectedBrand = '';
            this.selectedModel = '';
            this.brandArr = [];
            let brandSet = new Set();

            // ブランド抽出
            this.map.get(this.selectedNum).forEach(ele => brandSet.add(ele.Brand))

            this.brandArr = Array.from(brandSet);
        },

        setModel() {
            this. unSelectedEvent();
            this.selectedModel = '';
            this.modelArr = [];
            this.arrForSelectModel = this.map.get(this.selectedNum).filter(ele => ele.Brand === this.selectedBrand);
            this.arrForSelectModel.forEach(ele => this.modelArr.push(ele.Model))
        }
    }
}




var GpuComponent = {
    template: '#gpuComponent',
    data(){
        return {
            map: '',
            brandArr: '',
            selectedBrand: '',
            modelArr: [],
            selectedModel: '',
            arrForSelectModel: '',
        }
    },
    created() {
        this.getGpuData();
    },
    methods: {
        getGpuData() {
            Promise.resolve(fetch(config.URL + 'gpu'))
            .then(res => res.json())
            .then(data => {
                this.map = Controller.getTargetMap(data);
                this.brandArr = Controller.getKeysArr(this.map);
            })
        },

        selectedEvent() {
            let resultObj = Controller.getResultObj(this.arrForSelectModel, this.selectedModel);
            this.$emit("selected-event", "gpu", resultObj)
        },

        unSelectedEvent() {
            this.$emit('un-selected-event', "gpu")
        },

        setModel() {
            this.unSelectedEvent();
            this.modelArr = [];
            this.selectedModel = '';
            this.arrForSelectModel = this.map.get(this.selectedBrand);
            // セレクトしたブランドの配列からモデルを抜き出し
            this.arrForSelectModel.forEach(ele => this.modelArr.push(ele.Model));
        }
    }
}



var CpuComponent = {
    template: '#cpuComponent',
    data(){
        return {
            cpuMap: '',
            cpuBrandArr: '',
            selectedBrand: '',
            cpuModelArr: [],
            selectedModel: '',
            arrForSelectModel: '',

        }
    },
    created() {
        this.getCpuData();
    },
    methods: {
        getCpuData() {
            Promise.resolve(fetch(config.URL + 'cpu'))
            .then(res => res.json())
            .then(data => {
                this.cpuMap = Controller.getTargetMap(data);
                this.cpuBrandArr = Controller.getKeysArr(this.cpuMap);
            })
        },

        selectedEvent() {
            let resultObj = Controller.getResultObj(this.arrForSelectModel, this.selectedModel);
            this.$emit("selected-event", "cpu", resultObj);
        },

        unSelectedEvent() {
            this.$emit('un-selected-event', "cpu")
        },

        setModel() {
            this.unSelectedEvent();
            this.cpuModelArr = [];
            this.selectedModel = '';
            this.arrForSelectModel = '';
            
            this.arrForSelectModel = this.cpuMap.get(this.selectedBrand);
            // セレクトしたブランドの配列からモデルを抜き出し
            this.arrForSelectModel.forEach(ele => this.cpuModelArr.push(ele.Model));
        }
    }

}

var ComputerSelectComponent = {
    template: '#computerSelectComponent',
    data(){
        return {
            cpu: false,
            gpu: false,
            ram: false,
            storage: false,
            hasDone: false,
            pcObj: {
                cpu: '',
                gpu: '',
                ram: '',
                storage: '',
                benchmark: {
                    gamingScore: '',
                    workingScore: '',
                }
            }
        }
    },
    watch: {
        cpu: function() {
            this.judgeHasDone();
        },
        gpu: function() {
            this.judgeHasDone();
        },
        ram: function() {
            this.judgeHasDone();
        },
        storage: function() {
            this.judgeHasDone();
        },
    },
    methods: {
        createPc() {
            this.hasDone = false;
            this.pcObj.benchmark.gamingScore = Controller.calculateBenchmarkScore(this.pcObj, "Gaming");
            this.pcObj.benchmark.workingScore = Controller.calculateBenchmarkScore(this.pcObj, "Working");
            this.$emit("complete-event", this.pcObj);
        },

        judgeHasDone() {
            if (this.cpu == true && this.gpu == true && this.ram == true && this.storage == true) {
                this.hasDone = true;
            }
            else this.hasDone = false;
        },

        selectedEvent(...value) {
            let type = value[0];
            let obj = value[1];
            switch(type) {
                case "cpu":
                    this.cpu = true;
                    this.pcObj.cpu = obj;
                    break;
                case "gpu":
                    this.gpu = true;
                    this.pcObj.gpu = obj;
                    break;
                case "ram":
                    this.ram = true;
                    this.pcObj.ram = obj;
                    break;
                case "storage":
                    this.storage = true;
                    this.pcObj.storage = obj;
                    break;
            }
            
        },

        unSelectedEvent(value) {
            switch (value) {
                case "cpu":
                    this.cpu = false;
                    this.pcObj.cpu = '';
                    break;
                case "gpu":
                    this.gpu = false;
                    this.pcObj.gpu = '';
                    break;
                case "ram":
                    this.ram = false;
                    this.pcObj.ram = '';
                    break;
                case "storage":
                    this.storage = false;
                    this.pcObj.storage = '';
                    break;
            }
        }

    },
    components: {
        'cpu-component': CpuComponent,
        'gpu-component': GpuComponent,
        'ram-component': RamComponent,
        'storage-component': StorageComponent,
        'add-button-component': AddButtonComponent,
    }
}


var vm = new Vue({
    el: '#app',
    data: {
        user: [],
        obj: '',
    },
    methods: {
        completeEvent(obj) {    
            // 参照渡しから値渡しへ脱却
            this.obj = JSON.parse(JSON.stringify(obj));
            this.user.push(this.obj);
        }
    },
    components: {
        'computer-select-component': ComputerSelectComponent,
        'result-component': ResultComponent,
    }
})
