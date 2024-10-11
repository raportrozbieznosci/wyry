const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Połączenie z bazą danych MongoDB (z lokalną instancją MongoDB)
mongoose.connect('mongodb+srv://draisepach:<db_password>@raportrozbieznosci.8ntvo.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware do obsługi JSON w żądaniach
app.use(express.json());

// Prosty model danych (możesz go dostosować)
const DataSchema = new mongoose.Schema({
  value: String
});
const Data = mongoose.model('Data', DataSchema);

// Endpoint do zapisu danych
app.post('/api/data', async (req, res) => {
  const newData = new Data({
    value: req.body.value
  });
  await newData.save();
  res.status(201).send('Data saved');
});

// Endpoint do odczytu danych
app.get('/api/data', async (req, res) => {
  const data = await Data.find();
  res.json(data);
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});