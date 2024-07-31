import React,{useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const data = [
  { category: "Physics", score: 80 },
  { category: "GK", score: 40 },
  { category: "English", score: 90 },
  { category: "Chemistry", score: 50 }
];

const Results = () => {
  const [candidateResult,setCandidateResult] = useState([])
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.category}</Text>
      <Text style={styles.cell}>{item.score}</Text>
      {/* <Text style={styles.cell}>{calculateTotalAndPercentage()}</Text> */}
    </View>
  );
  useEffect(()=>{
    const fetchItems = async () => {
      try {
          const results = await AsyncStorage.getItem("results");
          
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
          if(results !== null){

              // console.log("nkwdw", questions)
              const rsltArray = JSON.parse(results)
              console.log("ndknwgwfgwg",rsltArray)
              // calculateTotalAndPercentage(rsltArray)
              setCandidateResult(rsltArray);

          }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  fetchItems();
  },[])

  // const calculateTotalAndPercentage = (data) => {
  //   const totalMarks = data.reduce((acc, item) => acc + item.score, 0);
  //   const percentage = (totalMarks / (data.length * 100)) * 10;
  //   console.log("total", totalMarks, "percentage", percentage)
  //   return { totalMarks, percentage };
  // };
  console.log("fkwnmlqd", candidateResult      )

  const capitalizeWord = (name)=>{
    let capitalized = name?.charAt(0).toUpperCase() + name?.slice(1);

     return capitalized

   }
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.Heading}>{`${capitalizeWord(candidateResult[0]?.name)} `}</Text>
        <Text style={[styles.Heading,styles.miniHeading]}>Your Result</Text>
         </View>
      <View style={styles.header}>
        <Text style={styles.headerCell}>Category</Text>
        <Text style={styles.headerCell}>Marks</Text>
        {/* <Text style={styles.headerCell}>Percentage</Text> */}
      </View>
      <FlatList
        data={candidateResult}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 8,
    paddingBottom: 4,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: 'black'
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    // fontWeight: 'bold',
    fontSize: 20,
  },
  Heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  miniHeading:{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  }
});

export default Results