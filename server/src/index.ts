import connectDB from "./config/db.config.js";
import app from "./app.js";


const PORT = process.env.PORT || 5000;

app.use("/", (req, res) => {
    res.status(200).send("Server is running");  
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error : any) => {
    console.error("Failed to connect to the database:", error);
});
