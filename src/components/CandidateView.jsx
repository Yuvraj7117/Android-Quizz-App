import { View, Text,FlatList,TouchableOpacity,Modal,Dimensions } from 'react-native'
import React,{useEffect,useState,useRef} from 'react';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuestionItem from './QuestionItem';

const {height, width} = Dimensions.get('window');
const CandidateView = ({route}) => {
    const [questions,setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(1);
    const [users,setUsers] = useState([])
    const [results,setResults] = useState([])
    // const [questions, setQuestions] = useState(englishData);
    const listRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const {category} = route.params 
    const resultArray = []
    // console.log("gregwe",category)
    const OnSelectOption = (index, x) => {
      const tempData = questions;
      tempData.map((item, ind) => {
        console.log("itemsdd", item)
        if (index == ind) {
          if (item.marked !== -1) {
            item.marked = -1;
          } else {
            item.marked = x;
          }
        }
      });
      let temp = [];
      tempData.map(item => {
        temp.push(item);
      });
      setQuestions(temp);
    };
    const getTextScore = () => {
      let marks = 0;
      questions.map(item => {
       
        if (item.marked !== -1) {
          if(item.marked===item.correct){
            marks = marks + (100/questions.length);
            
          }
          console.log("fkenfkqwa", item,marks)
          // console.log("wfqef", questions)
        }
      });
      return marks;
    };
    const resetFun = () => {
      const tempData = questions;
      tempData.map((item, ind) => {
        item.marked = -1;
      });
      let temp = [];
      tempData.map(item => {
        temp.push(item);
      });
      setQuestions(temp);
    };

    const onSubmitQuizzes=async()=>{
      let result={}
      for(let user of users){
        if(user.isLoggedIn){
          result.score = getTextScore();
          result.name = user.name
          result.category = category.name
          result.email = user.email
          resultArray.push(result)
          try{
            await AsyncStorage.setItem(`results`, JSON.stringify(resultArray));
            }catch(error){
              console.log(error)
  
          }
          // await AsyncStorage.setItem("results", JSON.stringify(users));
          setModalVisible(true);
  
      }

        console.log("fjekfnfwr",result)
    }
  }

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const questions = await AsyncStorage.getItem(category.name);
                console.log("kflejf",questions)
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
                    setQuestions(qstArray);
                    // setQuestionCount(questionsArray.length)
                }
                const usersArray = await AsyncStorage.getItem("users")
                if (usersArray !== null) {
                  // console.log('User:', JSON.parse(user));
                  const users = JSON.parse(usersArray)
                  console.log("usersswd", users)
                  setUsers(users);
                }

                const resultsArray = await AsyncStorage.getItem("results")
                if (resultsArray !== null) {
                  // console.log('User:', JSON.parse(user));
                  const results = JSON.parse(resultsArray)
                  console.log("usersswd", results)
                  setResults(results);
                }
                
            } catch (error) {
                console.error('Error fetching data:', error); 
            }
        };
    
        fetchItems();
    }, []);
    console.log("bnkfewd", users) 
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',

            marginLeft: 20,
            color: '#000',
          }}>
          Questions :{' ' + currentIndex + '/' + questions.length}
        </Text>
        <Text
          style={{
            marginRight: 20,
            fontSize: 20,
            fontWeight: '600',
            color: 'black',
          }}
          onPress={() => {
            resetFun();
            listRef.current.scrollToIndex({animated: true, index: 0});
          }}>
          Reset
        </Text>
      </View>
      <View style={{marginTop: 30}}>
        <FlatList
          ref={listRef}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          onScroll={e => {
            const x = e.nativeEvent.contentOffset.x / width + 1;
            setCurrentIndex(x.toFixed(0));
          }}
          data={questions}
          renderItem={({item, index}) => {
            return (
              <QuestionItem
                data={item}
                selectedOption={x => {
                  OnSelectOption(index, x);
                }}
              />
            );
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          bottom: 50,
          width: '100%',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: currentIndex > 1 ? 'purple' : 'gray',
            height: 50,
            width: 100,
            borderRadius: 10,
            marginLeft: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            console.log(parseInt(currentIndex) - 1);
            if (currentIndex > 1) {
              listRef.current.scrollToIndex({
                animated: true,
                index: parseInt(currentIndex) - 2,
              });
            }
          }}>
          <Text style={{color: '#fff'}}>Previous</Text>
        </TouchableOpacity>
        {currentIndex == questions.length ? (
          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              height: 50,
              width: 100,
              borderRadius: 10,
              marginRight: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              onSubmitQuizzes()
              setModalVisible(true);
            }}>
            <Text style={{color: '#fff'}}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: 'purple',
              height: 50,
              width: 100,
              borderRadius: 10,
              marginRight: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              console.log("gnkenfke",currentIndex);
              if (questions[currentIndex - 1].marked !== -1) {
                if (currentIndex < questions.length) {
                  listRef.current.scrollToIndex({
                    animated: true,
                    index: currentIndex,
                  });
                }
              }
            }}>
            <Text style={{color: '#fff'}}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',

              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: '800',
                alignSelf: 'center',
                marginTop: 20,
              }}>
              Result
            </Text>
            <Text
              style={{
                fontSize: 40,
                fontWeight: '800',
                alignSelf: 'center',
                marginTop: 20,
                color: 'green',
              }}>
              {getTextScore()}
            </Text>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                height: 40,
                padding: 10,
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 20,
                marginBottom: 20,
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default CandidateView