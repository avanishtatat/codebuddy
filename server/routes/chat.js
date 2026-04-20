const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');

const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic();

// POST /chat - Create a new message
router.post('/', protect, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const today = new Date();
        const lastMessageDate = user.lastMessageDate ? new Date(user.lastMessageDate) : null;

        // Reset lastMessageDate if it's a new day
        if (!lastMessageDate || lastMessageDate.toDateString() !== today.toDateString()) {
            user.messagesUsedToday = 0;
            user.lastMessageDate = today;
        }

        if (user.messagesUsedToday >= 20) {
            return res.status(429).json({ message: 'Daily limit reached. Come back tomorrow.' });
        }

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message content is required.' });
        }

        // Fetch the last 10 messages for context from the same user
        const recentMessages = await Message.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10);

        // Reverse so oldest is first for claude context
        recentMessages.reverse();

        // Prepare the context for the Anthropic API
        const SYSTEM_PROMPT = `You are CodeBuddy, a helpful coding assistant for beginner and 
intermediate developers. Only answer coding-related questions. If asked anything 
unrelated to coding, politely decline and redirect them to ask a coding question.`;

        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [
                ...recentMessages.map(msg => ({role: msg.role, content: msg.content })),
                { role: 'user', content: message }
            ]
        });
        
        const contentBlock = response.content?.[0];
        if (!contentBlock || contentBlock.type !== 'text' || !contentBlock.text) {
            console.error('Unexpected response format from Anthropic API:', response);
            throw new Error('Unexpected response format from AI');
        }
        const reply = contentBlock.text.trim();

        // Save the user's message and the assistant's reply to the database
        const assistantMessage = reply;
        const session = await Message.startSession();
        session.startTransaction();
        try {
            await Message.insertMany([
                { userId, role: 'user', content: message },
                { userId, role: 'assistant', content: assistantMessage }
            ], { session });
            user.messagesUsedToday += 1;
            user.lastMessageDate = new Date();
            await user.save({ session });
            await session.commitTransaction();
        } catch (txError) {
            await session.abortTransaction();
            console.log('Transaction error:', txError); 
            throw txError;
        } finally {
            session.endSession();
        }
        
        

        res.status(201).json({ message: assistantMessage });
    } catch (error) {
        console.error('Error processing chat message:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /chat/history - Get chat history for the authenticated user
router.get('/history', protect, async (req, res) => {
    const userId = req.user.id;

    try {
        const messages = await Message.find({ userId }).sort({ createdAt: -1 }).limit(50);
        messages.reverse(); // flip oldest first for better display
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;