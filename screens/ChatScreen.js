import React, { useLayoutEffect, useState } from "react";
import {View,TouchableWithoutFeedback,Text,StyleSheet,TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView,Platform, TextInput, Keyboard, Touchable} from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { AntDesign,Ionicons} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { auth, db } from "../firebase";
import firebase from "firebase";
const ChatScreen=({navigation,route})=>{
    const [input,setInput]=useState("");
    const [messages,setMessages]=useState([])
    useLayoutEffect(()=>{
        navigation.setOptions({
            title:"Chat",
            headerBackTiltVisible:false,
            headerTitleAlign:"left",
            headerTitle:()=>(
                <View style={{
                    flexDirection:"row",
                    alignItems:"center"
                }}>
                    <Avatar rounded source={{
                        uri:messages?.[messages.length-1]?.data.photoURL || "https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png"
                    }} />
                    <Text style={{color:"white",marginLeft:10,fontWeight:"700",fontSize:20}} >{route.params.chatName}</Text>
                </View>
            ),
            headerLeft:()=>(
                <TouchableOpacity style={{marginLeft:10}} onPress={navigation.goBack}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
            ),
        })
    },[navigation,messages]);
    useLayoutEffect(()=>{
        const unsubscribe=db.collection("chats")
        .doc(route.params.id)
        .collection("messages")
        .orderBy("timestamp","asc")
        .onSnapshot(snapshot=>setMessages(
            snapshot.docs.map((doc)=>({
                id:doc.id,
                data:doc.data()
            }))
        ));
        return unsubscribe;
    },[route])
    const sendMessage=()=>{
        Keyboard.dismiss();
        db.collection("chats").doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message:input,
            displayName: auth.currentUser.displayName,
            email:auth.currentUser.email,
            photoURL:auth.currentUser.photoURL,
        });
        setInput("");
    }
    return(<SafeAreaView style={{flex:1,backgroundColor:"white"}}>
        <StatusBar style="light" />
        <KeyboardAvoidingView behavior={Platform.OS==="ios"?"padding":"height"}
            style={styles.container}
            keyboardVerticalOffset={90}
        >
            
            <TouchableWithoutFeedback>
            <React.Fragment>
                <ScrollView contentContainerStyle={{paddingTop:15}}>
                    {
                        messages.map(({id,data})=>(
                            data.email===auth.currentUser.email?(
                                <View key={id} style={styles.reciever}>
                                    <Avatar
                                        position="absolute"
                                        bottom={-15}
                                        right={-5}
                                        rounded
                                        size={30}
                                        source={{uri:data.photoURL}} 
                                        // for web
                                        containerStyle={{
                                            position:"absolute",
                                            bottom:-15,
                                            right:-5
                                        }}
                                         />
                                    <Text style={styles.recieverText}>{data.message}</Text>
                                </View>
                            ):(
                                <View key={id} style={styles.sender}>
                                    <Avatar
                                        position="absolute"
                                        bottom={-15}
                                        left={-5}
                                        rounded
                                        size={30}
                                        source={{uri:data.photoURL}} 
                                        // for web
                                        containerStyle={{
                                            position:"absolute",
                                            bottom:-15,
                                            left:-5
                                        }}
                                         />
                                    <Text style={styles.senderText}>{data.message}</Text>
                                    <Text style={styles.senderName}>{data.displayName}</Text>
                                </View>
                            )
                        ))}
                    
                </ScrollView>
                <View style={styles.footer}>
                    <TextInput value={input} onChangeText={text=>setInput(text)} style={styles.textInput} onSubmitEditing={sendMessage} placeholder="TextIt Message" />
                    <TouchableOpacity onPress={sendMessage} activeOpacity={0.7}>
                        <Ionicons name="send" size={24} color="#32a852" />
                    </TouchableOpacity>
                </View>
                </React.Fragment>
                </TouchableWithoutFeedback>
            
        </KeyboardAvoidingView>
    </SafeAreaView>)
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    textInput:{
        bottom:0,
        height:40,
        flex:1,
        marginRight:15,
        borderColor:"transparent",
        backgroundColor:"#ECECEC",
        padding:10,
        color:"grey",
        borderRadius:30
    },
    footer:{
        flexDirection:"row",
        alignItems:"center",
        width:"100%",
        padding:15
    },
    reciever:{
        padding:15,
        backgroundColor:"#ECEECE",
        alignSelf:"flex-end",
        borderRadius:20,
        marginRight:15,
        marginBottom:20,
        maxWidth:"80%",
        position:"relative",
    },
    sender:{
        padding:15,
        backgroundColor:"#79c78e",
        alignSelf:"flex-start",
        borderRadius:20,
        marginRight:15,
        maxWidth:"80%",
        position:"relative",
    },
    senderName:{
        left:10,
        paddingRight:10,
        fontSize:10,
        color:"white"
    },
    senderText:{
        color:"white",
        fontWeight:"500",
        marginLeft:10,
        marginBottom:15
    },
    recieverText:{
        color:"black",
        fontWeight:"500",
        marginLeft:10,
    }
})

export default ChatScreen;
