import React, { useState, useEffect } from "react";
import { Button } from "react-native";
import "firebase/auth";
import "firebase/database";
import db from "./db.js";

export default ({ message, handleEdit }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    handleUser();
  }, []);

  const handleUser = async () => {
    const info = await db
      .collection(`users`)
      .doc(message.from)
      .get();
    setUser(info.data());
  };

  const handleDelete = messages => {
    db.collection("messages")
      .doc(messages.id)
      .delete();
  };

  return (
    user && (
      <>
        <Image
          source={{ uri: user.photoURL }}
          style={{ width: 50, hight: 50 }}
        />
        <Text style={styles.getStartedText} key={i}>
          {user.displayname} - {message.text} - {message.to}
        </Text>

        <Button title="Edit" onPress={() => handleEdit(message)} />
        <Button title="Delete" onPress={() => handleDelete(message)} />
      </>
    )
  );
};
