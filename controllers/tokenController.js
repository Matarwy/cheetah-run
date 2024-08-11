const Token = require('../models/Token');

exports.addTokens = async (req, res) => {
    const { userId, score } = req.body;

    try {
        let userTokens = await Token.findOne({ userId });

        if (!userTokens) {
            userTokens = new Token({ userId, tokens: score });
        } else {
            userTokens.tokens += score;
        }

        await userTokens.save();
        res.status(200).json({ success: true, tokens: userTokens.tokens });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding tokens' });
    }
};

exports.getTokens = async (req, res) => {
    const { userId } = req.params;

    try {
        const userTokens = await Token.findOne({ userId });

        if (!userTokens) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, tokens: userTokens.tokens });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching tokens' });
    }
};
