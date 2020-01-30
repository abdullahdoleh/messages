import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, TextInput, Button } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db";
import * as ImagePicker from "expo-image-picker";
import "firebase/storage";
import { setConfigurationAsync } from "expo/build/AR";

export default function SettingsScreen() {
  const [cameraRol, setCameraRol] = useState(false);
  const [displayname, setDisplayname] = useState("");
  const [uri, setUri] = useState("");

  const [photoURL, setPhotoURL] = useState("");

  const askPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    setCameraRol(status === "granted");
  };
  useEffect(() => {
    askPermission();
  }, []);

  const handleSet = async () => {
    const snap = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    setDisplayName(snap.data().displayName);
    setPhotoURL(snap.data().photoURL);
  };

  useEffect(() => {
    handleSet();
  }, []);

  useEffect(() => {
    // setDisplayName(firebase.auth().currentUser.displayName);
    // setPhotoURL(firebase.auth().currentUser.photoURL);
    handleSet();
  }, []);

  const handleSave = () => {
    //firebase.auth().currentUser.updateProfile({ displayName, photoURL });
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .set({ displayName, photoURL });
    handleSet();
  };

  const handlePickImage = async () => {
    // show camera roll, allow user to select, set photoURL
    // - use firebase storage
    // - upload selected image to default bucket, naming with uid
    // - get url and set photoURL
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    //if (!result.cancelled) {
    //this.setState({ image: result.uri });
    if (uri !== "") {
      console.log("....", result.uri);
      setUri(result.uri);

      const firebase = await fetch(result.uri);
      const blob = await response.blob();

      firebase
        .storage()
        .ref()
        .child(firebase.auth().currentUser.uid)
        .put(blob);

      const url = await firebase
        .storage()
        .ref()
        .child(firebase.auth().currentUser.uid)
        .getDownloadUrl();
      console.log(" photo url ", url);
      setPhotoURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{
          height: 30,
          borderColor: "black",
          borderWidth: 1,
          backgroundColor: "white"
        }}
        onChangeText={setDisplayname}
        placeholder="displayname"
        value={displayname}
      />
      {photoURL !== "" && (
        <Image style={{ width: 100, height: 100 }} source={{ uri: photoURL }} />
      )}
      ;
      <Button title="Pick Image" onPress={handlePickImage} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

SettingsScreen.navigationOptions = {
  title: "setting.json"
};

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
