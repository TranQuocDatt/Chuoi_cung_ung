import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"

function Supply() {
    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState({});
    const [MedStage, setMedStage] = useState([]);
    const [ID, setID] = useState("");

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

    const handlerChangeID = (event) => {
        setID(event.target.value);
    }

    const handlerSubmitRMSsupply = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.RMSsupply(ID).send({ from: currentaccount });
            if (receipt) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert("Đã xảy ra lỗi!!!")
        }
    }

    const handlerSubmitManufacturing = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.Manufacturing(ID).send({ from: currentaccount });
            if (receipt) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert("Đã xảy ra lỗi!!!")
        }
    }

    const handlerSubmitDistribute = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.Distribute(ID).send({ from: currentaccount });
            if (receipt) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert("Đã xảy ra lỗi!!!")
        }
    }

    const handlerSubmitRetail = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.Retail(ID).send({ from: currentaccount });
            if (receipt) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert("Đã xảy ra lỗi!!!")
        }
    }

    const handlerSubmitSold = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.sold(ID).send({ from: currentaccount });
            if (receipt) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert("Đã xảy ra lỗi!!!")
        }
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Chuỗi Cung Ứng Thuốc</h2>
            <span><b>Địa chỉ tài khoản hiện tại:</b> {currentaccount}</span>
            <br />
            <span onClick={redirect_to_home} className="btn btn-outline-danger btn-sm" style={{ marginLeft: '10px' }}> TRANG CHỦ</span>
            <h6><b>Dòng chảy Chuỗi Cung Ứng:</b></h6>
            <p>Đơn hàng thuốc -&gt; Nhà cung cấp nguyên liệu thô -&gt; Nhà sản xuất -&gt; Nhà phân phối -&gt; Nhà bán lẻ -&gt; Người tiêu dùng</p>
            <table className="table table-sm table-dark" style={{ marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', width: '80%' }}>
                <thead>
                    <tr>
                        <th scope="col">ID Thuốc</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Giai đoạn xử lý hiện tại</th>
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
            <h5><b>Bước 1: Cung cấp Nguyên liệu Thô</b> (Chỉ nhà cung cấp nguyên liệu thô đã đăng ký mới có thể thực hiện bước này):</h5>
            <form onSubmit={handlerSubmitRMSsupply} style={{ display: 'inline-block', textAlign: 'left', marginTop: '10px', width: '300px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Nhập ID Thuốc" required style={{ marginBottom: '5px', width: '100%' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-outline-success btn-sm">Cung cấp</button>
                </div>
            </form>
            <hr />
            <h5><b>Bước 2: Sản xuất</b> (Chỉ nhà sản xuất đã đăng ký mới có thể thực hiện bước này):</h5>
            <form onSubmit={handlerSubmitManufacturing} style={{ display: 'inline-block', textAlign: 'left', marginTop: '10px', width: '300px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Nhập ID Thuốc" required style={{ marginBottom: '5px', width: '100%' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-outline-success btn-sm">Sản xuất</button>
                </div>
            </form>
            <hr />
            <h5><b>Bước 3: Phân phối</b> (Chỉ nhà phân phối đã đăng ký mới có thể thực hiện bước này):</h5>
            <form onSubmit={handlerSubmitDistribute} style={{ display: 'inline-block', textAlign: 'left', marginTop: '10px', width: '300px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Nhập ID Thuốc" required style={{ marginBottom: '5px', width: '100%' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-outline-success btn-sm">Phân phối</button>
                </div>
            </form>
            <hr />
            <h5><b>Bước 4: Bán lẻ</b> (Chỉ nhà bán lẻ đã đăng ký mới có thể thực hiện bước này):</h5>
            <form onSubmit={handlerSubmitRetail} style={{ display: 'inline-block', textAlign: 'left', marginTop: '10px', width: '300px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Nhập ID Thuốc" required style={{ marginBottom: '5px', width: '100%' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-outline-success btn-sm">Bán lẻ</button>
                </div>
            </form>
            <hr />
            <h5><b>Bước 5: Đánh dấu đã bán</b> (Chỉ nhà bán lẻ đã đăng ký mới có thể thực hiện bước này):</h5>
            <form onSubmit={handlerSubmitSold} style={{ display: 'inline-block', textAlign: 'left', marginTop: '10px', width: '300px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Nhập ID Thuốc" required style={{ marginBottom: '5px', width: '100%' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-outline-success btn-sm">Đã bán</button>
                </div>
            </form>
            <hr />
        </div>
    )
}

export default Supply
