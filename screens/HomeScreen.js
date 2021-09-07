import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet,ScrollView ,View, KeyboardAvoidingView,SafeAreaView} from "react-native";
import { AntDesign,SimpleLineIcons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomListItem from "../components/CustomListItem";
import { auth,db } from "../firebase";
const HomeScreen=({navigation})=>{
    const [chats,setChats]=useState([]);


    const signOutUser=()=>{
        auth.signOut().then(()=>navigation.replace('Login'))
    }

    useEffect(()=>{
        const unsubscribe=db.collection('chats').onSnapshot((snapshot)=>{
            setChats(snapshot.docs.map(doc=>({
                id:doc.id,
                data:doc.data()
            })));
        });
        return unsubscribe;
    },[])
    useLayoutEffect(()=>{
        navigation.setOptions({
            title:"Text It",
            headerStyle:{
                backgroundColor:"#fff"
            },
            headerTitleStyle:{color:"black"},
            headerTintColor:"black",
            headerLeft:()=><View style={{marginLeft:20}}>
                <TouchableOpacity activeOpacity={0.7} onPress={signOutUser}>
                    <Avatar rounded source={{uri:auth?.currentUser?.photoURL}} />
                </TouchableOpacity>
            </View>,
            headerRight:()=>(
                <View style={{
                    flexDirection:"row",
                    justifyContent:'space-between',
                    width:80,
                    marginRight:20
                }}>
                    <TouchableOpacity activeOpacity={0.7}>
                        <AntDesign name="camerao" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("AddChat")} activeOpacity={0.7}>
                        <SimpleLineIcons name="pencil" size={24} color="black" />
                    </TouchableOpacity>
                </View>
        )
        })
    },[navigation]);
    const enterChat=(id,chatName)=>{
        navigation.navigate("Chat",{
            id,
            chatName
        })
    }
    return(
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({id,data:{chatName}})=>(
                    <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    container:{
        height:"100%"
    }
});

export default HomeScreen;