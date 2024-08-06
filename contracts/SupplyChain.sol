// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SupplyChain {
    address public Owner;

    constructor() public {
        Owner = msg.sender;
    }

    modifier onlyByOwner() {
        require(msg.sender == Owner, "Only owner can call this function");
        _;
    }

    enum STAGE {
        Init,
        RawMaterialSupply,
        Manufacture,
        Distribution,
        Retail,
        Sold
    }

    uint256 public medicineCtr = 0;
    uint256 public rmsCtr = 0;
    uint256 public manCtr = 0;
    uint256 public disCtr = 0;
    uint256 public retCtr = 0;

    struct Medicine {
        uint256 id;
        string name;
        string description;
        uint256 RMSid;
        uint256 MANid;
        uint256 DISid;
        uint256 RETid;
        STAGE stage;
    }

    mapping(uint256 => Medicine) public MedicineStock;
    mapping(string => uint256) private medicineNameToID;

    function showStage(uint256 _medicineID) public view returns (string memory) {
        require(medicineCtr > 0, "No medicines in stock");
        Medicine memory med = MedicineStock[_medicineID];
        if (med.stage == STAGE.Init) return "Medicine Ordered";
        if (med.stage == STAGE.RawMaterialSupply) return "Raw Material Supply Stage";
        if (med.stage == STAGE.Manufacture) return "Manufacturing Stage";
        if (med.stage == STAGE.Distribution) return "Distribution Stage";
        if (med.stage == STAGE.Retail) return "Retail Stage";
        if (med.stage == STAGE.Sold) return "Medicine Sold";
        revert("Invalid stage");
    }

    struct RawMaterialSupplier {
        address addr;
        uint256 id;
        string name;
        string place;
    }

    mapping(uint256 => RawMaterialSupplier) public RMS;

    struct Manufacturer {
        address addr;
        uint256 id;
        string name;
        string place;
    }

    mapping(uint256 => Manufacturer) public MAN;

    struct Distributor {
        address addr;
        uint256 id;
        string name;
        string place;
    }

    mapping(uint256 => Distributor) public DIS;

    struct Retailer {
        address addr;
        uint256 id;
        string name;
        string place;
    }

    mapping(uint256 => Retailer) public RET;

    event RMSAdded(uint256 indexed rmsId, address indexed addr, string name, string place);
    event ManufacturerAdded(uint256 indexed manId, address indexed addr, string name, string place);
    event DistributorAdded(uint256 indexed disId, address indexed addr, string name, string place);
    event RetailerAdded(uint256 indexed retId, address indexed addr, string name, string place);
    event MedicineAdded(uint256 indexed medicineId, string name, string description);
    event StageUpdated(uint256 indexed medicineId, STAGE stage);

    function addRMS(address _address, string memory _name, string memory _place) public onlyByOwner() {
        rmsCtr++;
        RMS[rmsCtr] = RawMaterialSupplier(_address, rmsCtr, _name, _place);
        emit RMSAdded(rmsCtr, _address, _name, _place);
    }

    function addManufacturer(address _address, string memory _name, string memory _place) public onlyByOwner() {
        manCtr++;
        MAN[manCtr] = Manufacturer(_address, manCtr, _name, _place);
        emit ManufacturerAdded(manCtr, _address, _name, _place);
    }

    function addDistributor(address _address, string memory _name, string memory _place) public onlyByOwner() {
        disCtr++;
        DIS[disCtr] = Distributor(_address, disCtr, _name, _place);
        emit DistributorAdded(disCtr, _address, _name, _place);
    }

    function addRetailer(address _address, string memory _name, string memory _place) public onlyByOwner() {
        retCtr++;
        RET[retCtr] = Retailer(_address, retCtr, _name, _place);
        emit RetailerAdded(retCtr, _address, _name, _place);
    }

    function RMSsupply(uint256 _medicineID) public {
        require(_medicineID > 0 && _medicineID <= medicineCtr, "Invalid medicine ID");
        uint256 _id = findRMS(msg.sender);
        require(_id > 0, "RMS not found");
        require(MedicineStock[_medicineID].stage == STAGE.Init, "Medicine not in Init stage");
        MedicineStock[_medicineID].RMSid = _id;
        MedicineStock[_medicineID].stage = STAGE.RawMaterialSupply;
        emit StageUpdated(_medicineID, STAGE.RawMaterialSupply);
    }

    function findRMS(address _address) private view returns (uint256) {
        require(rmsCtr > 0, "No RMS available");
        for (uint256 i = 1; i <= rmsCtr; i++) {
            if (RMS[i].addr == _address) return RMS[i].id;
        }
        return 0;
    }

    function Manufacturing(uint256 _medicineID) public {
        require(_medicineID > 0 && _medicineID <= medicineCtr, "Invalid medicine ID");
        uint256 _id = findMAN(msg.sender);
        require(_id > 0, "Manufacturer not found");
        require(MedicineStock[_medicineID].stage == STAGE.RawMaterialSupply, "Medicine not in RawMaterialSupply stage");
        MedicineStock[_medicineID].MANid = _id;
        MedicineStock[_medicineID].stage = STAGE.Manufacture;
        emit StageUpdated(_medicineID, STAGE.Manufacture);
    }

    function findMAN(address _address) private view returns (uint256) {
        require(manCtr > 0, "No manufacturers available");
        for (uint256 i = 1; i <= manCtr; i++) {
            if (MAN[i].addr == _address) return MAN[i].id;
        }
        return 0;
    }

    function Distribute(uint256 _medicineID) public {
        require(_medicineID > 0 && _medicineID <= medicineCtr, "Invalid medicine ID");
        uint256 _id = findDIS(msg.sender);
        require(_id > 0, "Distributor not found");
        require(MedicineStock[_medicineID].stage == STAGE.Manufacture, "Medicine not in Manufacture stage");
        MedicineStock[_medicineID].DISid = _id;
        MedicineStock[_medicineID].stage = STAGE.Distribution;
        emit StageUpdated(_medicineID, STAGE.Distribution);
    }

    function findDIS(address _address) private view returns (uint256) {
        require(disCtr > 0, "No distributors available");
        for (uint256 i = 1; i <= disCtr; i++) {
            if (DIS[i].addr == _address) return DIS[i].id;
        }
        return 0;
    }

    function Retail(uint256 _medicineID) public {
        require(_medicineID > 0 && _medicineID <= medicineCtr, "Invalid medicine ID");
        uint256 _id = findRET(msg.sender);
        require(_id > 0, "Retailer not found");
        require(MedicineStock[_medicineID].stage == STAGE.Distribution, "Medicine not in Distribution stage");
        MedicineStock[_medicineID].RETid = _id;
        MedicineStock[_medicineID].stage = STAGE.Retail;
        emit StageUpdated(_medicineID, STAGE.Retail);
    }

    function findRET(address _address) private view returns (uint256) {
        require(retCtr > 0, "No retailers available");
        for (uint256 i = 1; i <= retCtr; i++) {
            if (RET[i].addr == _address) return RET[i].id;
        }
        return 0;
    }

    function sold(uint256 _medicineID) public {
        require(_medicineID > 0 && _medicineID <= medicineCtr, "Invalid medicine ID");
        uint256 _id = findRET(msg.sender);
        require(_id > 0, "Retailer not found");
        require(_id == MedicineStock[_medicineID].RETid, "Retailer mismatch");
        require(MedicineStock[_medicineID].stage == STAGE.Retail, "Medicine not in Retail stage");
        MedicineStock[_medicineID].stage = STAGE.Sold;
        emit StageUpdated(_medicineID, STAGE.Sold);
    }

    function addMedicine(string memory _name, string memory _description) public onlyByOwner() {
        require(rmsCtr > 0 && manCtr > 0 && disCtr > 0 && retCtr > 0, "All participants must be added");
        medicineCtr++;
        MedicineStock[medicineCtr] = Medicine(medicineCtr, _name, _description, 0, 0, 0, 0, STAGE.Init);
        medicineNameToID[_name] = medicineCtr;
        emit MedicineAdded(medicineCtr, _name, _description);
    }

    function getMedicineByID(uint256 _medicineID) public view returns (uint256, string memory, string memory, uint256, uint256, uint256, uint256, STAGE) {
        require(_medicineID > 0 && _medicineID <= medicineCtr, "Invalid medicine ID");
        Medicine memory med = MedicineStock[_medicineID];
        return (med.id, med.name, med.description, med.RMSid, med.MANid, med.DISid, med.RETid, med.stage);
    }

    function getMedicineByName(string memory _name) public view returns (uint256, string memory, string memory, uint256, uint256, uint256, uint256, STAGE) {
        uint256 _medicineID = medicineNameToID[_name];
        require(_medicineID > 0, "Medicine not found");
        Medicine memory med = MedicineStock[_medicineID];
        return (med.id, med.name, med.description, med.RMSid, med.MANid, med.DISid, med.RETid, med.stage);
    }
}
