import mysql from 'mysql2';
import { user, group, userGroups } from '../types/types';

const databaseConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    insecureAuth: true,
    database: process.env.DB_NAME
})

export const connectDatabase = async () => {
    return new Promise<void>((resolve, reject) => {
        databaseConnection.connect((error) => {
            if (error) {
                console.error("Error connecting to the database:", error.message);
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

export const getAllUsers = (limit?: number, offset?: number): Promise<user[]> => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM `users`";
        const params: number[] = [];

        if (limit) {
            query += " LIMIT ?";
            params.push(limit);

            if (offset) {
                query += " OFFSET ?";
                params.push(offset);
            }
        }

        query += ";";

        databaseConnection.query(query, params, (error, results) => {
            if (error) {
                console.error("Error fetching users:", error.message);
                return reject(error);
            }
            resolve(results as user[]);
        });
    });
};

export const getAllGroups = (limit?: number, offset?: number): Promise<group[]> => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM `groups`";
        const params: number[] = [];

        if (limit) {
            query += " LIMIT ?";
            params.push(limit);

            if (offset) {
                query += " OFFSET ?";
                params.push(offset);
            }
        }

        query += ";";

        databaseConnection.query(query, params, (error, results) => {
            if (error) {
                console.error("Error fetching groups:", error.message);
                return reject(error);
            }
            resolve(results as group[]);
        });
    });
};

export const removeUserFromGroup = (userId: number, groupId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const removeUserMutation = "DELETE FROM `user_groups` WHERE `user_id` = ? AND `group_id` = ?;";
        databaseConnection.query(removeUserMutation, [userId, groupId], (error) => {
            if (error) {
                console.error("Error removing user from group:", error.message);
                return reject(error);
            }
        });

        const getRemainingGroupUsersQuery = "SELECT * FROM `user_groups` WHERE `group_id` = ?;";
        databaseConnection.query(getRemainingGroupUsersQuery, [groupId], (error, results: userGroups[]) => {
            if (error) {
                console.error("Error fetching remaining group users:", error.message);
                return reject(error);
            }

            if (results.length === 0) {
                const changeGroupStatusQuery = "UPDATE `groups` SET `status` = 'Empty' WHERE `id` = ?;";
                databaseConnection.query(changeGroupStatusQuery, [groupId], (error) => {
                    if (error) {
                        console.error("Error updating group status:", error.message);
                        return reject(error);
                    }
                });
            }

            resolve()
        });
    });
}