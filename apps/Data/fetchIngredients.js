const axios = require('axios');
const { Client } = require('pg');

// Cấu hình kết nối PostgreSQL
const db = new Client({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

db.connect();

const fetchIngredients = async () => {
    try {
        const response = await axios.get('https://api.supercook.com/ingredients');
        const ingredients = response.data;

        for (let ingredient of ingredients) {
            const { name, category } = ingredient;
            await db.query(
                'INSERT INTO ingredients (name, category) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
                [name, category]
            );
        }

        console.log('Dữ liệu nguyên liệu đã được lưu vào database!');
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
    } finally {
        db.end();
    }
};

// Chạy hàm
fetchIngredients();
