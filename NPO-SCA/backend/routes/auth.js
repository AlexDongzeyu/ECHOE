router.post('/send-verification', async (req, res) => {
    const { email } = req.body;
    
    try {
        // 生成验证码
        const verificationCode = generateRandomCode();
        
        // 存储验证码到数据库（设置过期时间）
        await db.collection('verificationCodes').insertOne({
            email,
            code: verificationCode,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10分钟过期
        });
        
        // 发送验证邮件
        await sendVerificationEmail(email, verificationCode);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send verification code' });
    }
});

router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;
    
    try {
        const verification = await db.collection('verificationCodes').findOne({
            email,
            code,
            expiresAt: { $gt: new Date() }
        });
        
        if (!verification) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

router.post('/create-account', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 检查邮箱是否已存在
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 创建用户账户
        await db.collection('users').insertOne({
            email,
            password: hashedPassword,
            createdAt: new Date(),
            role: 'user' // 默认角色
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create account' });
    }
}); 