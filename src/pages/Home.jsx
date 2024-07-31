import { View, Text,Modal,StyleSheet,Button,TouchableOpacity,TextInput,Image,ScrollView, Alert } from 'react-native'
import React,{useState,useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExaminerView from '../components/ExaminerView';
import CandidateView from '../components/CandidateView';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CreateQuestions from '../components/ExaminerView';
import Results from '../components/Results';
import Quizz from '../components/CandidateView';
import DocumentPicker from 'react-native-document-picker'
import { FlatList } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';


const Tab = createMaterialTopTabNavigator();
const Home = ({route,navigation}) => {
    const [savedArray,setSavedArray] = useState([])
    const [categories,setCategories] = useState([])
    const [questionsLimit,setQuestionsLimit] = useState(5)
    const [modalVisible, setModalVisible] = useState(false);
    const { control, handleSubmit,setValue,reset, formState: { errors } } = useForm();
    const [imageUri, setImageUri] = useState(null);
    const categoryArray = categories
 
    const pickFile = async () => {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
          });
          for(let item of res){

              console.log("lmeffe", item.uri)
              setImageUri(item.uri);
              setValue('image', item.uri)
          }
        } catch (err) {
            console.log(err)
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
            Alert.alert('Cancelled', 'File selection was cancelled');
          } else {
            // console.log(err)
            throw err;
          }
        }
      };

    // const { modalVisible,setModalVisible } = route.params
    console.log("jsndmkwf", imageUri) 
    
    const onSubmit = async(data) => {  
      const categoryExists = categories.some(category => formattedCategoryName(category.name) === formattedCategoryName(data.name))

      if(categoryExists){
        Alert.alert('Please provide another name', 'This category already exists in your category list');
      }else{

        const formattedData = {
            name:data.name,
            image:data.image?data.image:"",
            id:categoryArray.length+1,
            limit:questionsLimit
        }
        categoryArray.push(formattedData)
        console.log(categoryArray)
        const jsonValue = JSON.stringify(categoryArray)
        await AsyncStorage.setItem("Categories", jsonValue);
        setModalVisible(!modalVisible)
        setImageUri(null)
        reset()   
      }
    }; 
    const user = {isExaminer: false} 
 
    const formattedCategoryName = (name)=>{ 
      const str = name
      const trimValue = str.trim()
      let finalString = trimValue
      if (trimValue.includes(' ')) {
          finalString = trimValue.split(' ').map(word => word[0].toUpperCase()).join('');
      }  
      return finalString
      // console.log("cbvnm",data)
    }

    const navigatePage = ({isExaminer, category}) => {
      // console.log("hgkf,e4",user)
      navigation.navigate('Tabs', { isExaminer, category });
    };
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const allKeys = await AsyncStorage.getAllKeys();
                const itemsArray = await Promise.all(
                    allKeys.map(async (key) => {
                        const item = await AsyncStorage.getItem(key);
                        return JSON.parse(item);
                    })
                );
               
                setSavedArray(itemsArray);
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            try{
                const savedCategories = await AsyncStorage.getItem("Categories")
                // const removeCategory = AsyncStorage.removeItem("Categories")
                console.log("fwdA",savedCategories)
                if(savedCategories !==null){
                    const categories = JSON.parse(savedCategories)
                    setCategories(categories)
                }

                
            }catch(err){
               console.error(err.message);
            }
            // await AsyncStorage.removeItem("Categories");
        };
    
        fetchItems();
       
    }, []);
 
    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            // <TouchableOpacity
            //   onPress={() => setModalVisible(true)}
            //   style={styles.headerRightButton}
            // >
                <Text style={styles.headerButtonText} onPress={() => setModalVisible(true)}>Add Category</Text>
          
            // </TouchableOpacity>
          ),
        });
      }, [navigation])
    console.log("savedItems",categories) 
  return (
    <GestureHandlerRootView > 
      {/* {
        user?.isExaminer?<ExaminerView/>:<CandidateView/>     
      } */}
     {
      categories.length<=0 &&  <TouchableOpacity style={styles.categoryIconContainer} onPress={() => setModalVisible(true)}>
      <Image source={require('../Images/add-category-icon.png')} style={styles.defaultImage} />
        <Text style={styles.headerButtonText}>Add Category</Text>
      </TouchableOpacity>
      }
      <View>
        <FlatList data={categories}  
        keyExtractor={(item) => item.id}
        numColumns={2} 
        renderItem={({item})=>{
         return(
            <TouchableOpacity  onPress={() => navigatePage({isExaminer:user.isExaminer,category:item})}>
              <View style={styles.categoryCard}> 
            {
                item.image?<Image source={{ uri: item.image }} style={styles.categoryImage} />:
                <Image source={require('../Images/quizzLogo.png')} style={styles.defaultImage} />
            }
            
            <Text style={styles.categoryName}>{item.name}</Text>
          </View>
            </TouchableOpacity>
         ) 
        }}/>
      </View>
       <ScrollView>
       <Modal  
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add Quizz Category</Text>
            <View style={styles.pickerContainer}>
             {/* <Text style={styles.label}>Select Limit:</Text> */}
             <Text style={styles.label}>Select Questions Limit: {questionsLimit}</Text>
           <RNPickerSelect
        value={questionsLimit}
        onValueChange={(value) => setQuestionsLimit(value)}
        items={[
          { label: '5', value: 5 },
          { label: '10', value: 10 },
          { label: '20', value: 20 },
          { label: '50', value: 50 },
          { label: '100', value: 100 },
        ]}
        // style={pickerSelectStyles}
      />
      
    </View>
            <View style={styles.container}>
                <Text style={styles.label}>Add Image <Text style={{color:"orange"}}>(Optional)</Text></Text>
          <TouchableOpacity style={styles.chooseFile} onPress={()=>{pickFile()}}>
            <Text>Choose a File</Text>
          </TouchableOpacity>
          {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <Controller
        name="image"
        control={control}
        render={({ field: { value } }) => (
          <Text style={styles.hiddenText}>{value}</Text>
        )}
      />
    
          <Text style={styles.label}>Category Name</Text>
          <Controller
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Category Name"
                // secureTextEntry
              />
            )}
            name="name"
          />
          {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
    
          {/* <Button title="Login" onPress={handleSubmit(onSubmit)} /> */}
          {/* <Button title="Signup" onPress={navigation.navigate("Signup")} /> */}
        </View >
           <View style={styles.modelButtonsContainer}>
           <TouchableOpacity onPress={()=>{setModalVisible(!modalVisible)}} style={styles.cancelButton}> 
                <Text style={{color:"white"}}>Cancel</Text> 
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.addButton}> 
                <Text>Add</Text> 
            </TouchableOpacity>
           </View>
          </View>
        </View>
      </Modal>
       </ScrollView>
    </GestureHandlerRootView>

