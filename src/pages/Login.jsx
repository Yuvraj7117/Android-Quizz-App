import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, Controller } from 'react-hook-form';

const Login = ({navigation}) => {
    const [savedArray,setSavedArray] = useState([])
    const { control, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async(data) => {   
        console.log("cbvnm",savedArray,data) 
        const emailMatched = savedArray.some(user => user.email === data.email)  
        const passwordMatched = savedArray.some(user => user.password === data.password)  
        console.log(emailMatched , passwordMatched)
        if(emailMatched && passwordMatched){
        try{
            console.log("Login Successful")
            let user = savedArray.map(user => {
                if (user.email === data.email) {
                  return { ...user, isLoggedIn: true };
                }
                return user;
              });
              console.log("nkwlve" , user)
            await AsyncStorage.setItem("users", JSON.stringify(user));
            // console.warn("Login data saved successfully")
            navigation.navigate('Quizz Categories',{ user })
            // try {
            //     const response = await fetch('http://localhost:8081/Login', {
            //       method: 'POST',
            //       headers: {
            //         'Content-Type': 'application/json',
            //       },
            //       body: data,
            //     });
          
            //     const result = await response.json();
            //    console.log("token", result.token)
            //     if (result.token) {
            //       await AsyncStorage.setItem('authToken', JSON.stringify(result.token));
            //       console.log('Token stored successfully');
            //     } else {
            //       console.error('Login failed');
            //     }
            //   } catch (error) {
            //     console.error('Error during login:', error);
            //   }
        }catch(err){
            console.warn("Login Failed")
        }
        }else{
            console.warn("User not found")
        }
    //   for(let user of savedArray){
    //   }
    };
    useEffect(() => {
        const fetchItems = async () => {
            try {
                // const userArray = await AsyncStorage.getItem("users");
                // // const itemsArray = await Promise.all(
                // //     allKeys.map(async key => {
                // //         const item = await AsyncStorage.getItem(key);
                // //         return JSON.parse(item);
                // //     })
                // // );
                // const itemsArray = JSON.parse(userArray)
                // setSavedArray(itemsArray);

                const usersArray = await AsyncStorage.getItem("users")
            const users = JSON.parse(usersArray)
            setSavedArray(users);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchItems();
    }, []);
 
    console.log(savedArray)
    return (
        <View style={styles.container}>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Email"
              />
            )}
            name="email"
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
    
          <Text style={styles.label}>Password</Text>
          <Controller
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Password"
                secureTextEntry
              />
            )}
            name="password"
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
    
          <Button title="Login" onPress={handleSubmit(onSubmit)} />
          {/* <Button title="Signup" onPress={navigation.navigate("Signup")} /> */}
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
      },
      label: {
        marginBottom: 8,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
      },
      error: {
        color: 'red',
        marginBottom: 16,
      },
    });

export default Login