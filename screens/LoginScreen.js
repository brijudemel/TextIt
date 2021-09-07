import React, { useEffect, useState } from "react";
import { StyleSheet ,View,KeyboardAvoidingView } from "react-native";
import { Button,Input,Image } from "react-native-elements";
import {auth} from "../firebase"

const LoginScreen=({navigation})=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    useEffect(()=>{
        const unsubscribe=auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                navigation.replace("Home");
            }
        });
        return unsubscribe;
    },[])
    const signIn=()=>{
        auth.signInWithEmailAndPassword(email,password)
        .catch(error=>alert(error))
    }
    return(
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <Image source={require('../assets/msg.png')}
            style={{width:200,height:200}}
            />
        
        <View style={styles.inputContainer}>
            <Input placeholder="Email" autoFocus type="email" value={email} onChangeText={(text)=>setEmail(text)} />
            <Input onSubmitEditing={signIn} placeholder="Password" secureTextEntry type="password" value={password} onChangeText={(text)=>setPassword(text)} />
        </View>
        <Button buttonStyle={{backgroundColor :"#32a852"}} title="Login" containerStyle={styles.button} 
            onPress={signIn}
         />
        <Button titleStyle={{color:"#32a852"}} title="Register" containerStyle={styles.button} type="clear" onPress={()=>navigation.navigate('Register')} />
        <View style={{height:100}} />
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