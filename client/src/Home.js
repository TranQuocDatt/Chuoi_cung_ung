import React from 'react';
import { useHistory } from 'react-router-dom';

function Home() {
    const history = useHistory();
    const redirect_to_roles = () => {
        history.push('/roles');
    };
    const redirect_to_addmed = () => {
        history.push('/addmed');
    };
    const redirect_to_supply = () => {
        history.push('/supply');
    };
    const redirect_to_track = () => {
        history.push('/track');
    };
    return (
        <div style={styles.container}>
            <h3 style={styles.header}>Chuỗi cung ứng dược phẩm:</h3>
            <br />
            <h6 style={styles.note}>(Lưu ý: <u>Chủ sở hữu</u> là người triển khai hợp đồng thông minh trên blockchain)</h6>
            <h5 style={styles.step}>Bước 1: Chủ sở hữu nên đăng ký các nhà cung cấp nguyên liệu thô, nhà sản xuất, nhà phân phối và nhà bán lẻ</h5>
            <h6 style={styles.note}>(Lưu ý: Đây là bước thực hiện một lần. Bỏ qua bước 2 nếu đã hoàn thành)</h6>
            <button onClick={redirect_to_roles} style={styles.button}>Đăng ký</button>
            <br />
            <h5 style={styles.step}>Bước 2: Chủ sở hữu nên đặt hàng thuốc</h5>
            <button onClick={redirect_to_addmed} style={styles.button}>Đặt hàng thuốc</button>
            <br />
            <h5 style={styles.step}>Bước 3: Kiểm soát chuỗi cung ứng</h5>
            <button onClick={redirect_to_supply} style={styles.button}>Kiểm soát chuỗi cung ứng</button>
            <br />
            <hr />
            <br />
            <h5 style={styles.track}><b>Theo dõi</b> thuốc:</h5>
            <button onClick={redirect_to_track} style={styles.button}>Theo dõi thuốc</button>
        </div>
    );
}

const styles = {
    container: {
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    header: {
        color: '#333',
        fontSize: '24px',
    },
    note: {
        color: '#777',
        fontSize: '14px',
    },
    step: {
        color: '#555',
        fontSize: '18px',
        margin: '10px 0',
    },
    track: {
        color: '#333',
        fontSize: '20px',
        margin: '20px 0',
    },
    button: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        margin: '10px 0',
        borderRadius: '4px',
        outline: 'none',
        transition: 'background-color 0.3s ease',
    }
};

export default Home;
