import React, { useLayoutEffect, useState } from "react";
import {View,StyleSheet} from "react-native";
import { Button,Icon,Input } from "react-native-elements";
import { db } from "../firebase";
const AddChatScreen=({navigation})=>{
    const [input,setInput]=useState("")
    useLayoutEffect(()=>{
        navigation.setOptions({
            title:"Add a new Chat",
            headerBackTitle:"Chats"
        })
    },[navigation]);
    const createChat=async()=>{
        await db.collection('chats').add({
            chatName:input
        }).then(()=>{
            navigation.goBack()
        }).catch(err=>alert(err))
    }
    return(<View style={styles.container}>
        <Input
            placeholder="Enter a chat name"
            value={input}
            onChangeText={text=>setInput(text)}
            leftIcon={
                <Icon name="wechat" type="antdesign" size={24} color="black" />
            }
            onSubmitEditing={createChat}
            />
            <Button disabled={!input} title="Create New Chat" onPress={createChat} />
    </View>)
}

const styles= StyleSheet.create({
    container:{
        backgroundColor:"white",
        padding:30,
        height:"100%",
    }
})

export default AddChatScreen;