//     <Tab.Navigator>
    
//        { user?.isExaminer ? 
//         <>
//         <Tab.Screen name="questions" component={CreateQuestions} />
//         <Tab.Screen name="results" component={Results} />
//         </> :
//         <>
//         <Tab.Screen name="quizz" component={Quizz} />
//         <Tab.Screen name="results" component={Results} />   
//         </>} 
    
//   </Tab.Navigator>

  )
}


export default Home

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
    },
    label:{
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    container: {
        // flex: 1,
        justifyContent: 'center',

        // paddingHorizontal: 16, 
      },
      chooseFile: {
        marginBottom: 20,
      },
      input: {
        borderWidth: 2,
        borderColor: '#ccc',
        padding:0,
        paddingLeft: 4,
        marginTop: 5,
        borderRadius: 4,
        paddingHorizontal: 40,
      },
      error: {
        color: 'red',
        // marginBottom: 16,
      },
      modelButtonsContainer:{
        flexDirection: 'row',
        justifyContent:'space-between',
        // marginTop: 20,
        width: '70%',
      },
      addButton:{
        backgroundColor: '#f1948a',
        borderRadius: 4,
        padding: 10,
        paddingHorizontal: 30,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
      },
      cancelButton:{
        backgroundColor: '#a1948a',
        borderRadius: 4,
        padding: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        // color:"white",
      },
      image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
      },
      hiddenText:{
        display:"none"
      },
      headerRightButton:{
        backgroundColor: "#a0948a", 
        borderRadius: 5,
        padding: 10,
        paddingHorizontal: 35,
        justifyContent: 'center',
        alignItems: 'center', 
        // color: "white",
      },
      headerButtonText:{
        color: "black",
        fontWeight: "bold",
      },
      categoryCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        padding: 10,
        margin: 10,
        alignItems: 'center', 
        width: 170, 
        height: 150
        
      },
      categoryImage: {
        flex:1,
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
        
      },
      categoryName: {
        fontSize: 15,
        fontWeight: 'bold',   
        textAlign: 'center',     
      },
      defaultImage: {
        width: 100,
        height: 100, 
        borderRadius: 8,
        marginBottom: 10,
        resizeMode: 'contain',
      },
      categoryIconContainer:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:200,
      },
      pickerContainer:{
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }
  });