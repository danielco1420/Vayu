import express from 'express';
import bodyParser from 'body-parser';
import router from './routers/router.ts';
import { connectDatabase } from './utils/database.ts';
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (_, res) => {
    res.send('server active')
})

app.use('/api', router);

connectDatabase().then(() => {
    console.log("Database connected");
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })

}).catch((error) => {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
})

app.use((error, _, res, __) => {
    console.error("Unhandled error:", error);
    res.status(500).json({ error: 'Internal server error' });
});

