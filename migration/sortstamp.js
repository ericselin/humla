/* eslint-disable no-console */
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://super-todo-230614.firebaseio.com',
});

const main = async () => {
  const db = admin.firestore();
  const todos = await db
    .collection('todos')
    .where('owner', '==', 'sOUs8jnn5teGZtA0TXaHEehFcuk2')
    .get();
  console.log('Todos found:', todos.size);
  const nostamp = todos.docs.filter((doc) => doc.get('sortstamp') === undefined);
  console.log('Todos with no sortstamp', nostamp.length);

  const batch = db.batch();
  const now = Date.now();
  nostamp.reverse().forEach((doc, i) => {
    const stamp = now - i * 60000;
    batch.update(
      doc.ref,
      { sortstamp: admin.firestore.Timestamp.fromMillis(stamp) },
    );
  });
  await batch.commit();

  console.log('Done!');
};

main().catch((err) => { console.log(err); });
