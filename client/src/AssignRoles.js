import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SupplyChainABI from './artifacts/SupplyChain.json';
import { useHistory } from 'react-router-dom';

function AssignRoles() {
    const history = useHistory();
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, []);

    const [currentaccount, setCurrentaccount] = useState('');
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [RMSname, setRMSname] = useState('');
    const [MANname, setMANname] = useState('');
    const [DISname, setDISname] = useState('');
    const [RETname, setRETname] = useState('');
    const [RMSplace, setRMSplace] = useState('');
    const [MANplace, setMANplace] = useState('');
    const [DISplace, setDISplace] = useState('');
    const [RETplace, setRETplace] = useState('');
    const [RMSaddress, setRMSaddress] = useState('');
    const [MANaddress, setMANaddress] = useState('');
    const [DISaddress, setDISaddress] = useState('');
    const [RETaddress, setRETaddress] = useState('');
    const [RMS, setRMS] = useState({});
    const [MAN, setMAN] = useState({});
    const [DIS, setDIS] = useState({});
    const [RET, setRET] = useState({});

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('Trình duyệt không hỗ trợ Ethereum. Bạn nên thử MetaMask!');
        }
    };

    const loadBlockchaindata = async () => {
        setloader(true);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setCurrentaccount(accounts[0]);
        const networkId = await web3.eth.net.getId();
        const networkData = SupplyChainABI.networks[networkId];
        if (networkData) {
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
            setSupplyChain(supplychain);
            const rmsCtr = await supplychain.methods.rmsCtr().call();
            const rms = {};
            for (let i = 0; i < rmsCtr; i++) {
                rms[i] = await supplychain.methods.RMS(i + 1).call();
            }
            setRMS(rms);

            const manCtr = await supplychain.methods.manCtr().call();
            const man = {};
            for (let i = 0; i < manCtr; i++) {
                man[i] = await supplychain.methods.MAN(i + 1).call();
            }
            setMAN(man);

            const disCtr = await supplychain.methods.disCtr().call();
            const dis = {};
            for (let i = 0; i < disCtr; i++) {
                dis[i] = await supplychain.methods.DIS(i + 1).call();
            }
            setDIS(dis);

            const retCtr = await supplychain.methods.retCtr().call();
            const ret = {};
            for (let i = 0; i < retCtr; i++) {
                ret[i] = await supplychain.methods.RET(i + 1).call();
            }
            setRET(ret);
            setloader(false);
        } else {
            window.alert('Hợp đồng thông minh chưa được triển khai trên mạng hiện tại');
        }
    };

    const redirect_to_home = () => {
        history.push('/');
    };

    const handlerSubmitRMS = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.addRMS(RMSaddress, RMSname, RMSplace).send({ from: currentaccount });
            if (receipt) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert('Đã xảy ra lỗi!!!');
        }
    };

    const handlerSubmitMAN = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.addManufacturer(MANaddress, MANname, MANplace).send({ from: currentaccount });
            if (receipt) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert('Đã xảy ra lỗi!!!');
        }
    };

    const handlerSubmitDIS = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.addDistributor(DISaddress, DISname, DISplace).send({ from: currentaccount });
            if (receipt) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert('Đã xảy ra lỗi!!!');
        }
    };

    const handlerSubmitRET = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.addRetailer(RETaddress, RETname, RETplace).send({ from: currentaccount });
            if (receipt) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert('Đã xảy ra lỗi!!!');
        }
    };

    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    };

    if (loader) {
        return (
            <div style={styles.loadingContainer}>
                <h1 style={styles.loadingText}>Đang tải...</h1>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <span style={styles.account}><b>Địa chỉ tài khoản hiện tại:</b> {currentaccount}</span>
            <button onClick={redirect_to_home} style={styles.homeButton}>TRANG CHỦ</button>
            <div style={styles.section}>
                <h4>Nhà cung cấp nguyên liệu thô:</h4>
                <form onSubmit={handlerSubmitRMS} style={styles.form}>
                    <input className="form-control-sm" type="text" onChange={handleChange(setRMSaddress)} placeholder="Địa chỉ Ethereum" required />
                    <input className="form-control-sm" type="text" onChange={handleChange(setRMSname)} placeholder="Tên nhà cung cấp" required />
                    <input className="form-control-sm" type="text" onChange={handleChange(setRMSplace)} placeholder="Địa điểm" required />
                    <button className="btn btn-outline-success btn-sm" type="submit">Đăng ký</button>
                </form>
                <table className="table table-sm" style={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Địa điểm</th>
                            <th scope="col">Địa chỉ Ethereum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(RMS).map((key) => (
                            <tr key={key}>
                                <td>{RMS[key].id}</td>
                                <td>{RMS[key].name}</td>
                                <td>{RMS[key].place}</td>
                                <td>{RMS[key].addr}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={styles.section}>
                <h4>Nhà sản xuất:</h4>
                <form onSubmit={handlerSubmitMAN} style={styles.form}>
                    <input className="form-control-sm" type="text" onChange={handleChange(setMANaddress)} placeholder="Địa chỉ Ethereum" required />
                    <input className="form-control-sm" type="text" onChange={handleChange(setMANname)} placeholder="Tên nhà sản xuất" required />
                    <input className="form-control-sm" type="text" onChange={handleChange(setMANplace)} placeholder="Địa điểm" required />
                    <button className="btn btn-outline-success btn-sm" type="submit">Đăng ký</button>
                </form>
                <table className="table table-sm" style={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Địa điểm</th>
                            <th scope="col">Địa chỉ Ethereum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(MAN).map((key) => (
                            <tr key={key}>
                                <td>{MAN[key].id}</td>
                                <td>{MAN[key].name}</td>
                                <td>{MAN[key].place}</td>
                                <td>{MAN[key].addr}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={styles.section}>
                <h4>Nhà phân phối:</h4>
                <form onSubmit={handlerSubmitDIS} style={styles.form}>
                    <input className="form-control-sm" type="text" onChange={handleChange(setDISaddress)} placeholder="Địa chỉ Ethereum" required />
                    <input className="form-control-sm" type="text" onChange={handleChange(setDISname)} placeholder="Tên nhà phân phối" required />
                    <input className="form-control-sm" type="text" onChange={handleChange(setDISplace)} placeholder="Địa điểm" required />
                    <button className="btn btn-outline-success btn-sm" type="submit">Đăng ký</button>
                </form>
                <table className="table table-sm" style={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Địa điểm</th>
                            <th scope="col">Địa chỉ Ethereum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(DIS).map((key) => (
                            <tr key={key}>
                                <td>{DIS[key].id}</td>
                                <td>{DIS[key].name}</td>
                                <td>{DIS[key].place}</td>
                                <td>{DIS[key].addr}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={styles.section}>
                <h4>Nhà bán lẻ:</h4>
                <form onSubmit={handlerSubmitRET} style={styles.form}>
                    <input className="form-control-sm" type="text" onChange={handleChange(setRETaddress)} placeholder="Địa chỉ Ethereum" required />
                    <input className="form-control-sm" type="text" onChange={handleChange(setRETname)} placeholder="Tên nhà bán lẻ" required />
                    <input className="form-control-sm" type="text" onChange={handleChange(setRETplace)} placeholder="Địa điểm" required />
                    <button className="btn btn-outline-success btn-sm" type="submit">Đăng ký</button>
                </form>
                <table className="table table-sm" style={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Địa điểm</th>
                            <th scope="col">Địa chỉ Ethereum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(RET).map((key) => (
                            <tr key={key}>
                                <td>{RET[key].id}</td>
                                <td>{RET[key].name}</td>
                                <td>{RET[key].place}</td>
                                <td>{RET[key].addr}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    loadingText: {
        fontSize: '2rem',
        color: '#555',
    },
    container: {
        padding: '20px',
    },
    account: {
        display: 'block',
        marginBottom: '10px',
    },
    homeButton: {
        marginBottom: '20px',
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    section: {
        marginBottom: '30px',
    },
    form: {
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        marginBottom: '20px',
    },
};

export default AssignRoles;
