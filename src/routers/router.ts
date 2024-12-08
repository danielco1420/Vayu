import express from "express";
import { query as queryValidator, body as bodyValidator } from "express-validator";
const router = express.Router();
import { getAllUsers, getAllGroups, removeUserFromGroup } from "../utils/database";

router.get('/users',
    queryValidator('limit').isNumeric().optional(), queryValidator('offset').isNumeric().optional(),
    async (req, res) => {
        try {
            const limit = req.query && parseInt(req.query.limit as string, 10) || 10;
            const offset = req.query && parseInt(req.query.offset as string, 10) || 0;
            const users = await getAllUsers(limit, offset);
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error.message);
            res.status(500).json({ error: "Failed to fetch users" });
        }
    })

router.get('/groups',
    queryValidator('limit').isNumeric().optional(), queryValidator('offset').isNumeric().optional(),
    async (req, res) => {
        try {
            const limit = req.query && parseInt(req.query.limit as string, 10) || 10;
            const offset = req.query && parseInt(req.query.offset as string, 10) || 0;
            const groups = await getAllGroups(limit, offset);
            res.json(groups);
        } catch (error) {
            console.error("Error fetching groups:", error.message);
            res.status(500).json({ error: "Failed to fetch groups" });
        }
    })

router.post('/remove',
    bodyValidator('userId').isNumeric(), queryValidator('groupId').isNumeric(),
    async (req, res) => {
        try {
            const userId = parseInt(req.body.userId as string, 10);
            const groupId = parseInt(req.body.groupId as string, 10);

            if (isNaN(userId) || isNaN(groupId)) {
                return res.status(400).json({ error: "Invalid userId or groupId" });
            }

            await removeUserFromGroup(userId, groupId);
            res.status(200).send("User removed from group");
        } catch (error) {
            console.error("Error removing user from group:", error.message);
            res.status(500).json({ error: "Failed to remove user from group" });
        }
    })


export default router;