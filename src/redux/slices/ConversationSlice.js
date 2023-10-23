import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createFirestoreOneToOneChat,
  addMessageToConversationFirebase,
  fetchConversationFromFirestore,
  fetchAndStoreNewMessagesFirebase,
} from "../../../API/firebase";
import {
  getLastStoredTimestamp,
  storeLastMessageTimestamp,
} from "../../../utils/localStorage";
import { collection, orderBy, query } from "firebase/firestore";
import { fireStoreDB } from "../../../config/firebase.config";

export const createOneToOneChat = createAsyncThunk(
  "conversations/createOneToOneChat",
  async ({ user1Id, user2Id }, { getState, dispatch }) => {
    try {
      const conversationId = [user1Id, user2Id].sort().join("_");
      const existingConversation = getState().conversation.find(
        (conv) => conv.id === conversationId
      );

      if (existingConversation) {
        return conversationId;
      }
      try {
        await createFirestoreOneToOneChat(conversationId, user1Id, user2Id);
      } catch (error) {
        console.log(error);
      }

      dispatch(
        addConversation({
          id: conversationId,
          members: [user1Id, user2Id],
          lastActivity: new Date(),
        })
      );
      return conversationId;
    } catch (error) {
      throw error;
    }
  }
);
export const fetchConversationById = createAsyncThunk(
  "conversations/fetchConversationById",
  async (conversationId, { dispatch }) => {
    try {
      // Fetch the conversation data from Firestore using conversationId
      const conversationData = await fetchConversationFromFirestore(
        conversationId
      ); // Implement this function

      // Dispatch an action to update the Redux state with the fetched conversation data
      dispatch(addConversation(conversationData));

      return conversationData;
    } catch (error) {
      throw error;
    }
  }
);
export const addMessageToConversation = createAsyncThunk(
  "conversations/addMessageToConversation",
  async ({ conversationId, senderId, messageText }, { dispatch }) => {
    try {
      // Reference the conversation's messages sub-collection and add the new message
      const timestamp = new Date();
      const messageData = await addMessageToConversationFirebase(
        conversationId,
        senderId,
        messageText,
        timestamp
      );
      dispatch(
        addMessageToConversationSuccess({
          conversationId: conversationId,
          messageData: messageData,
        })
      );
      await storeLastMessageTimestamp(conversationId, timestamp);
    } catch (error) {
      throw error;
    }
  }
);

export const fetchAndStoreNewMessages = createAsyncThunk(
  "conversations/fetchAndStoreNewMessages",
  async ({ conversationId }, { dispatch }) => {
    const lastStoredTimestamp = await getLastStoredTimestamp(conversationId);
    const newMessages = await fetchAndStoreNewMessagesFirebase(
      conversationId,
      lastStoredTimestamp
    );
    if (newMessages.length > 0) {
      dispatch(addNewMessagesToStore({ conversationId, newMessages }));
      const latestMessage = newMessages[newMessages.length - 1];
      const latestTimestamp = latestMessage.timestamp;

      await storeLastMessageTimestamp(conversationId, latestTimestamp);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "conversations/fetchMessages",
  async ({ conversationId }, { dispatch }) => {
    const msgQuery = query(
      collection(fireStoreDB, "conversations", conversationId, "messages"),
      orderBy("timestamp", "asc")
    );
    onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data());
      dispatch({
        messageData: addMessageToConversationSuccess,
        conversationId,
      });
    });
  }
);

const ConversationSlice = createSlice({
  name: "conversations",
  initialState: [],
  reducers: {
    addConversation: (state, action) => {
      state.push(action.payload);
    },
    addMessageToConversationSuccess: (state, action) => {
      const { conversationId, messageData } = action.payload;
      const conversation = state.find((conv) => conv.id === conversationId);
      if (conversation) {
        const arr = conversation?.messages ? conversation.messages : [];
        arr.push(messageData);
        conversation.messages = arr;
      }
    },
    addNewMessagesToStore: (state, action) => {
      const { conversationId, newMessages } = action.payload;
      const conversation = state.find((conv) => conv.id === conversationId);

      if (conversation) {
        const arr = conversation?.messages ? conversation.messages : [];
        conversation.messages = [...conversation.messages, ...newMessages];
      }
    },
  },
});

export const {
  addConversation,
  addMessageToConversationSuccess,
  addNewMessagesToStore,
} = ConversationSlice.actions;
export default ConversationSlice.reducer;
