/* eslint-disable no-console */
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://super-todo-230614.firebaseio.com',
});

/**
 * @param {any[]} array
 * @param {number} chunkSize
 * @returns {any[][]}
 */
const chunkArray = (array, chunkSize) => {
  if (chunkSize < 1) throw new Error('Chunks size invalid');
  const chunkedArr = [];
  for (let pos = 0; pos < array.length; pos += chunkSize) {
    chunkedArr.push(array.slice(pos, pos + chunkSize));
  }
  // we know this is an array of arrays, but ts does not
  // @ts-ignore
  return chunkedArr;
};

const main = async () => {
  const db = admin.firestore();
  const todos = await db
    .collection('todos')
    .get();
  console.log('Todos found:', todos.size);
  const nostamp = todos.docs.filter((doc) => doc.get('sortstamp') === undefined);
  console.log('Todos with no sortstamp', nostamp.length);
  const chunked = chunkArray(nostamp.reverse(), 500);

  const now = Date.now();
  chunked.forEach(async (chunkedTodos, i) => {
    const batch = db.batch();
    chunkedTodos.forEach(async (doc, j) => {
      const stamp = now - (i * 500 + j) * 60000;
      batch.update(
        doc.ref,
        { sortstamp: admin.firestore.Timestamp.fromMillis(stamp) },
      );
    });
    await batch.commit();
    console.log('Done with batch');
  });
};

main()
  .then(() => {
    console.log('Done!');
  })
  .catch((err) => {
    console.log(err);
  });
