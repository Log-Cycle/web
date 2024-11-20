import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    doc,
    deleteDoc,
    writeBatch
} from "@firebase/firestore";

import firebaseKey from "../key/firebase-key.json";

const app = initializeApp(firebaseKey);

export const db = getFirestore(app);

const collection_collectionBoxs = "collectionBoxs"

const getUsers = async () => {
    const usersCollectionRef = collection(db, "users");
    const data = await getDocs(usersCollectionRef);

    let list = []
    data.forEach((doc) => {
        let user = doc.data();
        list.push({ ...user, id: doc.id });
    });
    return list;
};

const addItemsToCollectionBox = async (items) => {
    const batch = writeBatch(db);
    const collectionRef = collection(db, collection_collectionBoxs);

    items.forEach((item) => {
        const newDocRef = doc(collectionRef);
        batch.set(newDocRef, item);
    });

    try {
        await batch.commit();
    } catch (error) {
        console.error("Erro addItemsToCollectionBox:", error);
    }
};

const getCollectionBoxs = async () => {
    const readingsCollectionRef = query(collection(db, collection_collectionBoxs));
    const data = await getDocs(readingsCollectionRef);

    let list = []
    data.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
    return list;
};

const deleteItemFromCollectionBox = async (id) => {
    const docRef = doc(db, collection_collectionBoxs, id);
    await deleteDoc(docRef);
};

export default {
    deleteItemFromCollectionBox,
    getCollectionBoxs,
    addItemsToCollectionBox,
    getUsers
}

