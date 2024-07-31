import { View,ScrollView, Text,StyleSheet,Button,TextInput,Alert } from 'react-native'
import React,{useState,useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExaminerView = ({route}) => {
    const { control, handleSubmit,reset, formState: { errors } } = useForm();
    const [questionsArray, setQuestionsArray] = useState([]);
    const [questionCount,setQuestionCount] = useState(0)
    const {category} = route.params
    const questionsLimit = category.limit
    console.log(category)
    let questions= questionsArray
    console.log('Question Data:',questionCount);

      console.log("category Limit", questionsLimit)
    const onSubmit = async(data) => {
      const formattedData = {
        question: data.question,
        correct: Number(data.correct),
        options: [data.a,data.b,data.c,data.d,],
        marked:-1,
        id:questionsArray.length + 1
    }
    questions.push(formattedData)
      
      // const questionsExceedsLimit = questionsArray.some(questionItem => user.email === data.email)
    if(questionCount<questionsLimit){
      console.log('fefkemf')
      try {
       
        const jsonValue = JSON.stringify(questions)
        await AsyncStorage.setItem(category.name, jsonValue);
        console.log('Questions Data successfully saved');
        console.log("mkdmwld", questionsArray.number)
        setQuestionCount(questionsArray.length)
        reset()
        // setIsExaminer(false)
        // navigation.navigate('Login')
        // console.log("knlemw",   await AsyncStorage.getAllKeys())
        
      } catch (e) {
        console.log('Failed to save the data to the storage');
      }
    }else{
      Alert.alert('Exceeds Category Limit', 'No More Questions will Add');
    }
    };

    const removeItem =async()=>{
        await AsyncStorage.removeItem(category.name);
        console.warn("successfully Removed")
    }
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const questions = await AsyncStorage.getItem(category.name);
                
                // const itemsArray = await Promise.all(
                //     allKeys.map(async key => {
                //         const item = await AsyncStorage.getItem(key);
                //         return JSON.parse(item);
                //     })
                // );
                // for(let question of itemsArray){
                //     if(question.Number){
                //         console.log("questions",question)
                //     }
                // }
                if(questions !== null){

                    console.log("nkwdw", questions)
                    const qstArray = JSON.parse(questions)
                    console.log("ndknw",qstArray)
                    setQuestionsArray(qstArray);
                    setQuestionCount(qstArray.length)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchItems();
    }, []);

    console.log("Questions", questionCount, questionsArray)
    return (
        <ScrollView style={styles.container}>
          <Text style={[styles.label, styles.HeaderLabel]}>Question {questionCount+1}</Text>
          <Controller
            control={control}
            rules={{ required: 'Question is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.questionLabel]}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Question"
              />
            )}
            name={`question`}
          />
          {errors.question && <Text style={styles.error}>{errors.question.message}</Text>}
    
          <Text style={styles.HeaderLabel}>Options</Text>
          <Controller
            control={control}
            rules={{ required: 'Option 1 is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                placeholder="Option : 1"
              />
            )}
            name="a"
          />
          {errors.a && <Text style={styles.error}>{errors.a.message}</Text>}
    
          {/* <Text style={styles.label}>Option : b</Text> */}
          <Controller
            control={control}
            rules={{ required: 'Option 2 is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                placeholder="Option : 2"
              />
            )}
            name="b"
          />
          {errors.b && <Text style={styles.error}>{errors.b.message}</Text>}
    
          {/* <Text style={styles.label}>Option : c</Text> */}
          <Controller
            control={control}
            rules={{ required: 'Option 3 is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                placeholder="Opton : 3"
              />
            )}
            name="c"
          />
          {errors.c && <Text style={styles.error}>{errors.c.message}</Text>}
    
          {/* <Text style={styles.label}>Option : d</Text> */}
          <Controller
            control={control}
            rules={{ required: 'Option 4 is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                placeholder="Option : 4"
              />
            )}
            name="d"
          />
          {errors.d && <Text style={styles.error}>{errors.d.message}</Text>}
    
          <Text style={styles.HeaderLabel}>Correct Answer</Text>
          <Controller
            control={control}
            rules={{ required: 'Option 3 is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
                placeholder="Enter Correct Option"
              />
            )}
            name="correct"
          />
          {errors.correct && <Text style={styles.error}>{errors.correct.message}</Text>}
          <Button title="Submit Question" onPress={handleSubmit(onSubmit)} />
          <Button title="Remove" onPress={()=>{removeItem()}} />
        </ScrollView>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        // flex: 1,
        // justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
      },
      questionLabel:{
        fontSize:16,
        fontWeight:"bold",
        marginBottom:10,
        borderWidth:3,
      }
      ,
      HeaderLabel:{
    //    color:"red",
       fontSize:20,
       fontWeight:"bold",
       textAlign:"center",
       marginBottom:10,
      },
      label: {
        marginBottom: 8,
        fontWeight: '900',
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 10,
        borderRadius: 4,
      },
      error: {
        color: 'red',
        marginBottom: 10,
      },
    });

export default ExaminerView