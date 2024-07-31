import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExaminerView from '../components/ExaminerView';
import Results from '../components/Results';
import CandidateView from '../components/CandidateView';

const Tab = createBottomTabNavigator();
// const user = { isExaminer: true };

const NavigatorComponent = ({ route }) => {
    const {isExaminer,category} = route.params 
    console.log("fbkne,dmwd",category )

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


  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarLabelStyle: {
        fontSize: 20, // Increase font size
        fontWeight: 'bold', // Increase font weight
      },
    })}>
      {isExaminer ? (
        <>
          <Tab.Screen name="Questions" component={ExaminerView} initialParams={{ category }} options={{ title: `Create Questions Related to ${formattedCategoryName(category.name)}`, headerStyle: { backgroundColor: '#f4511e' }, headerTintColor: '#fff' }}/>
          <Tab.Screen name="results" component={Results} />
        </>
      ) : (
        <>
          <Tab.Screen name="quizz" component={CandidateView} initialParams={{ category }} options={{ title: `${formattedCategoryName(category.name)} Quizz`, headerStyle: { backgroundColor: '#f4511e',  }, headerTintColor: '#fff' }}/>
          <Tab.Screen name="results" component={Results} options={{ title: `Result`, headerStyle: { backgroundColor: '#f4511e',  }, headerTintColor: '#fff' }}/>
        </>
      )}
    </Tab.Navigator>
  ); 
};


export default NavigatorComponent