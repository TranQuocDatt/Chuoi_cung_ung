import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"

function AddMed() {
    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState({});
    const [MedName, setMedName] = useState("");
    const [MedDes, setMedDes] = useState("");
    const [MedStage, setMedStage] = useState([]);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Trình duyệt không hỗ trợ Ethereum. Hãy thử MetaMask!"
            );
        }
    };

    const loadBlockchaindata = async () => {
        setloader(true);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setCurrentaccount(account);
        const networkId = await web3.eth.net.getId();
        const networkData = SupplyChainABI.networks[networkId];
        if (networkData) {
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
            setSupplyChain(supplychain);
            const medCtr = await supplychain.methods.medicineCtr().call();
            const med = {};
            const medStage = [];
            for (let i = 0; i < medCtr; i++) {
                med[i] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i] = await supplychain.methods.showStage(i + 1).call();
            }
            setMED(med);
            setMedStage(medStage);
            setloader(false);
        } else {
            window.alert('Hợp đồng thông minh chưa được triển khai trên mạng hiện tại')
        }
    }

    if (loader) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h1 className="wait">Đang tải...</h1>
            </div>
        )
    }

    const redirect_to_home = () => {
        history.push('/')
    }

    const handlerChangeNameMED = (event) => {
        setMedName(event.target.value);
    }

    const handlerChangeDesMED = (event) => {
        setMedDes(event.target.value);
    }

    const handlerSubmitMED = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.addMedicine(MedName, MedDes).send({ from: currentaccount });
            if (receipt) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert("Đã xảy ra lỗi!!!")
        }
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Quản lý Thuốc</h2>
            <span><b>Địa chỉ tài khoản hiện tại:</b> {currentaccount}</span>
            <br />
            <span onClick={redirect_to_home} className="btn btn-outline-danger btn-sm" style={{ marginLeft: '10px' }}> TRANG CHỦ</span>
            <br />
            <h5>Thêm đơn hàng thuốc:</h5>
            <form onSubmit={handlerSubmitMED} style={{ display: 'inline-block', textAlign: 'left', marginTop: '10px', width: '300px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <input className="form-control-sm" type="text" onChange={handlerChangeNameMED} placeholder="Tên thuốc" required style={{ marginBottom: '5px', width: '100%' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input className="form-control-sm" type="text" onChange={handlerChangeDesMED} placeholder="Mô tả thuốc" required style={{ width: '100%' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-outline-success btn-sm">Đặt hàng</button>
                </div>
            </form>
            <br />
            <h5>Danh sách thuốc đã đặt:</h5>
            <table className="table table-bordered" style={{ marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Giai đoạn hiện tại</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(MED).map(key => (
                        <tr key={key}>
                            <td>{MED[key].id}</td>
                            <td>{MED[key].name}</td>
                            <td>{MED[key].description}</td>
                            <td>{MedStage[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AddMed
