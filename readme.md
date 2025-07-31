这是一个跟着 solana 训练营视频学习 solana 合约，同时有前端交互。

@solana/web3.js 已经有了第二版 @solana/kit，所以这里的项目会去掉训练营中的 @solana/web3.js 相关代码，改成 @solana/kit。

最后会依靠自己写一个关于 水滴筹 的合约，同样会有前端交互，打算采用 React native Expo

大概思路：

App 内做 kyc 进行验证，个人身份会与特定钱包进行绑定，会添加解绑功能，但需要 3 天时间，KYC 成功之后可以 claim 项目 NFT，默克尔树白名单 NFT。

只有持有项目 NFT 的人才可以发起众筹活动。也就是说，只有通过 KYC 才可以进行发布众筹，以免 spam。众筹资金可以选择 SOL 或者 USDT。

捐助者 无限制

web 项目会采用子图获取链上数据
