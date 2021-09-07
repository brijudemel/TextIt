import React, { useLayoutEffect, useState } from "react";
import { StyleSheet ,View, KeyboardAvoidingView} from "react-native";
import { Button,Input,Text } from "react-native-elements";
import {auth} from "../firebase"
const LoginScreen=({navigation})=>{
    const [name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[imageUrl,setImageUrl]=useState("");
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerBackTitle:"Login"
         })
    },[navigation])
    const register=()=>{
        auth
        .createUserWithEmailAndPassword(email,password)
        .then((authUser)=>{
            authUser.user.updateProfile({
                displayName:name,
                photoURL:imageUrl||
                "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",

            });
        })
        .catch((error)=>alert(error.message))
    }
    return(
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <Text h3 style={{marginBottom:50}}>Create a new TextIt account</Text>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Full Name"
                    type="text"
                    autofocus
                    value={name}
                    onChangeText={(text)=>setName(text)}
                 />
                 <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChangeText={(text)=>setEmail(text)}
                 />
                 <Input
                    placeholder="Password"
                    type="password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text)=>setPassword(text)}
                 />
                 <Input
                    placeholder="Profile Pic URL (optional)"
                    type="text"
                    autofocus
                    value={imageUrl}
                    onChangeText={(text)=>setImageUrl(text)}
                    onSubmitEditing={register}
                 />
            </View>
            <Button
                raised
                containerStyle={styles.button}
                buttonStyle={{backgroundColor :"#32a852"}}
                title="Register"
                onPress={register}
             />
        </KeyboardAvoidingView>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        padding:10,
        backgroundColor:'white'
    },button:{
        width:200,
        marginTop:10,
    },
    inputContainer:
    {
        width:300
    }
});

export default LoginScreen;