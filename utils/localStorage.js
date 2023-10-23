import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeLastMessageTimestamp = async (
  conversationId,
  latestTimestamp
) => {
  try {
    const key = `lastMessageTimestamp_${conversationId}`;
    // Convert the timestamp to a string (if it's not already a string)
    const timestampString = latestTimestamp.toString();

    // Store the latest timestamp in AsyncStorage
    await AsyncStorage.setItem(key, timestampString);
  } catch (error) {
    console.error("Error storing last message timestamp:", error);
  }
};
export const getLastStoredTimestamp = async (conversationId) => {
  try {
    const timestamp = await AsyncStorage.getItem(
      `lastMessageTimestamp_${conversationId}`
    );
    return timestamp ? parseInt(timestamp, 10) : 0;
  } catch (error) {
    console.error("Error retrieving last message timestamp:", error);
    return 0;
  }
};
