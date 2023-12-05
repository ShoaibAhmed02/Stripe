const express = require('express');
const app = express();
var fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
// const cron = require("node-cron");
const User = require('./models/User');
const Content = require('./models/Content');
const bodyParser = require('body-parser');



app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));



const PORT = process.env.PORT || 3017;

dotenv.config();



// const options = {
//   key: fs.readFileSync('/home/serverappsstagin/ssl/keys/b319e_1c941_fad63c8eeb17a7e86e5db73f3379eedb.key'),
// cert: fs.readFileSync('/home/serverappsstagin/ssl/certs/server_appsstaging_com_b319e_1c941_1694648224_922935e7339cac445668733169408dd2.crt'),
// };


//  const server = require('https').createServer(options, app);
const server = require('http').createServer(app);


//** Datrabase Connection **//
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }, () => console.log('Connection success')
);

const apiRoutes = require('./routes/api');


app.use('/api', apiRoutes);

/** Content seeder */
const contentSeeder = [
  {
    title: "Privacy Policy",
    content:
      "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
    type: "privacy_policy",
  },
  {
    title: "About Us",
    content:
      "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
    type: "about_us",
  },
  {
    title: "Terms and Conditions",
    content:
      "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
    type: "terms_and_conditions",
  },
];
var abc;
const dbSeed = async () => {
  console.log("sdsdsd")
  const d = await Content.find({ type: "privacy_policy" });
  if (d.length > 1 || d.length < 1) {
    await Content.deleteMany({ type: "privacy_policy" });
    await Content.insertMany(contentSeeder[0]);
  }
  const e = await Content.find({ type: "about_us" });
  if (e.length > 1 || e.length < 1) {
    await Content.deleteMany({ type: "about_us" });
    await Content.insertMany(contentSeeder[1]);
  }
  const f = await Content.find({ type: "terms_and_conditions" });
  if (f.length > 1 || f.length < 1) {
    await Content.deleteMany({ type: "terms_and_conditions" });
    await Content.insertMany(contentSeeder[2]);
  }
  abc = await Content.find();
};
dbSeed().then(() => {
  // mongoose.connection.close();
});
app.set("views", "./views");
app.set("view engine", "pug");
app.get("/privacy_policy", (req, res, next) => {
  res.render("index", {
    title: abc[0]?.title,
    heading: abc[0]?.title,
    paragraph: abc[0]?.content,
  });
});
app.get("/about_us", (req, res, next) => {
  res.render("index", {
    title: abc[1]?.title,
    heading: abc[1]?.title,
    paragraph: abc[1]?.content,
  });
});
app.get("/terms_and_conditions", (req, res, next) => {
  res.render("index", {
    title: abc[2]?.title,
    heading: abc[2]?.title,
    paragraph: abc[2]?.content,
  });
});

exports.dbSeed = dbSeed;


// app.use(express.static(path.resolve('../ibis_prep/build/')));
// app.get('*', function (req, res) {
//     res.sendFile(path.resolve('../ibis_prep/build/index.html'));
//     // res.sendFile(path.resolve(__dirname, 'admin', 'build', 'index.html'));
//   });


server.listen(PORT, () => console.log('Server running on', PORT))
