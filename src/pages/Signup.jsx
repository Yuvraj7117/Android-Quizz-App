import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert,TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
const filePath = RNFS.DocumentDirectoryPath + '/localUsersDb.json';


const Signup = ({navigation}) => {
  const { control, handleSubmit,reset, formState: { errors } } = useForm();
  const [ isExaminer , setIsExaminer] = useState(false);
  // const [isSelected, setSelection] = useState(false);
  const [myArray,setMyArray] = useState([])
  const usersRef = useRef([])
  let userArray = myArray
  // const users =[]

  const onSubmit = async(data) => {
    console.log("jbken", data)
    console.log("nkfe",myArray)
    // Alert.alert('Form Data',data);
    const userExists = myArray.some(user => user.email === data.email)
    if(userExists){
      console.warn("Email Already Exist")
    }else{
      console.log("dwdwdw")
      if(data.password !== data.confirmPassword) {
        console.warn("Password doesn't match")
      }else{      
        try {
          // createFile(data)
          
          data.id=myArray.length+1
          data.isExaminer = isExaminer
          data.isLoggedIn = false
          // console.log("jkenf", data)
          userArray.push(data)
          console.log("njnd", userArray)
          const jsonValue = JSON.stringify(userArray)
          await AsyncStorage.setItem("users", jsonValue);
          console.log('Data successfully saved');
          // reset()
          setIsExaminer(false)
          navigation.navigate('Login')
          // console.log("knlemw",   await AsyncStorage.getAllKeys())
          
        } catch (e) {
          console.log('Failed to save the data to the storage');
        }
      }
    }
 
    }
   


  useEffect(() => {
    const fetchItems = async () => {
        try {
            // const allKeys = await AsyncStorage.getAllKeys();
            // const itemsArray = await Promise.all(
            //     allKeys.map(async key => {
            //         const item = await AsyncStorage.getItem(key);
            //         return JSON.parse(item);
            //     })
            // );
            const usersArray = await AsyncStorage.getItem("users")
            if (usersArray !== null) {
              // console.log('User:', JSON.parse(user));
              const users = JSON.parse(usersArray)
              setMyArray((prev)=>[...prev,users]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchItems();
}, []);

const handleEmailChange = (value) => {

  const userExists = myArray.some(user => user.email === value)
  if(userExists){
    console.warn("email Exist")
    // setEmailExist(true)
  }else{
    console.warn("email not exist")
    // setEmailExist(false)
  }
  console.log('Current Email:', value);
};

console.log("Fetching items...", myArray);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      {/* <TextInput
            style={styles.input}
            // onBlur={onBlur}
            onChangeText={"knmfemf"}
            value={"kfmlemff"}
            placeholder="Name"
          /> */}
      <Controller
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            // onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter Name"
          />
        )}
        name="name"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            message: 'Email is not valid',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            // onBlur={onBlur}
             onChangeText={onChange}
            value={value}
            placeholder="Enter Email"
            keyboardType="email-address"
          />
        )}
        name="email"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Text style={styles.label}>Password</Text>
      <Controller
        control={control}
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            // onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter Password"
            secureTextEntry
          />
        )}
        name="password"
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
      <Text style={styles.label}>Confirm Password</Text>
      <Controller
        control={control}
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            // onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter Confirm Password"
            secureTextEntry
          />
        )}
        name="confirmPassword"
      />
      <View style={styles.checkboxContainer}>


       <CheckBox
                    value={isExaminer} 
                    onValueChange={setIsExaminer}
                    style={styles.checkbox} 
                />
         <Text>Your an Examiner? </Text>         
      </View>
      <View style={styles.signup}>

      <Button title="Sign Up" onPress={handleSubmit(onSubmit)} />
      </View>

     <Text style={styles.loginLabel}>Already an User?</Text>
     <View style={styles.login}>
      <Button title="Login" onPress={()=>{navigation.navigate('Login')}}/>
     </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    // borderBottomWidth:2,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius:50
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 5,
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#000',
  },
  label: {
    fontSize: 16,
  },
  // signup:{
  //   marginBottom: 86,
  //   position: 'absolute',
  //   bottom: 16,
  //   left: 16,
  //   right: 16,
  //   backgroundColor: '#4CAF50',
  //   borderRadius: 10,
  // },
  // login:{
  //   marginBottom: 16,
  //   position: 'absolute',
  //   bottom: 16,
  //   left: 16,
  //   right: 16,
  //   backgroundColor: '#4CAF50',
  //   borderRadius: 10,
  // },
  loginLabel:{
      color: 'black',
      backgroundColor: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      margin:20,
  } 
});


export default Signup