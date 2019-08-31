const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request-promise-native');

const API_KEY = 'AIzaSyA8T1qoF1G2NQ4eN946MDlsEfZFyaoiPNU';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const getToken = async (authorizationHeader) => {
  // Slice away the 'Bearer ' part of the auth header
  const refreshToken = authorizationHeader.slice(7);
  const res = await request({
    method: 'POST',
    uri: `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
  });
  const body = JSON.parse(res);
  return {
    idToken: body.id_token,
    uid: body.user_id,
  };
};

exports.me = functions.https.onRequest(async (req, res) => {
  try {
    const { uid } = await getToken(req.get('authorization'));
    res.send({ uid });
  } catch (error) {
    console.log(error);
    res.status(401).send('Authentication error');
  }
});

exports.create = functions.https.onRequest(async (req, res) => {
  try {
    const { uid } = await getToken(req.get('authorization'));
    const { title } = req.body;
    const ref = await db.collection('todos').add({
      title,
      owner: uid,
      completed: '',
      soft: '',
    });
    res.send({
      id: ref.id,
      title,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error');
  }
});
