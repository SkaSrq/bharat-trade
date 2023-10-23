import { fireStoreDB } from "../config/firebase.config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export const createFirestoreOneToOneChat = (
  conversationId,
  user1Id,
  user2Id
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const conversationRef = collection(fireStoreDB, "conversations");
      const docRef = doc(fireStoreDB, "conversations", conversationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        resolve(conversationId);
      } else {
        setDoc(doc(conversationRef, conversationId), {
          members: [user1Id, user2Id],
          lastActivity: new Date(),
        })
          .then(() => {
            resolve(conversationId);
          })
          .catch((error) => {
            reject(error);
          });
      }
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const fetchConversationFromFirestore = async (conversationId) => {
  try {
    const docRef = doc(fireStoreDB, "conversations", conversationId);
    const docSnap = await getDoc(docRef);

    // const conversationDoc = await conversationRef.get();

    if (docSnap.exists) {
      // If the document exists, extract the data
      const conversationData = docSnap.data();

      return {
        id: conversationId,
        ...conversationData,
      };
    } else {
      // Handle the case where the conversation document does not exist
      throw new Error("Conversation not found");
    }
  } catch (error) {
    // Handle any errors that may occur during the fetch
    throw error;
  }
};

export const addMessageToConversationFirebase = async (
  conversationId,
  senderId,
  messageText,
  timestamp
) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(
        "addMessageToConversationFirebase",
        conversationId,
        senderId,
        messageText
      );
      const messageData = {
        text: messageText,
        senderId,
        timestamp,
      };

      const conversationRef = collection(
        fireStoreDB,
        "conversations",
        conversationId,
        "messages"
      );
      await setDoc(doc(conversationRef), messageData);
      resolve(messageData);
    } catch (error) {
      console.log("Error: ", error);
      reject(error);
    }
  });
};

export async function fetchAndStoreNewMessagesFirebase(
  conversationId,
  lastStoredTimestamp
) {
  try {
    // Reference to the Firestore collection of messages for the conversation
    //   const messagesRef = firebase.firestore().collection('conversations').doc(conversationId).collection('messages');

    console.log(
      "fetchAndStoreNewMessagesFirebase",
      conversationId,
      lastStoredTimestamp
    );
    const messagesRef = collection(
      fireStoreDB,
      "conversations",
      conversationId,
      "messages"
    );
    // Query for messages with timestamps greater than the last stored timestamp
    //   const querySnapshot = await messagesRef.where('timestamp', '>', lastStoredTimestamp).orderBy('timestamp').get();
    const t = lastStoredTimestamp ? lastStoredTimestamp : new Date(0);
    console.log("creating query");
    const q = query(
      messagesRef,
      where("timestamp", ">", t),
      orderBy("timestamp")
    );
    const querySnapshot = await getDocs(q);

    const newMessages = [];
    console.log("querySnapshot", querySnapshot.length);

    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
      console.log("new m: ", messageData);
      newMessages.push(messageData);
    });

    return newMessages;
  } catch (error) {
    console.error("Error fetching and storing new messages:", error);
  }
}

export const fetchMessages = (conversationId) => {
  try {
    const q = query(
      collection(fireStoreDB, "conversations", conversationId, "messages"),
      orderBy("timestamp", "asc")
    );
  } catch (error) {}
};
