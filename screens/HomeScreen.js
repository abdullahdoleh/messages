import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import "@firebase/firestore";

import db from "../db.js";

import firebase from "firebase/app";
import "firebase/auth";
import Message from "../Message.js";

export default function HomeScreen() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [to, setTo] = useState("");
  const [id, setId] = React.useState("");

  useEffect(() => {
    db.collection("messages").onSnapshot(querySnapshot => {
      const messages = [];
      querySnapshot.forEach(doc => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      console.log("Current Messages: ", messages);
      setMessages([...messages]);
    });
  }, []);

  const handleSend = () => {
    // it checks that if the id messege is there that means that its being update
    const from = firebase.auth().currentUser.id;
    if (id) {
      db.collection("messages")
        .doc(id)
        // it will be called after clicking on send
        .update({ from, to, text });
    } else {
      //otherwise its a new message and it will use add to create and send it

      db.collection("messages").add({ from, to, text });
    }

    //if the message is new it will empty the from and to and text so it wont be updating anymore

    //creating from scratch

    setTo("");

    setText("");

    setId("");
  };

  const handleEdit = messages => {
    setTo(messages.to);
    setText(messages.text);
    setId(messages.id);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
      >
        {messages.map((message, i) => (
          <View>
            <Message key={i} message={message} handleEdit={handleEdit} />
          </View>
        ))}
      </ScrollView>

      <TextInput
        style={{
          height: 30,

          borderColor: "black",

          borderWidth: 1,

          backgroundColor: "white"
        }}
        onChangeText={setTo}
        placeholder="To"
        value={to}
      />

      <TextInput
        style={{
          height: "10%",

          borderColor: "black",

          borderWidth: 1,

          backgroundColor: "white"
        }}
        onChangeText={setText}
        placeholder="Text"
        value={text}
        multiline={true}
      />

      <View style={{ backgroundColor: "#e6f9ff" }}>
        <Button title="send" onPress={() => handleSend()} />
      </View>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/development-mode/"
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes"
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
